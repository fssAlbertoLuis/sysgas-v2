import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {Select} from '@blueprintjs/select';
import { Button, Menu, MenuItem, Divider } from '@blueprintjs/core';
import CurrencyFormat from 'react-currency-format';

const SearchCustomerInput = ({
  customer,
  customerState, 
  setSelectedCustomer,
  deleteCustomer,
}) => {

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (customerState.customersList) {
      setCustomers(customerState.customersList);
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
          text={`${renderedItems.length} clientes encontrados`}
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
      label={
        <CurrencyFormat 
          value={item.phone}
          displayType="text"
          format={item.phone.length > 8 ? '#####-####':'####-####'}
        />
      }
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
        items={customers}
        resetOnSelect={true}
        itemListRenderer={itemListRender}
        itemRenderer={renderItem}
        itemPredicate={searchItem}
        onItemSelect={(item) => {
          setSelectedCustomer(item);
        }}
      >
          <Button text={customer ? customer.name : 'selecione um cliente'} rightIcon="double-caret-vertical" />
        </Select>
    </div>
  )
};

const mapStateToProps = state => ({
  customerState: state.customerState,
});

export default connect(mapStateToProps)(SearchCustomerInput);
