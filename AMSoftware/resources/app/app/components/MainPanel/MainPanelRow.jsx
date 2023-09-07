import React from 'react';

const MainPanelRow = ({ competitor, heat, number, score, isLastInHeat, finalScores,
  selectedCell, selectCell, changeScore, scoringMethod }) => {
  let count = 0;
  let borderColor;
  if (isLastInHeat) {
    borderColor = 'hsl(171, 100%, 41%)';
  } else {
    borderColor = '#dbdbdb';
  }


  const scoreHtml = score.map((check, index) => {
    let isActive = ''; // アクティブな場合背景が少し濃くなる
    if (selectedCell.row === competitor && selectedCell.col === index + 1) {
      isActive = ' active';
    }

    const onClick = () => {
      if (scoringMethod === 'CHECK') {
        changeScore(competitor, index + 1, !score[index]);
      }
      selectCell(competitor, index + 1);
    };

    // 以下activeかどうかで分岐して描画する
    if (scoringMethod === 'CHECK') {
      if (check) {
        count += 1; // used to get the number of checks
        return (
          <td
            className={`${isActive}`}
            onClick={onClick}
            key={index}
            style={{ width: '2rem', padding: '0.25rem', borderBottomColor: borderColor }}
            ref={(el) => { if (el && isActive) { el.scrollIntoView(false); } }}
          >
            <a><i className="fa fa-check" /></a>
          </td>
        );
      }
    } else if (scoringMethod === 'RANKING') {
      if (typeof (check) === 'number' && check >= 1) {
        return (
          <td
            className={`${isActive}`}
            onClick={onClick}
            key={index}
            style={{ width: '2rem', borderBottomColor: borderColor }}
            ref={(el) => { if (el && isActive) { el.scrollIntoView(false); } }}
          >{check}</td>
        );
      }
    }
    return (
      <td
        className={`${isActive}`}
        onClick={onClick}
        key={index}
        style={{ width: '2rem', borderBottomColor: borderColor }}
        ref={(el) => { if (el && isActive) { el.scrollIntoView(false); } }}
      />
    );
  });

  const didPassHtml = () => {
    if (!finalScores) {
      return null;
    }
    if (Object.keys(finalScores).length === 0) {
      return null;
    }

    if (!finalScores.competitors || !finalScores.competitors[competitor]) {
      return null;
    }
    if (finalScores.competitors[competitor].score >= finalScores.bottomScore) {
      return (
        <a><i className="fa fa-check-circle-o"></i></a>
      );
    }
    return null;
  };

  return (
    <tr>
      <td style={{ borderBottomColor: borderColor }}>{ heat }</td>
      <td style={{ borderBottomColor: borderColor }}>{ number }</td>
      { scoreHtml }
      <td style={{ borderBottomColor: borderColor }}>{ count }</td>
      <td style={{ borderBottomColor: borderColor }}>{didPassHtml()}</td>
    </tr>
  );
};

// MainPanelRow.propTypes = {
//   heat: PropTypes.number.isRequired,
//   number: PropTypes.number.isRequired,
//   score: PropTypes.arrayOf(PropTypes.bool.isRequired).isRequired,
// };

export default MainPanelRow;
