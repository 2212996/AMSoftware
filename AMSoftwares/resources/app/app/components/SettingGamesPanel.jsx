import React from 'react';

const SettingGamesPanel = ({ games, temp, editTemp, changeStyleOption,
  addGame, changeGameName }) => {
  const gamesNumber = Object.keys(games).length;
  let maxRounds = 0;
  Object.keys(games).forEach((game) => {
    const length = Object.keys(games[game].options.rounds).filter(roundKey => (
      Number(roundKey) <= 100
    )).length;
    if (maxRounds < length) {
      maxRounds = length;
    }
  });

  const headersHtml = (
    <tr>
      <th style={{ width: '2rem' }}>ID</th>
      <th style={{ width: '15rem' }}>名称</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>W</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>T</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>F</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>Q</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>V</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>C</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>S</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>R</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>P</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>J</th>
      {/* <th>予選</th> */}
      <th style={{ width: '4.5em', textAlign: 'center' }}>予選数</th>
      <th style={{ width: '4.5em', textAlign: 'center' }}>下位決勝</th>
    </tr>
  );

  const bodyHtml = Object.keys(games).map((key) => {
    const options = games[key].options;
    function whichStyle(style) {
      if (options[style] === 0) {
        return (
          <td
            key={`settingGamesPanelStyle${key},${style}`}
            onClick={() => {
              changeStyleOption(key, style, 1);
            }}
          />
        );
      } else if (options[style] === 1) {
        return (
          <td
            key={`settingGamesPanelStyle${key},${style}`}
            onClick={() => {
              changeStyleOption(key, style, 2);
            }}
            style={{ padding: '0', height: '100%' }}
          >
            <a style={{ height: '100%', width: '100%' }} className="icon">
              <span className="icon"><icon className="fa fa-circle-o"></icon></span>
            </a>
          </td>
        );
      } else if (options[style] === 2) {
        return (
          <td
            key={`settingGamesPanelStyle${key},${style}`}
            onClick={() => {
              changeStyleOption(key, style, 3);
            }}
            style={{ padding: '0', height: '100%' }}
          >
            <a style={{ height: '100%', width: '100%' }}>
              <i
                style={{ width: '100%', textAlign: 'center', verticalAlign: 'middle' }}
                className="fa fa-angle-up"
              ></i>
            </a>
          </td>
        );
      } else if (options[style] === 3) {
        return (
          <td
            key={`settingGamesPanelStyle${key},${style}`}
            onClick={() => {
              changeStyleOption(key, style, 0);
            }}
            style={{ padding: '0', height: '100%' }}
          >
            <a style={{ height: '100%', width: '100%' }}>
              <i
                style={{ width: '100%', textAlign: 'center', verticalAlign: 'middle' }}
                className="fa fa-angle-double-up"
              ></i>
            </a>
          </td>
        );
      }
      return (
        <td key={`settingGamesPanelStyle${key},${style}`}>?</td>
      );
    }

    const gameInfoHtml = [];
    // 何次予選まであるか、2次からチェックして調べる
    for (let i = 2; i <= maxRounds; i++) {
      if (!options.rounds[i]) {
        gameInfoHtml.push(
          <td
            style={{ textAlign: 'center', fontSize: '13pt' }}
            key={'settingGamesPanelGameInfo1'}
          >{i - 1}</td>,
        );
        break;
      }
    }
    // 全部あったらmaxRounds分ある
    if (gameInfoHtml.length === 0) {
      gameInfoHtml.push(
        <td
          style={{ textAlign: 'center', fontSize: '13pt' }}
          key={'settingGamesPanelGameInfo1'}
        >{maxRounds}</td>,
      );
    }

    // 下位決勝があるかどうかを調べる
    if (options.rounds[103]) {
      gameInfoHtml.push(
        <td
          style={{ textAlign: 'center ' }}
          key={'settingGamesPanelGame2'}
        ><a><span className="icon"><icon className="fa fa-circle-o"></icon></span></a></td>,
      );
    } else {
      gameInfoHtml.push(
        <td
          style={{ textAlign: 'center ' }}
          key={'settingGamesPanelGame2'}
        ><a><span className="icon"><icon className="fa fa-times"></icon></span></a></td>,
      );
    }

    return (
      <tr key={`settingGamesPanelRow${key}`}>
        <td style={{ textAlign: 'center' }}>{key}</td>
        <td>{games[key].name}</td>
        {whichStyle('WALTZ')}
        {whichStyle('TANGO')}
        {whichStyle('FOX')}
        {whichStyle('QUICK')}
        {whichStyle('VIENNESE')}
        {whichStyle('CHA')}
        {whichStyle('SAMBA')}
        {whichStyle('RUMBA')}
        {whichStyle('PASO')}
        {whichStyle('JIVE')}
        {gameInfoHtml}
      </tr>
    );
  });

  const onChangeName = (e) => {
    editTemp(1, e.target.value);
  };
  const onChangeNum = (e) => {
    if (!isNaN(e.target.value) && e.target.value.slice(-1) !== '.') {
      editTemp(2, e.target.value);
    }
  };
  const onChangeId = (e) => {
    if (!isNaN(e.target.value) && e.target.value.slice(-1) !== '.') {
      editTemp(3, e.target.value.trim());
    }
  };

  const isAddButton = temp[1].trim() && temp[2].trim();
  const isChangeButton = temp[1].trim() && temp[3].trim();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '-10px',
      }}
    >
      <div style={{ overflow: 'auto', flex: '1 1 auto', margin: '0 0 8px' }}>
        <table className="table is-narrow is-striped is-bordered" style={{ tableLayout: 'fixed' }}>
          <thead>
            { headersHtml }
          </thead>
          <tfoot>
            { headersHtml}
          </tfoot>
          <tbody>
            {bodyHtml}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 auto' }}></div>
        <div className="control is-horizontal">
          <div className="field is-grouped">
            <div className="field-body">
              <p className="control">
                <input
                  type="text"
                  value={temp[1]}
                  onChange={onChangeName}
                  onFocus={() => { editTemp(0, -2); }}
                  onBlur={() => { editTemp(0, -1); }}
                  className="input"
                  placeholder="大会名"
                  style={{ width: '200px' }}
                />
              </p>
              <p className="control" style={{ marginLeft: '10px' }}>
                <input
                  type="text"
                  value={temp[2]} // TODO: 1以上であることを確認すること
                  onChange={onChangeNum}
                  onFocus={() => { editTemp(0, -2); }}
                  onBlur={() => { editTemp(0, -1); }}
                  className="input"
                  placeholder="予選数"
                  style={{ width: '70px' }}
                />
              </p>
              <p className="control" style={{ marginLeft: '10px' }}>
                <a
                  className="button is-primary"
                  disabled={!isAddButton}
                  onClick={() => {
                    if (temp[1].trim() && temp[2].trim()) {
                      addGame(gamesNumber + 1, temp[1], temp[2]);
                    }
                  }}
                >競技追加</a>
              </p>
              <p className="control" style={{ marginLeft: '10px' }}>
                <a
                  className="button is-primary"
                  disabled={!isAddButton}
                  onClick={() => {
                    if (temp[1].trim() && temp[2].trim()) {
                      addGame(gamesNumber + 1, temp[1], temp[2], true);
                    }
                  }}
                >競技追加（下位決勝あり）</a>
              </p>
              <p className="control" style={{ marginLeft: '10px' }}>
                <input
                  type="text"
                  value={temp[3]}
                  onChange={onChangeId}
                  onFocus={() => { editTemp(0, -2); }}
                  onBlur={() => { editTemp(0, -1); }}
                  className="input"
                  placeholder="ID"
                  style={{ width: '62px' }}
                />
              </p>
              <p className="control" style={{ marginLeft: '10px' }}>
                <a
                  className="button is-primary is-outlined"
                  disabled={!isChangeButton}
                  onClick={() => {
                    if (temp[3].trim() && Number(temp[3]) <= gamesNumber && temp[1].trim()) {
                      changeGameName(temp[3], temp[1]);
                    }
                    editTemp(1, '');
                    editTemp(3, '');
                  }}
                >競技名編集</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingGamesPanel;
