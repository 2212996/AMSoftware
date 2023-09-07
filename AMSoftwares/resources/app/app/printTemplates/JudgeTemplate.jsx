import React from 'react';


/*
data == {
judges,
round,
styles,
heats,
up,
scoringMethod,
gameName,
}
 */

const JudgeTemplate = (contest_name, data, pages) => {
  const sectionsHtml = [];
  let competitors = [];
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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
      return '同点決勝';
    }
    return ('不正な値');
  })();

  const headersHtml = [];

  for (let j = 0; j < data.judgeNum; j++) {
    let howToString = '';
    switch (data.scoringMethod) {
      case 'CHECK': {
        howToString = `チェック方式で ${data.up}名 上げてください。`;
        break;
      }
      case 'RANKING': {
        howToString = '順位法で行ってください。';
        break;
      }
      default: {
        howToString = '採点はチェック方式で行ってください。';
      }
    }

    data.styles.forEach((style) => {
      headersHtml.push(
        <div style={{ display: 'flex', flexDirection: 'column', marginRight: '5mm' }}>
          <h1 className="vertical-text" style={{ textAlign: 'center', flex: '1 1 auto', fontSize: '20px' }}>採点用紙</h1>
        </div>,
        <table className="table is-bordered vertical-text" style={{ width: '16mm', height: '265mm', tableLayout: 'fixed', margin: '26mm 5mm 5mm 0mm' }}>
          <tbody>
            <tr>
              <th colSpan="9" style={{ padding: '3mm 0 0 0', verticalAlign: 'middle' }}>
                <p style={{ width: '1.5em', overflow: 'hidden', fontSize: '18pt', padding: '0' }}>{`${data.gameName} ${roundName}`}</p>
              </th>
              <td
                style={style === 'WALTZ' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >W</td>
              <td
                style={style === 'TANGO' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >T</td>
              <td
                style={style === 'FOX' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >F</td>
              <td
                style={style === 'QUICK' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >Q</td>
              <td
                style={style === 'VIENNESE' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >V</td>
              <td
                style={style === 'CHA' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >C</td>
              <td
                style={style === 'SAMBA' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >S</td>
              <td
                style={style === 'RUMBA' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >R</td>
              <td
                style={style === 'PASO' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >P</td>
              <td
                style={style === 'JIVE' ? { backgroundColor: 'hsl(0, 0%, 60%)', verticalAlign: 'middle', textAlign: 'center' } :
                { verticalAlign: 'middle', textAlign: 'center' }}
              >J</td>
            </tr>
            <tr>
              <th colSpan="11" style={{ padding: '3mm 0 0 0', verticalAlign: 'middle' }}>
                <p style={{ overflow: 'hidden', fontSize: '18pt', padding: '0' }}>{howToString}</p>
              </th>
              <th colSpan="7" style={{ padding: '3mm 0 0 0', verticalAlign: 'middle' }}>
                <p style={{ overflow: 'hidden', fontSize: '18pt', padding: '0' }}>名前:</p>
              </th>
              <th style={{ padding: '0', verticalAlign: 'middle', fontSize: '18pt', textAlign: 'center', backgroundColor: 'hsl(0, 0%, 60%)' }}></th>
            </tr>
          </tbody>
        </table>,
      );
    });
  }

  const tablesHtml = data.heats.map((heat, heatNum) => {
    const bottomHtml = [];
    // ヒート表示するセル
    bottomHtml.push(
      <th style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', fontSize: '15pt' }}>{heatNum + 1}<br /><p style={{ fontSize: '5pt' }}>ヒート</p></th>,
    );
    // 背番号を表示する列
    const topHtml = heat.map((competitor, index) => {
      let borderBottomWidth = '1px';
      if (index === heat.length - 1) {
        borderBottomWidth = '3px';
      }
      // ついでに下にもpushする
      bottomHtml.push(
        <th style={{ borderBottomWidth }}></th>,
      );
      return (
        <th style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', fontSize: '17pt', borderBottomWidth }}>{data.competitors[competitor].number}</th>
      );
    });

    for (let i = 0; i < 18 - heat.length; i++) {
      topHtml.push(
        <th></th>,
      );
      bottomHtml.push(
        <th></th>,
      );
    }

    topHtml.unshift(
      <th style={{ height: '14mm', width: '8mm', padding: '0', verticalAlign: 'middle', textAlign: 'center' }}>背番号</th>,
    );

    return (
      <table className="table is-bordered vertical-text" style={{ width: '22mm', height: '265mm', margin: '26mm 5mm 5mm 5mm', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            {topHtml}
          </tr>
          <tr>
            {bottomHtml}
          </tr>
        </tbody>
      </table>
    );
  });

  for (let h = 0; h < headersHtml.length / 2; h++) {
    for (let i = 0; tablesHtml[i * 5]; i++) {
      sectionsHtml.push(
        <section className="print-page" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          {headersHtml[h * 2]}
          {headersHtml[(h * 2) + 1]}
          {tablesHtml[i * 5]}
          {tablesHtml[(i * 5) + 1]}
          {tablesHtml[(i * 5) + 2]}
          {tablesHtml[(i * 5) + 3]}
          {tablesHtml[(i * 5) + 4]}
        </section>,
      );
    }
  }

  const realSectionsHtml = [];
  for (let i = 0; i < pages; i++) {
    realSectionsHtml.push(...sectionsHtml);
  }

  return (
    <article className="judge-template">
      {realSectionsHtml}
    </article>
  );
};

export default JudgeTemplate;
