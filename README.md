<h1 align="center"> Primera Entrega Proyecto Final </h1>

Link del Proyecto: [Express](https://github.com/Dacelisl/express).

## Programacion Backend: Primera Entrega Proyecto Final

<div align="center">
  <img src='https://softprodigy.com/wp-content/uploads/2019/07/express-js.png' width='300px'/>
   </div>

Se desarrollará un servidor que contenga los endpoints y servicios necesarios para gestionar los productos y carritos de compra en el e-commerce

Desarrollar el servidor basado en Node.JS y express, que escuche en el puerto 8080 y disponga de dos grupos de rutas: /products y /carts. Dichos endpoints estarán implementados con el router de express, con las siguientes especificaciones:

### Products
Para el manejo de productos, el cual tendrá su router en ‘api/products’, configurar las siguientes rutas:
- La ruta raíz GET ‘/’ deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior)
- La ruta GET ‘/:pid’ deberá traer sólo el producto con el id proporcionado
- La ruta raíz POST ‘/’ deberá agregar un nuevo producto con los campos:
    - id: Number/String 
    - title:String,
    - description:String
    - code:String
    - price:Number
    - status:Boolean
    - stock:Number
    - category:String
    - thumbnails:Array de Strings
    - Status: true por defecto.
Todos los campos son obligatorios, a excepción de thumbnails

- La ruta PUT ‘/:pid’ deberá tomar un producto y actualizarlo por los campos enviados desde el body. NUNCA se debe actualizar o eliminar el id  al momento de hacer dicha actualización.
- La ruta DELETE ‘/:pid’ deberá eliminar el producto con el pid indicado. 

### Carts
Para el carrito, el cual tendrá su router en ‘/api/carts/’, configurar dos rutas:
- La ruta raíz POST ‘/’ deberá crear un nuevo carrito con la siguiente estructura:
    - Id:Number/String (autogenerado).
    - products: Array que contendrá objetos que representen cada producto

- La ruta GET ‘/:cid’ deberá listar los productos que pertenezcan al carrito con el parámetro ‘cid’ proporcionados.

- La ruta POST  ‘/:cid/product/:pid’ deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
    - product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
    - quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto. 


La persistencia de la información se implementará utilizando el file system, donde los archivos “productos,json” y “carrito.json”, respaldan la información.
No es necesario realizar ninguna implementación visual, todo el flujo se puede realizar por Postman o por el cliente de tu preferencia.