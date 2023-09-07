import React from 'react';

// FinalRanksOverallTemplateInfo = {
//       gameName,
//       contest,
//       finalScore: roundFinalScore,
//       competitors,
//     };

const PrintCertificate = (data) => {
    const pages = 1;
    const sectionsHtml = [];
    for (let i = 0; i < 1; i++){
        sectionsHtml.push(
            <section className="print-page">
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
export default PrintCertificate;
