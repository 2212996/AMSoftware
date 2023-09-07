import * as fs from 'fs';

// HELPERS
//--------------------------------------------------
function writeToFile(jsonData, path) {
  fs.writeFile(path, JSON.stringify(jsonData), (err) => {
    if (err) {
      return false;
    }
    return true;
  });
}

function readFile(path) {
  try {
    const data = fs.readFileSync(path, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) {
      return false;
    }
    return true;
  });
}

function fileStrings(gameId, roundKey) {
  let gameString = '';
  let roundString = '';
  if (Number(gameId) < 10) {
    gameString = `00${gameId}`;
  } else if (Number(gameId) < 100) {
    gameString = `0${gameId}`;
  } else {
    gameString = gameId;
  }
  if (Number(roundKey) < 10) {
    roundString = `00${roundKey}`;
  } else if (Number(roundKey) < 100) {
    roundString = `0${roundKey}`;
  } else {
    roundString = roundKey;
  }
  return [gameString, roundString];
}

function roundPath(backupPath, gameId, roundKey) {
  const [gameString, roundString] = fileStrings(gameId, roundKey);
  return `${backupPath}/round_${gameString}_${roundString}.dmr`;
}

function scorePath(backupPath, gameId, roundKey) {
  const [gameString, roundString] = fileStrings(gameId, roundKey);
  return `${backupPath}/score_${gameString}_${roundString}.dms`;
}

// EXPORTS
//--------------------------------------------------
// Rounds
export function readRound(backupPath, gameId, roundKey) {
  const filePath = roundPath(backupPath, gameId, roundKey);
  return readFile(filePath);
}

export function readAllRounds(backupPath, gameData, gameId) {
  const allRounds = {};
  Object.keys(gameData[gameId].options.rounds).forEach((roundKey) => {
    const filePath = roundPath(backupPath, gameId, roundKey);
    allRounds[roundKey] = readFile(filePath);
  });

  [200, 201, 103].forEach((roundKey) => {
    const filePath = roundPath(backupPath, gameId, roundKey);
    const roundData = readFile(filePath);
    if (roundData) {
      allRounds[roundKey] = roundData;
    }
  });

  return allRounds;
}

export function writeRound(roundData, backupPath, gameId, roundKey) {
  const filePath = roundPath(backupPath, gameId, roundKey);
  return writeToFile(roundData, filePath);
}

export function deleteRound(backupPath, gameId, roundKey) {
  const filePath = roundPath(backupPath, gameId, roundKey);
  return deleteFile(filePath);
}

// Scores
export function readScore(backupPath, gameId, roundKey) {
  const filePath = scorePath(backupPath, gameId, roundKey);
  return readFile(filePath);
}

export function readAllScores(backupPath, gameData, gameId) {
  const allScores = {};
  Object.keys(gameData[gameId].options.rounds).forEach((roundKey) => {
    const filePath = scorePath(backupPath, gameId, roundKey);
    allScores[Number(roundKey)] = readFile(filePath);
  });

  [200, 201].forEach((roundKey) => {
    const filePath = scorePath(backupPath, gameId, roundKey);
    const roundData = readFile(filePath);
    if (roundData) {
      allScores[roundKey] = roundData;
    }
  });

  return allScores;
}

export function writeScore(scoreData, backupPath, gameId, roundKey) {
  const filePath = scorePath(backupPath, gameId, roundKey);
  return writeToFile(scoreData, filePath);
}

export function deleteScore(backupPath, gameId, roundKey) {
  const filePath = scorePath(backupPath, gameId, roundKey);
  return deleteFile(filePath);
}

export function createRound(gameId, roundKey, judgeNum, scoringMethod, heats,
  upNum, styles, backupPath, postPonedPlayers) {
  const heatsCompetitors = heats.reduce((result, heat) => (
    result.concat(heat)
  ), []);

  const newScores = {};
  heatsCompetitors.forEach((competitor) => {
    newScores[competitor] = [];
    for (let i = 0; i < judgeNum; i++) {
      newScores[competitor].push(false);
    }
  });

  const newRound = {
    judgeNum,
    scoringMethod,
    upNum,
    heats,
    scores: newScores,
  };

  // optional argument
  if (postPonedPlayers) {
    newRound.postPonedPlayers = postPonedPlayers;
  }

  const roundFileData = {};
  styles.forEach((style) => {
    roundFileData[style] = newRound;
  });

  return writeRound(roundFileData, backupPath, gameId, roundKey);
}
