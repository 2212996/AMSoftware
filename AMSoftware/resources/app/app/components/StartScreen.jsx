import React from 'react';
import * as fs from 'fs';
import { remote } from 'electron';

import { readRound, deleteRound,
  readScore, deleteScore } from './common/fileService';

const dialog = remote.dialog;

class StartScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isStartScreenOn: true,
    };

    this.isStartScreenOnString = this.isStartScreenOnString.bind(this);
    this.onClickExistingFile = this.onClickExistingFile.bind(this);
    this.onClickNewFile = this.onClickNewFile.bind(this);
    this.checkRound = this.checkRound.bind(this);
    this.checkScore = this.checkScore.bind(this);
  }

  onClickExistingFile() {
    dialog.showOpenDialog({
      properties: ['openDirectory'],
    }, (folderNames) => {
      if (folderNames) {
        this.readFile(`${folderNames[0]}/contest.dme`, folderNames[0]);
      }
    });
  }

  onClickNewFile() {
    dialog.showOpenDialog({
      properties: ['openDirectory'],
    }, (folderNames) => {
      if (folderNames) {
        this.props.assignBackupPath(folderNames[0]);
        this.props.writeState(`${folderNames[0]}/contest.dme`);

        this.setState({ isStartScreenOn: false });
      }
    });
  }

  readFile(filePath, folderName) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        dialog.showMessageBox({
          type: 'info',
          title: '適切なフォルダーでありません',
          buttons: ['OK'],
          message: `選択されたフォルダーにはcontest.dmeファイルが含まれていません。
名前を変更してしまった場合はcontest.dmeに戻したうえで読み込みなおしてください。`,
          noLink: true,
        });
        return;
      }
      // Change how to handle the file content
      const newState = JSON.parse(data);
      this.props.readState(newState);
      // 場所を移されても大丈夫なように
      this.props.assignBackupPath(folderName);

      const games = newState.games;
      const selectedGame = newState.uiStates.selectedGame;
      const selectedRound = newState.uiStates.selectedRound.round;

      this.checkRound(selectedGame, selectedRound, games, folderName);
      this.checkScore(selectedGame, selectedRound, folderName);

      this.setState({ isStartScreenOn: false });
      // this.props.switchDidLoadFile(true);
    });
  }

  checkRound(gameId, roundKey, games, backupPath) {
    const readOutRound = readRound(backupPath, gameId, roundKey);

    if (readOutRound === null) {
      this.props.assignTempGame({});
      // 以降のroundとscoreファイルを削除する。dialogで確認してもいいかも
      if (Number(roundKey) <= 100) {
        [103, 200, 201].forEach((tRoundKey) => {
          deleteRound(backupPath, gameId, tRoundKey);
          deleteScore(backupPath, gameId, tRoundKey);
        });
        // 一応つけてある
        if (!games[gameId]) {
          return false;
        }
        Object.keys(games[gameId].options.rounds).forEach((tRoundKey) => {
          if (Number(tRoundKey) >= Number(roundKey)) {
            deleteRound(backupPath, gameId, tRoundKey);
            deleteScore(backupPath, gameId, tRoundKey);
          }
        });
      } else if (Number(roundKey) === 101) {
        [102, 103, 201].forEach((tRoundKey) => {
          deleteRound(backupPath, gameId, tRoundKey);
          deleteScore(backupPath, gameId, tRoundKey);
        });
      }

      return false;
    }

    this.props.assignTempGame(readOutRound);
    return true;
  }

  checkScore(gameId, roundKey, backupPath) {
    const readOutScore = readScore(backupPath, gameId, roundKey);

    if (readOutScore === null) {
      this.props.assignTempScore({});
    } else {
      this.props.assignTempScore(readOutScore);
    }
  }


  isStartScreenOnString() {
    if (this.state.isStartScreenOn) {
      return ' is-active';
    }
    return '';
  }

  render() {
    return (
      <div className={`modal${this.isStartScreenOnString()}`}>
        <div className="modal-background"> </div>
        <div className="modal-content box">
          <header className="has-text-centered">
            <p style={{ fontSize: '1.5em' }}>
              筒井ウルトッラ
            </p>
          </header>
          <section style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              className="box"
              style={{
                flex: '1 1 50%',
                display: 'flex',
                justifyContent: 'center',
                padding: '15px',
                margin: '10px',
              }}
            >
              <button className="button is-primary is-outlined" onClick={this.onClickExistingFile}>
                既存のファイルを開く
              </button>
            </div>

            <div
              className="box"
              style={{
                flex: '1 1 50%',
                display: 'flex',
                justifyContent: 'center',
                padding: '15px',
                margin: '10px',
              }}
            >
              <button className="button is-primary" style={{ width: '80%' }}onClick={this.onClickNewFile}>
                新規作成
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default StartScreen;
