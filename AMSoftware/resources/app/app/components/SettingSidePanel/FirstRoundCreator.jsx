import React from 'react';
import { remote } from 'electron';

import { compareArray, stylesArray } from '../common/utils';
import { createHeatsNewStandard, createHeatsVertical,
  createHeatsSideWays } from '../common/composeRounds';
import { createRound } from '../common/fileService';

const dialog = remote.dialog;

class FirstRoundCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGame: 1,
      selectedCreationMethod: 'STANDARD',
    };
    this.onChange = this.onChange.bind(this);
    this.onChangeCreationMethod = this.onChangeCreationMethod.bind(this);
    this.onClickCreateOne = this.onClickCreateOne.bind(this);
    this.onClickCreateAll = this.onClickCreateAll.bind(this);
    this.judgeAssignedToGame = this.judgeAssignedToGame.bind(this);
    this.stylesHeldByGames = this.stylesHeldByGames.bind(this);
    this.gamesOptions = this.gamesOptions.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (compareArray(Object.keys(nextProps.games), Object.keys(this.props.games)) &&
      nextProps.selectedCreationMethod === this.props.selectedCreationMethod &&
      nextState.selectedGame === this.state.selectedGame &&
      nextState.selectedCreationMethod === this.state.selectedCreationMethod) {
      return false;
    }
    return true;
  }

  onChange(e) {
    this.setState({ selectedGame: e.target.value });
  }

  onChangeCreationMethod(e) {
    this.props.selectCreationMethod(e.target.value);
  }

  onClickCreateOne() {
    const roundOption = this.props.games[this.state.selectedGame].options.rounds;
    const comps = this.props.competitors;
    const selectedGameComps = this.props.games[this.state.selectedGame].competitors;

    const duplicateNums = {};

    for (let i = 0; i < selectedGameComps.length - 1; i++) {
      for (let j = i + 1; j < selectedGameComps.length; j++) {
        if (Number(comps[selectedGameComps[i]].number) ===
        Number(comps[selectedGameComps[j]].number)) {
          duplicateNums[comps[selectedGameComps[i]].number] = 1;
        }
      }
    }

    const duplicateNumsArray = Object.keys(duplicateNums);
    if (duplicateNumsArray.length > 0) {
      dialog.showMessageBox({
        type: 'info',
        buttons: ['OK'],
        message: `以下の背番号が重複して存在するため、予選を生成できません
        ${duplicateNumsArray.join(',')}`,
      });
      return;
    }

    createRound(
      this.state.selectedGame, 1, this.judgeAssignedToGame(this.state.selectedGame), 'CHECK',
      this.createHeats(this.props.games[this.state.selectedGame].competitors,
      1, roundOption, comps),
      roundOption[1].up, this.stylesHeldByGames(this.state.selectedGame), this.props.backupPath,
    );
  }

  onClickCreateAll() {
    Object.keys(this.props.games).forEach((gameId) => {
      const roundOption = this.props.games[gameId].options.rounds;
      const comps = this.props.competitors;
      const selectedGameComps = this.props.games[gameId].competitors;

      const duplicateNums = {};

      for (let i = 0; i < selectedGameComps.length - 1; i++) {
        for (let j = i + 1; j < selectedGameComps.length; j++) {
          if (Number(comps[selectedGameComps[i]].number) ===
          Number(comps[selectedGameComps[j]].number)) {
            duplicateNums[comps[selectedGameComps[i]].number] = 1;
          }
        }
      }

      const duplicateNumsArray = Object.keys(duplicateNums);
      if (duplicateNumsArray.length > 0) {
        dialog.showMessageBox({
          type: 'info',
          buttons: ['OK'],
          message: `ID${gameId}の競技では以下の背番号が重複して存在するため、予選を生成できません
          ${duplicateNumsArray.join(',')}`,
        });
        return;
      }

      createRound(
        gameId, 1, this.judgeAssignedToGame(gameId), 'CHECK',
        this.createHeats(this.props.games[gameId].competitors, 1,
        roundOption, this.props.competitors), roundOption[1].up,
        this.stylesHeldByGames(gameId), this.props.backupPath,
      );
    });
  }

  createHeats(competitors, roundKey, roundsData, competitorsData) {
    switch (this.props.selectedCreationMethod) {
      case 'STANDARD': {
        return (createHeatsNewStandard(competitors, roundKey, roundsData, competitorsData));
      }
      case 'VERTICAL': {
        return (createHeatsVertical(competitors, roundKey, roundsData, competitorsData));
      }
      case 'SIDEWAYS': {
        return (createHeatsSideWays(competitors, roundKey, roundsData, competitorsData));
      }
      default: {
        return (createHeatsNewStandard(competitors, roundKey, roundsData, competitorsData));
      }
    }
  }

  judgeAssignedToGame(gameId) {
    return this.props.games[gameId].options.rounds[1].judge;
  }

  stylesHeldByGames(gameId) {
    const ret = [];
    stylesArray.forEach((style) => {
      if (this.props.games[gameId].options[style] === 1) {
        ret.push(style);
      }
    });
    return ret;
  }

  gamesOptions() {
    if (this.props.selectedGameType === 'SINGLE') {
      return Object.keys(this.props.games).map((game) => {
        const validStyle = Object.keys(this.props.games[game].options).find(style => (
          !isNaN(this.props.games[game].options[style]) &&
          this.props.games[game].options[style] === 1
        ));
        if (validStyle) {
          return (
            <option value={Number(game)} key={`SettingSidePanel,game${game}`}>
              {`${validStyle.slice(0, 1)}${validStyle.slice(1).toLowerCase()}`}
            </option>
          );
        }

        return (
          <option value={Number(game)} key={`SettingSidePanel,game${game}`}>
            {this.props.games[game].name}
          </option>
        );
      });
    }

    return Object.keys(this.props.games).map(game => (
      <option value={Number(game)} key={`SettingSidePanel,game${game}`}>
        {this.props.games[game].name}
      </option>
    ));
  }

  render() {
    return (
      <div>
        <div className="field">
          <p className="control">
            <span className="select is-fullwidth">
              <select value={this.props.selectedCreationMethod} onChange={this.onChangeCreationMethod}>
                <option value="STANDARD">標準</option>
                <option value="VERTICAL">縦並び</option>
                <option value="SIDEWAYS">横並び</option>
              </select>
            </span>
          </p>
        </div>
        <div className="box" style={{ padding: '5px', marginBottom: '5px' }} >
          <div className="field">
            <p className="control">
              <span className="select is-fullwidth">
                <select value={this.state.selectedGame} onChange={this.onChange}>
                  {this.gamesOptions()}
                </select>
              </span>
            </p>
          </div>
          <div className="field">
            <p className="control">
              <a
                className="button is-fullwidth is-info is-outlined"
                onClick={this.onClickCreateOne}
              >1次予選生成</a>
            </p>
          </div>
        </div>
        <div className="box" style={{ padding: '5px', marginBottom: '5px' }} >
          <div className="field">
            <p className="control">
              <a
                className="button is-fullwidth is-info is-outlined"
                onClick={this.onClickCreateAll}
              >
                全1次予選生成
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default FirstRoundCreator;
