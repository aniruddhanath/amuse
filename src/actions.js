export const receiveData = tracks => ({ type: 'RECEIVE_DATA', data: tracks });

export const removeData = trackId => ({ type: 'REMOVE_DATA', data: trackId });

export const appendData = track => ({ type: 'APPEND_DATA', data: track });

export const updateTrack = track => ({ type: 'UPDATE_TRACK', data: track });

export const filterTracks = query => ({ type: 'FILTER_TRACKS', data: query });

export const starFilter = doFilter => ({ type: 'STAR_FILTER', data: doFilter });

export const playTrack = track => ({ type: 'PLAY_TRACK', data: track });

export const removeTrack = track => ({ type: 'REMOVE_TRACK', data: track });

export const updateLoop = loop => ({ type: 'UPDATE_LOOP', data: loop });

export const updateProgress = progress => ({ type: 'UPDATE_PROGRESS', data: progress });

export const fetchTracks = () => {
  return dispatch => {
    chrome.storage.local.get(null, (data) => {
      let tracks = (Object.keys(data) || []).map( (id) => Object.assign(data[id], { id } ));
      dispatch(receiveData(tracks));
    });
  }
};

export const watchTracks = () => {
  return dispatch => {
    chrome.storage.onChanged.addListener((data) => {
      let key = Object.keys(data)[0],
        trackValue = data[key];
      if (!trackValue.oldValue && trackValue.newValue) {
        dispatch(appendData(Object.assign(trackValue.newValue, { id: key })));
      }
    });
  }
};

export const deleteTrack = trackId => {
  return dispatch => {
    chrome.storage.local.remove(trackId, () => {
      dispatch(removeData(trackId));
    });
  }
};

export const starTrack = track => {
  return dispatch => {
    let jsonfile = {},
      tmpTrack = Object.assign({}, track, { star: !track.star });
    jsonfile[track.id] = tmpTrack;
    chrome.storage.local.set(jsonfile);
    dispatch(updateTrack(tmpTrack));
  }
};

export const editTrack = (track, fname) => {
  return dispatch => {
    let jsonfile = {},
      tmpTrack = Object.assign({}, track, { fname });
    jsonfile[track.id] = tmpTrack;
    chrome.storage.local.set(jsonfile);
    dispatch(updateTrack(tmpTrack));
  }
};

export const loopMusic = (loop) => {
  return dispatch => {
    dispatch(updateLoop(loop));
  }
};

export const togglePlay = track => {
  return dispatch => {
    let tmpTrack = Object.assign({}, track, { paused: !track.paused });
    dispatch(updateTrack(tmpTrack));
  }
};
