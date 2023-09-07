import React from 'react';

const CenterHeading = ({ selectedScreen, selectedSettingScreen,
  selectSettingScreen, selectCell }) => {
  const activeTab = ['', '', '', '', ''].map((value, index) => {
    switch (selectedSettingScreen) {
      case 'CONTEST':
        if (index === 0) {
          return 'is-active';
        }
        return '';
      case 'COMPETITORS':
        if (index === 1) {
          return 'is-active';
        }
        return '';
      case 'GAMES':
        if (index === 2) {
          return 'is-active';
        }
        return '';
      case 'HEATS':
        if (index === 3) {
          return 'is-active';
        }
        return '';
      default:
        return '';

    }
  });

  const onClickContest = () => {
    selectSettingScreen('CONTEST');
  };

  const onClickCompetitors = () => {
    selectSettingScreen('COMPETITORS');
  };

  const onClickGames = () => {
    selectSettingScreen('GAMES');
    selectCell(1, 1);
  };

  const onClickHeats = () => {
    selectSettingScreen('HEATS');
    selectCell([1, 0], 1);
  };


  function centerHeadingHtml() {
    if (selectedScreen === 'SETTING') {
      return [
        <li className={activeTab[0]} onClick={onClickContest} key="headerContest">
          <a className="is-tab">大会情報</a>
        </li>,
        <li className={activeTab[1]} onClick={onClickCompetitors} key="headerCompetitors">
          <a className="is-tab">選手情報</a>
        </li>,
        <li className={activeTab[2]} onClick={onClickGames} key="headerGames">
          <a className="is-tab">競技情報</a>
        </li>,
        <li className={activeTab[3]} onClick={onClickHeats} key="headerHeats">
          <a className="is-tab">ヒート数</a>
        </li>,
      ];
    }

    return [];
  }

  return (
    <ul className="is-center">
      {centerHeadingHtml()}
    </ul>
  );
};

export default CenterHeading;
