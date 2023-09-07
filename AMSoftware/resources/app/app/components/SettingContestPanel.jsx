import React from 'react';

// Component
//--------------------------------------------------
const SettingContestPanel = ({ contestData, editContest, selectedGameType, selectGameType }) => {
  const onChangeName = (e) => {
    editContest('name', e.target.value);
  };
  const onChangeDate = (e) => {
    editContest('date', e.target.value);
  };
  const onChangeStage = (e) => {
    editContest('stage', e.target.value);
  };
  const onChangeGameType = (e) => {
    selectGameType(e.target.value);
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div className="box" style={{ flex: '1 1 auto', margin: '3px', height: '100%' }}>
        <label className="label">大会名称</label>
        <p className="control">
          <input
            type="text"
            className="input"
            value={contestData.name}
            onChange={onChangeName}
          />
        </p>
        <label className="label">開催日付</label>
        <p className="control">
          <input
            type="text"
            className="input"
            placeholder="例:平成28年12月31日"
            value={contestData.date}
            onChange={onChangeDate}
          />
          <span className="help">例:平成28年12月31日</span>
        </p>
        <label className="label">会場</label>
        <p className="control">
          <input
            type="text"
            className="input"
            value={contestData.stage}
            onChange={onChangeStage}
          />
        </p>
        <label className="label">単科・総合</label>
        <p className="control">
          <span className="select">
            <select value={selectedGameType} onChange={onChangeGameType}>
              <option value={'SINGLE'}>
                単科
              </option>
              <option value={'TOTAL'}>
                総合
              </option>
            </select>
          </span>
        </p>
      </div>
    </div>
  );
};

export default SettingContestPanel;
