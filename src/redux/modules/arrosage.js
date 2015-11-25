const LOAD = '@@reactProject/light/LOAD';
const LOAD_SUCCESS = '@@reactProject/light/LOAD_SUCCESS';
const LOAD_FAIL = '@@reactProject/light/LOAD_FAIL';

const initialState = {
  loaded: false
};

export default function arrosage(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
      };
    case LOAD_SUCCESS:
      return {
        ...state,
      };
    case LOAD_FAIL:
      return {
        ...state,
      };
    default:
      return state;
  }
}

export function on() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.post('/start/')
  };
}