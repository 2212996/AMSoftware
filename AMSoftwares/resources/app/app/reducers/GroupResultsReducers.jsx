import { ADD_GROUP_RESULT,
         ADD_ROUND_RESULT,
         ADD_RANK_RESULT } from '../actions/GroupResultsActions';

function groupResult(state, action) {
  switch (action.type) {
    case ADD_ROUND_RESULT:
      if (state.id === action.groupId) {
        return Object.assign({}, state, {
          [action.roundKey]: action.competitors,
        });
      }
      return state;
    case ADD_RANK_RESULT:
      if (state.id === action.groupId) {
        const newRank = Object.assign({}, state.rank, {
          [action.rank]: action.competitorId,
        });
        return Object.assign({}, state, {
          rank: newRank,
        });
      }
      return state;
    default:
      return state;
  }
}

export default function groupResults(state = [], action) {
  switch (action.type) {
    case ADD_GROUP_RESULT:
      return [
        ...state,
        {
          id: action.groupId,
          rank: {},
        },
      ];
    case ADD_ROUND_RESULT:
    case ADD_RANK_RESULT:
      return state.map((gr) =>
        groupResult(gr, action)
      );
    default:
      return state;
  }
}
