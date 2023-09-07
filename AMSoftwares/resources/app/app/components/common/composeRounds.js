import { remote } from 'electron';

const dialog = remote.dialog;


function minMax(a) {
  let min = a[0];
  let max = a[0];
  if (a.length === 1) {
    return [min, max];
  }
  for (let i = 1; i < a.length; i++) {
    if (a[i] > max) {
      max = a[i];
    }
    if (a[i] < min) {
      min = a[i];
    }
  }
  return [min, max];
}

function createGroupLengths(competitorGroups) { // 長さ順のソートまでやってくれる
  const tGroupsLength = []; // [[group, length]]
  Object.keys(competitorGroups).forEach((group) => { // tGroupsLength生成
    tGroupsLength.push([group, competitorGroups[group].length]);
  });
  tGroupsLength.sort((a, b) => { // 出場数が多い順にグループをソート
    if (a[1] > b[1]) {
      return -1;
    }
    if (a[1] < b[1]) {
      return 1;
    }
    return 0;
  });
  return tGroupsLength;
}

export function createHeatsNewStandard(tCompetitors, roundKey, roundsOptions, competitors) {
  // ヒート数を取得する
  let newHeatNumber = 1;
  if (roundKey < 101) {
    newHeatNumber = roundsOptions[roundKey].heats;
  }


  // ここに大学ごとの各ヒートの人数が保存される
  const numPerGroup = {};

  // 大学ごとに選手を分ける
  const competitorsByGroup = {};
  tCompetitors.forEach((c) => {
    const tGroup = competitors[c].group;
    if (competitorsByGroup[tGroup]) {
      competitorsByGroup[tGroup].push(c);
    } else {
      competitorsByGroup[tGroup] = [c];
      // numPerGroupにもgroupを追加
      numPerGroup[tGroup] = [];
    }
  });

  // ここに新しいヒートを作成する
  const newHeats = [];
  // ここにシードの各ヒートの人数が保存される
  const numPerSeeds = { 0: [], 1: [], 2: [] };
  // ヒート数分の配列をnewHeats,numPerGroup,numPerSeedsに用意する。
  for (let i = 0; i < newHeatNumber; i++) {
    newHeats[i] = [];
    Object.keys(numPerGroup).forEach((group) => {
      numPerGroup[group][i] = 0;
    });
    Object.keys(numPerSeeds).forEach((seed) => {
      numPerSeeds[seed][i] = 0;
    });
  }

  // 大学ごとに選手を振り分けていく。同時にどこに何人どの大学、どのシードの人がいるかのデータもとる。
  let heatIndex = 0;
  Object.keys(competitorsByGroup).forEach((group) => {
    competitorsByGroup[group].forEach((c) => {
      newHeats[heatIndex].push(c);
      numPerGroup[group][heatIndex] += 1;
      numPerSeeds[competitors[c].seed][heatIndex] += 1;

      // heatIndexをすすめる
      if (heatIndex === newHeatNumber - 1) {
        heatIndex = 0;
      } else {
        heatIndex += 1;
      }
    });
  });

  // シードを考慮した入れ替えを行う
  for (let currentSeed = 1; currentSeed <= 2; currentSeed++) {
    // 入れ替えが必要かどうかの確認
    const [minSeedNum, maxSeedNum] = minMax(numPerSeeds[currentSeed]);
    if (maxSeedNum - minSeedNum > 1) {
      // シードの人数ごとにヒートを仕分け
      const heatsBySeedNum = {};
      for (let i = 0; i <= maxSeedNum; i++) {
        heatsBySeedNum[i] = [];
      }
      numPerSeeds[currentSeed].forEach((seedNum, heatNumber) => {
        heatsBySeedNum[seedNum].push(heatNumber);
      });

      // 大きい人数を持つヒートから小さい人数をもつヒートに順に交換できる人がいないか走査していく
      for (let seedNumIndex = maxSeedNum; seedNumIndex > 1; seedNumIndex--) { // なおここではseedNumIndex > 2から開始する
        [...heatsBySeedNum[seedNumIndex]].forEach((bigHeat, bigHeatIndex) => {
          let validSmallCompetitor;
          let validSmallHeat;
          let smallSeedNumIndex;
          const validBigCompetitor = newHeats[bigHeat].find((bigCompetitor) => {
            // 処理中のシードを持っていなかったら交換する対象にはなりえない
            if (competitors[bigCompetitor].seed !== currentSeed) {
              return false;
            }
            // 今度は交換する相手を探す
            for (smallSeedNumIndex = minSeedNum; smallSeedNumIndex < seedNumIndex - 1; smallSeedNumIndex++) {
              validSmallHeat = heatsBySeedNum[smallSeedNumIndex].find((smallHeat) => {
                // 同一大学かつシードを持たないならば条件を満たす
                validSmallCompetitor = newHeats[smallHeat].find(smallCompetitor => (
                  competitors[bigCompetitor].group === competitors[smallCompetitor].group &&
                  competitors[smallCompetitor].seed === 0
                ));

                return validSmallCompetitor !== undefined;
              });
              // 条件満たしてたらtrue返す。するとvalidBigCompetitorも値を得る
              if (validSmallHeat !== undefined) {
                return true;
              }
            }
            // 全員ダメだった場合
            return false;
          });
          // もし該当者が見つかっていた場合
          if (validBigCompetitor !== undefined) {
            heatsBySeedNum[seedNumIndex].splice(bigHeatIndex, 1);
            heatsBySeedNum[seedNumIndex - 1].push(bigHeat);
            const tHeatsBySeedNum = heatsBySeedNum[smallSeedNumIndex];
            tHeatsBySeedNum.splice(tHeatsBySeedNum.indexOf(validSmallHeat), 1);
            heatsBySeedNum[smallSeedNumIndex + 1].push(validSmallHeat);
            numPerSeeds[currentSeed][bigHeat] -= 1;
            numPerSeeds[currentSeed][validSmallHeat] += 1;
            newHeats[bigHeat].splice(newHeats[bigHeat].indexOf(validBigCompetitor), 1);
            newHeats[validSmallHeat].splice(newHeats[validSmallHeat].indexOf(validSmallCompetitor), 1);
            newHeats[validSmallHeat].push(validBigCompetitor);
            newHeats[bigHeat].push(validSmallCompetitor);
          }
        });
      }
    }
  }


  // ソート
  newHeats.forEach((heat) => {
    heat.sort((a, b) => {
      if (Number(competitors[a].number) < Number(competitors[b].number)) {
        return -1;
      }
      return 1;
    });
  });
  return newHeats;
}


export function createHeatsStandard(tCompetitors, roundKey, roundsOptions, competitors) {
  let newHeatNumber = 1;
  if (roundKey < 101) {
    newHeatNumber = roundsOptions[roundKey].heats;
  }
  const newHeats = []; // [..[ids]]
  const newHeatSizes = new Array(newHeatNumber); // [size]: ヒートごとの人数
  for (let i = 0; i < newHeatNumber; i++) {
    newHeatSizes[i] = 0;
  }
  const newHeatGroups = {}; // { ..group: [size(ヒートごとの人数)]}
  const competitorsGroup = {}; // ..seed: {..group: [competitors]}
  competitorsGroup[0] = {};
  competitorsGroup[1] = {};
  competitorsGroup[2] = {};
  for (let i = 0; i < newHeatNumber; i++) { // newHeats初期化
    newHeats[i] = [];
  }

  tCompetitors.forEach((c) => { // competitorsGroupに仕分けする
    const tSeed = competitors[c].seed;
    const tGroup = competitors[c].group;
    if (competitorsGroup[tSeed][tGroup]) {
      competitorsGroup[tSeed][tGroup].push(c);
    } else {
      competitorsGroup[tSeed][tGroup] = [c];
    }
  });

  // 以下newHeatGroupsの初期化
  if (competitorsGroup[1]) {
    Object.keys(competitorsGroup[1]).forEach((group) => {
      if (!newHeatGroups[group]) {
        newHeatGroups[group] = new Array(newHeatNumber);
        for (let i = 0; i < newHeatNumber; i++) {
          newHeatGroups[group][i] = 0;
        }
      }
    });
  }
  if (competitorsGroup[2]) {
    Object.keys(competitorsGroup[2]).forEach((group) => {
      if (!newHeatGroups[group]) {
        newHeatGroups[group] = new Array(newHeatNumber);
        for (let i = 0; i < newHeatNumber; i++) {
          newHeatGroups[group][i] = 0;
        }
      }
    });
  }
  if (competitorsGroup[0]) {
    Object.keys(competitorsGroup[0]).forEach((group) => {
      if (!newHeatGroups[group]) {
        newHeatGroups[group] = new Array(newHeatNumber);
        for (let i = 0; i < newHeatNumber; i++) {
          newHeatGroups[group][i] = 0;
        }
      }
    });
  }
  // 初期化終了

  if (competitorsGroup[1]) { // もし第一シードがいる場合
    const tGroupsLength = createGroupLengths(competitorsGroup[1]);
    let i = 0;
    tGroupsLength.forEach((a) => {
      competitorsGroup[1][a[0]].forEach((competitor) => {
        newHeats[i].push(competitor);
        newHeatSizes[i] += 1;
        newHeatGroups[a[0]][i] += 1;
        if (i >= newHeatNumber - 1) {
          i = 0;
        } else {
          i += 1;
        }
      });
    });
    // 第一シード代入完了
  }

  if (competitorsGroup[2]) { // もし第二シードがいる場合
    const tGroupsLength = createGroupLengths(competitorsGroup[2]);
    tGroupsLength.forEach((a) => {
      competitorsGroup[2][a[0]].forEach((competitor) => {
        const [minSize, maxSize] = minMax(newHeatSizes);
        const [minSizeGroup] = minMax(newHeatGroups[a[0]]);
        let size = minSize;
        for (let i = 0; i < newHeatNumber; i++) {
          if (newHeatSizes[i] === size && newHeatGroups[a[0]][i] === minSizeGroup) {
            newHeats[i].push(competitor);
            newHeatSizes[i] += 1;
            newHeatGroups[a[0]][i] += 1;
            break;
          }
          if (i === newHeatNumber - 1 && size < maxSize) {
            i = 0;
            size += 1;
          }
        }
      });
    });
  }

  if (competitorsGroup[0]) {
    const tGroupsLength = createGroupLengths(competitorsGroup[0]);
    tGroupsLength.forEach((a) => {
      competitorsGroup[0][a[0]].forEach((competitor) => {
        const [minSize, maxSize] = minMax(newHeatSizes);
        const [minSizeGroup] = minMax(newHeatGroups[a[0]]);
        let size = minSize;
        for (let i = 0; i < newHeatNumber; i++) {
          if (newHeatSizes[i] === size && newHeatGroups[a[0]][i] === minSizeGroup) {
            newHeats[i].push(competitor);
            newHeatSizes[i] += 1;
            newHeatGroups[a[0]][i] += 1;
            break;
          }
          if (i === newHeatNumber - 1 && size < maxSize) {
            i = -1; // WARNING: 最初ここを0にしていたforを理解しよう
            size += 1;
          }
        }
      });
    });
  }
  const [minSize, maxSize] = minMax(newHeatSizes);

  // ヒートごとの人数に幅が出来てしまった場合
  if (maxSize - minSize > 1) {
    dialog.showMessageBox({
      defaultId: 0,
      type: 'info',
      buttons: ['OK'],
      message: '各ヒートごとの人数に差が生じています。手動でなおしてください。',
      noLink: true,
    });
  }

  // ソート
  newHeats.forEach((heat) => {
    heat.sort((a, b) => {
      if (Number(competitors[a].number) < Number(competitors[b].number)) {
        return -1;
      }
      return 1;
    });
  });
  return newHeats;
}

export function createHeatsVertical(tCompetitors, roundKey, roundsOptions, competitors) {
  let newHeatNumber = 1;
  if (roundKey < 101) {
    newHeatNumber = roundsOptions[roundKey].heats;
  }
  const newHeats = [];
  for (let i = 0; i < newHeatNumber; i++) {
    newHeats.push([]);
  }
  tCompetitors.sort((a, b) => {
    if (Number(competitors[a].number) < Number(competitors[b].number)) {
      return -1;
    }
    return 1;
  });
  let heatIndex = 1;
  tCompetitors.forEach((competitorId) => {
    newHeats[heatIndex - 1].push(competitorId);
    if (heatIndex < newHeatNumber) {
      heatIndex += 1;
    } else {
      heatIndex = 1;
    }
  });

  return newHeats;
}

export function createHeatsSideWays(tCompetitors, roundKey, roundsOptions, competitors) {
  let newHeatNumber = 1;
  if (roundKey < 101) {
    newHeatNumber = roundsOptions[roundKey].heats;
  }
  const newHeats = [];
  for (let i = 0; i < newHeatNumber; i++) {
    newHeats.push([]);
  }
  tCompetitors.sort((a, b) => {
    if (Number(competitors[a].number) < Number(competitors[b].number)) {
      return -1;
    }
    return 1;
  });

  const reminder = tCompetitors.length % newHeatNumber;
  const preCompetitorsPerHeat = Math.floor(tCompetitors.length / newHeatNumber);

  let heatIndex = 0;
  let competitorIndex = 0;
  tCompetitors.forEach((competitorId) => {
    newHeats[heatIndex].push(competitorId);
    competitorIndex += 1;

    // 一人多いヒートかどうかの判別
    let competitorsPerHeat;
    if (heatIndex < reminder) {
      competitorsPerHeat = preCompetitorsPerHeat + 1;
    } else {
      competitorsPerHeat = preCompetitorsPerHeat;
    }

    if (competitorIndex >= competitorsPerHeat) {
      competitorIndex = 0;
      heatIndex += 1;
    }
  });

  return newHeats;
}
