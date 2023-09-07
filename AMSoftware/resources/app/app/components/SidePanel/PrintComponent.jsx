import React from 'react';
import { ipcRenderer } from 'electron';
import { ipcMain } from 'electron';
import { renderToStaticMarkup } from 'react-dom/server';

import JudgeTemplate from '../../printTemplates/JudgeTemplate';
import ScoresTemplate from '../../printTemplates/ScoresTemplate';
import FinalRanksOverallTemplate from '../../printTemplates/FinalRanksOverallTemplate';
import PrintCertificateTemplate from '../../printTemplates/PrintCertificateTemplate';
import PrintCertificate2Template from '../../printTemplates/PrintCertificate2Template';
import FinalRanksSingleTemplate from '../../printTemplates/FinalRanksSingleTemplate';
import UnivNamesTemplate from '../../printTemplates/UnivNamesTemplate';
import HeatsTemplate from '../../printTemplates/HeatsTemplate';

import { deepGet } from '../common/utils';



// Helper
//--------------------------------------------------
function optionsHtml(str) {
  const result = [];
  for (let i = 0; i < 31; i++) {
    result.push(
      <option key={i} value={i}>{i}{str}</option>,
    );
  }

  return result;
}

//--------------------------------------------------

class PrintComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      whichModalOn: 0,
      fontLoaded: false,
    };

    this.onChangeNumToPrint = this.onChangeNumToPrint.bind(this);
    this.onClickAll = this.onClickAll.bind(this);
    this.onClickJudge = this.onClickJudge.bind(this);
    this.onClickCompInfo = this.onClickCompInfo.bind(this);
    this.onClickScores = this.onClickScores.bind(this);
    this.onClickScoresNP = this.onClickScoresNP.bind(this);
    //追加
    this.onClickPrintCertificate = this.onClickPrintCertificate.bind(this);
    this.onClickPrintCertificate2 = this.onClickPrintCertificate2.bind(this);

    this.onClickFinalRanksSingle = this.onClickFinalRanksSingle.bind(this);
    this.onClickFinalRanksOverall = this.onClickFinalRanksOverall.bind(this);
    this.onClickPlayoffRanksSingle = this.onClickPlayoffRanksSingle.bind(this);
    this.onClickPlayoffRanksOverall = this.onClickPlayoffRanksOverall.bind(this);
    this.onClickSmallFinalRanksSingle = this.onClickSmallFinalRanksSingle.bind(this);
    this.onClickSmallFinalRanksOverall = this.onClickSmallFinalRanksOverall.bind(this);
    this.onClickUnivNames = this.onClickUnivNames.bind(this);
    // this.onClickScoresVarify = this.onClickScoresVarify.bind(this);
    this.onClickSwitchModal = this.onClickSwitchModal.bind(this);
    this.forPrintData = this.forPrintData.bind(this);
    this.allScores = this.allScores.bind(this);
    this.currentRoundData = this.currentRoundData.bind(this);
    this.standardPrintButtonsHtml = this.standardPrintButtonsHtml.bind(this);
    this.checksButtonHtml = this.checksButtonHtml.bind(this);
    this.otherButtonHtml = this.otherButtonHtml.bind(this);
    this.gameNameHtml = this.gameNameHtml.bind(this);
    // this.scoresVarifyHtml = this.scoresVarifyHtml.bind(this);
    this.numToPrintHtml = this.numToPrintHtml.bind(this);
    this.finalPrintHtml = this.finalPrintHtml.bind(this);
    this.ranksHtml = this.ranksHtml.bind(this);
  }

  onChangeNumToPrint(num) {
    return (e) => {
      this.props.editTemp(num, Number(e.target.value));
    };
  }

  onClickAll() {
    if (Object.keys(this.props.tempGame).length > 0) {
      ipcRenderer.send('printTo', renderToStaticMarkup(
        <div>
          {HeatsTemplate(this.forPrintData(), this.props.temp[1])}
          {UnivNamesTemplate(this.forPrintData(), this.props.temp[8])}
          {JudgeTemplate(this.forPrintData(), this.props.temp[2])}
        </div>,
      ));
    }
  }

  onClickJudge() {
    // TODO: ここではtempGameが{} かroundデータだと仮定している。ほかのもそれでいこう。
    if (Object.keys(this.props.tempGame).length > 0) {
      ipcRenderer.send('printTo', renderToStaticMarkup(JudgeTemplate(this.props.contest.name, this.forPrintData(), this.props.temp[2])));
    }
  }

  onClickCompInfo() {
    if (Object.keys(this.props.tempGame).length > 0) {
      ipcRenderer.send('printTo', renderToStaticMarkup(HeatsTemplate(this.forPrintData(), this.props.temp[1])));
    }
  }

  onClickScores() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.allScores = this.allScores();

    ipcRenderer.send('printTo', renderToStaticMarkup(ScoresTemplate(templateInfo, this.props.temp[0])));
  }

  // NP short for 'no print'
  onClickScoresNP() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.allScores = this.allScores();
    ipcRenderer.send('printTo', renderToStaticMarkup(ScoresTemplate(templateInfo, this.props.temp[0])), 'DONT_PRINT');
  }

  // 追加したよ！！！！！
  onClickPrintCertificate() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.allScores = this.allScores();

    ipcRenderer.send('printCopyTo',
      renderToStaticMarkup(
        PrintCertificateTemplate(templateInfo)
        )
      );
  }

  onClickPrintCertificate2() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.allScores = this.allScores();

    ipcRenderer.send('printTo', renderToStaticMarkup(PrintCertificate2Template(templateInfo,this.props.temp[3])));
  }

  onClickFinalRanksSingle() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.allScores = this.allScores();

    ipcRenderer.send('printTo', renderToStaticMarkup(FinalRanksSingleTemplate(templateInfo, '決勝', this.props.temp[4])));
  }

  onClickFinalRanksOverall() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.halfNum = Math.floor(((this.currentRoundData().judgeNum *
      Object.keys(this.props.tempGame).length) / 2) + 1);
    // halfNum: Math.floor(((Object.keys(rounds[selectedRound
    // .round][selectedRound.style].s).length *
    //   Object.keys(allScores).length) / 2) + 1),
    ipcRenderer.send('printTo', renderToStaticMarkup(FinalRanksOverallTemplate(templateInfo, '決勝', this.props.temp[5])));
  }

  onClickPlayoffRanksSingle() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.allScores = this.allScores();

    ipcRenderer.send('printTo', renderToStaticMarkup(FinalRanksSingleTemplate(templateInfo, '同点決勝', this.props.temp[4])));
  }

  onClickPlayoffRanksOverall() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.halfNum = Math.floor(((this.currentRoundData().judgeNum *
      Object.keys(this.props.tempGame).length) / 2) + 1);

    ipcRenderer.send('printTo', renderToStaticMarkup(FinalRanksOverallTemplate(templateInfo, '同点決勝', this.props.temp[5])));
  }

  onClickSmallFinalRanksSingle() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.allScores = this.allScores();

    ipcRenderer.send('printTo', renderToStaticMarkup(FinalRanksSingleTemplate(templateInfo, '下位決勝', this.props.temp[4])));
  }

  onClickSmallFinalRanksOverall() {
    const templateInfo = this.forPrintData();
    templateInfo.finalScore = this.props.tempScore;
    templateInfo.halfNum = Math.floor(((this.currentRoundData().judgeNum *
      Object.keys(this.props.tempGame).length) / 2) + 1);

    ipcRenderer.send('printTo', renderToStaticMarkup(FinalRanksOverallTemplate(templateInfo, '下位決勝', this.props.temp[5])));
  }

  onClickUnivNames() {
    ipcRenderer.send('printTo', renderToStaticMarkup(UnivNamesTemplate(this.forPrintData(), this.props.temp[8])));
  }

  onClickSwitchModal(num) {
    return () => {
      this.setState({ whichModalOn: num });
    };
  }

  forPrintData() {
    return {
      judgeNum: this.currentRoundData().judgeNum,
      round: this.props.selectedRound.round,
      styles: Object.keys(this.props.tempGame),
      heats: this.currentRoundData().heats,
      up: this.currentRoundData().upNum,
      scoringMethod: this.currentRoundData().scoringMethod,
      gameName: this.props.games[this.props.selectedGame].name,
      competitors: this.props.competitors,
      contest: this.props.contest,
    };
  }

  allScores() {
    const allScores = {};
    Object.keys(this.props.tempGame).forEach((style) => {
      allScores[style] = this.props.tempGame[style].scores;
    });

    return allScores;
  }

  currentRoundData() {
    return this.props.tempGame[this.props.selectedRound.style];
  }

  standardPrintButtonsHtml() {
    let areButtonsOn = false;
    if (Object.keys(this.props.tempGame).length > 0) {
      areButtonsOn = true;
    }

    return (
      <div className="box" style={{ padding: '5px', marginBottom: '5px' }}>
        <div className="field">
          <p className="control">
            <a
              className="button is-info is-fullwidth"
              onClick={this.onClickAll}
              disabled={!areButtonsOn}
            >
              <span>すべて印刷</span>
              <span className="icon">
                <i className="fa fa-print"></i>
              </span>
            </a>
          </p>
        </div>

        <div style={{ borderTop: '1px solid hsl(0, 0%, 86%)', marginBottom: '13px' }}></div>

        <div className="field">
          <p className="control">
            <a
              className="button is-info is-fullwidth is-outlined"
              onClick={this.onClickUnivNames}
              disabled={!areButtonsOn}
            >
              <span>大学名</span>
              <span className="icon">
                <i className="fa fa-print"></i>
              </span>
            </a>
          </p>
        </div>
        {this.numToPrintHtml(8)}

        <div className="field">
          <p className="control">
            <a
              className="button is-info is-fullwidth is-outlined"
              onClick={this.onClickCompInfo}
              disabled={!areButtonsOn}
            >
              <span>ヒート表</span>
              <span className="icon">
                <i className="fa fa-print"></i>
              </span>
            </a>
          </p>
        </div>
        {this.numToPrintHtml(1)}

        <div className="field">
          <p className="control">
            <a
              className="button is-info is-fullwidth is-outlined"
              onClick={this.onClickJudge}
              disabled={!areButtonsOn}
            >
              <span>採点用紙</span>
              <span className="icon">
                <i className="fa fa-print"></i>
              </span>
            </a>
          </p>
        </div>
        {this.numToPrintHtml(2)}
      </div>
    );
  }

  checksButtonHtml() {
    if (Object.keys(this.props.tempGame).length === 0) {
      return (
        <div>
          <div className="field">
            <p className="control">
              <button className="button is-info is-fullwidth is-outlined" disabled>
                <span>チェック確認</span>
              </button>
            </p>
          </div>

          <div style={{ borderTop: '1px solid hsl(0, 0%, 86%)', marginBottom: '13px' }}></div>

          <div className="field">
            <p className="control">
              <a className="button is-info is-fullwidth is-outlined" disabled>
                <span>チェック表</span>
                <span className="icon">
                  <i className="fa fa-print"></i>
                </span>
              </a>
            </p>
          </div>
        </div>
      );
    }

    const scoringMethod = this.currentRoundData().scoringMethod;
    let isButtonDisabled = true;
    let onClickScores = () => {};
    let onClickScoresNP = () => {};

    if (Object.keys(this.props.tempScore).length > 0 && scoringMethod === 'CHECK') {
      isButtonDisabled = false;
      onClickScores = this.onClickScores;
      onClickScoresNP = this.onClickScoresNP;
    }

    return (
      <div className="field">
        <div className="field">
          <p className="control">
            <button className="button is-info is-fullwidth is-outlined" onClick={onClickScoresNP} disabled={isButtonDisabled}>
              <span>チェック確認</span>
            </button>
          </p>
        </div>

        <div style={{ borderTop: '1px solid hsl(0, 0%, 86%)', marginBottom: '13px' }}></div>

        <div className="field">
          <p className="control">
            <a className="button is-info is-fullwidth is-outlined" onClick={onClickScores} disabled={isButtonDisabled}>
              <span>チェック表</span>
              <span className="icon">
                <i className="fa fa-print"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
    );
  }

  otherButtonHtml() {
    if (Object.keys(this.props.tempGame).length === 0) {
      return [];
    }

    const scoringMethod = this.currentRoundData().scoringMethod;
    let isButtonOn = false;
    if (Object.keys(this.props.tempScore).length > 0) {
      isButtonOn = true;
    }
    const currentRound = Number(this.props.selectedRound.round);

    // ほかは名前とcallback以外は同じ
    let buttonName;
    let onClickButton;

    if (currentRound === 102) {
      buttonName = '決勝結果';
      onClickButton = this.onClickSwitchModal(1);
    } else if (currentRound === 103) {
      buttonName = '下位決勝結果';
      onClickButton = this.onClickSwitchModal(1);
    } else if (currentRound >= 200 && scoringMethod === 'RANKING') {
      buttonName = '同点決勝結果';
      onClickButton = this.onClickSwitchModal(1);
    }

    // 予選ではいらない
    if (!buttonName) {
      return [];
    }

    return (
      <div className="box" style={{ padding: '5px', marginBottom: '13px' }}>
        <div className="field">
          <p className="control">
            <a
              className="button is-info is-fullwidth"
              onClick={onClickButton}
              disabled={!isButtonOn}
            >
              <span>{buttonName}</span>
            </a>
          </p>
        </div>
      </div>
    );
  }

  /*scoresVarifyHtml() {
    if (Number(this.props.selectedRound.round) === 102) {
      return (
        <div className="box" style={{ padding: '5px', marginBottom: '13px' }}>
          <p className="control">
            <a
              className="button is-info is-fullwidth"
              onClick={this.onClickScoresVarify}
            >
              <span>結果更新</span>
            </a>
          </p>
        </div>
      );
    }

    return [];
  }*/

  numToPrintHtml(num) {
    let str = '';
    if (num === 2) {
      str = 'セット';
    }
    return (
      <div className="field">
        <p key={num} className="control">
          <span className="select is-fullwidth">
            <select value={this.props.temp[num]} onChange={this.onChangeNumToPrint(num)}>
              {optionsHtml(str)}
            </select>
          </span>
        </p>
      </div>
    );
  }

  finalPrintHtml() {
    const printButtonsData = [];
    if (Number(this.props.selectedRound.round) === 102) {
      printButtonsData.push(
        ['賞状印刷', this.onClickPrintCertificate2, 3],
        ['決勝順位(単科)', this.onClickFinalRanksSingle, 4],
        ['決勝順位(総合)', this.onClickFinalRanksOverall, 5],
      );
    } else if (Number(this.props.selectedRound.round) === 201) {
      printButtonsData.push(
        ['同決順位(単科)', this.onClickPlayoffRanksSingle, 4],
        ['同決順位(総合)', this.onClickPlayoffRanksOverall, 5],
      );
    } else if (Number(this.props.selectedRound.round) === 200) {
      printButtonsData.push(
        ['同決順位(単科)', this.onClickPlayoffRanksSingle, 4],
        ['同決順位(総合)', this.onClickPlayoffRanksOverall, 5],
      );
    } else if (Number(this.props.selectedRound.round) === 103) {
      printButtonsData.push(
        ['下位決順位(単科)', this.onClickSmallFinalRanksSingle, 4],
        ['下位決順位(総合)', this.onClickSmallFinalRanksOverall, 5],
      );
    }

    if (printButtonsData.length > 0) {
      const printButtonsHtml = [];
      printButtonsData.forEach((buttonData) => {
        printButtonsHtml.push(
          <div className="field" key={buttonData[2]}>
            <p key={buttonData[0]} className="control">
              <a
                className="button is-info is-outlined is-fullwidth"
                onClick={buttonData[1]}
              >
                <span>{buttonData[0]}</span>
                <span className="icon">
                  <i className="fa fa-print"></i>
                </span>
              </a>
            </p>
          </div>,
          this.numToPrintHtml(buttonData[2]),
        );
      });
      return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '10rem' }}>
          {printButtonsHtml}
        </div>
      );
    }

    return undefined;
  }

  ranksHtml() {
    if (Object.keys(this.props.tempScore).length === 0 || !this.currentRoundData() ||
      this.currentRoundData().scoringMethod !== 'RANKING') {
      return [];
    }

    const ranksToCompetitor = {};
    const competitorToRanks = this.props.tempScore.total.ranks;
    Object.keys(competitorToRanks).forEach((competitorId) => {
      const flooredScore = Math.floor(competitorToRanks[competitorId]);
      if (ranksToCompetitor[flooredScore]) {
        ranksToCompetitor[flooredScore].push(competitorId);
      } else {
        ranksToCompetitor[flooredScore] = [competitorId];
      }
    });
    const returnHtml = [];
    Object.keys(ranksToCompetitor).forEach((rank) => {
      ranksToCompetitor[rank].forEach((competitorId) => {
        returnHtml.push(
          <tr key={competitorId}>
            <td>{`${competitorToRanks[competitorId]}位`}</td>
            <td>{this.props.competitors[competitorId].number}</td>
            <td>{this.props.competitors[competitorId].leaderName}</td>
            <td>{this.props.competitors[competitorId].partnerName}</td>
          </tr>,
        );
      });
    });
    return returnHtml;
  }

  gameNameHtml() {
    if (Object.keys(this.props.tempGame).length === 0) {
      return [];
    }

    return (
      <div className="box" style={{ padding: '5px', marginBottom: '13px' }}>
          {this.props.games[this.props.selectedGame].name}
      </div>
    );
  }

  render() {

    return (
      <div>
        {this.gameNameHtml()}
        {this.otherButtonHtml()}
        <div className="box" style={{ padding: '5px', marginBottom: '13px' }}>
          {this.checksButtonHtml()}
          {this.numToPrintHtml(0)}
        </div>
        {this.standardPrintButtonsHtml()}

        <div className={`modal${this.state.whichModalOn === 1 ? ' is-active' : ''}`}>
          <div className="modal-background"></div>
          <div className="modal-content" style={{ width: '500px' }}>
            <div className="box" style={{ display: 'flex', flexDirection: 'row' }}>
              {this.finalPrintHtml()}
              <div style={{ flex: '1 1 auto', marginLeft: '1rem' }}>
                <table className="table is-narrow is-borderd">
                  <thead>
                    <tr>
                      <th>順位</th>
                      <th>背番号</th>
                      <th>リーダー</th>
                      <th>パートナー</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.ranksHtml()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <button
            className="modal-close"
            onClick={this.onClickSwitchModal(0)}
          ></button>
        </div>
      </div>
    );
  }
}

export default PrintComponent;
