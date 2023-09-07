import { ADD_CONTEST, EDIT_CONTEST, HAS_SMALL_FINAL } from '../actions/OptioinsActions';

const initialOptions = {
  contest: {
    number: '',
    name: '',
    date: '',
    group: '',
    stage: '',
    place: '',
  },
  hasSmallFinal: false,
};

export default function options(state = initialOptions, action) {
  switch (action.type) {
    case ADD_CONTEST:
      return Object.assign({}, state, {
        contest: {
          number: action.data.number,
          name: action.data.name,
          date: action.data.date,
          group: action.data.group,
          stage: action.data.stage,
          place: action.data.place,
        },
      });
    case EDIT_CONTEST: {
      const editedContest = Object.assign({}, state.contest, {
        [action.name]: action.data,
      });
      return Object.assign({}, state, {
        contest: editedContest,
      });
    }
    case HAS_SMALL_FINAL:
      return Object.assign({}, state, {
        hasSmallFinal: action.flag,
      });
    default:
      return state;
  }
}
