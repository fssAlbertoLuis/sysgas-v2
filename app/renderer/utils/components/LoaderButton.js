import React from 'react';
import { Button, Spinner } from '@blueprintjs/core';

const LoaderButton = ({loading, loadingText, ...props}) => (
  <Button 
  disabled={loading}
  icon={
    loading ? 
    <Spinner size={Spinner.SIZE_SMALL} /> :
    props.icon ? props.icon : 'play'
  }
  {...props}
>{
  loading ? 
    (loadingText ? loadingText : 'Carregando...') : 
    props.children
  }</Button>
);

export default LoaderButton;
