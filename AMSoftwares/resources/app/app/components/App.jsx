import React from 'react';
import VisibleHeader from '../containers/Header/VisibleHeader';
import VisibleSidePanel from '../containers/SidePanel/VisibleSidePanel';
import VisibleMainPanel from '../containers/MainPanel/VisiblelMainPanel';
import VisibleSettingSidePanel from '../containers/SettingSidePanel/VisibleSettingSidePanel';
import VisibleSettingMainPanel from '../containers/VisibleSettingMainPanel';
import VisibleStartScreen from '../containers/VisibleStartScreen';
import VisibleDataPanel from '../containers/VisibleDataPanel';
import VisibleDataEditPanel from '../containers/DataEditPanel/VisibleDataEditPanel';

const App = ({ selectedScreen, selectedCheckScreen }) => {
  let currentScreen;
  switch (selectedScreen) {
    case 'CHECK': {
      let currentPanel;
      switch (
        selectedCheckScreen) {
        case 'CHECK':
          currentPanel = <VisibleMainPanel />;
          break;
        case 'DATA':
          currentPanel = [
            <VisibleDataPanel key="VisibleDataPanel" />,
            <VisibleDataEditPanel key="VisibleDataEditPanel" />,
          ];
          break;
        default:
          currentPanel = <VisibleMainPanel />;
      }

      currentScreen = (
        <div style={{ height: '100%', width: '100%', display: 'flex' }}>
          <div style={{ height: '100%', width: '4px', flex: '0 0 auto' }} />
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <VisibleHeader />
            <div style={{ width: '100%', display: 'flex', flex: '1 1 auto' }}>
              <VisibleSidePanel />
              {currentPanel}
            </div>
            <div style={{ height: '4px', width: '100%', flex: '0 0 auto' }} />
          </div>
          <div style={{ height: '100%', width: '4px', flex: '0 0 auto' }} />
        </div>
      );

      break;
    }
    case 'SETTING':
      currentScreen = (
        <div style={{ height: '100%', width: '100%', display: 'flex' }}>
          <div style={{ height: '100%', width: '4px', flex: '0 0 auto' }} />
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <VisibleHeader />
            <div style={{ width: '100%', display: 'flex', flex: '1 1 auto' }}>
              <VisibleSettingSidePanel />
              <VisibleSettingMainPanel />
            </div>
            <div style={{ height: '4px', width: '100%', flex: '0 0 auto' }} />
          </div>
          <div style={{ height: '100%', width: '4px', flex: '0 0 auto' }} />
        </div>
      );
      break;
    default:
      currentScreen = (
        <div style={{ height: '100%' }}>
          予期しないスクリーン
        </div>
      );
  }

  return (
    <div style={{ height: '100%' }}>
      {currentScreen}
      <VisibleStartScreen />
    </div>
  );
};

export default App;
