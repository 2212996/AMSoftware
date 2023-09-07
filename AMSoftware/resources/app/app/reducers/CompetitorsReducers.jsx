import { ADD_COMPETITOR, CHANGE_COMPETITOR_FIELD,
  READ_COMPETITORS } from '../actions/CompetitorsActions';

const initialCompetitors = {
  // 1: {
  //   number: 1,
  //   leadername: '山田太郎',
  //   leaderkana: 'ヤマダタロウ',
  //   leaderregi: '東京大学',
  //   partnername: '山田花子',
  //   partnerkana: 'ヤマダハナコ',
  //   partnerregi: '日本女子大学',
  //   group: '東京大学',
  //   seed: 1,
  // },
  // 2: {
  //   number: 12,
  //   leadername: '山田元気',
  //   leaderkana: 'ヤマダゲンキ',
  //   leaderregi: '東京大学',
  //   partnername: '山田華子',
  //   partnerkana: 'ヤマダハナコ',
  //   partnerregi: '日本女子大学',
  //   group: '東京大学',
  //   seed: 1,
  // },
};

export default function competitors(state = initialCompetitors, action) {
  switch (action.type) {
    case READ_COMPETITORS:
      return Object.assign({}, action.data);

    case ADD_COMPETITOR:
      return Object.assign({}, state, {
        [action.data.id]: {
          number: action.data.number,
          leaderName: action.data.leaderName,
          leaderKana: action.data.leaderKana,
          leaderRegi: action.data.leaderRegi,
          partnerName: action.data.partnerName,
          partnerKana: action.data.partnerKana,
          partnerRegi: action.data.partnerRegi,
          group: action.data.group,
          seed: action.data.seed,
        },
      });

    case CHANGE_COMPETITOR_FIELD: {
      const editedCompetitor = Object.assign({}, state[action.id], {
        [action.key]: action.data,
      });
      return Object.assign({}, state, {
        [action.id]: editedCompetitor,
      });
    }
    default:
      return state;
  }
}
