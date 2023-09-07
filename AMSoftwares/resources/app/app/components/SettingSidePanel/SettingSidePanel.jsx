import React from 'react';
// TODO: 設定チェック用の関数を作りいろいろなボタン押す時に使うようにする

import VisibleFileImporter from '../../containers/SettingSidePanel/VisibleFileImporter';
import VisibleFirstRoundCreator from '../../containers/SettingSidePanel/VisibleFirstRoundCreator';
import GroupResult from './GroupResult';


// Component
//--------------------------------------------------
const SettingSidePanel = ({ temp, games, switchModal, competitors,
  isModalOn, backupPath }) => {
  const stylesArray = ['WALTZ', 'TANGO', 'FOX', 'QUICK', 'VIENNESE',
    'CHA', 'SAMBA', 'RUMBA', 'PASO', 'JIVE'];

  const gamesStyles = {};
  Object.keys(games).forEach((gameId) => {
    gamesStyles[gameId] = [];
    stylesArray.forEach((style) => {
      if (games[gameId].options[style] === 1) {
        gamesStyles[gameId].push(style);
      }
    });
  });

  const optionsHtml = [];

  for (let i = 1; i < 31; i++) {
    optionsHtml.push(
      <option key={i} value={i}>{i}</option>,
    );
  }

  return (
    <div
      className="sidePanel"
      style={{
        width: '125px',
        flex: '0 0 auto',
        margin: '3px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <VisibleFirstRoundCreator />

      <div style={{ flex: '1 1 auto' }} />

      <GroupResult games={games} competitors={competitors} backupPath={backupPath} />
      <div style={{ height: '15px' }}></div>
      <VisibleFileImporter />

      <div className={`modal${isModalOn === 6 ? ' is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content" style={{ width: '500px' }}>
          <article className="message is-warning">
            <div className="message-header">
              <p>結果ファイルの一部が存在しません</p>
              <button className="delete" onClick={() => { switchModal(0); }}></button>
            </div>
            <div className="message-body">
              次に示すファイルが存在するか確認してください。 <br />
              {temp[5]}
            </div>
          </article>
        </div>
        <button
          className="modal-close"
          onClick={() => { switchModal(0); }}
        ></button>
      </div>
    </div>
  );
};

export default SettingSidePanel;
