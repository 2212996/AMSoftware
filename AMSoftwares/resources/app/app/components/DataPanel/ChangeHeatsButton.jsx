import React from 'react';
import { compareArray } from '../common/utils';

class ChangeHeatsButton extends React.Component {
  constructor(props) {
    super(props);
    let initSelectedCompetitor = 0;
    if (props.heats) {
      initSelectedCompetitor = props.heats[0][0];
    }

    this.state = {
      selectedCompetitor: initSelectedCompetitor,
      selectedRemoveCompetitor: initSelectedCompetitor,
      targetHeat: 0,
    };

    this.onClickHeats = this.onClickHeats.bind(this);
    this.onClickRemove = this.onClickRemove.bind(this);
    this.onChangeSelectedCompetitor = this.onChangeSelectedCompetitor.bind(this);
    this.onChangeSelectedRemoveCompetitor = this.onChangeSelectedRemoveCompetitor.bind(this);
    this.onChangeTargetHeat = this.onChangeTargetHeat.bind(this);
    this.selectedCompetitorOptions = this.selectedCompetitorOptions.bind(this);
    this.targetHeatOptions = this.targetHeatOptions.bind(this);
    this.isButtonActive = this.isButtonActive.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!compareArray(nextProps.heats, this.props.heats)) {
      if (!nextProps.heats) {
        return;
      }
      this.setState({
        selectedCompetitor: nextProps.heats[0][0],
        selectedRemoveCompetitor: nextProps.heats[0][0],
        targetHeat: 0,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.selectedCompetitor !== this.state.selectedCompetitor ||
    nextState.targetHeat !== this.state.targetHeat ||
    nextState.selectedRemoveCompetitor !== this.state.selectedRemoveCompetitor) {
      return true;
    }

    return false;
  }

  onClickHeats() {
    if (this.props.heats) {
      const numedHeats = this.props.heats.map(heat => (
        heat.map(compId => Number(compId))
      ));
      const newHeats = numedHeats.map((heat) => {
        if (heat.indexOf(this.state.selectedCompetitor) !== -1) {
          heat.splice(heat.indexOf(this.state.selectedCompetitor), 1);
        }
        return heat;
      });

      newHeats[this.state.targetHeat].push(this.state.selectedCompetitor);
      newHeats[this.state.targetHeat].sort((a, b) => {
        if (this.props.competitors[a].number < this.props.competitors[b].number) {
          return -1;
        }
        return 1;
      });
      // 以下のassignHeatsが全種目分のヒートを変えてくれてる
      this.props.assignHeats(newHeats);
    }
  }

  onClickRemove() {
    if (this.props.heats) {
      const numedHeats = this.props.heats.map(heat => (
        heat.map(compId => Number(compId))
      ));
      const newHeats = numedHeats.map((heat) => {
        if (heat.indexOf(this.state.selectedRemoveCompetitor) !== -1) {
          heat.splice(heat.indexOf(this.state.selectedRemoveCompetitor), 1);
        }
        return heat;
      });

      const newScores = {};
      const currentScores = this.props.scores;
      Object.keys(currentScores).forEach((style) => {
        // 新しくオブジェクトを作る
        newScores[style] = {};
        Object.keys(currentScores[style]).forEach((competitorId) => {
          if (Number(competitorId) !== Number(this.state.selectedRemoveCompetitor)) {
            newScores[style][competitorId] = currentScores[style][competitorId];
          }
        });
      });

      const newTempGame = Object.assign({}, this.props.tempGame);
      Object.keys(newTempGame).forEach((style) => {
        newTempGame[style].heats = newHeats;
        newTempGame[style].scores = newScores[style];
      });

      this.props.assignTempGame(newTempGame);
      // 選手の選択のリセット。じゃないと削除した選手を選択したままになる。
      if (newHeats[0] && newHeats[0][0]) {
        this.setState({ selectedCompetitor: newHeats[0][0], selectedRemoveCompetitor: newHeats[0][0] });
      }
    }
  }

  onChangeSelectedCompetitor(e) {
    this.setState({ selectedCompetitor: Number(e.target.value) });
  }

  onChangeSelectedRemoveCompetitor(e) {
    this.setState({ selectedRemoveCompetitor: Number(e.target.value) });
  }

  onChangeTargetHeat(e) {
    this.setState({ targetHeat: Number(e.target.value) });
  }

  selectedCompetitorOptions() {
    if (!this.props.heats) {
      return null;
    }

    const returnHtml = [];

    this.props.heats.forEach((heat) => {
      heat.forEach((competitorId) => {
        returnHtml.push(
          <option key={competitorId} value={competitorId}>
            {this.props.competitors[competitorId].number}
          </option>,
        );
      });
    });

    return returnHtml;
  }

  targetHeatOptions() {
    if (!this.props.heats) {
      return null;
    }

    const returnHtml = [];

    for (let i = 0; i < this.props.heats.length; i++) {
      returnHtml.push(
        <option key={i} value={i}>{i + 1}H</option>,
      );
    }

    return returnHtml;
  }

  isButtonActive() {
    if (this.props.heats) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div className="field is-horizontal">
        <div className="field-body">
          <p className="control">
            <a className="button" onClick={this.onClickHeats} disabled={!this.isButtonActive()}>
              ヒート組み換え
            </a>
          </p>
          <p className="control" style={{ marginLeft: '10px' }}>
            <span className="select">
              <select
                value={this.state.selectedCompetitor}
                onChange={this.onChangeSelectedCompetitor}
              >
                {this.selectedCompetitorOptions()}
              </select>
            </span>
          </p>
          <p className="control" style={{ marginLeft: '10px' }}>
            <span className="select">
              <select value={this.state.targetHeat} onChange={this.onChangeTargetHeat}>
                {this.targetHeatOptions()}
              </select>
            </span>
          </p>

          <div style={{ flex: '1 0 0' }}></div>

          <p className="control">
            <button className="button" onClick={this.onClickRemove} disabled={!this.isButtonActive()}>
              削除
            </button>
          </p>
          <p className="control" style={{ marginLeft: '10px' }}>
            <span className="select">
              <select
                value={this.state.selectedRemoveCompetitor}
                onChange={this.onChangeSelectedRemoveCompetitor}
              >
                {this.selectedCompetitorOptions()}
              </select>
            </span>
          </p>
        </div>
      </div>
    );
  }
}

export default ChangeHeatsButton;
