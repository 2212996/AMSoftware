import React from 'react';

import { createHeatsNewStandard, createHeatsVertical, createHeatsSideWays } from '../common/composeRounds';
import { writeScore, createRound, readRound } from '../common/fileService';

import VisiblePassButton from '../../containers/MainPanel/VisiblePassButton';
import VisibleProcessRankButton from '../../containers/MainPanel/VisibleProcessRankButton';
// import VisibleScoreTable from '../../containers/MainPanel/VisibleScoreTable';
import ScoreTableJudge from '../../containers/MainPanel/VisibleScoreTableJudge';
// import DataPanelButton from './DataPanelButton';

const MainPanel = ({ competitors, selectedRound, switchModal, isModalOn, temp,
  selectedGame, tempGame, assignTempScore, games,
  backupPath, selectCreationMethod, selectedCreationMethod }) => {
// Varialbes
//--------------------------------------------------
  let round;
  const roundsJudgeNum = {};
  let roundsOptions;
  let scoringMethod;
  let gameOptions;
  let postPonedPlayers;
  let upNum;
  const allScores = {};

  if (games[selectedGame]) {
    gameOptions = games[selectedGame].options;
    if (tempGame) {
      if (Object.keys(tempGame).length > 0) {
        const wholeRound = tempGame;
        if (wholeRound) {
          round = wholeRound[selectedRound.style];
          scoringMethod = round.scoringMethod;
          postPonedPlayers = round.postPonedPlayers;
          upNum = round.upNum;
          Object.keys(wholeRound).forEach((style) => {
            allScores[style] = wholeRound[style].scores;
          });
        }
        Object.keys(games[selectedGame].options.rounds).forEach((roundKey) => {
          roundsJudgeNum[roundKey] = games[selectedGame].options.rounds[roundKey].judge;
        });
        roundsOptions = games[selectedGame].options.rounds;
      }
    }
  }

  const isModalActive = isModalOn === 1 ? ' is-active' : '';

  const stylesArray = ['WALTZ', 'TANGO', 'FOX', 'QUICK', 'VIENNESE',
    'CHA', 'SAMBA', 'RUMBA', 'PASO', 'JIVE'];

  let nextRoundKey = 0;
  if (roundsOptions) {
    if (roundsOptions[selectedRound.round + 1]) {
      nextRoundKey = selectedRound.round + 1;
    } else if (selectedRound.round === 201) {
      nextRoundKey = 102;
    } else {
      nextRoundKey = 101;
    }
  }
/**
 * Functions
 */
  function createHeats(...args) {
    switch (selectedCreationMethod) {
      case 'STANDARD':
        return createHeatsNewStandard(...args);
      case 'VERTICAL':
        return createHeatsVertical(...args);
      case 'SIDEWAYS':
        return createHeatsSideWays(...args);
      default:
        return createHeatsNewStandard(...args);
    }
  }

  const onClickPassConfirm = num => (
    () => {
      // バックアップをとる
      // if (backupPath) {
      //   fs.writeFile(`${backupPath}/save_${selectedGame}_${selectedRound.round}_${selectedRound.style}`, JSON.stringify(state), () => {});
      // }
      if (!roundsJudgeNum[nextRoundKey]) {
        switchModal(4);
        return;
      }
      const newHeat = (() => {
        // 同点決勝だった場合、保留組も追加
        if (selectedRound.round >= 200) {
          return createHeats(temp[0][num].concat(postPonedPlayers), nextRoundKey, roundsOptions, competitors);
        }
        return createHeats(temp[0][num], nextRoundKey, roundsOptions, competitors);
      })();
      if (nextRoundKey === 102) {
        const heldStyles = [];
        stylesArray.forEach((style) => {
          if (Number(gameOptions[style]) > 0) {
            heldStyles.push(style);
          }
        });

        createRound(
          selectedGame, 102, roundsJudgeNum[102], 'RANKING',
          newHeat, 0, heldStyles, backupPath,
        );

        // 下位決勝がある場合、その分も作成する
        if (roundsOptions[103]) {
          const finalsCompetitors = newHeat[0];
          const semiFinalData = readRound(backupPath, selectedGame, 101);
          if (!semiFinalData) {
            // TODO: dialogで準決のデータがないことをアピール
            switchModal(0);
            return;
          }
          const semiFinalCompetitors = semiFinalData[selectedRound.style].heats.reduce((result, heat) => (
            result.concat(heat)
          ), []);
          const validCompetitors = semiFinalCompetitors.filter((c1) => {
            let flag = true;
            finalsCompetitors.forEach((c2) => {
              if (c1 === c2) {
                flag = false;
              }
            });
            return flag;
          });

          createRound(
            selectedGame, 103, roundsJudgeNum[102], 'RANKING',
            [validCompetitors], 0, heldStyles, backupPath,
          );
        }
      } else if (nextRoundKey === 101) {
        const heldStyles = [];
        stylesArray.forEach((style) => {
          if (Number(gameOptions[style]) > 0 && Number(gameOptions[style] <= 2)) {
            heldStyles.push(style);
          }
        });

        createRound(
          selectedGame, 101, roundsJudgeNum[101], 'CHECK',
          newHeat, roundsOptions[nextRoundKey].up, heldStyles, backupPath,
        );
      } else {
        let heldStyles = [];
        heldStyles = Object.keys(allScores);

        createRound(
          selectedGame, nextRoundKey, roundsJudgeNum[nextRoundKey], 'CHECK',
          newHeat, roundsOptions[nextRoundKey].up, heldStyles, backupPath,
        );
      }

      if (scoringMethod === 'CHECK') {
        const finalScore = temp[1];
        finalScore.bottomScore = finalScore.bottomScore[num];
        finalScore.passed = finalScore.passed[num];
        assignTempScore(finalScore);
        writeScore(finalScore, backupPath, selectedGame, selectedRound.round);
        // TODO: 印刷画面... なんかなくなってる O_O
        // switchModal(0); // 本当は3だったのだけれど...
      // 順位の場合すでにonClickProcessRankで結果の追加などはされている。
      }

      switchModal(0);
    }
  );

  const onClickPlayOff = nScoringMethod => (
    () => {
      // sCompetitorとbCompetitorsの差分をとる
      const validCompetitors = [];
      temp[0][1].forEach((c1) => {
        let flag = true;
        temp[0][0].forEach((c2) => {
          if (c1 === c2) {
            flag = false;
          }
        });
        if (flag === true) {
          validCompetitors.push(c1);
        }
      });
      // ヒートにそのまま使うためソートする
      validCompetitors.sort((a, b) => {
        if (competitors[a].number < competitors[b].number) {
          return -1;
        }
        return 1;
      });

      // とりあえずsCompetitorsをとったとしてfinalScoreを追加する
      const finalScore = temp[1];
      finalScore.bottomScore = finalScore.bottomScore[0];
      finalScore.passed = finalScore.passed[0];
      assignTempScore(finalScore);
      writeScore(finalScore, backupPath, selectedGame, selectedRound.round);

      let roundKey;
      if (Number(selectedRound.round) === 101) {
        roundKey = 201;
      // 決勝の場合
      } else {
        roundKey = 200;
      }

      let selectedScoringMethod;
      let heldStyles = [];

      if (nScoringMethod === 1) {
        selectedScoringMethod = 'RANKING';
      } else if (nScoringMethod === 0) {
        selectedScoringMethod = 'CHECK';
      }

      heldStyles = Object.keys(allScores);

      createRound(
        selectedGame, roundKey, roundsJudgeNum[selectedRound.round], selectedScoringMethod,
        [validCompetitors], temp[2] - temp[0][0].length, heldStyles, backupPath, temp[0][0],
      );
      switchModal(0);
    }
  );


  // const onClickSmallFinal = () => {
  //   const round102Data = readRound(backupPath, selectedGame, 102);
  //   const finalsCompetitors = round102Data[selectedRound.style].heats[0];
  //   const semiFinalData = readFile(selectedGame, 101);
  //   if (!semiFinalData) {
  //     return;
  //   }
  //   const semiFinalCompetitors = semiFinalData[selectedRound.style].heats.reduce((result, heat) => (
  //     result.concat(heat)
  //   ), []);
  //   const validCompetitors = semiFinalCompetitors.filter((c1) => {
  //     let flag = true;
  //     finalsCompetitors.forEach((c2) => {
  //       if (c1 === c2) {
  //         flag = false;
  //       }
  //     });
  //     return flag;
  //   });

  //   const heldStyles = [];

  //   stylesArray.forEach((style) => {
  //     if (Number(games[selectedGame].options[style]) > 0) {
  //       heldStyles.push(style);
  //     }
  //   });

  //   createRound(
  //     selectedGame, 103, roundsJudges[102], 'RANKING', [validCompetitors], 0,
  //     heldStyles, backupPath,
  //   );

  //   switchModal(0);
  // };

  const onClickSwitchModal = num => (
    () => {
      switchModal(num);
    }
  );

/**
 * Htmls
 */

  function onChangeCreationMethod(e) {
    selectCreationMethod(e.target.value);
  }

  function creationMethodHtml() {
    return (
      <p className="control">
        <span className="select">
          <select value={selectedCreationMethod} onChange={onChangeCreationMethod}>
            <option value="STANDARD" key="STANDARD">標準</option>
            <option value="VERTICAL" key="VERTICAL">縦並び</option>
            <option value="SIDEWAYS" key="SIDEWAYS">横並び</option>
          </select>
        </span>
      </p>
    );
  }

  let modalButtonsHtml = [];

  if (Number(selectedRound.round) === 200 || Number(selectedRound.round) === 201) {
    if (temp[0][1].length === upNum) {
      modalButtonsHtml = (
        <div className="control is-grouped">
          <p className="control">
            <a className="button is-primary" onClick={onClickPassConfirm(1)}>
              {`${temp[0][1].length}名`}
            </a>
          </p>
        </div>
      );
    } else {
      modalButtonsHtml = (
        <div className="field is-horizontal">
          <div className="field-body">
            <p className="control">
              <a className="button is-primary" onClick={onClickPassConfirm(0)}>
                {`${temp[0][0].length}名`}
              </a>
            </p>
            <p className="control" style={{ marginLeft: '10px' }}>
              <a className="button is-primary" onClick={onClickPassConfirm(1)}>
                {`${temp[0][1].length}名`}
              </a>
            </p>
          </div>
        </div>
      );
    }
  } else if (Number(selectedRound.round) === 101 || Number(nextRoundKey) === 101) {
    if (temp[0][1].length === temp[2]) {
      modalButtonsHtml = (
        <div className="control is-grouped">
          <p className="control">
            <a className="button is-primary" onClick={onClickPassConfirm(1)}>
              {`${temp[0][1].length}名`}
            </a>
          </p>
        </div>
      );
    } else if (temp[0][0].length === 0) {
      modalButtonsHtml = (
        <div className="field is-horizontal">
          <div className="field-body">
            <p className="control">
              <a className="button is-primary" onClick={onClickPassConfirm(1)}>
                {`${temp[0][1].length}名`}
              </a>
            </p>
            <p className="control" style={{ marginLeft: '10px' }}>
              <a className="button is-primary is-outlined" onClick={onClickSwitchModal(10)}>
                同点決勝
              </a>
            </p>
          </div>
        </div>
      );
    } else {
      modalButtonsHtml = (
        <div className="field is-horizontal">
          <div className="field-body">
            <p className="control">
              <a className="button is-primary" onClick={onClickPassConfirm(0)}>
                {`${temp[0][0].length}名`}
              </a>
            </p>
            <p className="control" style={{ marginLeft: '10px' }}>
              <a className="button is-primary" onClick={onClickPassConfirm(1)}>
                {`${temp[0][1].length}名`}
              </a>
            </p>
            <p className="control" style={{ marginLeft: '10px' }}>
              <a className="button is-primary is-outlined" onClick={onClickSwitchModal(10)}>
                同点決勝
              </a>
            </p>
          </div>
        </div>
      );
    }
  } else if (temp[0][0].length === 0) {
    modalButtonsHtml = (
      <div className="control is-grouped">
        <p className="control">
          <a className="button is-primary" onClick={onClickPassConfirm(1)}>
            {`${temp[0][1].length}名`}
          </a>
        </p>
      </div>
    );
  } else {
    modalButtonsHtml = (
      <div className="field is-horizontal">
        <div className="field-body">
          <p className="control">
            <a className="button is-primary" onClick={onClickPassConfirm(0)}>
              {`${temp[0][0].length}名`}
            </a>
          </p>
          <p className="control" style={{ marginLeft: '10px' }}>
            <a className="button is-primary" onClick={onClickPassConfirm(1)}>
              {`${temp[0][1].length}名`}
            </a>
          </p>
        </div>
      </div>
    );
  }

  let passButtonHtml;

  switch (scoringMethod) {
    case 'CHECK': {
      passButtonHtml = (
        <VisiblePassButton />
      );
      break;
    }
    case 'RANKING': {
      passButtonHtml = (
        <VisibleProcessRankButton />
      );
      break;
    }
    default: {
      passButtonHtml = (
        <p className="control">
          <a className="button" disabled>
            通過決定
          </a>
        </p>
      );
    }
  }

  let passString;
  if (selectedRound.round >= 200) {
    passString = upNum;
  } else if (roundsOptions) {
    if (roundsOptions[selectedRound.round]) {
      if (roundsOptions[selectedRound.round].up) {
        passString = roundsOptions[selectedRound.round].up;
      }
    }
  }

  return (
    <div
      className="box"
      style={{
        overflow: 'auto',
        flex: '1 0 0',
        display: 'flex',
        flexDirection: 'column',
        margin: '3px',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flex: '1 1 0', overflow: 'auto' }}>
        <ScoreTableJudge />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row-reverse',
          flex: '0 0 auto',
        }}
      >
        {passButtonHtml}
      </div>

      <div className={`modal${isModalActive}`}>
        <div className="modal-background"></div>
        <div className="modal-content" style={{ width: '500px' }}>
          <div className="box" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="content has-text-centered">
              {`通過数を選んでください (予定${passString}名)`}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              {creationMethodHtml()}
              <div style={{ flex: '1 1 auto' }} />
              {modalButtonsHtml}
            </div>
          </div>
        </div>
        <button className="modal-close" onClick={onClickSwitchModal(0)}></button>
      </div>

      {/*<div className={`modal${isModalOn === 6 ? ' is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content" style={{ width: '500px' }}>
          <div className="box" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="content has-text-centered">
              下位決勝を行いますか？
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ flex: '1 1 auto' }} />
              <p className="control" style={{ marginRight: '1em' }}>
                <a
                  className="button is-primary is-outlined" onClick={onClickSmallFinal}
                >
                  行う
                </a>
              </p>
              <p className="control">
                <a className="button is-primary is-outlined" onClick={onClickSwitchModal(0)}>
                  行わない
                </a>
              </p>
            </div>
          </div>
        </div>
        <button className="modal-close" onClick={onClickSwitchModal(0)}></button>
      </div>*/}

      <div className={`modal${isModalOn === 10 ? ' is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-content" style={{ width: '500px' }}>
          <div className="box" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="content has-text-centered">
              どちらの方式で行いますか？
            </div>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ flex: '1 1 auto' }} />
              <p className="control" style={{ marginRight: '1em' }}>
                <a
                  className="button is-primary is-outlined" onClick={onClickPlayOff(0)}
                >
                  チェック
                </a>
              </p>
              <p className="control">
                <a className="button is-primary is-outlined" onClick={onClickPlayOff(1)}>
                  順位
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPanel;
