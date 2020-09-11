import React, {useState} from 'react';
import { FormGroup, InputGroup, Card, ControlGroup, Divider, Button, NumericInput, Icon, HTMLSelect } from '@blueprintjs/core';
import LoaderButton from '../../utils/components/LoaderButton';
import CurrencyFormat from 'react-currency-format';

const styles = {
  margin: '4px',
}
const CreateProduct = ({
  product, setProduct, saveProduct, loading, paymentTypes,
}) => {

  const [displayProduct, setDisplayProduct] = useState({
    cost: product.cost, price: product.price,
  });

  const [selectList, setSelectList] = useState([
    {label: 'Selecione...', value: '', key: 0},
    ...paymentTypes.map(v => ({label: v.paymentMethodName, value: v.paymentMethodName}))
  ]);

  const handleChange = (field, numeric) => (e) => {
    setProduct({
      ...product, 
      [field]: numeric ? Number(String(e).replace(/\D/g,'')) : e.target.value
    });
  }

  return (
    <Card>
      <h5 className="bp3-heading">
      <span><Icon  icon="box" /> </span>
        {product.id ? 'Editar produto' : 'Cadastrar novo produto'}
      </h5>
      <div className="bp3-text-muted">
        <p>Digite as informações do produto</p>       
      </div>
      <Divider />
      <form onSubmit={(e) => {
        e.preventDefault();
        saveProduct(product)
      }}>
        <ControlGroup fill vertical>
          <FormGroup
            helperText=""
            label="Nome"
            labelFor="text-input"
            style={styles}
          >
            <InputGroup 
              type="text" 
              name="product.name" 
              disabled={loading}
              value={product.name}
              onChange={handleChange('name')}
              required
            />
          </FormGroup>
          <ControlGroup style={{marginTop: 2, display: 'flex'}}>
            <FormGroup
              helperText="Deixar esse campo zerado/vazio não gerará uma nova despesa"
              label="Preço custo"
              labelFor="text-input"
              style={{...styles, flex: 2}}
            >
              <CurrencyFormat
                leftIcon="dollar"
                onFocus={e => e.target.select()}
                customInput={InputGroup}
                value={displayProduct.cost} 
                decimalSeparator=","
                thousandSeparator="."
                decimalScale={2}
                allowNegative={false}
                onValueChange={(values) => {
                  const {formattedValue, floatValue} = values;
                  setDisplayProduct({...displayProduct, cost: formattedValue});
                  setProduct({...product, cost: floatValue});
                }}
                disabled={loading}
              />
            </FormGroup>
            { (product.cost && product.cost > 0) ?
              <FormGroup
                helperText=""
                label="Tipo de pagamento"
                labelFor="text-input"
                style={{...styles, flex: 1}}
              >
                <HTMLSelect
                  fill="true"
                  options={selectList}
                  value={product.paymentType}
                  onChange={handleChange('paymentType')}
                  disabled={loading}
                  required={product.cost && product.cost > 0}
                />
              </FormGroup> : ''
            }
          </ControlGroup>
          
          <FormGroup
            helperText=""
            label="Preço venda"
            labelFor="text-input"
            style={styles}
          >
            <CurrencyFormat
              leftIcon="dollar"
              onFocus={e => e.target.select()}
              customInput={InputGroup}
              value={displayProduct.price} 
              decimalSeparator=","
              thousandSeparator="."
              decimalScale={2}
              allowNegative={false}
              onValueChange={(values) => {
                const {formattedValue, floatValue} = values;
                setDisplayProduct({...displayProduct, price: formattedValue});
                setProduct({...product, price: floatValue});
              }}
              disabled={loading}
              required
            />
          </FormGroup>
          <ControlGroup style={{marginTop: 2, display: 'flex'}}>
            <FormGroup
              helperText=""
              label={product.id ? 'Quantidade reestoque': 'Quantidade'}
              labelFor="text-input"
              style={{...styles, flex: 1}}
            >
              <NumericInput
                allowNumericCharactersOnly={true}
                min={0}
                disabled={loading}
                selectAllOnFocus={true}
                value={product.quantity}
                onValueChange={handleChange('quantity', true)}
                required
                minorStepSize={1}
                stepSize={1}
              />
            </FormGroup>
            {
              product.id &&
              <FormGroup
              helperText=""
              label="Quantidade em estoque"
              labelFor="text-input"
              style={{...styles, flex: 1}}
            >
              <InputGroup disabled
                type="text"
                value={product.quantityStock}
              />
            </FormGroup>
            }
          </ControlGroup>
          
          <LoaderButton 
            type="submit" 
            intent="primary"
            style={styles}
            loading={loading}
            disabled={
              loading||
              !product.name||
              !product.price||
              product.price == 0||
              (!product.id && !product.quantity)||
              (product.cost && !product.quantity)
            }
          >Cadastrar</LoaderButton>
        </ControlGroup>
      </form>
    </Card>
  );
};

export default CreateProduct;
