import React from 'react';

class ScoreTableJudge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedJudge0idx: 0,
      selectedPage0idx: 0,
      selectedCell: [0, 0],
      moveTimer: 0,
      scoreTimer: 0,
      hasMoved: true,
    };

    this.rowHtml = this.rowHtml.bind(this);
    this.tableBodyHtml = this.tableBodyHtml.bind(this);
    this.totalChecks = this.totalChecks.bind(this);
    this.paginationHtml = this.paginationHtml.bind(this);
    this.judgeSelectHtml = this.judgeSelectHtml.bind(this);
    this.onChangeSelectedJudge = this.onChangeSelectedJudge.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.moveAfterEnterOrSpace = this.moveAfterEnterOrSpace.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.selectedGame !== this.props.selectedGame ||
      nextProps.selectedRound.round !== this.props.selectedRound.round
    ) {
      this.setState({ selectedJudge0idx: 0, selectedPage0idx: 0, selectedCell: [0, 0] });
    }
  }

  onChangeSelectedJudge(e) {
    this.setState({ selectedJudge0idx: Number(e.target.value) });
  }

  // チェック画面でのキーによる操作
  onKeyDown(e) {
    if (Object.keys(this.props.tempGame).length === 0) {
      return;
    }

    const roundData = this.props.tempGame[this.props.selectedRound.style];
    const heats = roundData.heats;
    const judgeNum = roundData.judgeNum;
    const selectedCell = this.state.selectedCell;

    const date = new Date();
    const Qch = 81;
    const Ech = 69;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;
    const BACKSPACE = 8;
    const ENTER = 13;
    const SPACE = 32;

    // prevent default for certain keys
    switch (e.keyCode) {
      case LEFT:
      case RIGHT:
      case DOWN:
      case UP:
      case SPACE:
      case BACKSPACE:
        event.preventDefault();
        break;
      default:
    }

    // 移動とスコア入力で別々のタイマーを用意する
    if ((date.getTime() - this.state.moveTimer) > 80) {
      switch (e.keyCode) {
        case LEFT:
          if (selectedCell[1] > 0) {
            this.setState({ selectedCell: [selectedCell[0], selectedCell[1] - 1] });
          } else {
            this.setState({ selectedCell: [selectedCell[0], heats[selectedCell[0]].length - 1] });
          }

          this.setState({ moveTimer: date.getTime(), hasMoved: true });
          break;

        case RIGHT:
          if (selectedCell[1] < heats[selectedCell[0]].length - 1) {
            this.setState({ selectedCell: [selectedCell[0], selectedCell[1] + 1] });
          } else {
            this.setState({ selectedCell: [selectedCell[0], 0] });
          }

          this.setState({ moveTimer: date.getTime(), hasMoved: true });
          break;

        case UP: {
          let foundNextHeat = false;

          // 0以外の場合上から順位探していく
          if (selectedCell[0] !== 0) {
            for (let i = selectedCell[0] - 1; i >= 0; i--) {
              if (heats[i + (this.state.selectedPage0idx * 10)][selectedCell[1]] !== undefined) {
                this.setState({ selectedCell: [i, selectedCell[1]] });
                foundNextHeat = true;
                break;
              }
            }
          }

          // 無かったら一番下に戻り始める
          if (!foundNextHeat) {
            for (let i = 9; i > selectedCell[0]; i--) {
              if (!heats[i + (this.state.selectedPage0idx * 10)]) {
                continue;
              }
              if (heats[i + (this.state.selectedPage0idx * 10)][selectedCell[1]] !== undefined) {
                this.setState({ selectedCell: [i, selectedCell[1]] });
                break;
              }
            }
          }

          this.setState({ moveTimer: date.getTime(), hasMoved: true });
          break;
        }

        case DOWN: {
          let foundNextHeat = false;

          for (let i = selectedCell[0] + 1; i <= 9; i++) {
            if (!heats[i + (this.state.selectedPage0idx * 10)]) {
              continue;
            }
            if (heats[i + (this.state.selectedPage0idx * 10)][selectedCell[1]] !== undefined) {
              this.setState({ selectedCell: [i, selectedCell[1]] });
              foundNextHeat = true;
              break;
            }
          }

          // 無かったら一番上に戻り始める
          if (!foundNextHeat) {
            for (let i = 0; i < selectedCell[0]; i++) {
              if (heats[i + (this.state.selectedPage0idx * 10)][selectedCell[1]] !== undefined) {
                this.setState({ selectedCell: [i, selectedCell[1]] });
                break;
              }
            }
          }

          this.setState({ moveTimer: date.getTime(), hasMoved: true });
          break;
        }

        case Ech: {
          // 次ページがあるならそこに移動
          if (heats[((this.state.selectedPage0idx + 1) * 10) + 1]) {
            this.setState({ selectedPage0idx: this.state.selectedPage0idx + 1 });
          // 次ジャッジがある場合はそこに移動
          } else if (this.state.selectedJudge0idx < judgeNum - 1) {
            this.setState({
              selectedCell: [0, 0],
              selectedPage0idx: 0,
              selectedJudge0idx: this.state.selectedJudge0idx + 1,
            });
          }

          this.setState({ moveTimer: date.getTime(), hasMoved: true });
          break;
        }

        case Qch: {
          // 前ページがあるならそこに移動
          if (this.state.selectedPage0idx > 0) {
            this.setState({ selectedPage0idx: this.state.selectedPage0idx - 1 });
          // 前ジャッジがある場合はそこに移動
          } else if (this.state.selectedJudge0idx > 0) {
            const finalPage = Math.floor((heats.length - 1) / 10);
            this.setState({
              selectedCell: [0, 0],
              selectedPage0idx: finalPage,
              selectedJudge0idx: this.state.selectedJudge0idx - 1,
            });
          }

          this.setState({ moveTimer: date.getTime(), hasMoved: true });
          break;
        }

        default:
      }
    }

    // 移動とスコア入力で別々のタイマーを用意する
    if ((date.getTime() - this.state.scoreTimer) > 80) {
      // tempGameが存在しなければ処理スキップ
      if (Object.keys(this.props.tempGame).length === 0) {
        return;
      }
      const tempRound = this.props.tempGame[this.props.selectedRound.style];
      const scoringMethod = tempRound.scoringMethod;
      const scores = tempRound.scores;
      const competitorId = heats[selectedCell[0] + (this.state.selectedPage0idx * 10)][selectedCell[1]];

      if (scoringMethod === 'CHECK') {
        switch (e.keyCode) {
          case ENTER: {
            this.props.changeScore(
              competitorId,
              this.state.selectedJudge0idx + 1,
              false,
            );

            // 移動
            this.moveAfterEnterOrSpace(heats, judgeNum);

            this.setState({ scoreTimer: date.getTime() });
            break;
          }
          case SPACE: {
            this.props.changeScore(
              competitorId,
              this.state.selectedJudge0idx + 1,
              true,
            );

            // 移動
            this.moveAfterEnterOrSpace(heats, judgeNum);

            this.setState({ scoreTimer: date.getTime() });
            break;
          }

          default:
        }
      } else if (scoringMethod === 'RANKING') {
        if (e.keyCode > 48 && e.keyCode < 58) {
          if (this.state.hasMoved === true) {
            this.props.changeScore(
              competitorId,
              this.state.selectedJudge0idx + 1,
              e.keyCode - 48,
            );

            this.setState({ hasMoved: false });
          } else if (
            this.state.hasMoved === false &&
            (scores[competitorId][this.state.selectedJudge0idx] * 10) + (e.keyCode - 48) < 16
          ) {
            this.props.changeScore(
              competitorId,
              this.state.selectedJudge0idx + 1,
              (scores[competitorId][this.state.selectedJudge0idx] * 10) + (e.keyCode - 48),
            );
          }
        } else if (e.keyCode === ENTER || e.keyCode === SPACE) {
          this.moveAfterEnterOrSpace(heats, judgeNum);

          this.setState({ scoreTimer: date.getTime(), hasMoved: true });
        } else if (e.keyCode === BACKSPACE) {
          this.props.changeScore(
            competitorId,
            this.state.selectedJudge0idx + 1,
            false,
          );

          this.setState({ hasMoved: true });
        }
      }
    }
  }

  tableBodyHtml() {
    // ここでエラーチェックを済ます
    if (Object.keys(this.props.tempGame).length === 0) {
      return [];
    }

    const tempRound = this.props.tempGame[this.props.selectedRound.style];
    const heats = tempRound.heats;
    const retHtml = [];

    let lastHeatIndex = 0;
    if (heats.length < (this.state.selectedPage0idx + 1) * 10) {
      lastHeatIndex = heats.length;
    } else {
      lastHeatIndex = (this.state.selectedPage0idx + 1) * 10;
    }

    for (let i = 10 * this.state.selectedPage0idx; i < lastHeatIndex; i++) {
      const [headerHtml, bodyHtml] = this.rowHtml(i);
      // 6列を超える場合はセパレーターを入れる
      if (i === (10 * this.state.selectedPage0idx) + 5) {
        const emptyTds = [];
        for (let j = 0; j < 29; j++) {
          emptyTds.push(<td style={{ borderTopWidth: '2px', borderBottomWidth: '2px' }}></td>);
        }
        retHtml.push(
          <tr key={'separator'}>
            {emptyTds}
          </tr>,
        );
      }
      // 以下ヒートの列を加える処理
      retHtml.push(
        <tr key={`header, row${i}`}>
          {headerHtml}
        </tr>,
        <tr key={`body, row${i}`}>
          {bodyHtml}
        </tr>,
      );
    }

    return retHtml;
  }

  rowHtml(heatNumber0idx) {
    const tempRound = this.props.tempGame[this.props.selectedRound.style];
    const heats = tempRound.heats;
    const scores = tempRound.scores;

    const headerHtml = heats[heatNumber0idx].map(competitorId => (
      <td key={competitorId} style={{ textAlign: 'center', padding: '0', height: '1rem', fontSize: '11pt' }}>
        {this.props.competitors[competitorId].number}
      </td>
    ));
    headerHtml.unshift(<td key={`heat${heatNumber0idx}, empty,head`}></td>);
    for (let i = 0; headerHtml.length <= 28; i++) {
      headerHtml.push(<td key={`heat${heatNumber0idx}, empty, ${i}`}></td>);
    }

    const bodyHtml = [];
    bodyHtml.push(
      <td key={`heat${heatNumber0idx}`} style={{ padding: '0', textAlign: 'center', fontSize: '12pt' }}>
        <p>{Number(heatNumber0idx) + 1}</p>
        <p style={{ fontSize: '5pt' }}>ヒート</p>
      </td>,
    );

    heats[heatNumber0idx].forEach((competitorId, index) => {
      const thisCellRow = heatNumber0idx - (this.state.selectedPage0idx * 10);
      const isActive =
        (thisCellRow === this.state.selectedCell[0]) &&
        (index === this.state.selectedCell[1]) ? 'active' : '';
      const score = scores[competitorId][this.state.selectedJudge0idx];
      let rightBorderColor = 'hsl(0, 0%, 86%)';
      let rightBorderWidth = '1px';
      if (index === heats[heatNumber0idx].length - 1) {
        rightBorderColor = 'hsl(171, 100%, 41%)';
        rightBorderWidth = '2px';
      }

      if (tempRound.scoringMethod === 'CHECK') {
        const onClick = () => {
          this.props.changeScore(competitorId, this.state.selectedJudge0idx + 1, !score);
          this.setState({ selectedCell: [thisCellRow, index] });
        };

        if (score) {
          bodyHtml.push(
            <td
              className={isActive}
              onClick={onClick}
              key={competitorId}
              style={{ borderRightColor: rightBorderColor, borderRightWidth: rightBorderWidth }}
            >
              <span className="icon" style={{ color: 'hsl(171, 100%, 41%)' }}>
                <i className="fa fa-check" />
              </span>
            </td>,
          );
        } else {
          bodyHtml.push(
            <td
              className={isActive}
              onClick={onClick}
              key={competitorId}
              style={{ borderRightColor: rightBorderColor, borderRightWidth: rightBorderWidth }}
            ></td>,
          );
        }
      } else if (tempRound.scoringMethod === 'RANKING') {
        const onClick = () => {
          this.setState({ selectedCell: [thisCellRow, index], hasMoved: true });
        };

        if (score) {
          bodyHtml.push(
            <td
              className={isActive}
              onClick={onClick}
              key={competitorId}
              style={{
                fontSize: '13pt',
                textAlign: 'center',
                verticalAlign: 'middle',
                borderRightColor: rightBorderColor,
                borderRightWidth: rightBorderWidth,
              }}
            >
              {score}
            </td>,
          );
        } else {
          bodyHtml.push(
            <td
              className={isActive}
              onClick={onClick}
              key={competitorId}
              style={{ borderRightColor: rightBorderColor, borderRightWidth: rightBorderWidth }}
            ></td>,
          );
        }
      }
    });

    for (let i = 0; bodyHtml.length <= 28; i++) {
      bodyHtml.push(<td key={`heat${heatNumber0idx}, ${i}`}></td>);
    }

    return [headerHtml, bodyHtml];
  }

  judgeSelectHtml() {
    // エラー回避
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (Object.keys(this.props.tempGame).length === 0) {
      return [];
    }

    const tempRound = this.props.tempGame[this.props.selectedRound.style];
    const judgeNum = tempRound.judgeNum;

    const retHtml = [];
    for (let i = 0; i < judgeNum; i++) {
      retHtml.push(
        <option value={i} key={i}>
          {alphabet[i]}
        </option>,
      );
    }

    return retHtml;
  }

  paginationHtml() {
    // エラー回避
    if (Object.keys(this.props.tempGame).length === 0) {
      return [];
    }

    const tempRound = this.props.tempGame[this.props.selectedRound.style];
    const heats = tempRound.heats;
    const numOfPages = Math.floor((heats.length - 1) / 10) + 1;
    const retHtml = [];

    for (let i = 0; i < numOfPages; i++) {
      const isCurrent = this.state.selectedPage0idx === i ? 'is-current' : '';
      const onClickTab = () => {
        this.setState({ selectedPage0idx: i, selectedCell: [0, 0] });
      };

      let fontColor;
      if (isCurrent) {
        fontColor = '#fff';
      } else {
        fontColor = 'hsl(171, 100%, 41%)';
      }

      retHtml.push(
        <li
          className={`pagination-link ${isCurrent}`}
          key={i}
        ><a
          onClick={onClickTab}
          style={{ color: fontColor }}
        >{i + 1}</a></li>,
      );
    }

    return retHtml;
  }

  totalChecks(judge0idx) {
    if (Object.keys(this.props.tempGame).length === 0) {
      return 0;
    }

    const scores = this.props.tempGame[this.props.selectedRound.style].scores;
    let totalNum = 0;

    Object.keys(scores).forEach((number) => {
      if (scores[number][judge0idx]) {
        totalNum += 1;
      }
    });

    return totalNum;
  }

  moveAfterEnterOrSpace(heats, judgeNum) {
    const selectedCell = this.state.selectedCell;

    if (selectedCell[1] === heats[selectedCell[0] + (this.state.selectedPage0idx * 10)].length - 1) {
      // 次のヒートがあるなら次のヒートに進む
      if (heats[(this.state.selectedPage0idx * 10) + selectedCell[0] + 1]) {
        if (selectedCell[0] === 9) {
          this.setState({
            selectedPage0idx: this.state.selectedPage0idx + 1,
            selectedCell: [0, 0],
          });
        } else {
          this.setState({ selectedCell: [selectedCell[0] + 1, 0] });
        }
      } else if (this.state.selectedJudge0idx < judgeNum - 1) {
        this.setState({
          selectedPage0idx: 0,
          selectedCell: [0, 0],
          selectedJudge0idx: this.state.selectedJudge0idx + 1,
        });
      }
    } else {
      this.setState({ selectedCell: [selectedCell[0], selectedCell[1] + 1] });
    }
  }


  render() {
    return (
      <div
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        onKeyDown={this.onKeyDown}
        tabIndex="0"
      >
        <div style={{ flex: '0 0 auto', display: 'flex' }}>
          <div style={{ flex: '1 1 0', display: 'flex', verticalAlign: 'middle' }}>
            <span className="select is-medium" onChange={this.onChangeSelectedJudge}>
              <select value={this.state.selectedJudge0idx}>
                {this.judgeSelectHtml()}
              </select>
            </span>
            <nav className="pagination" style={{ marginLeft: '20px' }}>
              <ul>
                {this.paginationHtml()}
              </ul>
            </nav>
          </div>
          <div style={{ flex: '1 1 0' }}>
            <p style={{ fontSize: '14pt', marginRight: '3rem', lineHeight: '3rem', width: '100%', textAlign: 'center' }}>
              {`合計: ${this.totalChecks(this.state.selectedJudge0idx)}`}
            </p>
          </div>
          <div style={{ flex: '1 1 auto' }}></div>
        </div>

        <div style={{ overflow: 'auto', flex: '1 1 0', justifyContent: 'space-around' }}>
          <table style={{ tableLayout: 'fixed', width: '99%' }} className="table is-striped is-bordered is-narrow">
            <thead>
              <tr>

              </tr>
            </thead>
            <tbody>
              {this.tableBodyHtml()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
export default ScoreTableJudge;
