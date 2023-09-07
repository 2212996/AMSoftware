import React from 'react';

import VisibleModals from '../../containers/SettingCompetitorsPanel/VisibleModals';
import CompetitorsDataTable from '../../containers/SettingCompetitorsPanel/VisibleCompetitorsDataTable';


const SettingCompetitorsPanel = ({ competitors, deleteCompetitorInGame,
  games, addCompetitorInGame }) => {
  const gamesNumber = Object.keys(games).length;
  const headerGamesHtml = [];
  for (let i = 1; i <= gamesNumber; i++) {
    headerGamesHtml.push(
      <th style={{ width: '2rem', textAlign: 'center' }} key={`CompetitorsGame${i}`}>{i}</th>,
    );
  }

  const rightHeadersHtml = (
    <tr>
      <th style={{ width: '4rem' }}>背番</th>
      { headerGamesHtml }
    </tr>
  );

  const rightBodyHtml = Object.keys(competitors).sort((a, b) => {
    if (Number(competitors[a].number) < Number(competitors[b].number)) {
      return -1;
    }
    return 1;
  }).map((id) => {
    const gamesHtml = Object.keys(games).map((gameId) => {
      if (games[gameId].competitors.find((competitor) => {
        if (competitor === Number(id)) {
          return true;
        }
        return false;
      })) {
        return (
          <td
            key={`settingCompetitorsPanelGames${gameId},${id}`}
            onClick={() => {
              deleteCompetitorInGame(gameId, Number(id));
            }}
            style={{ padding: '0', height: '100%', textAlign: 'center', verticalAlign: 'middle' }}
          >
            <a style={{ height: '100%', width: '100%' }}>
              <span className="icon"><icon className="fa fa-circle-o"></icon></span>
            </a>
          </td>
        );
      }
      return (
        <td
          key={`settingCompetitorsPanelGames${gameId},${id}`}
          onClick={() => {
            addCompetitorInGame(gameId, Number(id));
          }}
          style={{ padding: '0.25rem' }}
        />
      );
    });

    const comp = competitors[id];
    return (
      <tr key={`settingCompetitorsPanelRow${id}`}>
        <td key={`settingCompetitorsPanelNum${id}`}>{comp.number}</td>
        {gamesHtml}
      </tr>
    );
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div style={{ display: 'flex', overflow: 'auto', flex: '1 1 auto' }}>
        <div style={{ overflow: 'auto', flex: '0 0 50%' }}>
          <CompetitorsDataTable competitors={competitors} />
        </div>
        <div style={{ overflow: 'auto', flex: '1 1 0' }}>
          <table style={{ tableLayout: 'fixed' }} className="table is-narrow is-striped is-bordered">
            <thead>
              {rightHeadersHtml}
            </thead>
            <tbody>
              {rightBodyHtml}
            </tbody>
            <tfoot>
              {rightHeadersHtml}
            </tfoot>
          </table>
        </div>
      </div>

      <VisibleModals />
    </div>
  );
};

export default SettingCompetitorsPanel;
