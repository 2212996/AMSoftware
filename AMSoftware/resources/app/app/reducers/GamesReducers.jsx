import { ADD_GAME, ADD_COMPETITOR_IN_GAME, DELETE_COMPETITOR_IN_GAME,
  CHANGE_ROUNDS_OPTION, CHANGE_STYLE_OPTION, CHANGE_GAME_NAME,
  READ_GAMES, ADD_COMPETITORS_IN_GAMES } from '../actions/GamesActions';


const initialGames = {
  // 1: {
  //   name: '第５３回中・洋大学対抗学生競技ダンス選手権大会',
  //   competitors: [1, 2, 3, 4, 5, 6, 7, 8],
  //
  //   options: {
  //     WALTZ: 0,
  //     TANGO: 1,
  //     FOX: 0,
  //     QUICK: 0,
  //     VIENNESE: 0,
  //     CHA: 0,
  //     SAMBA: 1,
  //     RUMBA: 0,
  //     PASO: 0,
  //     JIVE: 0,
  //     rounds: {
  //       1: {
  //         judge: 1,
  //         heats: 4,
  //         up: 4,
  //       },
  //       2: {
  //         judge: 1,
  //         heats: 2,
  //         up: 12,
  //       },
  //       101: {
  //         judge: 2,
  //         up: 6,
  //       },
  //       102: {
  //         judge: 2,
  //       },
  //     },
  //   },
  // },
};

export default function games(state = initialGames, action) {
  switch (action.type) {
    case ADD_COMPETITORS_IN_GAMES: {
      const newGames = {};

      Object.keys(action.newGamesCompetitors).forEach((gameId) => {
        if (!state[gameId]) {
          return;
        }

        newGames[gameId] = Object.assign(
          {},
          state[gameId],
          {
            competitors: state[gameId].competitors.concat(action.newGamesCompetitors[gameId]),
          },
        );
      });

      return Object.assign({}, state, newGames);
    }
    case READ_GAMES: {
      return Object.assign({}, action.games);
    }

    case ADD_GAME: {
      const newRounds = {};
      for (let i = 1; i <= action.num; i++) {
        newRounds[i] = {
          judge: 0,
          heats: 0,
          up: 0,
        };
      }
      newRounds[101] = {
        judge: 0,
        up: 0,
      };
      newRounds[102] = {
        judge: 0,
      };
      if (action.smallFinal) {
        newRounds[103] = {
          judge: 0,
        };
      }

      return Object.assign({}, state, {
        [action.id]: {
          name: action.name,
          competitors: [],
          options: {
            WALTZ: 0,
            TANGO: 0,
            FOX: 0,
            QUICK: 0,
            VIENNESE: 0,
            CHA: 0,
            SAMBA: 0,
            RUMBA: 0,
            PASO: 0,
            JIVE: 0,
            rounds: newRounds,
          },
        },
      });
    }
    case ADD_COMPETITOR_IN_GAME: {
      if (state[action.gameId]) {
        const newCompetitors = state[action.gameId].competitors.concat(action.competitorId);
        const newGame = Object.assign({}, state[action.gameId], {
          competitors: newCompetitors,
        });
        return Object.assign({}, state, {
          [action.gameId]: newGame,
        });
      }
      return state;
    }
    case DELETE_COMPETITOR_IN_GAME: {
      const newCompetitors = [];
      state[action.gameId].competitors.forEach((value) => {
        if (value !== action.competitorId) {
          newCompetitors.push(value);
        }
      });
      const editedGame = Object.assign({}, state[action.gameId], {
        competitors: newCompetitors,
      });
      return Object.assign({}, state, {
        [action.gameId]: editedGame,
      });
    }

    case CHANGE_ROUNDS_OPTION: {
      const editedRound = Object.assign({}, state[action.gameId].options.rounds[action.roundKey], {
        [action.option]: action.value,
      });
      const editedRounds = Object.assign({}, state[action.gameId].options.rounds, {
        [action.roundKey]: editedRound,
      });
      const editedOptions = Object.assign({}, state[action.gameId].options, {
        rounds: editedRounds,
      });
      const editedGame = Object.assign({}, state[action.gameId], {
        options: editedOptions,
      });
      return (Object.assign({}, state, {
        [action.gameId]: editedGame,
      }));
    }

    case CHANGE_STYLE_OPTION: {
      const editedOptions = Object.assign({}, state[action.gameId].options, {
        [action.style]: action.num,
      });
      const editedGame = Object.assign({}, state[action.gameId], {
        options: editedOptions,
      });
      return Object.assign({}, state, {
        [action.gameId]: editedGame,
      });
    }

    case CHANGE_GAME_NAME: {
      const editedGame = Object.assign({}, state[action.gameId], {
        name: action.name,
      });
      return Object.assign({}, state, {
        [action.gameId]: editedGame,
      });
    }

    default:
      return state;
  }
}
