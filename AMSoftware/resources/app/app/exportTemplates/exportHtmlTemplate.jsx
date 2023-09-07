import React from 'react';
import { roundNameString } from '../components/common/utils';

const exportHtmlTemplate = (gameName, scores, rounds, competitors) => {
  const roundHtml = [];
  Object.keys(rounds).forEach((roundKey) => {
    const roundString = roundNameString(roundKey);
    roundHtml.push(
      <h2>[{roundString}]</h2>,
    );
    Object.keys(rounds[roundKey]).forEach((style) => {
      if (!scores[roundKey]) {
        return;
      }
      const currentRound = rounds[roundKey][style];
      roundHtml.push(
        <h2>{style.slice(0, 1)}</h2>,
      );

      const roundHeaderHtml = [];
      roundHeaderHtml.push(
        <th style={{ width: '3.5em' }}>背番号</th>,
        <th style={{ width: '8.5em' }}>リーダー大学</th>,
        <th style={{ width: '8.5em' }}>パートナー大学</th>,
      );
      const judgeNumber = currentRound.judgeNum;
      for (let i = 0; i < judgeNumber; i++) {
        roundHeaderHtml.push(
          <th style={{ width: '1.5em' }}>{i + 1}</th>,
        );
      }
      if (currentRound.scoringMethod === 'CHECK') {
        roundHeaderHtml.push(
          <th style={{ width: '1.5em' }}>計</th>,
          <th style={{ width: '2.5em' }}>通過</th>,
        );
      } else if (currentRound.scoringMethod === 'RANKING') {
        roundHeaderHtml.push(
          <th style={{ width: '2.5em' }}>順位</th>,
        );
      }
      const roundBodyHtml = [];
      Object.keys(currentRound.scores).sort((a, b) => {
        if (competitors[a].number < competitors[b].number) {
          return -1;
        }
        return 1;
      }).forEach((competitor) => {
        const roundBodyRowHtml = [];
        roundBodyRowHtml.push(
          <td>{competitors[competitor].number}</td>,
          <td>{competitors[competitor].leaderRegi}</td>,
          <td>{competitors[competitor].partnerRegi}</td>,
        );
        if (currentRound.scoringMethod === 'CHECK') {
          let numOfChecks = 0;
          currentRound.scores[competitor].forEach((score) => {
            if (score) {
              numOfChecks += 1;
              roundBodyRowHtml.push(
                <td>V</td>,
              );
            } else {
              roundBodyRowHtml.push(
                <td></td>,
              );
            }
          });
          roundBodyRowHtml.push(
            <td>{numOfChecks}</td>,
          );
          if (!scores[roundKey].competitors[competitor]) {
            roundBodyRowHtml.push(
              <td></td>,
            );
            return;
          }
          if (scores[roundKey].competitors[competitor].score >= scores[roundKey].bottomScore) {
            roundBodyRowHtml.push(
              <td>〇</td>,
            );
          } else {
            roundBodyRowHtml.push(
              <td></td>,
            );
          }
        } else if (currentRound.scoringMethod === 'RANKING') {
          currentRound.scores[competitor].forEach((score) => {
            roundBodyRowHtml.push(
              <td>{score}</td>,
            );
          });
          roundBodyRowHtml.push(
            <td>{scores[roundKey].single[style].ranks[competitor]}</td>,
          );
        }
        roundBodyHtml.push(
          <tr>
            {roundBodyRowHtml}
          </tr>,
        );
      });
      roundHtml.push(
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
            {roundHeaderHtml}
          </thead>
          <tbody>
            {roundBodyHtml}
          </tbody>
          <tfoot>
            {roundHeaderHtml}
          </tfoot>
        </table>,
      );
    });
  });
  return (
    <html lang="ja" style={{ backgroundColor: '#ffffef' }}>
      <head>
        <style>
          {'td { border: 1px solid #000000 }\
            th { border: 1px solid #000000 }'}
        </style>
      </head>
      <meta charSet="utf-8" />
      <body style={{ textAlign: 'center' }}>
        <div>
          <h1>{gameName}</h1>
          <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            {roundHtml}
          </div>
        </div>
      </body>
    </html>
  );
};

export default exportHtmlTemplate;
