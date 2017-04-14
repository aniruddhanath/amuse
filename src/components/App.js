import React from 'react';
import { connect } from 'react-redux';
import fuzzysearch from 'fuzzysearch';
import { Scrollbars } from 'react-custom-scrollbars';

import Search from './Search';
import Starred from './Starred';
import Player from './Player';
import Tracks from './Tracks';

const matches = (filter, track) => fuzzysearch(filter.toLowerCase(), track.fname.toLowerCase());

const mapStateToProps = ({ tracks, trackFilter, filterStarred }) => ({
  tracks: tracks.filter(track => matches(trackFilter, track) && (filterStarred ? track.star : true)),
  no_tracks: !tracks.length
});

const App = React.createClass({

  render() {
    let { tracks, no_tracks } = this.props;

    let message = (<a href="http://pinkzebramusic.com/in-the-moment-of-inspiration/">To get started, just browse through few sites with music links!</a>);

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Amuse - Music Aggregator</h3>
        </div>

        <div className="panel-body">
          <div className="row">
            <div className="col-xs-8 col-sm-9 col-md-9 col-lg-9">
              <Search />
            </div>
            <div className="col-xs-4 col-sm-3 col-md-3 col-lg-3">
              <Starred />
            </div>
          </div>

          <div className="clearfix"></div>

          <Scrollbars style={{minHeight: '70vh'}}>
            <Tracks tracks={tracks} />
            <p className="text-primary text-center">{ no_tracks ? message : '' }</p>
          </Scrollbars>

        </div>

        <div className="panel-footer">
          <Player />
        </div>
      </div>
    );
  }

});

export default connect(mapStateToProps)(App);
