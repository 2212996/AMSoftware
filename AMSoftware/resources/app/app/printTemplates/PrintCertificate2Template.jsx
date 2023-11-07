import React from 'react';

// FinalRanksSingleTemplateInfo = {
//       gameName,
//       contest,
//       judgeNum,
//       allScores,
//       finalScore: roundFinalScore,
//     };

// もしranksで0,1だったら1いだけを出力

const PrintCertificate2Template = (data, ranks) => {
  let leader, partner, tmp;
  const realSectionsHtml = [];
  const names = ['吹田市長 後藤 圭二', '吹田市教育委員会', 'A.M Dance international Scool 代表 曾 偉修'];
  if(ranks===1 || ranks===0){
    for (let i = 0; i < data.heats[0].length; i++) {
      if(data.finalScore.total.ranks[data.heats[0][i]]===1){
        if(data.competitors[data.heats[0][i]].leaderName===data.competitors[data.heats[0][i]].partnerName){
          realSectionsHtml.push(
            <section className="print-page">
              <div className="space">
                <div className="name">{data.competitors[data.heats[0][i]].leaderName}</div>
              </div>
            </section>
          );
        } else{
          realSectionsHtml.push(
            <section className="print-page">
              <div className="space">
                <div className="name1">{data.competitors[data.heats[0][i]].leaderName}</div>
                <div className="name2">{data.competitors[data.heats[0][i]].partnerName}</div>
              </div>
            </section>
          );
        }
      }
    }
  } else if(ranks===2){
    for (let i = 0; i < data.heats[0].length; i++) {
      if(data.finalScore.total.ranks[data.heats[0][i]]<7){
        if(data.finalScore.total.ranks[data.heats[0][i]]===1){
          tmp='優勝';
        } else{
          tmp=data.finalScore.total.ranks[data.heats[0][i]]+'位';
        }
        if(data.competitors[data.heats[0][i]].leaderName===data.competitors[data.heats[0][i]].partnerName){
          realSectionsHtml.push(
            <section className="print-page">
              <div style={{ padding: '1mm 0 0 0' }}>
                <div style={{ width: '208mm', margin: '1mm' }}>
                  <div className="contents">
                    <div className="comp_title">
                      <div className="comp_title_top">
                        <p>賞<a1>ㅤㅤ</a1>状</p>
                      </div>
                      <div className="comp_title_sub">
                        <p>A.M Dance international School 主催</p>
                      </div>
                      <div className="comp_title_subsub">
                        <p>1st Winter Dance Festa & Winter Freedom Challenge Cup</p>
                      </div>
                    </div>
                    <div className="comp_name">
                        <p>{data.gameName}</p>
                    </div>
                    <div className="winner">
                        <div className="col1">{tmp}</div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName}殿`}</div>
                        <div className="col1"><a1>ㅤㅤ</a1></div>
                        <div className="col2"><a1>ㅤㅤ</a1></div>
                    </div>
                    <div className="context">
                        {`あなたは頭書の大会において優秀な成績を収められましたのでこれを賞します`}
                    </div>
                    <div className="comp_date">令和5年11月5日</div>
                    <div className="comp_sponser"><a1>A.M Dance international Scool 代表</a1> 曾 偉修</div>
                  </div>
                </div>
              </div>
            </section>
          );
        } else{
          realSectionsHtml.push(
            <section className="print-page">
              <div style={{ padding: '1mm 0 0 0' }}>
                <div style={{ width: '208mm', margin: '1mm' }}>
                  <div className="contents">
                    <div className="comp_title">
                      <div className="comp_title_top">
                        <p>賞<a1>ㅤㅤ</a1>状</p>
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
                        <div className="col1">{tmp}</div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName} 殿`}</div>
                        <div className="col1"></div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].partnerName} 殿`}</div>
                    </div>
                    <div className="context">
                        {`あなたがたのチームは頭書の大会において優秀な成績を収められましたのでこれを賞します`}
                    </div>
                    <div className="comp_date">令和5年11月5日</div>
                    <div className="comp_sponser"><a1>A.M Dance international Scool 代表</a1> 曾 偉修</div>
                  </div>
                </div>
              </div>
            </section>
          );
        }
      }
    }
  } else if(ranks===3){
    for (let i = 0; i < data.heats[0].length; i++) {
      if(data.finalScore.total.ranks[data.heats[0][i]]<9){
        if(data.finalScore.total.ranks[data.heats[0][i]]===1){
          tmp='優勝';
        } else{
          tmp=data.finalScore.total.ranks[data.heats[0][i]]+'位';
        }
        if(data.competitors[data.heats[0][i]].leaderName===data.competitors[data.heats[0][i]].partnerName){
          realSectionsHtml.push(
            <section className="print-page">
              <div style={{ padding: '1mm 0 0 0' }}>
                <div style={{ width: '208mm', margin: '1mm' }}>
                  <div className="contents">
                    <div className="comp_title">
                      <div className="comp_title_top">
                        <p>賞<a1>ㅤㅤ</a1>状</p>
                      </div>
                      <div className="comp_title_sub">
                        <p>A.M Dance international School 主催</p>
                      </div>
                      <div className="comp_title_subsub">
                        <p>1st Winter Dance Festa & Winter Freedom Challenge Cup</p>
                      </div>
                    </div>
                    <div className="comp_name">
                        <p>{data.gameName}</p>
                    </div>
                    <div className="winner">
                        <div className="col1">{tmp}</div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName}殿`}</div>
                        <div className="col1"><a1>ㅤㅤ</a1></div>
                        <div className="col2"><a1>ㅤㅤ</a1></div>
                    </div>
                    <div className="context">
                        {`あなたは頭書の大会において優秀な成績を収められましたのでこれを賞します`}
                    </div>
                    <div className="comp_date">令和5年11月5日</div>
                    <div className="comp_sponser"><a1>A.M Dance international Scool 代表</a1> 曾 偉修</div>
                  </div>
                </div>
              </div>
            </section>
          );
        } else{
          realSectionsHtml.push(
            <section className="print-page">
              <div style={{ padding: '1mm 0 0 0' }}>
                <div style={{ width: '208mm', margin: '1mm' }}>
                  <div className="contents">
                    <div className="comp_title">
                      <div className="comp_title_top">
                        <p>賞<a1>ㅤㅤ</a1>状</p>
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
                        <div className="col1">{tmp}</div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName} 殿`}</div>
                        <div className="col1"></div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].partnerName} 殿`}</div>
                    </div>
                    <div className="context">
                        {`あなたがたのチームは頭書の大会において優秀な成績を収められましたのでこれを賞します`}
                    </div>
                    <div className="comp_date">令和5年11月5日</div>
                    <div className="comp_sponser"><a1>A.M Dance international Scool 代表</a1> 曾 偉修</div>
                  </div>
                </div>
              </div>
            </section>
          );
        }
      }
    }
  } else {
    for (let i = 0; i < data.heats[0].length; i++) {
      if(data.finalScore.total.ranks[data.heats[0][i]]!=1 && data.finalScore.total.ranks[data.heats[0][i]]<7){
        tmp=data.finalScore.total.ranks[data.heats[0][i]]+'位';
        if(data.competitors[data.heats[0][i]].leaderName===data.competitors[data.heats[0][i]].partnerName){
          realSectionsHtml.push(
            <section className="print-page">
              <div style={{ padding: '1mm 0 0 0' }}>
                <div style={{ width: '208mm', margin: '1mm' }}>
                  <div className="contents">
                    <div className="comp_title">
                      <div className="comp_title_top">
                        <p>賞<a1>ㅤㅤ</a1>状</p>
                      </div>
                      <div className="comp_title_sub">
                        <p>A.M Dance international School 主催</p>
                      </div>
                      <div className="comp_title_subsub">
                        <p>1st Winter Dance Festa & Winter Freedom Challenge Cup</p>
                      </div>
                    </div>
                    <div className="comp_name">
                        <p>{data.gameName}</p>
                    </div>
                    <div className="winner">
                        <div className="col1">{tmp}</div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName}殿`}</div>
                        <div className="col1"><a1>ㅤㅤ</a1></div>
                        <div className="col2"><a1>ㅤㅤ</a1></div>
                    </div>
                    <div className="context">
                        {`あなたは頭書の大会において優秀な成績を収められましたのでこれを賞します`}
                    </div>
                    <div className="comp_date">令和5年11月5日</div>
                    <div className="comp_sponser"><a1>A.M Dance international Scool 代表</a1> 曾 偉修</div>
                  </div>
                </div>
              </div>
            </section>
          );
        } else{
          realSectionsHtml.push(
            <section className="print-page">
              <div style={{ padding: '1mm 0 0 0' }}>
                <div style={{ width: '208mm', margin: '1mm' }}>
                  <div className="contents">
                    <div className="comp_title">
                      <div className="comp_title_top">
                        <p>賞<a1>ㅤㅤ</a1>状</p>
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
                        <div className="col1">{tmp}</div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName} 殿`}</div>
                        <div className="col1"></div>
                        <div className="col2">{`${data.competitors[data.heats[0][i]].partnerName} 殿`}</div>
                    </div>
                    <div className="context">
                        {`あなたがたのチームは頭書の大会において優秀な成績を収められましたのでこれを賞します`}
                    </div>
                    <div className="comp_date">令和5年11月5日</div>
                    <div className="comp_sponser"><a1>A.M Dance international Scool 代表</a1> 曾 偉修</div>
                  </div>
                </div>
              </div>
            </section>
          );
        }
      }
    }
  }










  // let tmp;
  // const realSectionsHtml = [];
  // const names = ['吹田市長 後藤 圭二', '吹田市教育委員会', 'A.M Dance international Scool代表 曾 偉修'];
  // for (let i = 0; i < data.heats[0].length; i++) {
  //   if(data.competitors[data.heats[0][i]].leaderName===data.competitors[data.heats[0][i]].partnerName && data.finalScore.total.ranks[data.heats[0][i]]<=8){
  //     if(data.finalScore.total.ranks[data.heats[0][i]]===1){
  //       tmp='優勝';
  //     } else{
  //       tmp=data.finalScore.total.ranks[data.heats[0][i]]+'位';
  //     }
  //     realSectionsHtml.push(
  //       <section className="print-page">
  //         <div style={{ padding: '1mm 0 0 0' }}>
  //           <div style={{ width: '208mm', margin: '1mm' }}>
  //             <div className="contents">
  //               <div className="comp_title">
  //                 <div className="comp_title_top">
  //                   <p>賞<a1>ㅤㅤ</a1>状</p>
  //                 </div>
  //                 <div className="comp_title_sub">
  //                   <p>A.M Dance international School 主催</p>
  //                 </div>
  //                 <div className="comp_title_subsub">
  //                   <p>1st Winter Dance Festa & Winter Freedom Challenge Cup</p>
  //                 </div>
  //               </div>
  //               <div className="comp_name">
  //                   <p>{data.gameName}</p>
  //               </div>
  //               <div className="winner">
  //                   <div className="col1">{tmp}</div>
  //                   <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName}殿`}</div>
  //                   <div className="col1"><a1>ㅤㅤ</a1></div>
  //                   <div className="col2"><a1>ㅤㅤ</a1></div>
  //               </div>
  //               <div className="context">
  //                   {`貴殿は当大会において終始よく敢闘され当初の成績をもって入賞されました．ここにその栄をたたえ賞状を呈します．`}
  //               </div>
  //               <div className="comp_date">2023年11月5日</div>
  //               <div className="comp_sponser">{names[ranks]}</div>
  //             </div>
  //           </div>
  //         </div>
  //       </section>
  //     );
  //   }
  //   else if (data.finalScore.total.ranks[data.heats[0][i]]<=8){
  //     if(data.finalScore.total.ranks[data.heats[0][i]]===1){
  //       tmp='優勝';
  //     } else{
  //       tmp=data.finalScore.total.ranks[data.heats[0][i]];
  //     }
  //     realSectionsHtml.push(
  //       <section className="print-page">
  //         <div style={{ padding: '1mm 0 0 0' }}>
  //           <div style={{ width: '208mm', margin: '1mm' }}>
  //             <div className="contents">
  //               <div className="comp_title">
  //                 <div className="comp_title_top">
  //                   <p>賞<a1>ㅤㅤ</a1>状</p>
  //                 </div>
  //                 <div className="comp_title_sub">
  //                   <p>A.M Dance international School 主催</p>
  //                   <p>1st Winter Dance Festa</p>
  //                   <p>Winter Freedom Challenge Cup</p>
  //                 </div>
  //               </div>
  //               <div className="comp_name">
  //                   <p>{data.gameName}</p>
  //               </div>
  //               <div className="winner">
  //                   <div className="col1">{tmp}</div>
  //                   <div className="col2">{`${data.competitors[data.heats[0][i]].leaderName} 殿`}</div>
  //                   <div className="col1"></div>
  //                   <div className="col2">{`${data.competitors[data.heats[0][i]].partnerName} 殿`}</div>
  //               </div>
  //               <div className="context">
  //                   {`貴殿は当大会において終始よく敢闘され当初の成績をもって入賞されました．ここにその栄をたたえ賞状を呈します．`}
  //               </div>
  //               <div className="comp_date">2023年11月5日</div>
  //               <div className="comp_sponser">{names[ranks]}</div>
  //             </div>
  //           </div>
  //         </div>
  //       </section>
  //     );
  //   }
  // }

  return (
    <article className="fianl-ranks-overall-template" style={{ fontSize: '11pt' }}>
      {realSectionsHtml}
    </article>
  );
};
export default PrintCertificate2Template;
