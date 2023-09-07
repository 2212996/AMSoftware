import React from 'react';
import * as xlsx from 'xlsx';
import { remote } from 'electron';
import * as fs from 'fs';

import { stylesArray } from '../common/utils';

const dialog = remote.dialog;
const utils = xlsx.utils;

// Helpers
//--------------------------------------------------
function readFile(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    return workbook.Sheets[workbook.SheetNames[0]];
  } catch (e) {
    return false;
  }
}

function renewRoundStyleOptions(lastOptions, styleCell, newStyleVal) {
  const newStyleOptions = {};
  // ex) style === 'WALTZ', style.slice(0, 1) === 'W'
  stylesArray.forEach((style) => {
    newStyleOptions[style] = lastOptions[style] === 0 &&
      styleCell.v.includes(style.slice(0, 1)) ? newStyleVal : lastOptions[style];
  });

  return newStyleOptions;
}

const READ_MODE = { OVERRIDE: 0, ADD: 1 };

function isGamesCompetitorsAcceptable(gamesCompetitors, actualGames, maxTableColumnNumber) {
  const numberOfActualGames = Object.keys(actualGames).length;
  // Excelの行の数が、定義された競技の数から想定されるものと合わない場合
  if (numberOfActualGames !== maxTableColumnNumber - 7) {
    const pressedButton = dialog.showMessageBox({
      defaultId: 0,
      type: 'info',
      buttons: ['キャンセル', 'OK'],
      message: `選手を存在しない競技に追加しようとしました。続行しますか？
      最大の競技ID:${numberOfActualGames}
      追加しようとした競技IDのうち最大のもの:${maxTableColumnNumber - 10}`,
      noLink: true,
    });

    if (pressedButton === 0) {
      return false;
    }
  }

  // 選手が追加されていない競技がある場合。
  if (numberOfActualGames !== Object.keys(gamesCompetitors).length) { //TODO
    const noCompetitorGames = [];
    Object.keys(actualGames).forEach((gameId) => {
      if (!gamesCompetitors[gameId]) {
        noCompetitorGames.push(gameId);
      }
    });

    const pressedButton = dialog.showMessageBox({
      defaultId: 0,
      type: 'info',
      buttons: ['キャンセル', 'OK'],
      message: `以下のように選手が追加されていない競技があります。続行しますか？
      ${noCompetitorGames.join(',')}`,
      noLink: true,
    });

    if (pressedButton === 0) {
      return false;
    }
  }

  return true;
}

// Class
//--------------------------------------------------
class FileImporter extends React.Component {
  constructor(props) {
    super(props);
    this.onClickOpen = this.onClickOpen.bind(this);
    this.onClickAddCompetitors = this.onClickAddCompetitors.bind(this);
    this.readGamesFromFile = this.readGamesFromFile.bind(this);
    this.readCompetitorsFromFile = this.readCompetitorsFromFile.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  onClickOpen() {
    const hasContestFile = fs.existsSync(`${this.props.backupPath}/comp.xlsx`);
    const hasEntryFolder = fs.existsSync(`${this.props.backupPath}/entry/`);

    if (!hasContestFile) {
      dialog.showMessageBox({
        defaultId: 0,
        type: 'info',
        buttons: ['OK'],
        message: '競技ファイルが確認されませんでしたよ。ファイルの読み込みを中止します。',
        noLink: true,
      });
      return;
    }

    if (!hasEntryFolder) {
      dialog.showMessageBox({
        defaultId: 0,
        type: 'info',
        buttons: ['OK'],
        message: 'entryフォルダが確認されませんでした。ファイルの読み込みを中止します。',
        noLink: true,
      });
      return;
    }

    const competitorsFileNames = fs.readdirSync(`${this.props.backupPath}/entry/`);
    if (competitorsFileNames.length === 0) {
      dialog.showMessageBox({
        defaultId: 0,
        type: 'info',
        buttons: ['OK'],
        message: 'entryフォルダ内が空でした。ファイルの読み込みを中止します。',
        noLink: true,
      });
      return;
    }
    const competitorsFullFileNames = competitorsFileNames.map(fileName => (
      `${this.props.backupPath}/entry/${fileName}`
    ));

    const buttonIndex = dialog.showMessageBox({
      defaultId: 0,
      type: 'info',
      buttons: ['キャンセル', 'OK'],
      message: '競技ファイル及びentryフォルダが確認されました。現在の競技および選手データを破棄してファイルを読み込みますか？',
      noLink: true,
    });
    if (buttonIndex === 0) {
      return;
    }

    const newGames = this.readGamesFromFile(`${this.props.backupPath}/comp.xlsx`);

    if (Object.keys(newGames).length === 0 ||
    !this.readCompetitorsFromFile(competitorsFullFileNames, READ_MODE.OVERRIDE, newGames)) {
      // どちらかでキャンセルした場合全部からにする
      this.props.readGames({});
      this.props.readCompetitors({});
      this.props.writeState(`${this.props.backupPath}/contest.dme`);
    }
  }

  onClickAddCompetitors() {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    }, (fileNames) => {
      if (fileNames.length !== 0) {
        this.readCompetitorsFromFile(fileNames, READ_MODE.ADD, {});
      }
    });
  }

  readGamesFromFile(fileName) {
    const ws = readFile(fileName);

    // const book = xlsx.readFile(fileName);
    // const ws = book.Sheets['Sheet1'];

    // Excelファイルを読み込めなかったら中止
    if (ws === false) {
      dialog.showMessageBox({
        defaultId: 0,
        type: 'info',
        buttons: ['OK'],
        message: 'Excelファイルを読み込めませんでした。すでにほかのアプリケーションで開いている場合は閉じてから再実行してください。',
        noLink: true,
      });
      return {};
    }
    const newGames = {};
    // 現在処理中の競技ID
    let currentGameId = 0;
    const rangeOfTable = utils.decode_range(ws['!ref']);
    const errRows = [];

    // 1行が一つの予選を表す
    // 2行目以降を読み込む
    for (let row = 1; row <= rangeOfTable.e.r; row++) {

      const name = ws[utils.encode_cell({ c: 1, r: row })];
      const roundName = ws[utils.encode_cell({ c: 2, r: row })];
      const judgeNum = ws[utils.encode_cell({ c: 3, r: row })];
      const numOfHeats = ws[utils.encode_cell({ c: 4, r: row })];
      const numOfCompetitorsToNextRound = ws[utils.encode_cell({ c: 5, r: row })];
      const stylesString = ws[utils.encode_cell({ c: 6, r: row })];

      // 名前を省略した場合、同競技の定義の続きとみなすよ～ん
      if (!name || name.v.trim() === '') {
        // empty?
        if (!roundName || roundName.v.trim() === '') {
          errRows.push(row + 1);
          continue;
        }

        const trimmedRoundName = roundName.v.trim();
        // 準決の場合
        if (trimmedRoundName[0] === '準') {
          // 要素がそろっていなければスキップ
          if (!judgeNum || !numOfCompetitorsToNextRound) {
            errRows.push(row + 1);
            continue;
          }

          newGames[currentGameId].options.rounds[101] = {
            judge: judgeNum.v,
            up: numOfCompetitorsToNextRound.v,
          };

          // 準決から追加する種目がある場合、読み込む
          if (stylesString) {
            const currentOptions = newGames[currentGameId].options;

            // 準決から追加の場合optionに2が入る
            newGames[currentGameId].options = Object.assign(
              currentOptions,
              renewRoundStyleOptions(currentOptions, stylesString, 2),
            );
          }

        // 決勝または上位決勝の場合
        } else if (trimmedRoundName === '決勝' || trimmedRoundName[0] === '上') {
          if (!judgeNum) {
            errRows.push(row + 1);
            continue;
          }

          newGames[currentGameId].options.rounds[102] = {
            judge: judgeNum.v,
          };

          if (stylesString) {
            const currentOptions = newGames[currentGameId].options;
            newGames[currentGameId].options = Object.assign(
              currentOptions,
              renewRoundStyleOptions(currentOptions, stylesString, 3),
            );
          }
        // 下位決勝の場合
        } else if (trimmedRoundName[0] === '下') {
          if (!judgeNum) {
            errRows.push(row + 1);
            continue;
          }

          newGames[currentGameId].options.rounds[103] = {
            judge: judgeNum.v,
          };
          // 種目の追加は上位決勝に行ってもらう。
          // というか下位決勝で種目追加とかないはず
          // え、ないよね？
        } else { // 続きの場合
          // roundName === '1次' とかなので'次'を取り除いて数値に変換する
          if (isNaN(trimmedRoundName[0])) {
            errRows.push(row + 1);
            continue;
          }

          let roundNum = 0;
          for (let j = 0; !isNaN(trimmedRoundName[j]) && j < trimmedRoundName.length; j++) {
            roundNum = (roundNum * 10) + Number(trimmedRoundName[j]);
          }

          newGames[currentGameId].options.rounds[roundNum] = {
            judge: judgeNum.v,
            heats: numOfHeats.v,
            up: numOfCompetitorsToNextRound.v,
          };
        }

        if (row == 500){
          break;
        }

      }

      // 新しい名前が付いた予選は新しい競技の1次予選とみなす。
      if (name) {
        // indexを進める
        currentGameId += 1;

        newGames[currentGameId] = {
          name: name.v,
          competitors: [],
          options: {
            rounds: {
              1: {
                judge: judgeNum.v,
                heats: numOfHeats.v,
                up: numOfCompetitorsToNextRound.v,
              },
            },
          },
        };

        stylesArray.forEach((style) => {
          newGames[currentGameId].options[style] =
            stylesString.v.includes(style.slice(0, 1)) ? 1 : 0;
        });
      }
    }

    // 準決か決勝がなければエラーで終了
    let no101or102 = false;
    Object.keys(newGames).forEach((gameIdItr) => {
      if (no101or102 === false) {
        const currentRounds = newGames[gameIdItr].options.rounds;
        if (!currentRounds[101] || !currentRounds[102]) {
          dialog.showMessageBox({
            type: 'info',
            buttons: ['OK'],
            message: `${newGames[gameIdItr].name}に準決または決勝が存在しません`,
            noLink: true,
          });

          no101or102 = true;
        }
      }
    });
    if (no101or102) {
      return {};
    }

    if (errRows.length > 0) {
      // もし最終行のみの場合。じゃないと最終行の次がエラーで表示されたりする
      if (!(errRows.length === 1 && errRows[0] === rangeOfTable.e.r + 1)) {
        const pressedButton = dialog.showMessageBox({
          defaultId: 0,
          type: 'info',
          buttons: ['キャンセル', '続行'],
          message: ws['!ref'],//`以下の行の競技は不備があったため追加できませんでした。続行しますか？
            //${errRows.join(',')}`,
          noLink: true,
        });

        if (pressedButton === 0) {
          return {};
        }
      }
    }

    if (errRows.length === 0) {
      const pressedButton = dialog.showMessageBox({
        defaultId: 0,
        type: 'info',
        buttons: ['キャンセル', '続行'],
        message: '大丈夫よん',
        noLink: true,
      });

      if (pressedButton === 0) {
        return {};
      }
    }

    this.props.readGames(newGames);
    this.props.writeState(`${this.props.backupPath}/contest.dme`);

    return newGames;
  }

  readCompetitorsFromFile(fileNames, readMode, newGames) {

    // データ読み込みか選手追加かの判定
    let isLoadDataMode = true;
    if (Object.keys(newGames).length === 0) {
      isLoadDataMode = false;
    }

    // 最後に実際に追加する選手たちの情報の定義
    let allNewCompetitors = {};
    // 選手追加の場合は現在の選手を追加の上で始める
    if (readMode === READ_MODE.ADD) {
      allNewCompetitors = Object.assign({}, this.props.competitors);
    }

    let gameNumber = 0;
    if (isLoadDataMode) {
      gameNumber = Object.keys(newGames).length;
    } else {
      gameNumber = Object.keys(this.props.games).length;
    }

    const allNewGamesCompetitors = {};
    let endedWithError = false;
    for (let i = 1; i <= gameNumber; i++) {
      allNewGamesCompetitors[i] = [];
    }
    fileNames.forEach((fileName) => {
      // 一時ファイルだったらスキップ
      if (fileName.includes('~$')) {
        // dialog.showMessageBox({
        //   defaultId: 0,
        //   type: 'info',
        //   buttons: ['OK'],
        //   message: '一時ファイルあり',
        //   noLink: true,
        // });

        return;
      }
      // 準備
      const ws = readFile(fileName);
      // 読み込めなかったら
      if (ws === false) {
        dialog.showMessageBox({
          defaultId: 0,
          type: 'info',
          buttons: ['OK'],
          message: `ESファイル${fileName}を読み込めませんでした。すでにほかのアプリケーションで開いている場合は閉じてから再実行してください。`,
          noLink: true,
        });

        endedWithError = true;
        return;
      }

      const newCompetitors = {};
      // 現在上書きモードで選手の追加を行っている。
      let currentCompetitorId = Object.keys(allNewCompetitors).length;
      const rangeOfTable = utils.decode_range(ws['!ref']);
      const newGamesCompetitors = {};
      for (let i = 1; i <= gameNumber; i++) {
        newGamesCompetitors[i] = [];
      }
      const errRows = [];

      // 3行目から読み込み始める
      for (let row = 2; row <= rangeOfTable.e.r; row++) {
        if (row == 200){
          break;
        }

        if (!ws[utils.encode_cell({ c: 0, r: row })] ||
        isNaN(ws[utils.encode_cell({ c: 0, r: row })].v)) {
          errRows.push(row + 1);
          continue;
        }

        const number = ws[utils.encode_cell({ c: 0, r: row })];
        const leaderName = ws[utils.encode_cell({ c: 1, r: row })];
        const leaderKana = ws[utils.encode_cell({ c: 2, r: row })];
        const leaderRegi = ws[utils.encode_cell({ c: 3, r: row })];
        const partnerName = ws[utils.encode_cell({ c: 4, r: row })];
        const partnerKana = ws[utils.encode_cell({ c: 5, r: row })];
        const partnerRegi = ws[utils.encode_cell({ c: 6, r: row })];
        const group = ws[utils.encode_cell({ c: 7, r: row })];

        if (!number || !leaderName || !leaderKana || !leaderRegi || !partnerName ||
          !partnerKana || !partnerRegi || !group) {
          errRows.push(row + 1);
          continue;
        }

        currentCompetitorId += 1;

        newCompetitors[currentCompetitorId] = {
          number: number.v,
          leaderName: leaderName.v,
          leaderKana: leaderKana.v,
          leaderRegi: leaderRegi.v,
          partnerName: partnerName.v,
          partnerKana: partnerKana.v,
          partnerRegi: partnerRegi.v,
          group: group.v,
        };

        // シードの指定がなかった場合はなしという意味で0を入れる
        // if (ws[utils.encode_cell({ c: 10, r: row })]) {
        //   newCompetitors[currentCompetitorId].seed
        //   = ws[utils.encode_cell({ c: 10, r: row })].v;
        // } else {
        newCompetitors[currentCompetitorId].seed = 0;
        // }

        // 参加する競技の調査
        for (let gameId = 1; gameId <= gameNumber; gameId++) {
          if (ws[utils.encode_cell({ c: gameId + 7, r: row })] &&
            ws[utils.encode_cell({ c: gameId + 7, r: row })].v.trim() !== '') {
            newGamesCompetitors[gameId].push(currentCompetitorId);
          }
        }
      }

      // 読み込めない行があった場合
      if (errRows.length > 0) {
        const fileDirectories = fileName.split('/');
        const shortFileName = fileDirectories[fileDirectories.length - 1];
        const pressedButton = dialog.showMessageBox({
          defaultId: 1,
          title: shortFileName,
          type: 'info',
          buttons: ['キャンセル', 'OK'],
          message: `以下の行の選手は不備があったため読み込みませんでした。続行しますか？
          ${errRows.join(',')}`,
          noLink: true,
        });
        if (pressedButton === 0) {
          endedWithError = true;
          return;
        }
      }

      // もし選手追加だったら
      if (!isLoadDataMode) {
        if (!isGamesCompetitorsAcceptable(newGamesCompetitors, this.props.games, rangeOfTable.e.c)) {
          return;
        }
      }

      Object.assign(allNewCompetitors, newCompetitors);
      Object.keys(allNewGamesCompetitors).forEach((gameId) => {
        allNewGamesCompetitors[gameId].push(...newGamesCompetitors[gameId]);
      });
    });

    // キャンセルが一度でも押されていたら
    if (endedWithError) {
      return false;
    }

    // readGamesFromFileから来た場合、{}の中に新ゲームデータが入ってる。
    if (!isLoadDataMode) {
      this.props.addCompetitorsInGames(allNewGamesCompetitors);
    } else {
      // 選手を追加したうえでreadGamesする
      const retNewGames = Object.assign({}, newGames);
      Object.keys(newGames).forEach((gameId) => {
        retNewGames[gameId].competitors = allNewGamesCompetitors[gameId];
      });

      this.props.readGames(retNewGames);
    }

    this.props.readCompetitors(allNewCompetitors);
    this.props.writeState(`${this.props.backupPath}/contest.dme`);

    return true;
  }

  render() {
    return (
      <div className="box" style={{ padding: '5px', marginBottom: '5px' }}>
        <div className="field">
          <p className="control">
            <button className="button is-fullwidth is-info is-outlined" onClick={this.onClickAddCompetitors}>
              <span>選手追加</span>
              <span className="icon"><icon className="fa fa-folder-open-o"></icon></span>
            </button>
          </p>
        </div>
        <div style={{ borderBottom: 'solid 1px hsl(0, 0%, 81%)', marginBottom: '10px' }}></div>
        <div className="field">
          <p className="control">
            <a className="button is-fullwidth is-info" onClick={this.onClickOpen}>
              <span>データ読込</span>
              <span className="icon"><icon className="fa fa-folder-open-o"></icon></span>
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default FileImporter;
