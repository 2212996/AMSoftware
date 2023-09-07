import React from 'react';

// FinalRanksSingleTemplateInfo = {
//       gameName,
//       contest,
//       judgeNum,
//       allScores,
//       finalScore: roundFinalScore,
//     };

const FinalRanksSingleTemplate = (data, name, pages) => {
  const styleSkatingBlock = Object.keys(data.allScores).map((style) => {
    const headerHtml = [];
    headerHtml.push(
      <td style={{ height: '15mm', padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>背番号</td>,
    );
    for (let i = 0; i < data.judgeNum; i++) {
      headerHtml.push(
        <td style={{ height: '7mm', padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>{i + 1}</td>,
      );
    }
    for (let i = data.judgeNum; i < 15; i++) {
      headerHtml.push(
        <td style={{ height: '7mm', padding: '0', verticalAlign: 'middle', textAlign: 'center' }}></td>,
      );
    }
    headerHtml.push(
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1&2</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1～3</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1～4</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1～5</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1～6</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1～7</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1～8</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1～9</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>1～10</td>,
      <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>順位</td>,
    );

    const bodyHtml = data.heats[0].map((competitorId) => {
      let isHidden = 'hidden';
      if (competitorId === data.heats[0][data.heats[0].length - 1]) {
        isHidden = '';
      }
      const ranksHtml = data.allScores[style][competitorId].map(rank => (
        <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', borderLeft: isHidden }}>{rank}</td>
      ));
      for (let i = ranksHtml.length; i < 15; i++) {
        ranksHtml.push(
          <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', borderLeft: isHidden }}></td>,
        );
      }
      const skatingHtml = [];
      const halfNum = Math.floor((data.judgeNum / 2) + 1);
      const skating = data.finalScore.single[style].skating[competitorId];
      skating.forEach((value) => {
        if (value) {
          if (value < halfNum) {
            skatingHtml.push(
              <td style={{ color: 'hsl(0, 0%, 60%)', padding: '0', verticalAlign: 'middle', textAlign: 'center', borderLeft: isHidden }}>{value}</td>,
            );
          } else {
            skatingHtml.push(
              <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', borderLeft: isHidden }}>{value}</td>,
            );
          }
        } else {
          skatingHtml.push(
            <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', borderLeft: isHidden }}></td>,
          );
        }
      });
      for (let i = skatingHtml.length; i < 10; i++) {
        skatingHtml.push(
          <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', borderLeft: isHidden }}></td>,
        );
      }
      return (
        <tr>
          <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', borderLeft: isHidden }}>{data.competitors[competitorId].number}</td>
          {ranksHtml}
          {skatingHtml}
          <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', borderLeft: isHidden }}>{data.finalScore.single[style].ranks[competitorId]}</td>
        </tr>
      );
    });
    return (
      <div style={{ writingMode: 'vertical-rl', textOrientation: 'sideways' }}>
        <p style={{ margin: '7mm 0mm 5mm 0mm' }}>{style.slice(0, 1)}</p>
        <table className="table is-bordered is-narrow" style={{ tableLayout: 'fixed', width: '8mm', height: '286mm', margin: '5mm 0mm 5mm 3mm' }}>
          <tbody>
            <tr>
              {headerHtml}
            </tr>
            {bodyHtml}
          </tbody>
        </table>
      </div>
    );
  });

  const judgeHtml1 = [];
  const judgeHtml2 = [];
  const fullJudgeHtml2 = [];
  const judgeKeys = [];
  for (let i = 0; i < data.judgeNum; i++) {
    judgeKeys.push(i);
  }
  for (let i = 0; i < 9; i++) {
    if (judgeKeys[i]) {
      judgeHtml1.push(
        <td style={{ height: '9mm', padding: '0', verticalAlign: 'middle', textAlign: 'center' }}><p style={{ width: '1.5em', overflow: 'hidden' }}>{i}</p></td>,
        <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}><p style={{ width: '1.5em', overflow: 'hidden' }}>{i + 1}</p></td>,
      );
    } else {
      judgeHtml1.push(
        <td style={{ height: '9mm', padding: '0', verticalAlign: 'middle', textAlign: 'center' }}></td>,
        <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}></td>,
      );
    }
  }

  for (let i = 9; i < 18; i++) {
    if (judgeKeys[i]) {
      judgeHtml2.push(
        <td style={{ height: '9mm', padding: '0', verticalAlign: 'middle', textAlign: 'center' }}><p style={{ width: '1.5em', overflow: 'hidden' }}>{i}</p></td>,
        <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}><p style={{ width: '1.5em', overflow: 'hidden' }}>{i}</p></td>,
      );
    } else {
      judgeHtml2.push(
        <td style={{ height: '9mm', padding: '0', verticalAlign: 'middle', textAlign: 'center' }}></td>,
        <td style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center' }}></td>,
      );
    }
  }
  if (judgeKeys[9]) {
    fullJudgeHtml2.push(
      <tr>
        {judgeHtml2}
      </tr>,
    );
  }

  const sectionsHtml = [];
  for (let i = 0; styleSkatingBlock[i * 3]; i++) {
    sectionsHtml.push(
      <section className="print-page">
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <div
            style={{ writingMode: 'vertical-rl',
              textOrientation: 'sideways',
              border: '1px solid #000000',
              margin: '5mm 5mm 5mm 13mm',
              padding: '3mm 0 0 0',
              height: '286mm',
            }}
          >
            <div className="contents"></div>
            <h1 className="subtitle" style={{ marginLeft: '3mm' }}>{`${name}順位一覧表（単科）`}</h1>
            <p>
              {`競技名: ${data.gameName}`}
            </p>
            <p>
              {data.contest.date}
            </p>
            <p>
              {`会場: ${data.contest.stage}`}
            </p>
          </div>

          {styleSkatingBlock[i * 3]}
          {styleSkatingBlock[(i * 3) + 1]}
          {styleSkatingBlock[(i * 3) + 2]}
        </div>
      </section>,
    );
  }

  const realSectionsHtml = [];
  for (let i = 0; i < pages; i++) {
    realSectionsHtml.push(...sectionsHtml);
  }

  return (
    <article className="final-ranks-single-template">
      {realSectionsHtml}
    </article>
  );
};

export default FinalRanksSingleTemplate;
