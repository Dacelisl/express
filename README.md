<h1 align="center"> Websockets + Handlebars </h1>

Link del Proyecto: [Express](https://github.com/Dacelisl/express).

## Integrar vistas y sockets a nuestro servidor actual.

<div align="center">
  <img src='https://softprodigy.com/wp-content/uploads/2019/07/express-js.png' width='300px'/>
   </div>

Configurar nuestro proyecto para que trabaje con Handlebars y websocket.


### Aspectos a incluir
- Configurar el servidor para integrar el motor de plantillas Handlebars e instalar un servidor de socket.io al mismo tiempo
- Crear una vista “home.handlebars” la cual contenga una lista de todos los productos agregados hasta el momento

- Además, crear una vista “realTimeProducts.handlebars”, la cual vivirá en el endpoint “/realtimeproducts” en nuestro views router, ésta contendrá la misma lista de productos, sin embargo, ésta trabajará con websockets.

    - Al trabajar con websockets, cada vez que creemos un producto nuevo, o bien cada vez que eliminemos un producto, se debe actualizar automáticamente en dicha vista la lista.