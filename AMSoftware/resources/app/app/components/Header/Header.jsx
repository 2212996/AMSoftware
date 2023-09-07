import React from 'react';
import * as fs from 'fs';
import { remote, ipcRenderer } from 'electron';

import VisibleCenterHeading from '../../containers/Header/VisibleCenterHeading';
import { readRound, writeRound, deleteRound, readScore, deleteScore } from '../common/fileService';

const dialog = remote.dialog;
const Menu = remote.Menu;

const Header = ({ selectedScreen, selectScreen, assignTempGame, tempGame,
  games, readState, backupPath, switchModal, selectCheckScreen, selectedCheckScreen,
  selectedGame, selectedRound, assignTempScore, isModalOn, writeState, exportHtml,
  assignBackupPath }) => {
  function readFile(folderPath) {
    fs.readFile(`${folderPath}/contest.dme`, 'utf-8', (err, data) => {
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
      readState(newState);
      // 場所を移されても大丈夫なように
      assignBackupPath(folderPath);
    });
  }

  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: '開く',
          accelerator: 'CmdOrCtrl+O',
          click() {
            dialog.showOpenDialog({
              properties: ['openDirectory'],
            }, (folderNames) => {
          // fileNames is an array that contains all the selected
              if (folderNames) {
                readFile(folderNames[0]);
              }
            });
          },
        },
        {
          label: '保存',
          accelerator: 'CmdOrCtrl+S',
          click() {
            if (backupPath) {
              writeState(`${backupPath}/contest.dme`);
            } else {
              dialog.showSaveDialog((fileName) => {
                if (fileName === undefined) {
                  return;
                }
                // fileName is a string that contains the path
                // and filename created in the save file dialog.
                writeState(fileName);
                assignBackupPath(fileName.slice(0, -12));
              });
            }
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'バックアップを保存',
          accelerator: 'Shift+CmdOrCtrl+S',
          click() {
            dialog.showSaveDialog({
              properties: ['openFile'],
              filters: [
                { name: '大会データ', extensions: ['dme'] },
              ],
            }, (fileName) => {
              if (fileName === undefined) {
                return;
              }
              // fileName is a string that contains the path
              // and filename created in the save file dialog.
              writeState(fileName);
            });
          },
        },
      ],
    },
    {
      label: 'Window',
      submenu: [
        {
          label: '印刷プレビュー表示',
          click() {
            ipcRenderer.send('showWorkerWin');
          },
        },
        {
          label: '賞状印刷プレビュー表示',
          click() {
            ipcRenderer.send('showWorkerWin2');
          },
        },
      ],
    },
    {
      label: 'Export',
      submenu: [
        {
          label: '成績表出力',
          click() {
            exportHtml();
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  // Menu.setApplicationMenu(menu);

  function checkRound(gameId, roundKey) {
    const readOutRound = readRound(backupPath, gameId, roundKey);

    if (readOutRound === null) {
      assignTempGame({});
      // 以降のroundとscoreを消す
      if (Number(roundKey) <= 100) {
        [103, 200, 201].forEach((tRoundKey) => {
          deleteRound(backupPath, gameId, tRoundKey);
          deleteScore(backupPath, gameId, tRoundKey);
        });
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
    } else {
      assignTempGame(readOutRound);
    }
  }

  function checkScore(gameId, roundKey) {
    const readOutScore = readScore(backupPath, gameId, roundKey);

    if (readOutScore === null) {
      assignTempScore({});
    } else {
      assignTempScore(readOutScore);
    }
  }

  const onClickSwitch = () => {
    if (selectedScreen === 'SETTING') {
      if (selectedGame !== 0) {
        checkRound(selectedGame, selectedRound.round);
        checkScore(selectedGame, selectedRound.round);
      }
      selectScreen('CHECK');
    } else {
      if (selectedGame !== 0) {
        writeRound(tempGame, backupPath, selectedGame, selectedRound.round);
      }
      selectScreen('SETTING');
    }
  };

  const onClickSwitchCheck = () => {
    switch (selectedCheckScreen) {
      case 'CHECK':
        if (selectedGame !== 0) {
          writeRound(tempGame, backupPath, selectedGame, selectedRound.round);
        }
        selectCheckScreen('DATA');
        break;
      case 'DATA':
        if (selectedGame !== 0) {
          writeRound(tempGame, backupPath, selectedGame, selectedRound.round);
          // checkRound(selectedGame, selectedRound.round);
          // checkScore(selectedGame, selectedRound.round);
        }

        selectCheckScreen('CHECK');
        break;
      default:
        selectCheckScreen('CHECK');
    }
  };

  const onClickSave = () => {
    writeState(`${backupPath}/contest.dme`);
  };

  let switchIcon;
  if (selectedScreen === 'CHECK') {
    switchIcon = (
      <span className="icon"><i className="fa fa-cog"></i></span>
    );
  }
  if (selectedScreen === 'SETTING') {
    switchIcon = (
      <span className="icon"><i className="fa fa-reply"></i></span>
    );
  }

  let switchCheckScreenButton;
  if (selectedScreen === 'CHECK') {
    switch (selectedCheckScreen) {
      case 'CHECK':
        switchCheckScreenButton = (
          <li><a className="button is-outlined is-info" onClick={onClickSwitchCheck}>
            <span className="icon"><i className="fa fa-user"></i></span>
          </a></li>
        );
        break;
      case 'DATA':
        switchCheckScreenButton = (
          <li><a className="button is-outlined is-info" onClick={onClickSwitchCheck}>
            <span className="icon"><i className="fa fa-check-square-o"></i></span>
          </a></li>
        );
        break;
      default:
        switchCheckScreenButton = (
          <li><a className="button is-outlined is-info" onClick={onClickSwitchCheck}>
            <span className="icon"><i className="fa fa-user"></i></span>
          </a></li>
        );
    }
  }

  let saveButton;
  if (selectedScreen === 'SETTING') {
    saveButton = (
      <button
        className="button is-primary"
        onClick={onClickSave}
        style={{
          marginRight: '10px',
          height: '85%',
        }}
      >保存</button>
    );
  }

  const isAlertActive = Number(isModalOn) === 4 ? ' is-active' : '';

  return (
    <div className="header" style={{ flex: '0 1 auto', width: '100%', margin: '0px 10px 4px 6px' }}>
      <div className="tabs is-boxed" style={{ height: '37px' }}>
        <ul className="is-left">
          <li style={{ marginRight: '10px' }}><a className="button is-outlined is-info" onClick={onClickSwitch}>
            {switchIcon}
          </a></li>
          {switchCheckScreenButton}
        </ul>

        <VisibleCenterHeading />

        <ul className="is-right" >
          {saveButton}
        </ul>
      </div>
      <div className={`modal${isAlertActive}`}>
        <div className="modal-background"></div>
        <div className="modal-content" style={{ width: '500px' }}>
          <article className="message is-warning">
            <div className="message-header">
              <p>ラウンドが生成できませんでした。</p>
              <button className="delete" onClick={() => { switchModal(0); }}></button>
            </div>
            <div className="message-body">
              指定したジャッジグループが存在することを確認してください。
            </div>
          </article>
        </div>
        <button className="modal-close" onClick={() => { switchModal(0); }}></button>
      </div>
    </div>
  );
};

export default Header;
