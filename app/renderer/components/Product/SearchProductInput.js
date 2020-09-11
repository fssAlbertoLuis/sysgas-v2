import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Select} from '@blueprintjs/select';
import { Button, Menu, MenuItem, Divider } from '@blueprintjs/core';

const SearchProductInput = ({
  product,
  inventoryState, 
  setSelectedProduct
}) => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (inventoryState.list) {
      setProducts(inventoryState.list);
    }
  })
  const itemListRender = ({filteredItems, itemsParentRef, renderItem}) => {
    const renderedItems = filteredItems.map(renderItem).filter(
      item => item != null
    );
    return (
      <Menu 
        ulRef={itemsParentRef} 
        style={{maxHeight: '300px', overflowY: 'scroll'}}
      >
        <MenuItem
          disabled={true}
          text={`${renderedItems.length} produtos encontrados`}
        />
        <Divider />
        {renderedItems}
      </Menu>
    );
  }

  const renderItem = (item, { handleClick, modifiers }) => (
    <MenuItem 
      key={item.id} 
      text={item.name}
      label={`R$${item.price}`}
      active={modifiers.active}
      onClick={handleClick}
    />
  );

  const searchItem = (query, item, index, exactMatch) => {
    const normalizedTitle = item.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
        return normalizedTitle === normalizedQuery;
    } else {
        return normalizedTitle.indexOf(normalizedQuery) >= 0;
    }
  }
  return (
    <div>
      <Select
        popoverProps={{
          className: 'sys-popover-height-300',
          modifiers: {
            arrow: {
              enabled: false
            }
          }
        }}
        style={{width: '100%'}}
        items={products}
        resetOnSelect={true}
        itemListRenderer={itemListRender}
        itemRenderer={renderItem}
        itemPredicate={searchItem}
        onItemSelect={(item) => {
          setSelectedProduct({
            id: item.id, 
            name: item.name, 
            price: item.price, 
            quantity: 1, 
            stock: item.quantity,
          });
        }}
      >
          <Button text={product ? product.name : 'selecione um produto'} rightIcon="double-caret-vertical" />
        </Select>
    </div>
  )
};

const mapStateToProps = state => ({
  inventoryState: state.inventoryState,
});

export default connect(mapStateToProps)(SearchProductInput);
