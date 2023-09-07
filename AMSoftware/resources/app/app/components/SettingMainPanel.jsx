import React from 'react';
import VisibleSettingContestPanel from '../containers/VisibleSettingContestPanel';
import VisibleSettingCompetitorsPanel from '../containers/SettingCompetitorsPanel/VisibleSettingCompetitorsPanel';
import VisibleSettingGamesPanel from '../containers/VisibleSettingGamesPanel';
import VisibleSettingHeatsPanel from '../containers/VisibleSettingHeatsPanel';

const SettingMainPanel = ({ selectedSettingScreen }) => {
  let settingHtml;

  switch (selectedSettingScreen) {
    case 'CONTEST':
      settingHtml = <VisibleSettingContestPanel />;
      break;
    case 'COMPETITORS':
      settingHtml = <VisibleSettingCompetitorsPanel />;
      break;
    case 'GAMES':
      settingHtml = <VisibleSettingGamesPanel />;
      break;
    case 'HEATS':
      settingHtml = <VisibleSettingHeatsPanel />;
      break;
    default:
      settingHtml = (
        <div>
          予期しない値
        </div>
      );
  }

  return (
    <div
      className="box"
      style={{
        flex: '1 1 0',
        margin: '3px',
        overflow: 'auto',
      }}
    >
      { settingHtml }
    </div>
  );
};

export default SettingMainPanel;
