import React from 'react';
import { connect } from 'react-redux';
import InlineEdit from 'react-edit-inline';

import { deleteTrack, starTrack, playTrack, editTrack, removeTrack } from '../actions';
import { dateFormat } from '../lib';

const mapStateToProps = ({ currentTrack }) => ({
  currentTrack
});

const mapDispatchToProps = dispatch => ({
  onDelete: trackId => dispatch(deleteTrack(trackId)),
  onStar: track => dispatch(starTrack(track)),
  onPlay: track => dispatch(playTrack(track)),
  onEdit: (track, fname) => dispatch(editTrack(track, fname)),
  onStop: track => dispatch(removeTrack(track))
});

const Track = React.createClass({
  render() {
    if (!this.props.track) {
      return (
        <li className="list-group-item">
          <div className="row">
            <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
              <p className="text-muted">No tracks :(</p>
              <p style={{background: 'whitesmoke'}}>&nbsp;</p>
            </div>
          </div>
        </li>
      );
    }

    let { track, currentTrack } = this.props,
      isSelected = (currentTrack.id === track.id),
      isPlaying = (currentTrack.id === track.id) && !currentTrack.paused;

    return (
      <li className={`list-group-item ${isSelected ? "list-group-item-success" : ""}`}>
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <p>
              <InlineEdit className="text-info" text={track.fname}
                activeClassName="edit-fname text-info"
                validate={this.validateName}
                paramName="fname"
                change={this.nameChanged}
                style={{
                  outline: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'block',
                  textOverflow: 'ellipsis'
                }}>
              </InlineEdit>
            </p>
            <p className="text-muted">Page visited on { dateFormat(track.lastAccessed) }</p>
          </div>

          <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6">
            <p className="text-right">
              <small><a href={track.pageLink} className="text-primary">{track.hostname}</a></small>
            </p>
            <div>
              <button
                className="btn btn-sm btn-danger pull-right"
                onClick={this.onDelete}>
                Delete
              </button>
              <div className="pull-right">{'\u00A0'}</div>
              <button
                className={`btn btn-sm pull-right ${track.star ? "btn-success" : "btn-warning"}`}
                onClick={this.onStar}>
                { track.star ? "Unstar" : "Star" }
              </button>
              <div className="pull-right">&nbsp;</div>
              <button
                className="btn btn-sm btn-default pull-right"
                onClick={this.onPlay}>
                { isPlaying ? "Stop" : "Play" }
              </button>
              <div className="pull-right">&nbsp;</div>
            </div>
          </div>
        </div>
      </li>
    );
  },

  validateName(fname) {
    return !!fname.trim();
  },

  nameChanged(params) {
    this.props.onEdit(this.props.track, params.fname);
  },

  onDelete() {
    this.props.onDelete(this.props.track.id);
  },

  onStar() {
    this.props.onStar(this.props.track);
  },

  onPlay() {
    let { track, currentTrack } = this.props,
      isPlaying = (currentTrack.id === track.id) && !currentTrack.paused;

    this.props.onStop(this.props.track);

    if (!isPlaying) {
      setTimeout(() => {
        this.props.onPlay(this.props.track);
      }, 100);
    }
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Track);
