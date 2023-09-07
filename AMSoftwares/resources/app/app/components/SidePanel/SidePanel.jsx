import React from 'react';

// TODO: JCF needs these
// import ScheduleTemplate from '../printTemplates/ScheduleTemplate';
// import CompetitorsTemplate from '../printTemplates/CompetitorsTemplate';
// import ContestWinnersTemplate from '../printTemplates/ContestWinnersTemplate';
// import InformCompetitorsTemplate from '../printTemplates/InformCompetitorsTemplate';

import { stylesArray, roundNameString } from '../common/utils';
import { readRound, writeRound, deleteRound,
  readScore, deleteScore } from '../common/fileService';

import PrintComponent from '../../containers/SidePanel/VisiblePrintComponent';


const SidePanel = ({ selectedRound, selectRound, assignTempGame, games, selectGameAndRound,
  selectedGame, backupPath, assignTempScore, tempGame, selectedGameType,
  }) => {
  const gameOptions = Object.keys(games).map((gameId) => {
    if (selectedGameType === 'SINGLE') {
      const validStyle = Object.keys(games[gameId].options).find(style => (
        !isNaN(games[gameId].options[style]) &&
        games[gameId].options[style] === 1
      ));
      if (validStyle) {
        return (
          <option value={Number(gameId)} key={`SidePanel,game${gameId}`}>
            {`${validStyle.slice(0, 1)}${validStyle.slice(1).toLowerCase()}`}
          </option>
        );
      }
    }

    return (
      <option value={Number(gameId)} key={`SettingSidePanel,game${gameId}`}>
        {games[gameId].name}
      </option>
    );
  });

  gameOptions.unshift(
    <option value="0" key={'SidePanel,game0'}>選択してください</option>,
  );

  let roundOptions = [];
  const styleOptions = [];
  const styleOptionsString = [];

  if (games[selectedGame]) {
    roundOptions = Object.keys(games[selectedGame].options.rounds).map((key) => {
      const roundName = roundNameString(key);
      return (
        <option value={key} key={key}>{roundName}</option>
      );
    });
    // 200 and on arent inluded in round options, include it manually
    if (readRound(backupPath, selectedGame, 200)) {
      roundOptions.push(
        <option value="200" key={200}>同点決勝(準決)</option>,
      );
    }
    if (readRound(backupPath, selectedGame, 201)) {
      roundOptions.push(
        <option value="201" key={201}>同点決勝(決勝)</option>,
      );
    }

    // makes styleOptions based on round options, not on tempRound
    // TODO: make this dependent on tempRound
    Object.keys(games[selectedGame].options).forEach((style) => {
      if (style === 'rounds') {
        return;
      }
      if (Number(selectedRound.round) < 101 || Number(selectedRound.round) === 200) {
        if (Number(games[selectedGame].options[style]) === 1) {
          styleOptions.push(
            <option value={style} key={style}>{`${style.slice(0, 1)}${style.slice(1).toLowerCase()}`}</option>,
          );
          styleOptionsString.push(style);
        }
      } else if (Number(selectedRound.round) === 101 || Number(selectedRound.round) === 201) {
        if (Number(games[selectedGame].options[style]) <= 2 &&
        Number(games[selectedGame].options[style]) !== 0) {
          styleOptions.push(
            <option value={style} key={style}>{`${style.slice(0, 1)}${style.slice(1).toLowerCase()}`}</option>,
          );
          styleOptionsString.push(style);
        }
      } else if (Number(selectedRound.round) === 102 || Number(selectedRound.round) === 103) {
        if (Number(games[selectedGame].options[style]) <= 3 &&
        Number(games[selectedGame].options[style]) !== 0) {
          styleOptions.push(
            <option value={style} key={style}>{`${style.slice(0, 1)}${style.slice(1).toLowerCase()}`}</option>,
          );
          styleOptionsString.push(style);
        }
      }
    });
  }

  function checkRound(gameId, roundKey) {
    const readOutRound = readRound(backupPath, gameId, roundKey);

    if (readOutRound === null) {
      assignTempGame({});
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

    assignTempGame(readOutRound);
    return true;
  }

  function checkScore(gameId, roundKey) {
    const readOutScore = readScore(backupPath, gameId, roundKey);

    if (readOutScore === null) {
      assignTempScore({});
    } else {
      assignTempScore(readOutScore);
    }
  }

  function firstRound(gameId) {
    if (games[gameId].options) {
      for (let i = 0; i < stylesArray.length; i++) {
        if (games[gameId].options[stylesArray[i]] === 1) {
          return stylesArray[i];
        }
      }
    }

    // TODO: there should be some other better option
    return 'WALTZ';
  }

  // if (didLoadContestFile === true) {
  //   checkRound(selectedGame, selectedRound.round);
  //   checkScore(selectedGame, selectedRound.round);
  //   switchDidLoadFile(false);
  // }

  const onChangeRound = (e) => {
    if (Object.keys(tempGame).length !== 0) {
      writeRound(tempGame, backupPath, selectedGame, selectedRound.round);
    }
    checkRound(selectedGame, e.target.value);
    checkScore(selectedGame, e.target.value);
    selectRound(Number(e.target.value), firstRound(selectedGame));
  };

  const onChangeStyle = (e) => {
    if (Object.keys(tempGame).length !== 0) {
      writeRound(tempGame, backupPath, selectedGame, selectedRound.round);
    }
    selectRound(selectedRound.round, e.target.value);
  };

  const onChangeGame = (e) => {
    if (Number(e.target.value) === 0) {
      return;
    }
    if (selectedGame !== 0 && Object.keys(tempGame).length !== 0) {
      writeRound(tempGame, backupPath, selectedGame, selectedRound.round);
    }

    if (checkRound(e.target.value, selectedRound.round)) {
      checkScore(e.target.value, selectedRound.round);
      selectGameAndRound(Number(e.target.value), selectedRound.round, firstRound(Number(e.target.value)));
    } else {
      checkRound(e.target.value, 1);
      checkScore(e.target.value, 1);
      selectGameAndRound(Number(e.target.value), 1, firstRound(Number(e.target.value)));
    }
  };

  // 下が真の場合styleOptionsの処理いらない。けどstringOptionsStringいる。いつか直してね
  const styleOptionsHtml = [];
  if (selectedGameType === 'TOTAL') {
    styleOptionsHtml.push(
      <div className="field">
        <p className="control">
          <span className="select is-fullwidth">
            <select value={selectedRound.style} onChange={onChangeStyle}>
              { styleOptions }
            </select></span>
        </p>
      </div>,
    );
  }

  return (
    <div
      className="sidePanel"
      style={{
        width: '125px',
        flex: '0 0 auto',
        margin: '3px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <div className="field">
          <p className="control">
            <span className="select is-fullwidth">
              <select value={selectedGame} onChange={onChangeGame}>
                {gameOptions}
              </select>
            </span>
          </p>
        </div>
        <div className="field">
          <p className="control">
            <span className="select is-fullwidth">
              <select value={selectedRound.round} onChange={onChangeRound}>
                { roundOptions }
              </select>
            </span>
          </p>
        </div>
        {styleOptionsHtml}
      </div>

      <div style={{ flex: '1 1 auto' }} />

      <PrintComponent />
    </div>
  );
};

export default SidePanel;
