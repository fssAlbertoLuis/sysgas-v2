import React from 'react';
import { Toaster, Position, Toast } from '@blueprintjs/core';

const SysToast = ({messages, updateToasts}) => (
  <Toaster position={Position.BOTTOM_RIGHT}>
    {
      messages.map((msg, index) =>
        <Toast 
          key={index}
          message={msg.message}
          intent={msg.type}
          icon={msg.type === 'success' ? 'tick':'warning-sign'}
          onDismiss={
          () => {
            let msgList = messages;
            msgList.splice(index, 1);
            updateToasts(msgList);
          }
        }/>
      )
    }
  </Toaster>
)

export default SysToast;
