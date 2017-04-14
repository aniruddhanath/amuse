import React from 'react';

import Track from './Track';

const Tracks = React.createClass({
  render() {
    let tracks = this.props.tracks;

    if (!tracks || !tracks.length) {
      return (
        <ul className="list-group">
          <Track />
        </ul>
      );
    }

    return (
      <ul className="list-group">
        {tracks.map((track, index) =>
          <Track key={index} track={track} />
        )}
      </ul>
    );
  }
});

export default Tracks;
