import React from 'react';

import { deepGet } from '../common/utils';
import { writeRound } from '../common/fileService';


class PassButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isButtonActive: true,
    };

    this.onClickPass = this.onClickPass.bind(this);
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
    if (nextState.isButtonActive !== this.state.isButtonActive) {
      return true;
    }

    return false;
  }

  onClickPass() {
    const selectedGameData = this.props.games[this.props.selectedGame];
    const selectedRoundDatas = this.props.tempGame;
    const selectedRoundData = deepGet(selectedRoundDatas, [this.props.selectedRound.style]);

    const stylesHeldInRound = Object.keys(selectedRoundDatas);
    const numOfJudges = deepGet(selectedRoundData, ['judgeNum']);
    const numOfCompetitorToNextRound =
      deepGet(selectedRoundData, ['upNum']);

    if (!selectedGameData) {
      return;
    }

    const finalScore = {};
    finalScore.competitors = {};
    // まずチェック数ごとのcompetitorを集めた配列を作りtempに入れておく。
    // あとはmodalのほうでheatを生成しnextRoundを生成する。
    const competitorsByCheckNum = []; // index=チェック数, val=competitor ids
    for (let i = 0; i <= numOfJudges * stylesHeldInRound.length; i++) {
      competitorsByCheckNum.push([]);
    }

    // 各選手ごとにチェック数を数える
    Object.keys(selectedRoundData.scores).forEach((competitorId) => {
      let numOfChecks = 0;
      stylesHeldInRound.forEach((style) => {
        selectedRoundDatas[style].scores[competitorId].forEach((check) => {
          if (check === true) {
            numOfChecks += 1;
          }
        });
      });
      finalScore.competitors[competitorId] = {};
      finalScore.competitors[competitorId].score = numOfChecks;
      competitorsByCheckNum[numOfChecks].push(competitorId);
    });

    // 順位決定処理
    let currentRank = 1;
    for (let i = numOfJudges * stylesHeldInRound.length; i >= 0; i--) {
      if (competitorsByCheckNum[i].length !== 0) {
        for (let j = 0; j < competitorsByCheckNum[i].length; j++) {
          finalScore.competitors[competitorsByCheckNum[i][j]].rank = currentRank;
        }
        currentRank += competitorsByCheckNum[i].length;
      }
    }

    // 進出者決定
    const sCompetitors = [];
    const bCompetitors = [];
    const tempCompetitors = [];
    for (let i = numOfJudges * stylesHeldInRound.length; i >= 0; i--) {
      bCompetitors.push(...competitorsByCheckNum[i]);
      if (bCompetitors.length === numOfCompetitorToNextRound) {
        tempCompetitors.push([]);
        tempCompetitors.push(bCompetitors);
        this.props.editTemp(0, tempCompetitors);
        finalScore.bottomScore = [0, i];
        finalScore.passed = [0, bCompetitors.length];
        break;
      } else if (bCompetitors.length > numOfCompetitorToNextRound) {
        tempCompetitors.push(sCompetitors);
        tempCompetitors.push(bCompetitors);
        finalScore.bottomScore = [i + 1, i];
        finalScore.passed = [sCompetitors.length, bCompetitors.length];
        this.props.editTemp(0, tempCompetitors);
        break;
      }
      sCompetitors.push(...competitorsByCheckNum[i]);

      // おそらくアップ数が選手数よりも多く設定されていた場合
      if (i === 0) {
        tempCompetitors.push([]);
        tempCompetitors.push(bCompetitors);
        this.props.editTemp(0, tempCompetitors);
        finalScore.bottomScore = [0, i];
        finalScore.passed = [0, bCompetitors.length];
        break;
      }
    }
    this.props.editTemp(2, numOfCompetitorToNextRound);
    // この時点ではfinalScoreにはcompetitors, 仮bottomScore, 仮passed,が含まれている
    this.props.editTemp(1, finalScore);
    writeRound(
      this.props.tempGame,
      this.props.backupPath,
      this.props.selectedGame,
      this.props.selectedRound.round,
    );
    // this.props.writeFullRound(
    //   this.props.selectedGame,
    //   this.props.selectedRound.round,
    //   this.props.backupPath,
    // );
    this.props.switchModal(1);
  }

  render() {
    return (
      <p className="control">
        <a
          className="button is-primary is-outlined"
          onClick={this.onClickPass}
          disabled={!this.state.isButtonActive}
        >
          通過決定
        </a>
      </p>
    );
  }
}

export default PassButton;
