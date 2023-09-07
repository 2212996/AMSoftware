import React from 'react';

import ChangeHeatsButton from './ChangeHeatsButton';


// Component
//--------------------------------------------------
const DataPanel = ({ competitorsData, selectedRound, tempGame,
  assignHeats, assignScores, assignTempGame }) => {
  let dataHtml;
  let heats;
  const scores = {};
  if (Object.keys(tempGame).length > 0) {
    heats = tempGame[selectedRound.style].heats;
    Object.keys(tempGame).forEach((style) => {
      scores[style] = tempGame[style].scores;
    });

    dataHtml = heats.map((heat, heatIndex) => (
      heat.map((competitorId, competitorIndex) => {
        const competitorData = competitorsData[competitorId];
        let borderColor;
        if (competitorIndex === heat.length - 1) {
          borderColor = 'hsl(171, 100%, 41%)';
        } else {
          borderColor = '#dbdbdb';
        }

        return (
          <tr>
            <td style={{ borderBottomColor: borderColor }}>{ competitorData.number }</td>
            <td style={{ borderBottomColor: borderColor }}>{ competitorData.leaderName }</td>
            <td style={{ borderBottomColor: borderColor }}>{ competitorData.leaderRegi }</td>
            <td style={{ borderBottomColor: borderColor }}>{ competitorData.partnerName }</td>
            <td style={{ borderBottomColor: borderColor }}>{ competitorData.partnerRegi }</td>
            <td style={{ borderBottomColor: borderColor }}>{ competitorData.seed }</td>
            <td style={{ borderBottomColor: borderColor }}>{ heatIndex + 1 }</td>
          </tr>
        );
      })
    ));
  }

  return (
    <div
      className="box"
      style={{
        flex: '1 0 0',
        margin: '3px',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ flex: '1 1 0', overflow: 'auto' }}>
        <table className="table is-narrow" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '2rem' }} ></th>
              <th style={{ width: '6rem' }}>リーダー</th>
              <th></th>
              <th style={{ width: '6rem' }}>パートナー</th>
              <th></th>
              <th style={{ width: '2rem' }}>S</th>
              <th style={{ width: '2rem' }}>H</th>
            </tr>
          </thead>
          <tfoot>
            <tr>
              <th></th>
              <th>リーダー</th>
              <th></th>
              <th>パートナー</th>
              <th></th>
              <th>S</th>
              <th>H</th>
            </tr>
          </tfoot>
          <tbody>
            { dataHtml }
          </tbody>
        </table>
      </div>
      <div style={{ flex: '0 0 auto' }}></div>
      <ChangeHeatsButton
        scores={scores}
        heats={heats}
        competitors={competitorsData}
        assignHeats={assignHeats}
        assignScores={assignScores}
        assignTempGame={assignTempGame}
        tempGame={tempGame}
      />
    </div>
  );
};

export default DataPanel;
