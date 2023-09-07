import React from 'react';
import CompetitorsEditModal from '../../containers/SettingCompetitorsPanel/VisibleCompetitorsEditModal';

class CompetitorsDataTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOn: false,
      currentId: undefined,
      currentComp: undefined,
    };

    this.onClickCompetitorDataRow = this.onClickCompetitorDataRow.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
    this.bodyHtml = this.bodyHtml.bind(this);
  }

  onClickCompetitorDataRow(id) {
    return () => {
      const comp = this.props.competitors[id];

      this.setState({
        isModalOn: true,
        currentComp: comp,
        currentId: id,
      });
    };
  }

  onClickCancel() {
    this.setState({ isModalOn: false });
  }

  bodyHtml() {
    return Object.keys(this.props.competitors).sort((a, b) => {
      if (Number(this.props.competitors[a].number) < Number(this.props.competitors[b].number)) {
        return -1;
      }
      return 1;
    }).map((id) => {
      const comp = this.props.competitors[id];
      return (
        <tr key={`settingCompetitorsPanelRow${id}`} onClick={this.onClickCompetitorDataRow(id)}>
          <td key={`settingCompetitorsPanelNum${id}`}>{comp.number}</td>
          <td key={`settingCompetitorsPanelLName${id}`}>{comp.leaderName}</td>
          <td key={`settingCompetitorsPanelLKana${id}`}>{comp.leaderKana}</td>
          <td key={`settingCompetitorsPanelLRegi${id}`}>{comp.leaderRegi}</td>
          <td key={`settingCompetitorsPanelPName${id}`}>{comp.partnerName}</td>
          <td key={`settingCompetitorsPanelPKana${id}`}>{comp.partnerKana}</td>
          <td key={`settingCompetitorsPanelPRegi${id}`}>{comp.partnerRegi}</td>
          <td key={`settingCompetitorsPanelGroup${id}`}>{comp.group}</td>
          <td key={`settingCompetitorsPanelSeed${id}`}>{comp.seed}</td>
        </tr>
      );
    });
  }

  render() {
    const headersHtml = (
      <tr>
        <th style={{ width: '4rem' }}>背番</th>
        <th style={{ width: '10rem' }}>リーダー</th>
        <th style={{ width: '10rem' }}>フリガナ</th>
        <th style={{ width: '10rem' }}>登録大学</th>
        <th style={{ width: '10rem' }}>パートナー</th>
        <th style={{ width: '10rem' }}>フリガナ</th>
        <th style={{ width: '10rem' }}>登録大学</th>
        <th style={{ width: '12rem' }}>所属</th>
        <th style={{ width: '1.5rem' }}><abbr title="シード">S</abbr></th>
      </tr>
    );

    return (
      <div>
        <table style={{ tableLayout: 'fixed' }} className="table is-narrow is-striped is-bordered">
          <thead>
            { headersHtml }
          </thead>
          <tbody>
            { this.bodyHtml() }
          </tbody>
          <tfoot>
            { headersHtml }
          </tfoot>
        </table>

        <CompetitorsEditModal
          isModalOn={this.state.isModalOn}
          id={this.state.currentId}
          comp={this.state.currentComp}
          onClickCancel={this.onClickCancel}
        />
      </div>
    );
  }
}

export default CompetitorsDataTable;
