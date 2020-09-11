import React, {useState} from 'react';
import {DateInput} from '@blueprintjs/datetime';
import { Card, Button, Intent } from '@blueprintjs/core';
import moment from 'moment';

const DateFilter = ({changeDate, additionalFilters, resetFunction}) => {
  const [filterDate, setFilterDate] = useState(new Date());
  return (
    <Card style={{margin: '0 8px'}}>
      <span>
        Filtrar por data: <DateInput
          inputProps={{ leftIcon: "calendar" }}
          formatDate={date => moment(date).format("DD/MM/YYYY")}
          onChange={(date) => {
            setFilterDate(date);
          }}
          parseDate={str => new Date(str)}
          placeholder={"D/M/YYYY"}
          value={filterDate}
        />
        <Button intent={Intent.SUCCESS} text="Filtrar" onClick={() => changeDate(filterDate)} />
        <Button 
          style={{margin: '0 4px'}}
          intent={Intent.DANGER} 
          text="remover filtros" 
          onClick={() => {
            setFilterDate(new Date());
            resetFunction();
          }} 
        />
      </span>
      {additionalFilters}
    </Card>
  );
}

export default DateFilter;
