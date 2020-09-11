import React from 'react';

const styles = {
  height: '100%',
  display: 'flex',
  padding: 4,
  overflow: 'hidden',
  width: '100%',
}

const BaseContainer = ({children, flexFlow}) => {
  flexFlow = flexFlow ? flexFlow : 'column';
  return (
    <div style={{flexFlow, ...styles}}>
      {children}
    </div>
  );
};

export default BaseContainer;
