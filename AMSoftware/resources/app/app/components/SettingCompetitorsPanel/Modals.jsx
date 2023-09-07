import React from 'react';
import { modifyArray } from '../common/utils';

// Helpers
//--------------------------------------------------
const initInputVals = [];
for (let i = 0; i < 12; i++) {
  initInputVals.push('');
}
//--------------------------------------------------

class Modals extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputVals: initInputVals,
      isModalOn: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onClickAdd = this.onClickAdd.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.onClickTurnOnModal = this.onClickTurnOnModal.bind(this);
    this.setInputVals = this.setInputVals.bind(this);
    this.isAddButtonDisabled = this.isAddButtonDisabled.bind(this);
    this.isAddModalOn = this.isAddModalOn.bind(this);
  }

  onChange(num) {
    return (e) => {
      if (num === 1) {
        if (!isNaN(e.target.value) && e.target.value.slice(-1) !== '.') {
          this.setInputVals(num, e.target.value);
        }
      } else if (num === 11) {
        if (!isNaN(e.target.value) && e.target.value.slice(-1) !== '.' &&
        Number(e.target.value) <= 2) {
          this.setInputVals(num, e.target.value);
        }
      } else {
        this.setInputVals(num, e.target.value);
      }
    };
  }

  onClickAdd() {
    if (!this.isAddButtonDisabled()) {
      // シード未記入でバグが発生したのでとりあえず応急措置
      let seed = 0;
      // 数字に変換出来たらseedに代入
      if (!isNaN(this.state.inputVals[11])) {
        seed = Number(this.state.inputVals[11]);
      }

      const data = {
        id: Object.keys(this.props.competitors).length + 1,
        number: this.state.inputVals[1],
        leaderName: this.state.inputVals[2],
        leaderKana: this.state.inputVals[3],
        leaderRegi: this.state.inputVals[4],
        partnerName: this.state.inputVals[5],
        partnerKana: this.state.inputVals[6],
        partnerRegi: this.state.inputVals[7],
        group: this.state.inputVals[8],
        seed,
      };

      this.props.addCompetitor(data);

      this.setState({ inputVals: initInputVals });

      this.setState({ isModalOn: false });
    }
  }

  onClickCancel() {
    this.setState({ isModalOn: false });
  }

  onClickTurnOnModal() {
    this.setState({ isModalOn: true });
  }

  setInputVals(index, newVal) {
    this.setState({ inputVals: modifyArray(this.state.inputVals, index, newVal) });
  }

  isAddButtonDisabled() {
    let ret = false;
    for (let i = 1; i <= 11 && ret === ''; i++) {
      if (!this.state.inputVals[i].trim()) {
        ret = true;
      }
    }
    return ret;
  }

  isAddModalOn() {
    return this.state.isModalOn === true ? ' is-active' : '';
  }

  renderEditHtml() {
    return (
      <div>
        <div style={{ display: 'flex' }} key="settingCompetitorsPanelModalCompDown">
          <div style={{ flex: '1 1 auto', marginRight: '10px' }}>
            <label className="label">リーダー氏名</label>
            <input value={this.state.inputVals[2]} type="text" className="input" onChange={this.onChange(2)} />
            <label className="label">リーダーフリガナ</label>
            <input value={this.state.inputVals[3]} type="text" className="input" onChange={this.onChange(3)} />
            <label className="label">リーダー登録</label>
            <input value={this.state.inputVals[4]} type="text" className="input" onChange={this.onChange(4)} />
          </div>
          <div style={{ flex: '1 1 auto' }}>
            <label className="label">パートナー氏名</label>
            <input value={this.state.inputVals[5]} type="text" className="input" onChange={this.onChange(5)} />
            <label className="label">パートナーフリガナ</label>
            <input value={this.state.inputVals[6]} type="text" className="input" onChange={this.onChange(6)} />
            <label className="label">パートナー登録</label>
            <input value={this.state.inputVals[7]} type="text" className="input" onChange={this.onChange(7)} />
          </div>
        </div>
        <div style={{ width: '100%' }}>
          <label className="label">所属</label>
          <input value={this.state.inputVals[8]} type="text" className="input" onChange={this.onChange(8)} />
        </div>
      </div>
    );
  }


  render() {
    return (
      <div>
        <div style={{ display: 'flex', flex: '0 0 auto' }}>
          <div style={{ flex: '1 1 auto' }} />

          <div className="control is-grouped">
            <p className="control">
              <a
                className="button is-primary"
                onClick={this.onClickTurnOnModal}
              >追加</a>
            </p>

          </div>
        </div>

        <div className={`modal${this.isAddModalOn()}`}>
          <div className="modal-background"></div>

          <div className="modal-card">
            <header className="modal-card-head">
              <h2 className="subtitle">選手追加</h2>
            </header>

            <div className="modal-card-body">
              <div className="control is-horizontal" key="settingCompetitorsPanelModalUp">
                <div className="control-label">
                  <label className="label">背番号</label>
                </div>
                <div className="control">
                  <input value={this.state.inputVals[1]} type="text" className="input" onChange={this.onChange(1)} />
                </div>

                <div className="control-label">
                  <label className="label">シード</label>
                </div>
                <div className="control">
                  <input
                    value={this.state.inputVals[11]}
                    type="text"
                    className="input"
                    onChange={this.onChange(11)}
                    placeholder="0～2"
                  />
                </div>
              </div>
              {this.renderEditHtml()}
            </div>

            <footer className="modal-card-foot">
              <a
                className="button is-primary"
                onClick={this.onClickAdd}
                disabled={this.isAddButtonDisabled()}
              >追加</a>
              <a className="button" onClick={this.onClickCancel}>キャンセル</a>
            </footer>
          </div>
        </div>
      </div>
    );
  }
}

export default Modals;
