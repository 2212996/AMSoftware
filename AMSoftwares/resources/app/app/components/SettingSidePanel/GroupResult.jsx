import React from 'react';
import { remote } from 'electron';

import { readAllScores } from '../common/fileService';

const dialog = remote.dialog;

class GroupResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOn: false,
      firstPoint: 0,
      deltaPoint: 0,
      calculateLastPreContest: 'true',
      highestPoint: 28,
    };

    this.groupResultHtml = this.groupResultHtml.bind(this);
    this.calculateGroupResult = this.calculateGroupResult.bind(this);
    this.onClickChangeModal = this.onClickChangeModal.bind(this);
    this.isModalOn = this.isModalOn.bind(this);
    this.formHtml = this.formHtml.bind(this);
    this.onChangeCalc = this.onChangeCalc.bind(this);
    this.onChangeDeltaPoint = this.onChangeDeltaPoint.bind(this);
    this.onChangeFirstPoint = this.onChangeFirstPoint.bind(this);
    this.onChangeHighestPoint = this.onChangeHighestPoint.bind(this);
  }

  onClickChangeModal(flag) {
    return () => {
      this.setState({ isModalOn: flag });
    };
  }

  onChangeFirstPoint(e) {
    if (!isNaN(e.target.value) && Number(e.target.value) >= 0) {
      this.setState({ firstPoint: Number(e.target.value) });
    }
  }

  onChangeDeltaPoint(e) {
    if (!isNaN(e.target.value) && Number(e.target.value) >= 0) {
      this.setState({ deltaPoint: Number(e.target.value) });
    }
  }

  onChangeCalc(e) {
    this.setState({ calculateLastPreContest: e.target.value });
  }

  onChangeHighestPoint(e) {
    if (!isNaN(e.target.value) && Number(e.target.value) >= 0) {
      this.setState({ highestPoint: Number(e.target.value) });
    }
  }

  groupResultHtml() {
    if (this.state.isModalOn !== 2) {
      return null;
    }

    const groupResults = this.calculateGroupResult();
    // calculateGroupResultsでエラーがあった場合、nullが返される
    if (!groupResults) {
      return (
        <p>
          全ての競技を終えた後、改めて団体成績を計算してください
        </p>
      );
    }

    const orderedResult = Object.keys(groupResults).sort((a, b) => {
      if (groupResults[a] < groupResults[b]) {
        return 1;
      }

      return -1;
    });

    const tableRows = orderedResult.map((groupName, index) => (
      <tr key={`groupResultRow${groupName}`}>
        <td>{index + 1}位</td>
        <td>{groupName}</td>
        <td>{groupResults[groupName]}</td>
      </tr>
    ));

    return (
      <table className="table">
        <thead>
          <tr>
            <th>順位</th>
            <th>大学名</th>
            <th>点数</th>
          </tr>
        </thead>
        <tbody>
          {tableRows}
        </tbody>
        <tfoot>
          <tr>
            <th>順位</th>
            <th>大学名</th>
            <th>点数</th>
          </tr>
        </tfoot>
      </table>
    );
  }

  formHtml() {
    return (
      <div>
        <div className="field">
          <label className="label">1次予選得点</label>
          <p className="control">
            <input
              value={this.state.firstPoint}
              type="text"
              className="input"
              placeholder="0 ~"
              onChange={this.onChangeFirstPoint}
            />
          </p>
        </div>

        <div className="field">
          <label className="label">予選ごとの追加得点</label>
          <p className="control">
            <input
              value={this.state.deltaPoint}
              type="text"
              className="input"
              placeholder="0 ~"
              onChange={this.onChangeDeltaPoint}
            />
          </p>
        </div>

        <div className="field">
          <label className="label">最終予選を減点方式で計算する</label>
          <p className="control">
            <span className="select">
              <select
                value={this.state.calculateLastPreContest}
                onChange={this.onChangeCalc}
              >
                <option value>Yes</option>
                <option value={false}>No</option>
              </select>
            </span>
          </p>
        </div>

        <div className="field">
          <label className="label">減点元</label>
          <p className="control">
            <input
              value={this.state.highestPoint}
              type="text"
              className="input"
              placeholder="最終予選、もしくは準決勝進出者以上の数にすること"
              onChange={this.onChangeHighestPoint}
            />
          </p>
        </div>
      </div>
    );
  }

  calculateGroupResult() {
    // ここら辺も選択できるようにする
    const firstPoint = this.state.firstPoint;
    const deltaPoint = this.state.deltaPoint;
    const calculateLastPreContest = this.state.calculateLastPreContest === 'true';
    const highestPoint = this.state.highestPoint;

    const pointsToGroup = {};
    function addPointToGroup(groupName, point) {
      if (pointsToGroup.hasOwnProperty(groupName)) {
        pointsToGroup[groupName] += point;
      } else {
        pointsToGroup[groupName] = point;
      }
    }

    const errGames = [];

    // 計算するゲームIDも選択できるようにする
    Object.keys(this.props.games).forEach((gameId) => {
      const allScores = readAllScores(this.props.backupPath, this.props.games, gameId);
      const preContestScores = Object.keys(allScores).filter(roundKey => (roundKey < 100));

      // 全てのラウンドが存在するかチェックする
      let isErr = false;
      Object.keys(allScores).forEach((roundKey) => {
        if (!allScores[roundKey]) {
          isErr = true;
        }
      });
      // 存在しないものがあったらこのgameIdは離脱

      if (isErr) {
        errGames.push(gameId);
        return;
      }

      // 予選について
      preContestScores.forEach((roundKey) => {
        const currentScore = allScores[roundKey];

        // 最終予選だった場合
        if (Number(roundKey) === preContestScores.length && calculateLastPreContest) {
          Object.keys(currentScore.competitors).forEach((competitorId) => {
            if (currentScore.competitors[competitorId].score < currentScore.bottomScore) {
              addPointToGroup(this.props.competitors[competitorId].group,
              highestPoint - currentScore.competitors[competitorId].rank);
            }
          });
        // 一般的には
        } else {
          Object.keys(currentScore.competitors).forEach((competitorId) => {
            if (currentScore.competitors[competitorId].score < currentScore.bottomScore) {
              addPointToGroup(this.props.competitors[competitorId].group,
              firstPoint + ((roundKey - 1) * deltaPoint));
            }
          });
        }
      });

      // 決勝では
      const finalRanks = allScores[102].total.ranks;

      Object.keys(finalRanks).forEach((competitorId) => {
        addPointToGroup(this.props.competitors[competitorId].group,
        highestPoint - finalRanks[competitorId]);
      });

      // 下位決勝がなかった場合準決で点数を決める
      if (allScores[103]) {
        const smallFinalRanks = allScores[103].total.ranks;
        Object.keys(smallFinalRanks).forEach((competitorId) => {
          addPointToGroup(this.props.competitors[competitorId].group,
          highestPoint - (smallFinalRanks[competitorId] + Object.keys(finalRanks).length));
        });
      } else {
        Object.keys(allScores[101].competitors).forEach((competitorId) => {
          if (allScores[101].competitors[competitorId].score < allScores[101].bottomScore) {
            addPointToGroup(this.props.competitors[competitorId].group,
            highestPoint - allScores[101].competitors[competitorId].rank);
          }
        });
      }
    });

    // もし終了していない競技があったら、結果を返さない
    if (errGames.length > 0) {
      dialog.showMessageBox({
        type: 'info',
        buttons: ['OK'],
        message: `以下のIDの競技はすべての試合が終了していません。
        ${errGames.join(',')}`,
      });

      return null;
    }

    return pointsToGroup;
  }

  isModalOn(num) {
    if (this.state.isModalOn === num) {
      return ' is-active';
    }
    return '';
  }

  render() {
    return (
      <div>
        <div className="box" style={{ padding: '5px', marginBottom: '5px' }} >
          <p className="control">
            <button
              className="button is-info is-fullwidth is-outlined"
              onClick={this.onClickChangeModal(1)}
            >
              団体成績
            </button>
          </p>
        </div>

        {/* Modal
        //--------------------------------------------------*/}

        <div className={`modal${this.isModalOn(1)}`}>
          <div className="modal-background"></div>
          <div className="modal-content" style={{ width: '500px' }}>
            <div className="box" style={{ display: 'flex', flexDirection: 'column' }}>
              <div>
                {this.formHtml()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'row-reverse', marginTop: '10px' }}>
                <div className="field is-horizontal">
                  <div className="field-body">
                    <div className="field">
                      <button
                        className="button is-primary is-outlined"
                        onClick={this.onClickChangeModal(2)}
                      >
                        決定
                      </button>
                    </div>
                    <div className="field">
                      <button className="button" onClick={this.onClickChangeModal(0)}>
                        キャンセル
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`modal${this.isModalOn(2)}`}>
          <div className="modal-background"></div>
          <div className="modal-content" style={{ width: '500px' }}>
            <div className="box" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: '1 1 600px', overflow: 'auto' }}>
                {this.groupResultHtml()}
              </div>
              <div
                style={{
                  flex: '0 0 auto',
                  display: 'flex',
                  flexDirection: 'row-reverse',
                  marginTop: '10px',
                }}
              >
                <button
                  className="button is-primary is-outlined"
                  onClick={this.onClickChangeModal(false)}
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

export default GroupResult;
