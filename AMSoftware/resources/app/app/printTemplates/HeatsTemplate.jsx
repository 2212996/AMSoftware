import React from 'react';
import { roundNameString } from '../components/common/utils';

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

const HeatsTemplate = (data, pages) => {
  const sectionsHtml = [];
  const roundName = roundNameString(data.round);

  let competitors = [];
  data.heats.forEach((heat) => {
    competitors = competitors.concat(heat);
  });

  const headersHtml = [];

  const backgroundColor = {
    W: data.styles.includes('WALTZ') ? 'hsl(0, 0%, 60%)' : '',
    T: data.styles.includes('TANGO') ? 'hsl(0, 0%, 60%)' : '',
    F: data.styles.includes('FOX') ? 'hsl(0, 0%, 60%)' : '',
    Q: data.styles.includes('QUICK') ? 'hsl(0, 0%, 60%)' : '',
    V: data.styles.includes('VIENNESE') ? 'hsl(0, 0%, 60%)' : '',
    C: data.styles.includes('CHA') ? 'hsl(0, 0%, 60%)' : '',
    S: data.styles.includes('SAMBA') ? 'hsl(0, 0%, 60%)' : '',
    R: data.styles.includes('RUMBA') ? 'hsl(0, 0%, 60%)' : '',
    P: data.styles.includes('PASO') ? 'hsl(0, 0%, 60%)' : '',
    J: data.styles.includes('JIVE') ? 'hsl(0, 0%, 60%)' : '',
  };

  headersHtml.push(
    <div style={{ display: 'flex', flexDirection: 'column', marginRight: '5mm' }}>
      <h1 className="vertical-text" style={{ textAlign: 'center', flex: '1 1 auto', fontSize: '20px' }}>ヒート表</h1>
    </div>,
    <table className="table is-bordered vertical-text" style={{ width: '8mm', height: '286mm', tableLayout: 'fixed', margin: '5mm 5mm 5mm 0mm' }}>
      <tbody>
        <tr>
          <th colSpan="10">
            <p style={{ overflow: 'hidden', width: '1.5em' }}>{`${data.gameName} ${roundName}`}</p>
          </th>
          <td colSpan="2" style={{ verticalAlign: 'middle', textAlign: 'center' }}>{`${competitors.length}組`}</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.W }}
          >W</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.T }}
          >T</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.F }}
          >F</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.Q }}
          >Q</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.V }}
          >V</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.C }}
          >C</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.S }}
          >S</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.R }}
          >R</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.P }}
          >P</td>
          <td
            style={{ verticalAlign: 'middle', textAlign: 'center', backgroundColor: backgroundColor.J }}
          >J</td>
        </tr>
      </tbody>
    </table>,
  );

  const tablesHtml = data.heats.map((heat, heatNum) => {
    const topHtml = heat.map(competitor => (
      <th style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', fontSize: '26pt' }}>{data.competitors[competitor].number}</th>
    ));
    for (let i = 0; i < 16 - heat.length; i++) {
      topHtml.push(
        <th></th>,
      );
    }
    topHtml.unshift(
      <th style={{ padding: '0', verticalAlign: 'middle', textAlign: 'center', fontSize: '22pt' }}>{heatNum + 1}<br /><p style={{ fontSize: '8pt' }}>ヒート</p></th>,
    );
    return (
      <table className="table is-bordered vertical-text" style={{ width: '16mm', height: '286mm', margin: '5mm 5mm 5mm 3mm', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            {topHtml}
          </tr>
        </tbody>
      </table>
    );
  });

  const remainder = tablesHtml.length % 7;

  if (remainder !== 0) {
    const emptyTdsHtml = [];
    for (let i = 0; i < 16; i++) {
      emptyTdsHtml.push(
        <th></th>,
      );
    }
    for (let i = 0; i < 7 - remainder; i++) {
      tablesHtml.push(
        <table className="table is-bordered vertical-text" style={{ width: '16mm', height: '286mm', margin: '5mm 5mm 5mm 3mm', tableLayout: 'fixed' }}>
          <tbody>
            <tr>
              {emptyTdsHtml}
            </tr>
          </tbody>
        </table>,
      );
    }
  }

  for (let i = 0; tablesHtml[i * 7]; i++) {
    sectionsHtml.push(
      <section className="print-page" style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        {headersHtml[0]}
        {headersHtml[1]}
        {tablesHtml[i * 7]}
        {tablesHtml[(i * 7) + 1]}
        {tablesHtml[(i * 7) + 2]}
        {tablesHtml[(i * 7) + 3]}
        {tablesHtml[(i * 7) + 4]}
        {tablesHtml[(i * 7) + 5]}
        {tablesHtml[(i * 7) + 6]}
        <p className="vertical-text" style={{ textAlign: 'right', paddingBottom: '5mm' }}>{i + 1}ページ</p>
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

export default HeatsTemplate;

