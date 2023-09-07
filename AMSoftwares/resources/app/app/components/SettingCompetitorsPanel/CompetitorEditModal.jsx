import React from 'react';
import { modifyArray } from '../common/utils';

// Helpers
//--------------------------------------------------
const initInputVals = [];
for (let i = 0; i < 10; i++) {
  initInputVals.push('');
}

//--------------------------------------------------
class CompetitorsEditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOn: false,
      inputVals: initInputVals,
    };

    this.onClickChange = this.onClickChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setInputVals = this.setInputVals.bind(this);
    this.isChangeButtonDisabled = this.isChangeButtonDisabled.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.comp) {
      this.setState({
        inputVals: [
          nextProps.id,
          nextProps.comp.number.toString(),
          nextProps.comp.leaderName,
          nextProps.comp.leaderKana,
          nextProps.comp.leaderRegi,
          nextProps.comp.partnerName,
          nextProps.comp.partnerKana,
          nextProps.comp.partnerRegi,
          nextProps.comp.group,
          nextProps.comp.seed.toString(),
        ],
      });
    }
  }

  onClickChange() {
    if (!this.isChangeButtonDisabled()) {
      if (this.state.inputVals[1] && this.state.inputVals[1].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'number', Number(this.state.inputVals[1]));
      }
      if (this.state.inputVals[2] && this.state.inputVals[2].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'leaderName', this.state.inputVals[2]);
      }
      if (this.state.inputVals[3] && this.state.inputVals[3].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'leaderKana', this.state.inputVals[3]);
      }
      if (this.state.inputVals[4] && this.state.inputVals[4].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'leaderRegi', this.state.inputVals[4]);
      }
      if (this.state.inputVals[5] && this.state.inputVals[5].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'partnerName', this.state.inputVals[5]);
      }
      if (this.state.inputVals[6] && this.state.inputVals[6].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'partnerKana', this.state.inputVals[6]);
      }
      if (this.state.inputVals[7] && this.state.inputVals[7].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'partnerRegi', this.state.inputVals[7]);
      }
      if (this.state.inputVals[8] && this.state.inputVals[8].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'group', this.state.inputVals[8]);
      }
      if (this.state.inputVals[9] && this.state.inputVals[9].trim()) {
        this.props.changeCompetitorField(this.state.inputVals[0], 'seed', Number(this.state.inputVals[9]));
      }

      this.props.writeState(`${this.props.backupPath}/contest.dme`);
      this.props.onClickCancel();
    }
  }

  onChange(num) {
    return (e) => {
      if (num === 1) {
        if (!isNaN(e.target.value) && e.target.value.slice(-1) !== '.') {
          this.setInputVals(num, e.target.value);
        }
      } else if (num === 9) {
        if (!isNaN(e.target.value) && e.target.value.slice(-1) !== '.' &&
        Number(e.target.value) <= 2) {
          this.setInputVals(num, e.target.value);
        }
      } else if (num === 0) {
        if (!isNaN(e.target.value) && e.target.value.slice(-1) !== '.' &&
        this.props.competitors[Number(e.target.value)]) {
          this.setInputVals(num, e.target.value);
        } else if (e.target.value === '') {
          this.setInputVals(num, '');
        }
      } else {
        this.setInputVals(num, e.target.value);
      }
    };
  }

  setInputVals(index, newVal) {
    this.setState({ inputVals: modifyArray(this.state.inputVals, index, newVal) });
  }

  isChangeButtonDisabled() {
    return this.state.inputVals[0].trim() === '';
  }

  render() {
    return (
      <div className={`modal${this.props.isModalOn ? ' is-active' : ''}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <h2 className="subtitle">選手編集</h2>
          </header>
          <div className="modal-card-body">
            <div className="control is-horizontal" key="settingCompetitorsPanelModalUp">
              <div className="control-label">
                <label className="label" style={{ width: '48px' }}>背番号</label>
              </div>
              <div className="control">
                <input value={this.state.inputVals[1]} type="text" className="input" onChange={this.onChange(1)} />
              </div>
              <div className="control-label">
                <label className="label" style={{ width: '48px' }} >シード</label>
              </div>
              <div className="control">
                <input
                  value={this.state.inputVals[9]}
                  type="text"
                  className="input"
                  onChange={this.onChange(9)}
                  placeholder="0～2"
                />
              </div>
            </div>
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
          </div>
          <footer className="modal-card-foot">
            <a
              className="button is-primary"
              onClick={this.onClickChange}
              disabled={this.isChangeButtonDisabled()}
            >編集</a>
            <a className="button" onClick={this.props.onClickCancel}>キャンセル</a>
          </footer>
        </div>
      </div>
    );
  }
}

export default CompetitorsEditModal;
