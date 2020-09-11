import React from 'react';
import BaseContainer from '../utils/components/BaseContainer';
import OptionsPageHeader from '../components/options/OptionsPageHeader';
import ThemeChanger from '../components/options/ThemeChanger';
import DatabaseBackup from '../components/options/DatabaseBackup';

const OptionsPage = () => {
  return (
    <BaseContainer>
      <OptionsPageHeader />
      <ThemeChanger />
      <DatabaseBackup />
    </BaseContainer>
  );
};

export default OptionsPage;
