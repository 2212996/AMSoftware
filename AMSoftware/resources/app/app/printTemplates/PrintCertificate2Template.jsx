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
  const names = ['吹田市長 後藤 圭二', '吹田市教育委員会'];
  for (let i = 0; i < data.heats[0].length; i++) {
    if(data.competitors[data.heats[0][i]].leaderName===data.competitors[data.heats[0][i]].partnerName && data.finalScore.total.ranks[data.heats[0][i]]<=8){
      realSectionsHtml.push(
        <section className="print-page">
          <div style={{ padding: '1mm 0 0 0' }}>
            <div style={{ width: '208mm', margin: '1mm' }}>
              <div className="contents">
                <div className="comp_title">
                  <div className="comp_title_top">
                    <p>賞 状</p>
                  </div>
                  <div className="comp_title_sub">
                    <p>A.M Dance international School 主催</p>
                    <p>1st Winter Dance Festa</p>
                    <p>Winter Freedom Challenge Cup</p>
                    {/* <p>{data.heats[0].length}</p> */}
                  </div>
                </div>
                <div className="comp_name">
                    <p>{data.gameName}</p>
                </div>
                <div className="winner">
                    <div className="col1">{`${data.finalScore.total.ranks[data.heats[0][i]]}位`}</div>
                    <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName}殿`}</div>
                    <div className="col1"></div>
                    <div className="col2"></div>
                </div>
                <div className="context">
                    {`貴殿は当大会において終始よく敢闘され当初の成績をもって入賞されました．ここにその栄をたたえ賞状を呈します．`}
                </div>
                <div className="comp_date">2023年9月16日</div>
                <div className="comp_sponser">{names[ranks]}</div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    else if (data.finalScore.total.ranks[data.heats[0][i]]<=8){
      realSectionsHtml.push(
        <section className="print-page">
          <div style={{ padding: '1mm 0 0 0' }}>
            <div style={{ width: '208mm', margin: '1mm' }}>
              <div className="contents">
                <div className="comp_title">
                  <div className="comp_title_top">
                    <p>賞 状</p>
                  </div>
                  <div className="comp_title_sub">
                    <p>A.M Dance international School 主催</p>
                    <p>1st Winter Dance Festa</p>
                    <p>Winter Freedom Challenge Cup</p>
                  </div>
                </div>
                <div className="comp_name">
                    <p>{data.gameName}</p>
                </div>
                <div className="winner">
                    <div className="col1">{`${data.finalScore.total.ranks[data.heats[0][i]]}位`}</div>
                    <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName}殿`}</div>
                    <div className="col1"></div>
                    <div className="col2">{`${data.competitors[data.heats[0][i]].partnerName}殿`}</div>
                </div>
                <div className="context">
                    {`貴殿は当大会において終始よく敢闘され当初の成績をもって入賞されました．ここにその栄をたたえ賞状を呈します．`}
                </div>
                <div className="comp_date">2023年9月16日</div>
                <div className="comp_sponser">{names[ranks]}</div>
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
