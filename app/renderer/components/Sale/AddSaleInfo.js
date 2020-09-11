import React, {useState, useEffect} from 'react';
import { Card, Divider, Icon, Button } from '@blueprintjs/core';
import SearchProductInput from '../Product/SearchProductInput';
import ProductCartTable from '../Product/ProductCartTable';


const AddSaleInfo = ({
  product, 
  setProduct, 
  sale, 
  setSale,
  resetSale,
  setResetSale,
}) => {

  const [selfSale, setSelfSale] = useState(sale);

  useEffect(() => {
    updateSale();
  }, [selfSale]);

  useEffect(() => {
    if (resetSale) {
      setSelfSale({
        products: [], paymentType: '', customer: null, delivererId: '',
        totalValue: 0, paidValue: 0, changeValue: 0,
      });
    }
  }, [resetSale]);

  const setSelectedProduct = (product) => {
    setProduct(product);
  }

  const addProductToCart = async () => {
    const d = selfSale.products;
    const foundIndex = d.findIndex(p => p.id === product.id);
    if (foundIndex !== -1) {
      await setSelfSale({...selfSale, products: [...d]});
    } else {
      await setSelfSale({...selfSale, products: [...selfSale.products, product]});
    }
    setProduct(null);
  }

  const updateSale = () => {
    const total = selfSale.products.map(
      p => p.price * p.quantity
    ).reduce(
      (a, b) => a + b, 0
    );
    setSale({
      ...selfSale, 
      customer: resetSale ? null : sale.customer,
      totalValue: Number(total).toFixed(2),
      changeValue: selfSale.paidValue - total < 0 ? 0 : selfSale.paidValue - total
    });
    setResetSale(false);
  }

  const handleChangeQuantity = (qtd, index) => {
    const d = selfSale.products;
    d[index].quantity = qtd && qtd >0 ? qtd : 1;
    setSelfSale({...selfSale, products: [...d]});
  }

  const deleteProduct = (index) => {
    const d = selfSale.products;
    d.splice(index, 1);
    setSelfSale({
      ...selfSale, 
      products: [...d]});
  }
  return (
    <Card style={{height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
      <h3 
        className="bp3-heading" 
        style={{display: 'flex', alignItems: 'center'}}
      > <Icon  icon="trending-up" style={{marginRight:'8px'}} />
        Realizar venda
      </h3>
      <Divider />
      <div style={{display: 'flex'}}>
        <SearchProductInput
          product={product}
          setSelectedProduct={setSelectedProduct}
        />
        <Button
          disabled={!product}
          intent="success"
          icon="shopping-cart"
          text="Adicionar produto"
          onClick={addProductToCart}
        />
      </div>
      <ProductCartTable 
        cart={selfSale.products} 
        handleChangeQuantity={handleChangeQuantity}
        deleteProduct={deleteProduct}
      />
    </Card>
  )
};

export default AddSaleInfo;
