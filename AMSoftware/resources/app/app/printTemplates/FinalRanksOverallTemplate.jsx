import React from 'react';

// FinalRanksOverallTemplateInfo = {
//       gameName,
//       contest,
//       finalScore: roundFinalScore,
//       competitors,
//     };

const FinalRanksOverallTemplate = (data, name, pages) => {
  const stylesArray = ['WALTZ', 'TANGO', 'FOX', 'QUICK', 'VIENNESE', 'CHA', 'SAMBA', 'RUMBA', 'PASO', 'JIVE'];
  const bodyHtml1 = (() => {
    const headerHtml = (
      <tr>
        <td style={{ width: '10mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>背番</td>
        <td style={{ borderRight: 'hidden', width: '9mm' }}>W</td>
        <td style={{ borderRight: 'hidden', width: '9mm' }}>T</td>
        <td style={{ borderRight: 'hidden', width: '9mm' }}>F</td>
        <td style={{ borderRight: 'hidden', width: '9mm' }}>Q</td>
        <td style={{ width: '9mm' }}>V</td>
        <td style={{ borderRight: 'hidden', width: '9mm' }}>C</td>
        <td style={{ borderRight: 'hidden', width: '9mm' }}>S</td>
        <td style={{ borderRight: 'hidden', width: '9mm' }}>R</td>
        <td style={{ borderRight: 'hidden', width: '9mm' }}>P</td>
        <td style={{ width: '9mm' }}>J</td>
        <td style={{ width: '10mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>合計</td>
        <td style={{ width: '18mm', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>総合順位</td>
        <td>備考</td>
      </tr>
    );
    const bodyHtml = data.heats[0].map((competitorId) => {
      const compHtml = [];
      let isBottomHidden = 'hidden';
      if (competitorId === Object.keys(data.finalScore.total.ranks).pop()) {
        isBottomHidden = '';
      }
      compHtml.push(
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{data.competitors[competitorId].number}</td>,
      );
      stylesArray.forEach((style) => {
        let isRightHidden = 'hidden';
        if (style === 'VIENNESE' || style === 'JIVE') {
          isRightHidden = '';
        }
        if (data.finalScore.single[style]) {
          compHtml.push(
            <td style={{ borderRight: isRightHidden, padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{data.finalScore.single[style].ranks[competitorId]}</td>,
          );
        } else {
          compHtml.push(
            <td style={{ borderRight: isRightHidden, padding: '0', textAlign: 'center', verticalAlign: 'middle' }}></td>,
          );
        }
      });
      compHtml.push(
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{data.finalScore.total.skating.total[competitorId]}</td>,
      );
      compHtml.push(
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{data.finalScore.total.ranks[competitorId]}</td>,
      );
      compHtml.push(
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}></td>,
      );
      return (
        <tr style={{ borderBottom: isBottomHidden }}>
          {compHtml}
        </tr>
      );
    });
    return (
      <div style={{ width: '200mm', margin: '5mm' }}>
        <p>
          〇総合順位結果
        </p>
        <table className="table is-bordered" style={{ tableLayout: 'fixed' }}>
          <tbody>
            {headerHtml}
            {bodyHtml}
          </tbody>
        </table>
      </div>
    );
  })();

  const bodyHtml2 = (() => {
    const headerHtml = (
      <tr>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>背番号</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1&2</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～3</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～4</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～5</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～6</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～7</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～8</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～9</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～10</td>
      </tr>
    );
    const bodyHtml = data.heats[0].map((competitorId) => {
      let isHidden = 'hidden';
      if (competitorId === Object.keys(data.finalScore.total.ranks).pop()) {
        isHidden = '';
      }
      const rule10Comp = data.finalScore.total.skating.rule10[competitorId];
      const compHtml = [];
      compHtml.push(
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{data.competitors[competitorId].number}</td>,
      );
      if (rule10Comp) {
        for (let i = 0; i < rule10Comp.length; i++) {
          const skating = rule10Comp[i];
          if (skating) {
            compHtml.push(
              <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{skating}</td>,
            );
          } else {
            compHtml.push(
              <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}></td>,
            );
          }
        }
        for (let i = rule10Comp.length; i < 10; i++) {
          compHtml.push(
            <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}></td>,
          );
        }
      } else {
        for (let i = 0; i < 10; i++) {
          compHtml.push(
            <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}></td>,
          );
        }
      }
      return (
        <tr style={{ borderBottom: isHidden }}>
          {compHtml}
        </tr>
      );
    });
    return (
      <div style={{ width: '200mm', margin: '5mm' }}>
        <p>
          〇ルール１０　多数決・上位加算表
        </p>
        <table className="table is-bordered" style={{ tableLayout: 'fixed' }}>
          <tbody>
            {headerHtml}
            {bodyHtml}
          </tbody>
        </table>
      </div>
    );
  })();

  const bodyHtml3 = (() => {
    const headerHtml = (
      <tr>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>背番号</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1&2</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～3</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～4</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～5</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～6</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～7</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～8</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～9</td>
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>1～10</td>
      </tr>
    );
    const bodyHtml = data.heats[0].map((competitorId) => {
      let isHidden = 'hidden';
      if (competitorId === Object.keys(data.finalScore.total.ranks).pop()) {
        isHidden = '';
      }
      const compHtml = [];
      compHtml.push(
        <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{data.competitors[competitorId].number}</td>,
      );
      const rule11Comp = data.finalScore.total.skating.rule11[competitorId];
      if (rule11Comp) {
        for (let i = 0; i < rule11Comp.length; i++) {
          if (rule11Comp[i]) {
            if (rule11Comp[i] < data.halfNum) {
              compHtml.push(
                <td style={{ color: 'hsl(0, 0%, 60%)', padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{rule11Comp[i]}</td>,
              );
            } else {
              compHtml.push(
                <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}>{rule11Comp[i]}</td>,
              );
            }
          } else {
            compHtml.push(
              <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}></td>,
            );
          }
        }
        for (let i = rule11Comp.length; i < 10; i++) {
          compHtml.push(
            <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}></td>,
          );
        }
      } else {
        for (let i = 0; i < 10; i++) {
          compHtml.push(
            <td style={{ padding: '0', textAlign: 'center', verticalAlign: 'middle' }}></td>,
          );
        }
      }
      return (
        <tr style={{ borderBottom: isHidden }}>
          {compHtml}
        </tr>
      );
    });
    return (
      <div style={{ width: '200mm', margin: '5mm' }}>
        <p>
          〇ルール１１　再スケーティング結果表
        </p>
        <table className="table is-bordered" style={{ tableLayout: 'fixed' }}>
          <tbody>
            {headerHtml}
            {bodyHtml}
          </tbody>
        </table>
      </div>
    );
  })();

  const sectionsHtml = [];
  sectionsHtml.push(
    <section className="print-page">
      <div style={{ padding: '1mm 0 0 0' }}>
        <div style={{ border: '1px solid #000000', width: '200mm', margin: '5mm', padding: '2mm' }}>
          <div className="contents"></div>
          <h1 className="subtitle">
            {`${name}順位一覧表（総合）`}
          </h1>
          <p>
            {`競技名: ${data.gameName}`}
          </p>
          <p>
            {`開催日: ${data.contest.date}`}
          </p>
          <p>
            {`会場: ${Object.keys(data.finalScore.total.ranks).length}`}
          </p>
        </div>
      </div>
      {bodyHtml1}
      {bodyHtml2}
      {bodyHtml3}
    </section>,
  );

  const realSectionsHtml = [];
  for (let i = 0; i < pages; i++) {
    realSectionsHtml.push(...sectionsHtml);
  }

  return (
    <article className="fianl-ranks-overall-template" style={{ fontSize: '11pt' }}>
      {realSectionsHtml}
    </article>
  );
};
export default FinalRanksOverallTemplate;
