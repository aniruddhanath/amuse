import React from 'react';
import { connect } from 'react-redux';

import { starFilter } from '../actions';

const mapStateToProps = ({ tracks, filterStarred }) => ({
  starred: tracks.filter(track => track.star).length,
  starApplied: filterStarred
});

const mapDispatchToProps = dispatch => ({
  starFilter: starApplied => dispatch(starFilter(starApplied)),
});

const Starred = React.createClass({
  
  render() {
    let starApplied = this.props.starApplied;

    return (
      <button className={`btn pull-right ${ starApplied ? "btn-warning" : "btn-success" }`} onClick={this.starFilter}>
        Favourites #{this.props.starred}
      </button>
    );
  },

  starFilter() {
    this.props.starFilter(!this.props.starApplied);
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(Starred);
