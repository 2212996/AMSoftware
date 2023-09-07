import React from 'react';

const SettingHeatsPanel = ({ games, selectedCell, temp,
selectCell, editTemp, changeJudge, changeHeats, changeUps }) => {
  // const gamesNumber = Object.keys(games).length;
  let maxRounds = 0;
  Object.keys(games).forEach((game) => {
    const length = Object.keys(games[game].options.rounds).filter(roundKey => (
      Number(roundKey) <= 100
    )).length;
    if (maxRounds < length) {
      maxRounds = length;
    }
  });

  const roundsHeaderTop = [];
  for (let i = 1; i <= maxRounds; i++) {
    roundsHeaderTop.push(
      <th
        key={`settingHeatsPanelHeader${i}`}
        colSpan="3"
        style={{ width: '6rem', textAlign: 'center' }}
      >{i}</th>,
    );
  }
  const headerTop = (
    <tr key="settingHeatsPanelHeaderTop">
      <th style={{ width: '2rem' }} />
      <th style={{ width: '15rem' }} />
      {roundsHeaderTop}
      <th colSpan="2" style={{ width: '4rem', textAlign: 'center' }}>準</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>上</th>
      <th style={{ width: '2rem', textAlign: 'center' }}>下</th>
    </tr>
  );

  const roundsHeaderBottom = [];
  for (let i = 1; i <= maxRounds; i++) {
    roundsHeaderBottom.push(
      <th style={{ textAlign: 'center' }} key={`settingHeatsPanelJ${i}`}>J</th>,
    );
    roundsHeaderBottom.push(
      <th style={{ textAlign: 'center' }} key={`settingHeatsPanelH${i}`}>H</th>,
    );
    roundsHeaderBottom.push(
      <th style={{ textAlign: 'center' }} key={`settingHeatsPanelUp${i}`}>Up</th>,
    );
  }
  const headerBottom = (
    <tr key="settingHeatsPanelHeaderBottom">
      <th>ID</th>
      <th>名称</th>
      {roundsHeaderBottom}
      <th style={{ textAlign: 'center' }}>J</th>
      <th style={{ textAlign: 'center' }}>Up</th>
      <th style={{ textAlign: 'center' }}>J</th>
      <th style={{ textAlign: 'center' }}>J</th>
    </tr>
  );

  const headersTopHtml = [];
  headersTopHtml.push(headerTop);
  headersTopHtml.push(headerBottom);

  const headersBottomHtml = [];
  headersBottomHtml.push(headerBottom);
  headersBottomHtml.push(headerTop);

  const bodyHtml = Object.keys(games).map((key) => {
    const rounds = games[key].options.rounds;
    const dataHtml = [];
    for (let i = 1; i <= maxRounds; i++) {
      if (rounds[i]) {
        const isActiveJ = selectedCell.col[0] === i && selectedCell.col[1] === 0 &&
        selectedCell.row === Number(key) ? 'active' : '';
        const isActiveH = selectedCell.col[0] === i && selectedCell.col[1] === 1 &&
        selectedCell.row === Number(key) ? 'active' : '';
        const isActiveUp = selectedCell.col[0] === i && selectedCell.col[1] === 2 &&
        selectedCell.row === Number(key) ? 'active' : '';

        dataHtml.push(
          <td
            style={{ textAlign: 'center' }}
            className={isActiveJ}
            key={`settingHeatsPanelJudge${key},${i}`}
            onClick={() => { editTemp(0, -1); selectCell([i, 0], Number(key)); }}
          >{Number(rounds[i].judge)}</td>,
        );
        dataHtml.push(
          <td
            style={{ textAlign: 'center' }}
            className={isActiveH}
            key={`settingHeatsPanelHeats${key},${i}`}
            onClick={() => { editTemp(0, -1); selectCell([i, 1], Number(key)); }}
          >{rounds[i].heats}</td>,
        );
        dataHtml.push(
          <td
            style={{ textAlign: 'center' }}
            className={isActiveUp}
            key={`settingHeatsPanelUps${key},${i}`}
            onClick={() => { editTemp(0, -1); selectCell([i, 2], Number(key)); }}
          >{rounds[i].up}</td>,
        );
      } else {
        dataHtml.push(
          <td key={`settingHeatsPanelJudge${key},${i}`} />,
        );
        dataHtml.push(
          <td key={`settingHeatsPanelHeats${key},${i}`} />,
        );
        dataHtml.push(
          <td key={`settingHeatsPanelUps${key},${i}`} />,
        );
      }
    }

    const isActiveJSemi = selectedCell.col[0] === 101 && selectedCell.col[1] === 0 &&
    selectedCell.row === Number(key) ? 'active' : '';
    const isActiveUpSemi = selectedCell.col[0] === 101 && selectedCell.col[1] === 2 &&
    selectedCell.row === Number(key) ? 'active' : '';
    const isActiveJFinal = selectedCell.col[0] === 102 && selectedCell.col[1] === 0 &&
    selectedCell.row === Number(key) ? 'active' : '';

    dataHtml.push(
      <td
        style={{ textAlign: 'center' }}
        className={isActiveJSemi}
        key={`settingHeatsPanelJudge${key},101`}
        onClick={() => { editTemp(0, -1); selectCell([101, 0], Number(key)); }}
      >{Number(rounds[101].judge)}</td>,
      <td
        style={{ textAlign: 'center' }}
        className={isActiveUpSemi}
        key={`settingHeatsPanelUps${key},101`}
        onClick={() => { editTemp(0, -1); selectCell([101, 2], Number(key)); }}
      >{rounds[101].up}</td>,
      <td
        style={{ textAlign: 'center' }}
        className={isActiveJFinal}
        key={`settingHeatsPanelJudge${key},102`}
        onClick={() => { editTemp(0, -1); selectCell([102, 0], Number(key)); }}
      >{Number(rounds[102].judge)}</td>,
    );

    if (rounds[103]) {
      const isActiveJSmallFinal = selectedCell.col[0] === 103 && selectedCell.col[1] === 0 &&
      selectedCell.row === Number(key) ? 'active' : '';

      dataHtml.push(
        <td
          style={{ textAlign: 'center' }}
          className={isActiveJSmallFinal}
          key={`settingHeatsPanelJudge${key},103`}
          onClick={() => { editTemp(0, -1); selectCell([103, 0], Number(key)); }}
        >{Number(rounds[103].judge)}</td>,
      );
    } else {
      dataHtml.push(
        <td key={`settingHeatsPanelJudge${key},103`} />,
      );
    }

    return (
      <tr key={`settingHeatsPanelRow${key}`}>
        <td>{key}</td>
        <td>{games[key].name}</td>
        {dataHtml}
      </tr>
    );
  });

  const onKeyDown = (e) => {
    // const gameRounds = Object.keys(games[selectedCell.row].options.rounds).filter(roundKey => (
    //   Number(roundKey <= 100)
    // )).length;
    // const date = new Date();
    let selectedValue;
    if (selectedCell.col[1] === 0) {
      selectedValue = Number(games[selectedCell.row].options.rounds[selectedCell.col[0]].judge);
    } else if (selectedCell.col[1] === 1) {
      selectedValue = Number(games[selectedCell.row].options.rounds[selectedCell.col[0]].heats);
    } else if (selectedCell.col[1] === 2) {
      selectedValue = Number(games[selectedCell.row].options.rounds[selectedCell.col[0]].up);
    }

    if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 ||
      e.keyCode === 40 || e.keyCode === 32) {
      e.preventDefault();
    }

    // if ((date.getTime() - temp[1]) > 80) {
    //   editTemp(1, date.getTime());
    if (e.keyCode > 47 && e.keyCode < 58) {
      if (Number(temp[0]) === -2) {
        return;
      }
      if (Number(temp[0]) === -1) {
        editTemp(0, selectedValue);
        if (selectedCell.col[1] === 1) {
          changeHeats(selectedCell.row, selectedCell.col[0], e.keyCode - 48);
        } else if (selectedCell.col[1] === 2) {
          changeUps(selectedCell.row, selectedCell.col[0], e.keyCode - 48);
        } else if (selectedCell.col[1] === 0) {
          changeJudge(selectedCell.row, selectedCell.col[0], Number(e.keyCode) - 48);
        }
      } else if (selectedCell.col[1] === 1) {
        // 100ヒート以上はない気がする
        if (selectedValue < 10) {
          changeHeats(selectedCell.row, selectedCell.col[0],
            (selectedValue * 10) + (e.keyCode - 48));
        }
      } else if (selectedCell.col[1] === 2) {
        // 1000以上はさすがにない
        if (selectedValue < 100) {
          changeUps(selectedCell.row, selectedCell.col[0],
            (selectedValue * 10) + (e.keyCode - 48));
        }
      } else if (selectedCell.col[1] === 0) {
        // ジャッジ百人とかない
        if (selectedValue < 10) {
          changeJudge(selectedCell.row, selectedCell.col[0], (selectedValue * 10) + (Number(e.keyCode) - 48));
        }
      }
    }

      // if (e.keyCode === 13) { // enter
      //   editTemp(0, -1);
      //   if (selectedCell.row >= gamesNumber) {
      //     if (selectedCell.col[0] === maxRounds && selectedCell.col[1] === 2) {
      //       selectCell([101, 0], 1);
      //       return;
      //     } else if (selectedCell.col[0] === 101 && selectedCell.col[1] === 0) {
      //       selectCell([101, 2], 1);
      //       return;
      //     } else if (selectedCell.col[0] === 101 && selectedCell.col[1] === 2) {
      //       selectCell([102, 0], 1);
      //     } else if (selectedCell.col[0] <= maxRounds) {
      //       if (selectedCell.col[1] === 2) {
      //         for (let i = 1; i <= gamesNumber; i++) {
      //           if (games[i].options.rounds[selectedCell.col[0] + 1]) {
      //             selectCell([selectedCell.col[0] + 1, 0], i);
      //             return;
      //           }
      //         }
      //       } else if (selectedCell.col[1] < 2) {
      //         for (let i = 1; i <= gamesNumber; i++) {
      //           if (games[i].options.rounds[selectedCell.col[0]]) {
      //             selectCell([selectedCell.col[0], selectedCell.col[1] + 1], i);
      //             return;
      //           }
      //         }
      //       }
      //     }
      //   } else if (selectedCell.row < gamesNumber) {
      //     for (let i = selectedCell.row + 1; i <= gamesNumber; i++) {
      //       if (games[i].options.rounds[selectedCell.col[0]]) {
      //         selectCell(selectedCell.col, i);
      //         return;
      //       }
      //     }
      //     if (selectedCell.col[0] === maxRounds && selectedCell.col[1] === 2) {
      //       selectCell([101, 0], 1);
      //       return;
      //     } else if (selectedCell.col[1] === 2) {
      //       for (let i = 1; i <= gamesNumber; i++) {
      //         if (games[i].options.rounds[selectedCell.col[0] + 1]) {
      //           selectCell([selectedCell.col[0] + 1, 0], i);
      //           return;
      //         }
      //       }
      //     } else if (selectedCell.col[1] < 2) {
      //       for (let i = 1; i <= gamesNumber; i++) {
      //         if (games[i].options.rounds[selectedCell.col[0]]) {
      //           selectCell([selectedCell.col[0], selectedCell.col[1] + 1], i);
      //           return;
      //         }
      //       }
      //     }
      //   }
      // }

      // if (e.keyCode === 32) { // space
      //   editTemp(0, -1);
      //   if (selectedCell.col[0] >= 102 && selectedCell.row < gamesNumber) {
      //     selectCell([1, 0], selectedCell.row + 1);
      //     return;
      //   } else if (selectedCell.col[0] === gameRounds && selectedCell.col[1] === 2) {
      //     selectCell([101, 0], selectedCell.row);
      //     return;
      //   } else if (selectedCell.col[0] === 101 && selectedCell.col[1] === 0) {
      //     selectCell([101, 2], selectedCell.row);
      //     return;
      //   } else if (selectedCell.col[0] === 101 && selectedCell.col[1] === 2) {
      //     selectCell([102, 0], selectedCell.row);
      //   } else if (selectedCell.col[0] <= maxRounds) {
      //     if (selectedCell.col[1] === 2) {
      //       selectCell([selectedCell.col[0] + 1, 0], selectedCell.row);
      //     } else if (selectedCell.col[1] < 2) {
      //       selectCell([selectedCell.col[0], selectedCell.col[1] + 1], selectedCell.row);
      //     }
      //   }
      // }

      // if (e.keyCode === 37) { // left
      //   editTemp(0, -1);
      //   if (selectedCell.col[0] === 101 && selectedCell.col[1] === 0) {
      //     selectCell([gameRounds, 2], selectedCell.row);
      //   } else if (selectedCell.col[0] === 101 && selectedCell.col[1] === 2) {
      //     selectCell([101, 0], selectedCell.row);
      //   } else if (selectedCell.col[0] === 1 && selectedCell.col[1] === 0) {
      //     selectCell([102, 0], selectedCell.row);
      //   } else if (selectedCell.col[1] === 0) {
      //     selectCell([selectedCell.col[0] - 1, 2], selectedCell.row);
      //   } else if (selectedCell.col[1] > 0) {
      //     selectCell([selectedCell.col[0], selectedCell.col[1] - 1], selectedCell.row);
      //   }
      // }

      // if (e.keyCode === 38) { // up
      //   editTemp(0, -1);
      //   if (selectedCell.row === 1) {
      //     for (let i = gamesNumber; i >= 1; i--) {
      //       if (games[i].options.rounds[selectedCell.col[0]]) {
      //         selectCell(selectedCell.col, i);
      //         return;
      //       }
      //     }
      //   } else if (selectedCell.row > 1) {
      //     for (let i = selectedCell.row - 1; i >= 1; i--) {
      //       if (games[i].options.rounds[selectedCell.col[0]]) {
      //         selectCell(selectedCell.col, i);
      //         return;
      //       }
      //     }
      //     for (let i = gamesNumber; i >= selectedCell.row; i--) {
      //       if (games[i].options.rounds[selectedCell.col[0]]) {
      //         selectCell(selectedCell.col, i);
      //         return;
      //       }
      //     }
      //   }
      // }

      // if (e.keyCode === 39) { // right
      //   editTemp(0, -1);
      //   if (selectedCell.col[0] === gameRounds && selectedCell.col[1] === 2) {
      //     selectCell([101, 0], selectedCell.row);
      //   } else if (selectedCell.col[0] === 101 && selectedCell.col[1] === 0) {
      //     selectCell([101, 2], selectedCell.row);
      //   } else if (selectedCell.col[0] === 102 && selectedCell.col[1] === 0) {
      //     selectCell([1, 0], selectedCell.row);
      //   } else if (selectedCell.col[1] === 2) {
      //     selectCell([selectedCell.col[0] + 1, 0], selectedCell.row);
      //   } else if (selectedCell.col[1] < 2) {
      //     selectCell([selectedCell.col[0], selectedCell.col[1] + 1], selectedCell.row);
      //   }
      // }

      // if (e.keyCode === 40) { // down
      //   editTemp(0, -1);
      //   if (Number(selectedCell.row) >= gamesNumber) {
      //     for (let i = 1; i <= gamesNumber; i++) {
      //       if (games[i].options.rounds[selectedCell.col[0]]) {
      //         selectCell(selectedCell.col, i);
      //         return;
      //       }
      //     }
      //   } else if (Number(selectedCell.row) < gamesNumber) {
      //     for (let i = Number(selectedCell.row) + 1; i <= gamesNumber; i++) {
      //       if (games[i].options.rounds[selectedCell.col[0]]) {
      //         selectCell(selectedCell.col, i);
      //         return;
      //       }
      //     }
      //     for (let i = 1; i <= Number(selectedCell.row); i++) {
      //       if (games[i].options.rounds[selectedCell.col[0]]) {
      //         selectCell(selectedCell.col, i);
      //         return;
      //       }
      //     }
      //   }
      // }
    // }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      tabIndex="0"
      onKeyDown={onKeyDown}
    >
      <div style={{ overflow: 'auto', flex: '1 1 auto', margin: '0 0 8px' }}>
        <table className="table is-narrow is-striped is-bordered" style={{ tableLayout: 'fixed' }}>
          <thead>
            { headersTopHtml }
          </thead>
          <tfoot>
            { headersBottomHtml }
          </tfoot>
          <tbody>
            {bodyHtml}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingHeatsPanel;
