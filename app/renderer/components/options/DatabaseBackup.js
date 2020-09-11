import React from 'react';
import {connect} from 'react-redux';
import { ipcRenderer } from 'electron';
import { Card, Button, Intent, Icon, FormGroup, Divider, InputGroup, Alert } from '@blueprintjs/core';
import AlertActions from '../../redux/actions/AlertActions';
import SysConfirm from '../alert/SysConfirm';

const styles = {
  margin: 8
};

const divStyles = {
  margin: 4,
  flex: 1,
};

const mapDispatchToProps = dispatch => ({
  showAlert: (type, msg) => dispatch(AlertActions.open(type, msg))
});
export default connect(null, mapDispatchToProps)(
  ({showAlert}) => {

    const [filepath, setFilepath] = React.useState('');
    const [isOpen, setOpen] = React.useState(false);
    const [resAlertOpen, setResAlertOpen] = React.useState(false);

    const getBackupFile = () => {
      const result = ipcRenderer.sendSync('options:getBackupFile');
      if (result) {
        setFilepath(result);
      }
    }
    
    const backupDatabase = async () => {
      const result = await ipcRenderer.invoke('options:res:backupDatabase');
      if (result) {
        setFilepath('');
        showAlert(
          'success', 'Backup do banco de dados salvo em: '+result
        );
      }
    }

    const restoreDatabase = () => {
      const response = ipcRenderer.sendSync('options:restoreDatabase', filepath);
      if (response) {
        setResAlertOpen(true);
      } else {
        showAlert(Intent.DANGER, 'Não foi possível restaurar o banco de dados.');
      }
      setFilepath('');
    }

    return (
      <Card style={styles}>
        <div style={{display: 'flex'}}>
          <h2><Icon iconSize={Icon.SIZE_STANDARD*2} icon="archive" /> Backup/Restaurar banco de dados</h2>
          <div style={{flex: 1}} />
        </div>
        <div style={{display: 'flex'}}>
          <div style={divStyles}>
            <FormGroup
              label="Restaurar banco de dados a partir de um arquivo"
              labelFor="file-input"
            >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <InputGroup
                  placeholder="Caminho do arquivo de restauração"
                  value={filepath}
                  readOnly
                  rightElement={<Button onClick={getBackupFile}>buscar</Button>}
                  fill
                  onClick={getBackupFile}
                />
                <Button 
                  intent={Intent.PRIMARY} 
                  disabled={!filepath}
                  onClick={() => setOpen(true)}
                >
                  Restaurar
                </Button>
              </div>
            </FormGroup>
          </div>
          <Divider />
          <div style={divStyles}>
            <FormGroup
              label="Fazer backup do banco de dados atual"
              labelFor="file-input"
            >
              <Button 
                intent={Intent.SUCCESS}
                onClick={() => backupDatabase()}
              >Backup banco de dados</Button>
            </FormGroup>
          </div>
        </div>
        <SysConfirm
          type={Intent.DANGER}
          canOutsideClickCancel={true}
          isOpen={isOpen}
          onClose={(res) => {
            if (res) {
              restoreDatabase();
            }
            setOpen(false)
          }}
          message="[ATENÇÃO] Ao restaurar o banco de dados todas as suas alterações do banco de dados atual serão perdidas. Caso esteja incerto, faça primeiro o backup do banco de dados atual antes de restaurar qualquer informação. Deseja realmente continuar?"
        />
        <Alert className={theme}
          icon="tick-circle"
          intent={Intent.SUCCESS}
          confirmButtonText="OK"
          isOpen={resAlertOpen}
          onClose={() => ipcRenderer.send('restart-app')}
        ><p>Banco de dados restaurado! Reiniciando a aplicação...</p></Alert>
      </Card>
    );
  }
);