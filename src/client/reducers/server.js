const defaultState = {
  config: {},
};

export default function reducer(state = defaultState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'config':
      return { ...state, config: payload };
    default:
      return state;
  }
}
