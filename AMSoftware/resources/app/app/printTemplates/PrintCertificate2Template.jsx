import React from 'react';

// FinalRanksSingleTemplateInfo = {
//       gameName,
//       contest,
//       judgeNum,
//       allScores,
//       finalScore: roundFinalScore,
//     };

const PrintCertificate2Template = (data, ranks) => {
  const realSectionsHtml = [];
  for (let i = 0; i < Object.keys(data.finalScore.total.ranks).length; i++) {
    if(data.competitors[data.heats[0][i]].leaderName===data.competitors[data.heats[0][i]].partnerName){
      data.competitors[data.heats[0][i]].partnerName = ''
    }
    if (data.finalScore.total.ranks[data.heats[0][i]]<ranks+1){
    realSectionsHtml.push(
      <section className="print-page">
        <div style={{ padding: '1mm 0 0 0' }}>
          <div style={{ width: '208mm', margin: '1mm' }}>
            <div className="contents">
              <div className="comp_name">
                  <p>{data.contest.name}</p>
                  <p>{data.gameName}</p>
              </div>
              <div className="winner">
                  <div className="col1">{`${data.finalScore.total.ranks[data.heats[0][i]]}位`}</div>
                  <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName}殿`}</div>
                  <div className="col1"></div>
                  <div className="col2">{`${data.competitors[data.heats[0][i]].partnerName}殿`}</div>
              </div>
              <div className="context">
                  {`貴殿は${data.contest.name}において終始よく敢闘され当初の成績をもって入賞されました．ここにその栄をたたえ賞状を呈します．`}
              </div>
              <div className="comp_date">{data.contest.date}</div>
            </div>
          </div>
        </div>
      </section>
    );
    }
  }

  return (
    <article className="fianl-ranks-overall-template" style={{ fontSize: '11pt' }}>
      {realSectionsHtml}
    </article>
  );
};
export default PrintCertificate2Template;
