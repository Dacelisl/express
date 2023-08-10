export const generateProductErrorInfo = (product) => {
    return `
      Una o mas propiedades estan incompletas o invalidas!!!
      Lista de propiedades obligatgorias:
          * title: Must be a string. (${product.title})
          * category: Must be a string. (${product.category})
          * price: Must be a numeric. (${product.price})    
      `;
  };