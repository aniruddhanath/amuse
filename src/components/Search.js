import React from 'react';
import { connect } from 'react-redux';

import { filterTracks } from '../actions';

const mapDispatchToProps = dispatch => ({
  onFilter: query => dispatch(filterTracks(query))
});

const Search = React.createClass({
  render() {

    return (
      <div className="form-group has-warning">
        <input 
          onChange={e => this.onFilter(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Search track..." />
      </div>
    );
  },

  onFilter(query) {
    this.props.onFilter(query);
  }

});

export default connect(null, mapDispatchToProps)(Search);
