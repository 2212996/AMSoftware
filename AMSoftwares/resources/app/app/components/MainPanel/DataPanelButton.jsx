import React from 'react';
import VisibleDataPanel from '../../containers/VisibleDataPanel';

class DataPanelButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOn: '',
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    this.setState({ isModalOn: 'is-active' });
  }

  render() {
    return (
      <div>
        <button
          className="button is-primary"
          onClick={this.onClick}
        >
          選手一覧
        </button>

        <div className={`modal ${this.state.isModalOn}`}>
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="box" style={{ display: 'flex', flexDirection: 'column', height: '700px' }}>
              <VisibleDataPanel />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DataPanelButton;
