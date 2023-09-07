import React from 'react';
import { remote } from 'electron';
import * as fs from 'fs';
import { renderToStaticMarkup } from 'react-dom/server';
import exportHtmlTemplate from '../../exportTemplates/exportHtmlTemplate';
import { fileStrings } from '../common/utils';

const dialog = remote.dialog;

const exportHtml = (contest, games, competitors, backupPath) => {
  const scoreDatas = [];
  const roundDatas = [];
  const errorScoreStrings = [];
  const errorRoundStrings = [];
  Object.keys(games).forEach((gameId) => {
    scoreDatas[gameId] = {};
    roundDatas[gameId] = {};
    Object.keys(games[gameId].options.rounds).forEach((roundKey) => {
      const [gameString, roundString] = fileStrings(gameId, roundKey);
      try {
        const data = fs.readFileSync(`${backupPath}/score_${gameString}_${roundString}.dms`);
        scoreDatas[gameId][roundKey] = JSON.parse(data);
      } catch (e) {
        errorScoreStrings.push(`${gameString}_${roundString}`);
      }
      try {
        const data = fs.readFileSync(`${backupPath}/round_${gameString}_${roundString}.dmr`);
        roundDatas[gameId][roundKey] = JSON.parse(data);
      } catch (e) {
        errorRoundStrings.push(`${gameString}_${roundString}`);
      }
    });
    [103, 200, 201].forEach((roundKey) => {
      const [gameString, roundString] = fileStrings(gameId, roundKey);
      try {
        const data = fs.readFileSync(`${backupPath}/score_${gameString}_${roundString}.dms`);
        scoreDatas[gameId][roundKey] = JSON.parse(data);
      } catch (e) {
      }
      try {
        const data = fs.readFileSync(`${backupPath}/round_${gameString}_${roundString}.dmr`);
        roundDatas[gameId][roundKey] = JSON.parse(data);
      } catch (e) {
      }
    });
  });

  if (errorScoreStrings.length > 0 || errorRoundStrings > 0) {
    const buttonIndex = dialog.showMessageBox({
      defaultId: 0,
      type: 'info',
      buttons: ['キャンセル', 'OK'],
      message: `ラウンド${errorRoundStrings.join(', ')}、結果${
        errorScoreStrings.join(', ')}のデータが存在しませんが、結果を出力しますか?`,
      noLink: true,
    });
    if (buttonIndex !== 1) {
      return;
    }
  }

  // 以下テンプレートの作成

  const indexBodyHtml = [];

  Object.keys(games).forEach((gameId) => {
    indexBodyHtml.push(
      <h2>
        {games[gameId].name}
      </h2>,
      <a href={`game${gameId}.html`}>[結果詳細]</a>,
    );

    const gameHeaderHtml = [
      <th style={{ width: '2.5em' }}>順位</th>,
      <th style={{ width: '3.5em' }}>背番号</th>,
      <th style={{ width: '8.5em' }}>リーダー名</th>,
      <th style={{ width: '8.5em' }}>パートナー名</th>,
      <th style={{ width: '8.5em' }}>大学名</th>,
    ];

    const gameBodyHtml = [];

    if (!scoreDatas[gameId][102]) {
      return;
    }

    const rankToCompetitors = scoreDatas[gameId][102].total.ranks;
    Object.keys(rankToCompetitors).sort((a, b) => {
      if (Number(rankToCompetitors[a]) < Number(rankToCompetitors[b])) {
        return -1;
      }
      return 1;
    }).forEach((competitorId) => {
      const gameBodyRowHtml = [];
      gameBodyRowHtml.push(
        <td>{rankToCompetitors[competitorId]}位</td>,
        <td>{competitors[competitorId].number}</td>,
        <td>{competitors[competitorId].leaderName}</td>,
        <td>{competitors[competitorId].partnerName}</td>,
        <td>{competitors[competitorId].group}</td>,
      );
      gameBodyHtml.push(
        <tr>
          {gameBodyRowHtml}
        </tr>,
      );
    });
    indexBodyHtml.push(
      <table
        style={{
          borderCollapse: 'separate',
          border: '1px solid #000000',
          marginLeft: 'auto',
          marginRight: 'auto',
          tableLayout: 'fixed',
        }}
      >
        <thead>
          {gameHeaderHtml}
        </thead>
        <tbody>
          {gameBodyHtml}
        </tbody>
        <tfoot>
          {gameHeaderHtml}
        </tfoot>
      </table>,
    );
  });

  const indexHtml = (
    <html lang="ja" style={{ backgroundColor: '#ffffef' }}>
      <head>
        <style>
          {'td { border: 1px solid #000000 }\
            th { border: 1px solid #000000 }'}
        </style>
      </head>
      <meta charSet="utf-8" />
      <body style={{ textAlign: 'center' }}>
        <h1>{contest.name}</h1>
        <h3>開催日時:{contest.date}</h3>
        <h3>開催場所:{contest.stage}</h3>
        {indexBodyHtml}
      </body>
    </html>
  );

  const exportHtmlStrings = [];
  Object.keys(games).forEach((gameId) => {
    const exportGameHtml = renderToStaticMarkup(
      exportHtmlTemplate(games[gameId].name, scoreDatas[gameId], roundDatas[gameId], competitors),
    );
    exportHtmlStrings[gameId] = `<!DOCTYPE html>${exportGameHtml}`;
  });

  const indexHtmlString = `<!DOCTYPE html>${renderToStaticMarkup(indexHtml)}`;

  if (!fs.existsSync(`${backupPath}/score`)) {
    fs.mkdirSync(`${backupPath}/score`);
  }
  fs.writeFile(`${backupPath}/score/index.html`, indexHtmlString, () => {});
  for (let i = 1; i < exportHtmlStrings.length; i++) {
    fs.writeFile(`${backupPath}/score/game${i}.html`, exportHtmlStrings[i], () => {});
  }
};

export default exportHtml;
