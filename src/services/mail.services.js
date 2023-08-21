import nodemailer from 'nodemailer'
import dataConfig from '../config/process.config.js'
import { ticketServices } from '../services/ticket.services.js'
import { __dirname } from '../utils/utils.js'

class MailServices {
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
        data: sendResult,
        msg: 'Mail sent successfully',
      }
    } catch (error) {
      return {
        status: 'Fail',
        code: 401,
        msg: `Error Mail sent ${error}`,
      }
    }
  }

  createTransporter() {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: dataConfig.email_google,
        pass: dataConfig.key_email_google,
      },
    })
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
}
export const mailServices = new MailServices()
