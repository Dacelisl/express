import nodemailer from 'nodemailer'
import dataConfig from '../config/process.config.js'
import { ticketServices } from '../services/ticket.services.js'
import { __dirname } from '../utils/utils.js'

class MailServices {
  createTransporter() {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: dataConfig.email_google,
        pass: dataConfig.key_email_google,
      },
    })
  }

  async sendMail(code, dataUser) {
    try {
      const cartPurchase = await ticketServices.getTicketById(code)
      const dataRes = cartPurchase.data
      const transporter = this.createTransporter()
      const mailOptions = this.generateMailOptions(dataUser, dataRes)
      const sendResult = await transporter.sendMail(mailOptions)
      return {
        status: 'Success',
        code: 201,
        payload: sendResult,
        message: 'Mail sent successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 401,
        payload: {},
        message: `Error Mail sent ${error}`,
      }
    }
  }
  generateMailOptions(user, dataRes) {
    return {
      from: dataConfig.email_google,
      to: user.email,
      subject: `${user.firstName}, hemos recibido tu pedido `,
      html: this.generateMailHtml(dataRes),
      attachments: [
        {
          filename: 'banner_shop.png',
          path: __dirname + '/public/banner_shop.png',
          cid: 'image1',
        },
      ],
    }
  }
  generateMailHtml(dataRes) {
    return `
    <style>
    body {
      font-family: Arial, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    .products {
      border-collapse: collapse;
      width: 100%;
    }
    .products th, .products td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .products th {
      background-color: #f2f2f2;
    }
    .total {
      text-align: right;
      margin-top: 20px;
      font-weight: bold;
    }
  </style>
      <div class="container">
        <div class="header">
        <h1>Confirmación de Compra</h1>
        <p>¡Gracias por comprar en Coder-Shop!</p>
        <p>Estamos a la espera de recibir la confirmación del pago.</p>
        <p>Una vez sea confirmado, tu pedido será procesado y te notificaremos.</p>
        </div>
        <table class="products">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Producto</th>
              <th>Categoria</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            ${this.generateProductsListHtml(dataRes.products)}
          </tbody>
        </table>
        <div class="total">
          <p>Total pagado: $${dataRes.amount.toFixed(2)}</p>
        </div>
        <img src="cid:image1" />
        <p>Si necesitas información o ayuda adicional, por favor contáctanos.</p>
      </div>
    `
  }
  generateProductsListHtml(products) {
    return products
      .map(
        (product) => `
        <tr>
          <td>${product.productId.code}</td>
          <td>${product.productId.title}</td>
          <td>${product.productId.category}</td>
          <td>${product.quantity}</td>
          <td>${product.productId.price}</td>
        </tr>
      `
      )
      .join('')
  }

  async deleteInactiveUsersMail(email, user) {
    try {
      const currentDate = new Date()
      const currentTime = currentDate.toLocaleString()
      const transporter = this.createTransporter()
      const mailOptions = this.generateMailInactiveUsersOptions(email, user, currentTime)
      const sendResult = await transporter.sendMail(mailOptions)
      return {
        status: 'Success',
        code: 201,
        message: 'Mail sent successfully',
        payload: sendResult,
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 401,
        message: `Error Mail sent ${error}`,
        payload: {},
      }
    }
  }
  generateMailInactiveUsersOptions(email, user, currentTime) {
    return {
      from: dataConfig.email_google,
      to: email,
      subject: 'Inactive user deleted',
      html: this.generateMailInactiveUsersHtml(email, user, currentTime),
    }
  }
  generateMailInactiveUsersHtml(email, user, currentTime) {
    return `
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background-color: #007BFF;
            color: #fff;
            text-align: center;
            padding: 20px 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
    <div class="container">
        <div class="header">
            <h1>Notificación de eliminación de cuenta debido a inactividad</h1>
        </div>
        <div class="content">
            <p>Estimado ${user}</p>
            <p>Esperamos que te encuentres bien. Te escribimos para informarte que tu cuenta en nuestro sistema ha sido eliminada debido a inactividad.</p>
            <p>Detalles de la cuenta eliminada:</p>
            <p>- Nombre de usuario: ${user}</p>
            <p>- Dirección de correo electrónico: ${email}</p>
            <p>- Fecha de eliminación: ${currentTime}</p>
            <p>La eliminación de tu cuenta se ha realizado debido a que no has iniciado sesión en nuestra plataforma en un período de tiempo considerable y, lamentablemente, no hemos recibido ninguna actividad en tu cuenta.</p>
            <p>Si consideras que esta eliminación ha sido un error o deseas restaurar tu cuenta, por favor, ponte en contacto con nuestro equipo de soporte a través de hero055@gmail.com y estaremos encantados de ayudarte.</p>
            <p>Agradecemos tu comprensión y esperamos volver a verte en nuestra plataforma en el futuro.</p>
            <p>Atentamente,<br>Tu Equipo de Soporte</p>
        </div>
    </div>
    `
  }

  async recoveryMail(email, token, basePath) {
    try {
      const transporter = this.createTransporter()
      const mailOptions = this.generateMailRecoverOptions(email, token, basePath)
      const sendResult = await transporter.sendMail(mailOptions)
      return {
        status: 'Success',
        code: 201,
        payload: sendResult,
        message: 'Mail sent successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 401,
        payload: {},
        message: `Error Mail sent ${error}`,
      }
    }
  }
  generateMailRecoverOptions(email, token, basePath) {
    return {
      from: dataConfig.email_google,
      to: email,
      subject: 'Recovery Password',
      html: this.generateMailRecoverHtml(email, token, basePath),
    }
  }
  generateMailRecoverHtml(email, token, basePath) {
    return `
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background-color: #007BFF;
            color: #fff;
            text-align: center;
            padding: 20px 0;
        }
        .content {
            padding: 20px;
        }
        .button {
            display: inline-block;
            background-color: #007BFF;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 4px;
        }
    </style>
    <div class="container">
        <div class="header">
            <h1>Recuperación de Contraseña</h1>
        </div>
        <div class="content">
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no has realizado esta solicitud, puedes ignorar este mensaje.</p>
            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
            <p><a class="button" href='${basePath}/recover/pass?token=${token}&email=${email}'>Restablecer Contraseña</a></p>
            <p>Este enlace es de unico uso y expirará en 1 hora. Si no haces clic en el enlace antes de la expiración, deberás solicitar un nuevo enlace de restablecimiento de contraseña.</p>
            <p>Gracias,<br>Tu Equipo de Soporte</p>
        </div>
    </div>
    `
  }
}
export const mailServices = new MailServices()
