<h1 align="center"> Servidor con express </h1>

Link del Proyecto: [Express](https://github.com/Dacelisl/express).

## Programacion Backend: Servidor Express

<div align="center">
  <img src='https://softprodigy.com/wp-content/uploads/2019/07/express-js.png' width='300px'/>
   </div>

Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

- Aspectos a incluir:
  - Se deberá utilizar la clase ProductManager que actualmente utilizamos con persistencia de archivos.
  - Desarrollar un servidor express que, en su archivo app.js importe al archivo de ProductManager que actualmente tenemos.
  - El servidor debe contar con los siguientes endpoints:
    - ruta ‘/products’, la cual debe leer el archivo de productos y devolverlos dentro de un objeto. Agregar el soporte para recibir por query param el valor ?limit= el cual recibirá un límite de resultados.
      - Si no se recibe query de límite, se devolverán todos los productos
      - Si se recibe un límite, sólo devolver el número de productos solicitados
    - ruta ‘/products/:pid’, la cual debe recibir por req.params el pid (product Id), y devolver sólo el producto solicitado, en lugar de todos los productos.
