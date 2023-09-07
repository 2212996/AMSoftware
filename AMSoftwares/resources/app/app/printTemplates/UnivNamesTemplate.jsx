import React from 'react';

// const CompetitorsTemplateInfo = {
//     games,
//     competitors,
//   };
/*
data == {
judges,
round,
styles,
heats,
up,
scoringMethod,
gameName,
competitors,
}
 */

const UnivNamesTemplate = (data, pages) => {
  let competitors = [];
  data.heats.forEach((heat) => {
    competitors = competitors.concat(heat);
  });
  const roundName = (() => {
    if (Number(data.round) < 100) {
      return (`${data.round}次予選`);
    } else if (Number(data.round) === 101) {
      return ('準決勝');
    } else if (Number(data.round) === 102) {
      return ('決勝');
    } else if (Number(data.round) === 103) {
      return ('下位決勝');
    } else if (Number(data.round) >= 200) {
      return ('同点決勝');
    }
    return ('不正な値');
  })();

  const bodyHtml = [];
  data.heats.forEach((heat, index) => {
    bodyHtml.push(
      <tr style={{ height: '8mm', borderBottomWidth: '1px' }} key={`heat${index + 1}`}>
        <td style={{ width: '8mm' }}>{`${index + 1}H`}</td>
        <td></td>
        <td></td>
        <td style={{ width: '75mm' }}></td>
      </tr>,
    );
    heat.forEach((competitorId) => {
      bodyHtml.push(
        <tr style={{ height: '8mm', borderBottomWidth: '1px'  }} key={competitorId}>
          <td style={{ width: '8mm' }}>{data.competitors[competitorId].number}</td>
          <td>{data.competitors[competitorId].leaderName}</td>
          <td>{data.competitors[competitorId].partnerName}</td>
          <td style={{ width: '75mm' }}>{data.competitors[competitorId].group}</td>
        </tr>,
      );
    });
  });
  const sectionsHtml = [];
  for (let i = 0; bodyHtml[i * 31]; i++) {
    const validBodyHtml = bodyHtml.slice(i * 31, (i + 1) * 31);
    sectionsHtml.push(
      <section className="print-page" style={{ fontSize: '11pt' }}>
        <p style={{ textAlign: 'right', padding: '5mm 5mm 0mm 0mm' }}>{`${i + 1}ページ`}</p>
        <div>
          <h2 className="subtitle" style={{ textAlign: 'center', padding: '5mm' }}>出場選手一覧</h2>
        </div>
        <div style={{ width: '190mm', margin: '5mm 10mm 10mm' }}>
          <h3>{`${data.gameName} ${roundName}`}</h3>
          <table style={{ tableLayout: 'fixed', width: '170mm', margin: '3mm 10mm 7mm 10mm', borderBottomStyle: 'solid' }}>
            <tbody>
              {validBodyHtml}
            </tbody>
          </table>
        </div>
      </section>,
    );
  }

  const realSectionsHtml = [];

  for (let i = 0; i < pages; i++) {
    realSectionsHtml.push(...sectionsHtml);
  }

  return (
    <article className="competitors-template">
      {realSectionsHtml}
    </article>
  );
};

export default UnivNamesTemplate;

