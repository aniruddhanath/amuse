export const tracks = (state, action) => {
  switch(action.type){
    case 'RECEIVE_DATA':
      return action.data || state;

    case 'REMOVE_DATA':
      return state.filter(track => track.id !== action.data);

    case 'APPEND_DATA':
      return [ ...state, action.data ];

    case 'UPDATE_TRACK':
      return state.map(track => ( track.id !== action.data.id ) ?
        track :
        Object.assign({}, track, action.data)
      );

    default:
      return state || [];
  }
};

export const trackFilter = (state, action) => {
  switch (action.type) {
    case 'FILTER_TRACKS':
      return action.data;

    default:
      return state || '';
  }
};

export const filterStarred = (state, action) => {
  switch (action.type) {
    case 'STAR_FILTER':
      return action.data;

    default:
      return state || '';
  }
};

export const currentTrack = (state, action) => {
  switch (action.type) {
    case 'REMOVE_TRACK':
      return {};

    case 'PLAY_TRACK':
      return Object.assign({}, action.data, { paused: false });

    case 'UPDATE_TRACK':
      return state.id !== action.data.id ?
        state :
        Object.assign({}, state, action.data);

    default:
      return state || '';
  }
};

export const loopTrack = (state, action) => {
  switch (action.type) {
    case 'UPDATE_LOOP': 
      return action.data;

    default:
      return state || '';
  }
};

export const audioData = (state, action) => {
  switch (action.type) {
    case 'UPDATE_PROGRESS':
      return action.data;

    default:
      return state || 0;
  }
};
