// CONSTANTS
//--------------------------------------------------
export const stylesArray = ['WALTZ', 'TANGO', 'FOX', 'QUICK', 'VIENNESE',
  'CHA', 'SAMBA', 'RUMBA', 'PASO', 'JIVE'];

export const alphabetArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// FUNCTIONS
//--------------------------------------------------
export function modifyArray(array, index, newVal) {
  const newArray = array.slice();
  newArray[index] = newVal;
  return newArray;
}

export function compareArray(a, b) {
  // emptyが関与している場合。これは直してもいいかも
  if (!a && !b) {
    return true;
  }
  if (!a || !b) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

// gets deep nested properties safely
export function deepGet(obj, properties) {
  if (obj === undefined || obj === null) {
    return undefined;
  }

  if (properties.length === 0) {
    return obj;
  }

  const nextObj = obj[properties[0]];
  const remainingProperties = properties.slice(1);

  return deepGet(nextObj, remainingProperties);
}

export function fileStrings(gameId, roundKey) {
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

export function roundNameString(roundKey) {
  const roundNum = Number(roundKey);
  if (roundNum < 100) {
    return (`${roundKey}次予選`);
  } else if (roundNum === 101) {
    return ('準決勝');
  } else if (roundNum === 102) {
    return ('決勝');
  } else if (roundNum === 103) {
    return ('下位決勝');
  } else if (roundNum === 200) {
    return ('同点決勝(準決)');
  } else if (roundNum === 201) {
    return ('同点決勝');
  }
  return ('不正な値');
}
