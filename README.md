<h1 align="center">Backend de una aplicación ecommerce </h1>

<div align="center">[Deploy Coder-Shop](https://coder-shop.onrender.com/api/products). </div>

## ENTREGA DEL PROYECTO FINAL

<div align="center">
  <img src='https://miro.medium.com/v2/resize:fit:4800/format:webp/1*M10QaO1mZCk_jvH2EBNmaQ.jpeg' width='300px'/>
   </div>

### Objetivos generales

    - Completar el proyecto final

### Objetivos específicos

    - Conseguir una experiencia de compra completa
    - Cerrar detalles administrativos con los roles.

### Formato

    - Link al repositorio sin node_modules
    - Link del proyecto desplegado..

Con base en el proyecto que venimos desarrollando, toca solidificar algunos procesos:

## Se debe entregar

Desde el router de /api/users, crear tres rutas: - GET / deberá obtener todos los usuarios, éste sólo debe devolver los datos principales como nombre, correo, tipo de cuenta (rol)

    - DELETE / deberá limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días. (puedes hacer pruebas con los últimos 30 minutos, por ejemplo). Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad

Crear una vista para poder visualizar, modificar el rol y eliminar un usuario. Esta vista únicamente será accesible para el administrador del ecommerce.

Modificar el endpoint que elimina productos, para que, en caso de que el producto pertenezca a un usuario premium, le envíe un correo indicándole que el producto fue eliminado.

Finalizar las vistas pendientes para la realización de flujo completo de compra. NO ES NECESARIO tener una estructura específica de vistas, sólo las que tú consideres necesarias para poder llevar a cabo el proceso de compra.

No es necesario desarrollar vistas para módulos que no influyan en el proceso de compra (Como vistas de usuarios premium para crear productos, o vistas de panel de admin para updates de productos, etc)
