import React, {useState} from 'react';
import {
  Navbar, Alignment, Button, Menu,
  MenuItem, Popover, Position, Intent} from '@blueprintjs/core';
import {Link, useHistory} from 'react-router-dom';
import {ipcRenderer} from 'electron';
import SysConfirm from '../alert/SysConfirm';

const AppBar = () => {
  const router = useHistory();
  const [maximized, setMaximized] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const navigate = (url) => {
    router.push(url);
  }

  return (
    <Navbar  style={{WebkitAppRegion: 'drag'}}>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>SysGás</Navbar.Heading>
        <Navbar.Divider />
        <Button
          style={{WebkitAppRegion: 'no-drag'}}
          className="bp3-minimal" 
          icon="barcode" 
          text="Realizar venda"
          onClick={() => navigate('/sale/create')}
        />
        <Popover content={
          <Menu>
            <MenuItem 
              text="Recebimentos"
              onClick={() => navigate('/finances/revenues')}
            />
            <MenuItem 
              text="Despesas" 
              onClick={() => navigate('/finances/expenses')}
            />
            <MenuItem 
              text="Relatórios" 
              onClick={() => navigate('/report')}
            />
          </Menu>
        } position={Position.BOTTOM}>
          <Button
            style={{WebkitAppRegion: 'no-drag'}}
            className="bp3-minimal" 
            icon="bank-account" 
            text="Financeiro"
          />
        </Popover>
        <Button
          style={{WebkitAppRegion: 'no-drag'}}
          className="bp3-minimal" 
          icon="box" 
          text="Entregas"
          onClick={() => navigate('/deliveries')}
        />
        <Popover content={
          <Menu>
            <MenuItem 
              text="Estoque"
              onClick={() => navigate('/products')}
            />
            <MenuItem 
              text="Clientes"
              onClick={() => navigate('/customers')}
            />
            <MenuItem 
              text="Entregadores" 
              onClick={() => navigate('/general-create')}
            />
          </Menu>
        } position={Position.BOTTOM}>
          <Button
            style={{WebkitAppRegion: 'no-drag'}}
            className="bp3-minimal" 
            icon="add" 
            text="Cadastros"
          />
        </Popover>
        <Button
          style={{WebkitAppRegion: 'no-drag'}}
          className="bp3-minimal" 
          icon="settings" 
          text="opções"
          onClick={() => navigate('/options')}
        />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Button
          style={{marginRight: 10, WebkitAppRegion: 'no-drag'}}
          icon="minus" intent="primary"
          onClick={() => ipcRenderer.send('minimize-app')}
        />
        <Button
          style={{marginRight: 10, WebkitAppRegion: 'no-drag'}}
          icon={maximized ? 'minimize':'maximize'} intent="primary"
          onClick={() => {
            ipcRenderer.send('maximize-app')
            setMaximized(!maximized);
          }}
        />
        <Button
          style={{WebkitAppRegion: 'no-drag'}}
          icon="cross" intent="danger"
          onClick={() => setOpen(true)}
        />
      </Navbar.Group>
      <SysConfirm
        type={Intent.DANGER}
        canOutsideClickCancel={true}
        isOpen={isOpen}
        onClose={(res) => {
          if (res) {
            ipcRenderer.send('close-app')
          }
          setOpen(false)
        }}
        message="Você deseja realmente sair do programa?"
      />
    </Navbar>
  )
};

export default AppBar;
