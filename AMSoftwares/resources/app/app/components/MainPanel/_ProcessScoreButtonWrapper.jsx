// Under Construction
import React from 'react';

import VisiblePassButton from '../../containers/MainPanel/VisiblePassButton';
import VisibleProcessRankButton from '../../containers/MainPanel/VisibleProcessRankButton';

class ProcessScoreButtonWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  onClickPassConfirm(num) {
    return (
      () => {
        // バックアップをとる
        // if (backupPath) {
        //   fs.writeFile(`${backupPath}/save_${selectedGame}_${selectedRound.round}_${selectedRound.style}`, JSON.stringify(state), () => {});
        // }
        if (!roundsJudges[nextRoundKey]) {
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
            selectedGame, 102, roundsJudges[102], 'RANKING',
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
              selectedGame, 103, roundsJudges[102], 'RANKING',
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
            selectedGame, 101, roundsJudges[101], 'CHECK',
            newHeat, roundsOptions[nextRoundKey].up, heldStyles, backupPath,
          );
        } else {
          let heldStyles = [];
          heldStyles = Object.keys(allScores);

          createRound(
            selectedGame, nextRoundKey, roundsJudges[nextRoundKey], 'CHECK',
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
  }

  onClickPlayOff(nScoringMethod) {
    return (
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
          selectedGame, roundKey, roundsJudges[selectedRound.round], selectedScoringMethod,
          [validCompetitors], temp[2] - temp[0][0].length, heldStyles, backupPath, temp[0][0],
        );
        switchModal(0);
      }
    );
  }


  buttonHtml() {
    switch (this.props.scoringMethod) {
      case 'CHECK': {
        return (
          <VisiblePassButton />
        );
      }
      case 'RANKING': {
        return (
          <VisibleProcessRankButton />
        );
      }
      default: {
        return (
          <p className="control">
            <a className="button" disabled>
              通過決定
            </a>
          </p>
        );
      }
    }
  }

  render() {
    return (
      <p className="control">
        <button className="button is-primary is-outlined">
          通過決定
        </button>
      </p>
    );
  }
}

export default ProcessScoreButtonWrapper;
