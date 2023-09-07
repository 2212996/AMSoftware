import React from 'react';
import { writeRound } from '../common/fileService';

class DataEditPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedSeed: 100,
      selectedCompetitorId: 0, // unselected
      selectedHeat: 0,
    };

    this.bodyTableHtml = this.bodyTableHtml.bind(this);
    this.heatOptionsHtml = this.heatOptionsHtml.bind(this);
    this.onChangeSelectedSeed = this.onChangeSelectedSeed.bind(this);
    this.onChangeSelectedComp = this.onChangeSelectedComp.bind(this);
    this.onChangeMethod = this.onChangeMethod.bind(this);
    this.onChangeSelectedHeat = this.onChangeSelectedHeat.bind(this);
    this.selectCompetitorsHtml = this.selectCompetitorsHtml.bind(this);
    this.onClickAddOne = this.onClickAddOne.bind(this);
    this.addCompetitors = this.addCompetitors.bind(this);
  }

  onChangeMethod(e) {
    this.props.selectCreationMethod(e.target.value);
  }

  onClickAddOne() {
    this.addCompetitors([this.state.selectedCompetitorId]);
  }

  onChangeSelectedSeed(e) {
    this.setState({ selectedSeed: Number(e.target.value) });
  }

  onChangeSelectedHeat(e) {
    this.setState({ selectedHeat: Number(e.target.value) });
  }

  onChangeSelectedComp(e) {
    this.setState({ selectedCompetitorId: Number(e.target.value) });
  }

  bodyTableHtml() {
    if (!this.props.games[this.props.selectedGame]) {
      return [];
    }

    const competitorsData = this.props.competitors;

    const allCompetitors = this.props.games[this.props.selectedGame].competitors;
    const currentGameCompetitors = this.props.tempGame[this.props.selectedRound.style]
    .heats.reduce((accum, heat) => (
      accum.concat(heat)
    ));
    const numedCurrentGameCompetitors = currentGameCompetitors.map(competitorId => (
      Number(competitorId)
    ));

    // filters out competitors that are already included in the current game
    const competitors = allCompetitors.filter(competitorId => (
      !numedCurrentGameCompetitors.includes(Number(competitorId))
    ));

    // シードごとに選手を画面に表示する機能の一部。いらん子だった
    // let seedCompetitors = [];

    // if (this.state.selectedSeed === 100) {
    //   seedCompetitors = [...competitors];
    // } else {
    //   seedCompetitors = competitors.filter(competitorId => (
    //     Number(competitorsData[competitorId].seed) === this.state.selectedSeed
    //   ));
    // }

    competitors.sort((a, b) => (
      Number(competitorsData[a].number) < Number(competitorsData[b].number) ? -1 : 1
    ));

    return competitors.map(competitorId => (
      (
        <tr key={`competitor${competitorId}`}>
          <td>{competitorsData[competitorId].number}</td>
          <td>{competitorsData[competitorId].leaderName}</td>
          <td>{competitorsData[competitorId].leaderRegi}</td>
          <td>{competitorsData[competitorId].partnerName}</td>
          <td>{competitorsData[competitorId].partnerRegi}</td>
        </tr>
      )
    ));
  }

  selectCompetitorsHtml() {
    const competitorsData = this.props.competitors;

    const allCompetitors = this.props.games[this.props.selectedGame].competitors;
    const currentGameCompetitors = this.props.tempGame[this.props.selectedRound.style]
    .heats.reduce((accum, heat) => (
      accum.concat(heat)
    ));
    const numedCurrentGameCompetitors = currentGameCompetitors.map(competitorId => (
      Number(competitorId)
    ));

    // filters out competitors that are already included in the current game
    const competitors = allCompetitors.filter(competitorId => (
      !numedCurrentGameCompetitors.includes(competitorId)
    ));

    competitors.sort((a, b) => (
      Number(competitorsData[a].number) < Number(competitorsData[b].number) ? -1 : 1
    ));

    const optionsHtml = competitors.map(competitorId => (
      <option value={competitorId} key={competitorId}>
        {competitorsData[competitorId].number}
      </option>
    ));

    return (optionsHtml);
  }

  addCompetitors(addingCompetitors) {
    // 0の場合は選択してくださいを選択中なので入れない
    if (Number(addingCompetitors[0]) === 0) {
      return;
    }

    const tempGame = this.props.tempGame;
    const selectedTempGame = tempGame[this.props.selectedRound.style];

    // 選手をヒートに追加
    const newHeats = selectedTempGame.heats.concat();
    newHeats[this.state.selectedHeat].push(...addingCompetitors);

    newHeats[this.state.selectedHeat].sort((a, b) => (
      Number(this.props.competitors[a].number) < Number(this.props.competitors[b].number) ? -1 : 1
    ));

    // 新規scores生成
    const newScores = [];
    for (let i = 0; i < selectedTempGame.judgeNum; i++) {
      newScores.push(false);
    }
    const addingScoresTable = {};
    addingCompetitors.forEach((competitorId) => {
      addingScoresTable[competitorId] = newScores;
    });

    const newTempGame = {};
    Object.keys(tempGame).forEach((style) => {
      const newSelectedTempGame = Object.assign({}, tempGame[style], {
        heats: newHeats,
        scores: Object.assign({}, tempGame[style].scores, addingScoresTable),
      });

      newTempGame[style] = newSelectedTempGame;
    });

    this.props.assignTempGame(newTempGame);
    writeRound(newTempGame, this.props.backupPath,
      this.props.selectedGame, this.props.selectedRound.round);
  }

  heatOptionsHtml() {
    const currentHeats = this.props.tempGame[this.props.selectedRound.style].heats;
    const returnHtml = [];
    for (let i = 0; i < currentHeats.length; i++) {
      returnHtml.push(
        <option key={i} value={i}>{i + 1}H</option>,
      );
    }

    return returnHtml;
  }

  render() {
    return (
      <div
        className="box"
        style={{
          flex: '1 0 0',
          margin: '3px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ flex: '1 0 0', overflow: 'auto' }}>
          <table className="table is-narrow">
            <thead>
              <tr>
                <th style={{ width: '2rem' }} ></th>
                <th>リーダー</th>
                <th></th>
                <th>パートナー</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.bodyTableHtml()}
            </tbody>
            <tfoot>
              <tr>
                <th style={{ width: '2rem' }} ></th>
                <th>リーダー</th>
                <th></th>
                <th>パートナー</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="field is-horizontal" style={{ flex: '0 0 auto' }}>
          <div className="field-body">
            {/* <p className="control">
              <span className="select">
                <select
                  value={this.state.selectedSeed}
                  onChange={this.onChangeSelectedSeed}
                >
                  <option value={100}>全て</option>
                  <option value={0}>0</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </span>
            </p> */}
            <p className="control" style={{ marginLeft: '10px' }}>
              <button className="button" onClick={this.onClickAddOne}>
                追加
              </button>
            </p>
            <p className="control" style={{ marginLeft: '10px' }}>
              <span className="select">
                <select
                  value={this.state.selectedCompetitorId}
                  onChange={this.onChangeSelectedComp}
                >
                  <option value={0}>選択してください</option>
                  {this.selectCompetitorsHtml()}
                </select>
              </span>
            </p>
            <p className="control" style={{ marginLeft: '10px' }}>
              <span className="select">
                <select
                  value={this.state.selectedHeat}
                  onChange={this.onChangeSelectedHeat}
                >
                  {this.heatOptionsHtml()}
                </select>
              </span>
            </p>
            {/* <p className="control" style={{ marginLeft: '10px' }}>
              <span className="select">
                <select value={this.props.selectedCreationMethod} onChange={this.onChangeMethod}>
                  <option value="STANDARD">標準</option>
                  <option value="VERTICAL">縦並び</option>
                  <option value="SIDEWAYS">横並び</option>
                </select>
              </span>
            </p> */}
          </div>
        </div>
      </div>
    );
  }
}

export default DataEditPanel;
