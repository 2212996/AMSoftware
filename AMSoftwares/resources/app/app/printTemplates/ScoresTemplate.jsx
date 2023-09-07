import React from 'react';

// ScoresTemplateInfo = {
//   allScores,
//   judges: rounds[selectedRound.round][selectedRound.style].judges,
//   up: rounds[selectedRound.round][selectedRound.style].upNum,
//   finalScore: roundFinalScore,
//   contest,
//   gameName,
//   round,
//   competitors,
// };
const ScoresTemplate = (data, pages) => {
  const bodyInfo = {};
  Object.keys(data.finalScore.competitors).forEach((competitorId) => {
    bodyInfo[competitorId] = [];
    for (let i = 0; i < data.judgeNum; i++) {
      bodyInfo[competitorId].push('');
    }

    Object.keys(data.allScores).forEach((style) => {
      for (let i = 0; i < data.judgeNum; i++) {
        if (data.allScores[style][competitorId][i] === true) {
          bodyInfo[competitorId][i] = bodyInfo[competitorId][i].concat(style[0]);
        } else {
          bodyInfo[competitorId][i] = bodyInfo[competitorId][i].concat('.');
        }
      }
    });
  });

  const bodyHtml = Object.keys(data.finalScore.competitors).sort((a, b) => {
    if (Number(data.competitors[a].number < Number(data.competitors[b].number))) {
      return -1;
    }
    return 1;
  }).map((competitorId) => {
    const checksHtml = bodyInfo[competitorId].map(checks => (
      <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{checks}</td>
    ));
    if (data.finalScore.competitors[competitorId].rank <= data.finalScore.passed) {
      return (
        <tr style={{ backgroundColor: 'hsl(0, 0%, 60%)' }}>
          <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>
            {data.competitors[competitorId].group.slice(0, 3)}
          </td>
          <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>
            {data.competitors[competitorId].number}
          </td>
          <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>〇</td>
          <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>
            {data.finalScore.competitors[competitorId].score}
          </td>
          <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>
            {data.finalScore.competitors[competitorId].rank}
          </td>
          {checksHtml}
        </tr>
      );
    }
    return (
      <tr>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>
          {data.competitors[competitorId].group.slice(0, 3)}
        </td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>
          {data.competitors[competitorId].number}
        </td>
        <td></td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>
          {data.finalScore.competitors[competitorId].score}
        </td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>
          {data.finalScore.competitors[competitorId].rank}
        </td>
        {checksHtml}
      </tr>
    );
  });

  const roundName = (() => {
    if (Number(data.round) < 101) {
      return `${data.round}次予選`;
    } else if (Number(data.round) === 101) {
      return '準決勝';
    } else if (Number(data.round) === 102) {
      return '決勝';
    } else if (Number(data.round) === 103) {
      return '下位決勝';
    } else if (Number(data.round) >= 200) {
      return '同点決勝';
    }
    return '予期しない値';
  })();

  const sectionsHtml = [];
  const judgesHtml = [];
  for (let i = 0; i < data.judgeNum; i++) {
    judgesHtml.push(
      <th style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{i + 1}</th>,
    );
  }
  for (let i = 0; bodyHtml[i * 38]; i++) {
    const currentBodyHtml = [];
    for (let j = i * 38; j < (i * 38) + 38; j++) {
      currentBodyHtml.push(bodyHtml[j]);
    }
    sectionsHtml.push(
      <section className="print-page" style={{ fontSize: '11pt' }}>
        <p style={{ textAlign: 'right', margin: '0mm 5mm 5mm 5mm', padding: '5mm 0mm 0mm 0mm' }}>{`${i + 1}ページ`}</p>
        <table className="table is-bordered" style={{ tableLayout: 'fixed', margin: '5mm 5mm 10mm 5mm', width: '200mm' }}>
          <tbody>
            <tr>
              <td rowSpan="3">
                <h2 className="subtitle">{`${roundName}  チェック表`}</h2>
                <p style={{ height: '1.5em', overflow: 'hidden' }}>
                  {`競技名: ${data.gameName}`}
                </p>
              </td>
              <td style={{ width: '20mm', fontSize: '13pt', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>出場</td>
              <td style={{ width: '20mm', fontSize: '13pt', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{`${Object.keys(data.finalScore.competitors).length}組`}</td>
            </tr>
            <tr>
              <td style={{ fontSize: '13pt', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>通過</td>
              <td style={{ fontSize: '13pt', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{`${data.finalScore.passed}組`}</td>
            </tr>
            <tr>
              <td style={{ fontSize: '13pt', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>仕切点</td>
              <td style={{ fontSize: '13pt', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{`${data.finalScore.bottomScore}点`}</td>
            </tr>
          </tbody>
        </table>
        <table className="table is-narrow" style={{ tableLayout: 'fixed', margin: '5mm', width: '200mm' }}>
          <thead>
            <tr>
              <th style={{ width: '15mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>大学名</th>
              <th style={{ width: '9mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>背番</th>
              <th style={{ width: '9mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>判定</th>
              <th style={{ width: '9mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>得点</th>
              <th style={{ width: '9mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>順位</th>
              {judgesHtml}
            </tr>
          </thead>
          <tbody>
            {currentBodyHtml}
          </tbody>
          <tfoot>
            <tr>
              <th style={{ width: '15mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>大学名</th>
              <th style={{ width: '9mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>背番</th>
              <th style={{ width: '9mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>判定</th>
              <th style={{ width: '9mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>得点</th>
              <th style={{ width: '9mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>順位</th>
              {judgesHtml}
            </tr>
          </tfoot>
        </table>
      </section>,
    );
  }

  const realSectionsHtml = [];
  for (let i = 0; i < pages; i++) {
    realSectionsHtml.push(...sectionsHtml);
  }

  return (
    <article>
      {realSectionsHtml}
    </article>
  );
};

export default ScoresTemplate;
