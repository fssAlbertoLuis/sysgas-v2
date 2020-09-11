import React from 'react';
import { HTMLTable } from '@blueprintjs/core';


const tblStyle = {
  width: '100%',
}

const BaseTable = ({columns, data, emptyDataTxt}) => {
  
  const setHeaders = () => (
    <thead>
      <tr>
        {
          ['#', ...columns].map(column => {
            const headerTitle = Array.isArray(column) ? column[1] : column;
            return <th key={headerTitle}>{headerTitle}</th>;
          })
        }
      </tr>
    </thead>
  );
  
  const determineAttributes = (data, key, index) => {
    if (Array.isArray(key)) {
      return key.map(k => (
        k === 'index' ? index : data[k]
      ));
    } else {
      return key === 'index' ? [index] : [data[key]];
    }
  }
  const setRows = () => {
    if (data && data.length) {
      return data.map((d, index) => (
        <tr key={index}>
          <td>{index+1}</td>
          {
            columns.map((column, i) => {
              const key = Array.isArray(column) ? column[0] : column;
              const func = Array.isArray(column) && column[2] ? column[2] : null;
              const value = determineAttributes(d, key, index);
              return <td key={i}>{func ? func(...value) : value}</td>
            })
          }
        </tr>
      ));
    } else {
      return (
        <tr>
          <td colSpan={['#', ...columns].length} style={{textAlign: 'center'}}>
            {emptyDataTxt ? emptyDataTxt : 'Nada encontrado'}
          </td>
        </tr>
      );
    }
  }

  return (
    <HTMLTable style={tblStyle} bordered condensed interactive striped>
      {setHeaders()}
      <tbody>
      {setRows()}
      </tbody>
      <tfoot>
        <tr>
          <th colSpan={['#', ...columns].length} style={{textAlign: 'center'}}>-</th>
        </tr>
      </tfoot>
    </HTMLTable>
  );
}

export default BaseTable;
