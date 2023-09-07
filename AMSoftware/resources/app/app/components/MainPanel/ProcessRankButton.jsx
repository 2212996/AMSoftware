import React from 'react';

import { deepGet } from '../common/utils';
import { writeRound, writeScore } from '../common/fileService';


class ProcessRankButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isButtonActive: true,
      sIsModalOn: '',
    };

    this.onClickProcessRank = this.onClickProcessRank.bind(this);
    this.onClickModalOk = this.onClickModalOk.bind(this);
    this.onRankSingle = this.onRankSingle.bind(this);
    this.onRankSingleDraw = this.onRankSingleDraw.bind(this);
    this.onRankTotalDraw = this.onRankTotalDraw.bind(this);
    this.onRankTotalDrawWrapper = this.onRankTotalDrawWrapper.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const selectedRoundDatas = nextProps.tempGame;
    const selectedHeatsData = deepGet(selectedRoundDatas, [nextProps.selectedRound.style, 'heats']);
    if (selectedHeatsData) {
      this.setState({ isButtonActive: true });
    } else {
      this.setState({ isButtonActive: false });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isButtonActive !== this.state.isButtonActive || nextState.sIsModalOn !== this.state.sIsModalOn) {
      return true;
    }

    return false;
  }

  onClickModalOk() {
    this.setState({ sIsModalOn: '' });
  }

  onClickProcessRank() {
    const selectedRoundDatas = this.props.tempGame;
    const selectedRoundData = deepGet(selectedRoundDatas, [this.props.selectedRound.style]);

    const stylesHeldInRound = Object.keys(selectedRoundDatas);
    const numOfCompetitorToNextRound =
      deepGet(selectedRoundData, ['upNum']);

    // バックアップ！
    if (this.props.backupPath) {
      // fs.writeFile(`${backupPath}/save_${selectedGame}_${selectedRound.round}_${selectedRound.style}`, JSON.stringify(state), () => {});
      this.props.writeState(`${this.props.backupPath}/save_${this.props.selectedGame}_${this.props.selectedRound.round}_` +
        `${this.props.selectedRound.style}`);
    }

    const finalScore = {
      single: {},
      total: {
        skating: {
          total: {},
          rule10: [],
          rule11: [],
        },
        ranks: {},
      },
    };

    // まず単科ずつの処理を行う
    stylesHeldInRound.forEach((style) => {
      finalScore.single[style] = {
        skating: [],
        ranks: {},
      };
      const numOfJudges = selectedRoundDatas[style].judgeNum;
      const currentRoundScore = selectedRoundDatas[style].scores;
      const currentCompetitors = Object.keys(currentRoundScore);

      [finalScore.single[style].skating, finalScore.single[style].ranks] =
        this.onRankSingle(currentCompetitors, 1, currentRoundScore, numOfJudges, currentCompetitors.length, false);
    });

    // 以下総合順位について
    const ranksToCompetitor = {};
    Object.keys(finalScore.single).forEach((style) => {
      Object.keys(finalScore.single[style].ranks).forEach((competitorId) => {
        if (ranksToCompetitor[competitorId]) {
          ranksToCompetitor[competitorId].push(finalScore.single[style].ranks[competitorId]);
        } else {
          ranksToCompetitor[competitorId] = [finalScore.single[style].ranks[competitorId]];
        }
      });
    });
    const rankSumToCompetitor = {};
    Object.keys(ranksToCompetitor).forEach((competitorId) => {
      const sum = ranksToCompetitor[competitorId].reduce((result, rank) => (
        result + rank
      ), 0);
      rankSumToCompetitor[competitorId] = sum;
    });

    const tCompetitors = Object.keys(rankSumToCompetitor);
    const finalTotalRank = {};
    const rule10 = {};
    const rule11 = {};

    let currentRank = 1;

    // 順位が決定した選手から順にtCompetitorsから抜いていく
    while (tCompetitors.length > 0) {
      let minRankSum = 1000;
      let minRankSumCompetitors = [];

      // 最小合計順位を持つ選手の選定
      tCompetitors.forEach((competitorId) => {
        if (rankSumToCompetitor[competitorId] < minRankSum) {
          minRankSum = rankSumToCompetitor[competitorId];
          minRankSumCompetitors = [competitorId];
        } else if (rankSumToCompetitor[competitorId] === minRankSum) {
          minRankSumCompetitors.push(competitorId);
        }
      });

      // 一人だったらその人の順位決定
      if (minRankSumCompetitors.length === 1) {
        finalTotalRank[minRankSumCompetitors[0]] = currentRank;
        currentRank += 1;
        const dIndex = tCompetitors.indexOf(minRankSumCompetitors[0]);
        tCompetitors.splice(dIndex, 1);

      // そうでなかったら同点の場合の処理へ
      } else if (minRankSumCompetitors.length > 1) {
        const [drawResult, tempRule10, tempRule11] =
        this.onRankTotalDrawWrapper(currentRank, minRankSumCompetitors, ranksToCompetitor);
        Object.assign(finalTotalRank, drawResult);
        Object.assign(rule10, tempRule10);
        Object.assign(rule11, tempRule11);
        currentRank += minRankSumCompetitors.length;
        minRankSumCompetitors.forEach((competitorId) => {
          const dIndex = tCompetitors.indexOf(competitorId);
          tCompetitors.splice(dIndex, 1);
        });
      }
    }
    finalScore.total.skating.total = rankSumToCompetitor;
    finalScore.total.skating.rule10 = rule10;
    finalScore.total.skating.rule11 = rule11;
    finalScore.total.ranks = finalTotalRank;
    // 一通りの処理終了
    writeRound(
      this.props.tempGame, this.props.backupPath,
      this.props.selectedGame, this.props.selectedRound.round,
    );
    // this.props.writeFullRound(
    //   this.props.selectedGame,
    //   this.props.selectedRound.round,
    //   this.props.backupPath,
    // );
    writeScore(
      finalScore, this.props.backupPath,
      this.props.selectedGame, this.props.selectedRound.round,
    );
    // this.props.writeScore(
    //   this.props.selectedGame,
    //   this.props.selectedRound.round,
    //   this.props.backupPath,
    // );
    this.props.assignTempScore(finalScore);
    if (this.props.selectedRound.round >= 200) { // 同点決勝の場合あげる選手の選定まで行う。
      const rankToCompetitors = {};
      Object.keys(finalTotalRank).forEach((competitorId) => {
        if (rankToCompetitors[Math.floor(finalTotalRank[competitorId])]) {
          rankToCompetitors[Math.floor(finalTotalRank[competitorId])].push(competitorId);
        } else {
          rankToCompetitors[Math.floor(finalTotalRank[competitorId])] = [competitorId];
        }
      });

      let validCompetitors = [];
      const ranks = Object.keys(rankToCompetitors);
      for (let i = 0; i < ranks.length; i++) {
        const preValidCompetitors = validCompetitors.concat(rankToCompetitors[ranks[i]]);
        if (preValidCompetitors.length === numOfCompetitorToNextRound) {
          this.props.editTemp(0, [[], preValidCompetitors]);
          break;
        } else if (preValidCompetitors.length > numOfCompetitorToNextRound) {
          this.props.editTemp(0, [validCompetitors, preValidCompetitors]);
          break;
        }
        validCompetitors = preValidCompetitors;
      }
      this.props.switchModal(1);
    } else {
      // 同決じゃない場合確認画面をだす。じゃないと押せたのか不安になる。
      this.setState({ sIsModalOn: ' is-active' });
    }
  }

  onRankSingle(competitors, rank, roundScore, numOfJudges, numOfAllCompetitors, isEarlyReturn) {
    // 現在決めようとしている順位
    let currentRank = rank;
    const tCompetitors = competitors;
    // スケーティングでの過半数
    const halfNum = Math.floor((numOfJudges / 2) + 1);
    const finalSkating = {}; // これをそのまま表示すればよいようにする
    tCompetitors.forEach((competitorId) => {
      finalSkating[competitorId] = [];
    });
    const finalRank = {};
    // i + 1 === 順位
    for (let processingRank = rank; processingRank <= numOfAllCompetitors;) {
      let maxScoreNum = 0;
      let maxCompetitors = [];

      // 処理中の順位以上を付けたジャッジ数を計算
      tCompetitors.forEach((competitorId) => {
        const scoreNum = roundScore[competitorId].filter((score) => {
          if (score <= processingRank) {
            return true;
          }
          return false;
        }).length;
        if (scoreNum === maxScoreNum) {
          maxCompetitors.push(competitorId);
        } else if (scoreNum > maxScoreNum) {
          maxScoreNum = scoreNum;
          maxCompetitors = [competitorId];
        }
        if (!finalSkating[competitorId][processingRank - 1]) {
          finalSkating[competitorId][processingRank - 1] = scoreNum;
        }
      });

      // もしジャッジ数が過半数を超えていたら
      if (maxScoreNum >= halfNum) {
        if (maxCompetitors.length === 1) {
          finalRank[maxCompetitors[0]] = currentRank;
          // onTotalDraw用
          if (isEarlyReturn) {
            return [finalSkating, finalRank];
          }
          currentRank += 1;
          const dIndex = tCompetitors.indexOf(maxCompetitors[0]);
          tCompetitors.splice(dIndex, 1);
        } else if (maxCompetitors.length > 1) {
          while (maxCompetitors.length > 0) {
            const [drawResult, tempSkating] =
            this.onRankSingleDraw(roundScore, processingRank, maxCompetitors);

            // スケーティングの反映
            Object.keys(tempSkating).forEach((competitorId) => {
              tempSkating[competitorId].forEach((skating, index) => {
                finalSkating[competitorId][(processingRank + index) - 1] = skating;
              });
            });

            if (drawResult.length === 1) {
              // rank の処理
              finalRank[drawResult[0]] = currentRank;
              // onTotalDraw用
              if (isEarlyReturn) {
                return [finalSkating, finalRank];
              }

              currentRank += 1;
            } else {
              let averageRank = 0;
              for (let j = 0; j < drawResult.length; j++) {
                averageRank += currentRank + j;
              }
              averageRank /= drawResult.length;
              drawResult.forEach((competitorId) => {
                finalRank[competitorId] = averageRank;
              });
              // onTotalDraw用
              if (isEarlyReturn) {
                return [finalSkating, finalRank];
              }

              currentRank += drawResult.length;
            }

            // 処理中選手一覧からの削除など
            drawResult.forEach((competitorId) => {
              let dIndex = tCompetitors.indexOf(competitorId);
              tCompetitors.splice(dIndex, 1);
              dIndex = maxCompetitors.indexOf(competitorId);
              maxCompetitors.splice(dIndex, 1);
            });

            // 同点者も残り一名の場合
            if (maxCompetitors.length === 1) {
              finalRank[maxCompetitors[0]] = currentRank;
              const dIndex = tCompetitors.indexOf(maxCompetitors[0]);
              tCompetitors.splice(dIndex, 1);
              currentRank += 1;
              maxCompetitors = [];
            }
          }
        }
      } else {
        processingRank += 1;
      }

      if (tCompetitors.length === 1) {
        finalRank[tCompetitors[0]] = currentRank;
        break;
      }

      if (tCompetitors.length === 0) {
        break;
      }
    }

    return [finalSkating, finalRank];
  }

  onRankSingleDraw(roundScore, drawRank, drawCompetitors) {
    let maxNumOfScores = 0;
    let maxNumOfScoresComps = [];

    const tempSkating = {};

    // まず多数決法で
    drawCompetitors.forEach((competitorId) => {
      const validScores = roundScore[competitorId].filter((score) => {
        if (score <= drawRank) {
          return true;
        }
        return false;
      });

      tempSkating[competitorId] = [`${validScores.length}`];

      if (validScores.length > maxNumOfScores) {
        maxNumOfScores = validScores.length;
        maxNumOfScoresComps = [competitorId];
      } else if (validScores.length === maxNumOfScores) {
        maxNumOfScoresComps.push(competitorId);
      }
    });
    if (maxNumOfScoresComps.length === 1) {
      return [[maxNumOfScoresComps[0]], tempSkating];
    }

    // つぎに上位加算法で
    let minTotalScore = 1000;
    let minTotalScoreComps = [];

    maxNumOfScoresComps.forEach((competitorId) => {
      const validScores = roundScore[competitorId].filter((score) => {
        if (score <= drawRank) {
          return true;
        }
        return false;
      });
      const totalScore = validScores.reduce((result, score) => (
        result + score
      ), 0);

      tempSkating[competitorId] = [`${validScores.length}(${totalScore})`];
      if (totalScore < minTotalScore) {
        minTotalScore = totalScore;
        minTotalScoreComps = [competitorId];
      } else if (totalScore === minTotalScore) {
        minTotalScoreComps.push(competitorId);
      }
    });

    // 一人であれば順位決定
    if (minTotalScoreComps.length === 1) {
      return [[minTotalScoreComps[0]], tempSkating];
    // もし最終順位まで来てしまったら同点として返す
    } else if (drawRank === Object.keys(roundScore).length) {
      return [minTotalScoreComps, tempSkating];
    }

    const [drawWinner, accumSkating] = this.onRankSingleDraw(roundScore, drawRank + 1, minTotalScoreComps);
    Object.keys(tempSkating).forEach((competitorId) => {
      if (accumSkating[competitorId]) {
        tempSkating[competitorId] = tempSkating[competitorId].concat(accumSkating[competitorId]);
      }
    });
    return [drawWinner, tempSkating];
  }

  onRankTotalDraw(drawRank, drawCompetitors, ranksToCompetitor) {
    const selectedRoundDatas = this.props.tempGame;
    const selectedRoundData = deepGet(selectedRoundDatas, [this.props.selectedRound.style]);

    const stylesHeldInRound = Object.keys(selectedRoundDatas);
    const numOfJudges = deepGet(selectedRoundData, ['judgeNum']);
    // const AllCompetitorsOfRound = selectedRoundData.heats.reduce((competitorsSoFar, nextCompetitors) => (
    //   competitorsSoFar.concat(nextCompetitors)
    // ));

    const rule10a = {};
    const rule10b = {};
    const rule11 = {};

    let maxScoreNum = 0;
    let maxScoreNumCompetitors = [];

    // 多数決
    drawCompetitors.forEach((competitorId) => {
      const validScores = ranksToCompetitor[competitorId].filter((rank) => {
        if (rank <= drawRank) {
          return true;
        }
        return false;
      });

      rule10a[competitorId] = validScores.length;
      if (validScores.length > maxScoreNum) {
        maxScoreNum = validScores.length;
        maxScoreNumCompetitors = [competitorId];
      } else if (validScores.length === maxScoreNum) {
        maxScoreNumCompetitors.push(competitorId);
      }
    });
    // 多数決で決まったらreturn
    if (maxScoreNumCompetitors.length === 1) {
      return [maxScoreNumCompetitors, rule10a, rule11, []];
    }

    let minScoreSum = 1000;
    let minScoreSumCompetitors = [];

    // 上位加算
    maxScoreNumCompetitors.forEach((competitorId) => {
      const validScores = ranksToCompetitor[competitorId].filter((rank) => {
        if (rank <= drawRank) {
          return true;
        }
        return false;
      });

      const validScoresSum = validScores.reduce((result, score) => (
        result + score
      ), 0);

      rule10b[competitorId] = `${validScores.length}(${validScoresSum})`;
      if (validScoresSum < minScoreSum) {
        minScoreSum = validScoresSum;
        minScoreSumCompetitors = [competitorId];
      } else if (validScoresSum === minScoreSum) {
        minScoreSumCompetitors.push(competitorId);
      }
    });

    // 上位加算に含まれていない競技者のrule10aとrule10bを統合
    Object.assign(rule10a, rule10b);

    // 上位加算で決まったらreturn
    if (minScoreSumCompetitors.length === 1) {
      return [minScoreSumCompetitors, rule10a, rule11, []];
    }

    // 以下rule11の適用
    const allRanks = {};
    const totalNumOfJudges = numOfJudges * stylesHeldInRound.length;
    const tCompetitors = minScoreSumCompetitors.concat();

    // 全種目の成績の統合(再スケーティング用)
    stylesHeldInRound.forEach((style) => {
      Object.keys(ranksToCompetitor).forEach((competitorId) => {
        if (allRanks[competitorId]) {
          allRanks[competitorId] = allRanks[competitorId].concat(selectedRoundDatas[style].scores[competitorId]);
        } else {
          allRanks[competitorId] = selectedRoundDatas[style].scores[competitorId];
        }
      });
    });

    const [tempSkating, tempRanking] = this.onRankSingle(minScoreSumCompetitors, drawRank, allRanks,
      totalNumOfJudges, Object.keys(ranksToCompetitor).length, true);

    // 一番いい順位をとった人が何人いるかの計算
    let highestRank = 1000;
    let highestRankCompetitors = [];
    Object.keys(tempRanking).forEach((competitorId) => {
      if (Number(tempRanking[competitorId]) < highestRank) {
        highestRank = tempRanking[competitorId];
        highestRankCompetitors = [competitorId];
      } else if (Number(tempRanking[competitorId] === highestRank)) {
        highestRankCompetitors.push(competitorId);
      }
    });

    // rule11グループからすでに順位が確定した人を除いてreturn。また残りの選手でrule10からやり直し
    // やり直し処理はonRankTotalDrawWrapperがやってくれる
    highestRankCompetitors.forEach((competitorId) => {
      const dIndex = tCompetitors.indexOf(competitorId);
      tCompetitors.splice(dIndex, 1);
    });

    return [highestRankCompetitors, rule10a, tempSkating, tCompetitors];
  }

  onRankTotalDrawWrapper(drawRank, drawCompetitors, ranksToCompetitor) {
    const finalResult = {};
    const rule10 = {};
    const rule11 = {};
    // 初期化
    drawCompetitors.forEach((competitorId) => {
      rule10[competitorId] = [];
      rule11[competitorId] = [];
    });

    let currentRank = drawRank;
    const tCompetitors = [...drawCompetitors];

    // 順位が決定した選手から削除されていく
    while (tCompetitors.length > 0) {
      if (tCompetitors.length === 1) {
        finalResult[tCompetitors[0]] = currentRank;
        break;
      }

      const [drawResult, tempRule10, tempRule11, rule11Group]
      = this.onRankTotalDraw(currentRank, tCompetitors, ranksToCompetitor);
      Object.keys(tempRule10).forEach((competitorId) => {
        rule10[competitorId][currentRank - 1] = tempRule10[competitorId];
      });

      // スケーティング情報の更新
      if (tempRule11 !== {}) {
        Object.keys(tempRule11).forEach((competitorId) => {
          tempRule11[competitorId].forEach((skating, index) => {
            if (skating) {
              if (!rule11[competitorId][index]) {
                rule11[competitorId][index] = skating;
              } else if (typeof (rule11[competitorId][index]) === 'number') {
                rule11[competitorId][index] = skating;
              }
            }
          });
        });
      }

      // 同点がいなかった場合順位決定
      if (drawResult.length === 1) {
        finalResult[drawResult[0]] = currentRank;
        currentRank += 1;
        const dIndex = tCompetitors.indexOf(drawResult[0]);
        tCompetitors.splice(dIndex, 1);

      //そうでなかった場合順位を計算
      } else if (drawResult.length > 1) {
        let average = 0;
        for (let i = 0; i < drawResult.length; i++) {
          average += currentRank + i;
        }
        average /= drawResult.length;
        drawResult.forEach((competitorId) => {
          finalResult[competitorId] = average;
          const dIndex = tCompetitors.indexOf(competitorId);
          tCompetitors.splice(dIndex, 1);
        });
        currentRank += drawResult.length;
      }

      // rule11までいってしまった場合新たな再帰グループが誕生する
      if (rule11Group.length === 1) {
        finalResult[rule11Group[0]] = currentRank;
        currentRank += 1;
        const dIndex = tCompetitors.indexOf(rule11Group[0]);
        tCompetitors.splice(dIndex, 1);
      } else if (rule11Group.length > 1) {
        const [group11Result, group11Rule10, group11Rule11]
        = this.onRankTotalDrawWrapper(currentRank, rule11Group, ranksToCompetitor);

        // 順位が決まった人の削除
        rule11Group.forEach((competitorId) => {
          const dIndex = tCompetitors.indexOf(competitorId);
          tCompetitors.splice(dIndex, 1);
        });

        // 結果の反映
        Object.assign(finalResult, group11Result);

        //スケーティングの反映
        Object.keys(group11Rule10).forEach((competitorId) => {
          group11Rule10[competitorId].forEach((skating, index) => {
            if (skating) {
              rule10[competitorId][index] = skating;
            }
          });
        });
        Object.keys(group11Rule11).forEach((competitorId) => {
          group11Rule11[competitorId].forEach((skating, index) => {
            if (skating) {
              if (!rule11[competitorId][index]) {
                rule11[competitorId][index] = skating;
              } else if (typeof (rule11[competitorId][index]) === 'number') {
                rule11[competitorId][index] = skating;
              }
            }
          });
        });

        // 処理中順位の繰り上げ
        currentRank += Object.keys(group11Result).length;
      }
    }
    // console.log(finalResult, rule10, rule11);
    return [finalResult, rule10, rule11];
  }

  render() {
    return (
      <div>
        <p className="control">
          <a
            className="button is-primary is-outlined"
            onClick={this.onClickProcessRank}
            disabled={!this.state.isButtonActive}
          >
            順位決定
          </a>
        </p>
        <div className={`modal${this.state.sIsModalOn}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box">
              <div className="content has-text-centered">
                順位が決定しました
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ flex: '1 0 0' }}></div>
                <p className="control">
                  <button className="button is-primary is-outlined" onClick={this.onClickModalOk}>
                    OK
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProcessRankButton;
