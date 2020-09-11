
import {ipcRenderer} from 'electron';

const insertProduct = async ({name, quantity, price}) => {
  try {
    const product = ipcRenderer.sendSync('product:getByName', name);
    if (product) {
      return false;
    } else {
      const insertedProduct = ipcRenderer.sendSync('product:insert', {
        name, quantity, price
      });
      return insertedProduct;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const updateProduct = async ({id, name, quantity, price}) => {
  try {
    const updatedProduct = ipcRenderer.sendSync('product:update', {
      name, quantity, price
    }, id);
    return updatedProduct;
  } catch (error) {
    console.log(error);
    return false;
  }
}

const deleteProduct = async (id) => {
  const result = ipcRenderer.sendSync('product:delete',id);
  return result;
}

const getProducts = async () => {
  const data = ipcRenderer.sendSync('get-model', 'Product', 'findAll');
  return data ? data.map(p => p.dataValues) : [];
};

const ProductService = {
  insertProduct, getProducts, updateProduct, deleteProduct
};

export default ProductService;
