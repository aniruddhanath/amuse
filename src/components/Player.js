import React from 'react';
import { connect } from 'react-redux';

import { formatTime } from '../lib';
import { loopMusic, togglePlay, playTrack, updateProgress } from '../actions';

const mapStateToProps = ({ currentTrack, loopTrack, tracks, audioData, filterStarred }) => ({
  track: currentTrack,
  loopTrack,
  tracks: tracks.filter(tr => (filterStarred ? tr.star : true)),
  audioData
});

const mapDispatchToProps = dispatch => ({
  loopMusic: loop => dispatch(loopMusic(loop)),
  playTrack: track => dispatch(playTrack(track)),
  togglePlay: track => dispatch(togglePlay(track)),
  updateProgress: progress => dispatch(updateProgress(progress))
});

const Player = React.createClass({

  componentWillUpdate(nextProps) {
    if (nextProps.track.id !== this.props.track.id && !nextProps.track.id) {
      this.audio && this.audio.pause();
    }
  },

  componentDidUpdate(prevProps) {
    let { track } = this.props;

    if (prevProps.track.id !== track.id) {
      this.audio = new Audio(track.source);
      this.enablePlay = false;
      this.audio.addEventListener('loadedmetadata', () => {
        this.enablePlay = true;
        this.audio.play();
      });
      this.audio.addEventListener('timeupdate', this.updateProgress);
      this.audio.addEventListener('ended', this.handleFinish);
    }

    this.audio && (this.audio.loop = this.props.loopTrack);
  },

  componentWillUnmount() {
    this.audio.removeEventListener('loadedmetadata');
    this.audio.removeEventListener('timeupdate');
    this.audio.removeEventListener('ended');
  },

  render() {
    let { track, loopTrack, audioData } = this.props;

    if (!track || !track.id) {
      return (<div>
        Select a track to play
      </div>);
    }

    return (
      <div className="row">
        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3" style={{paddingTop: '4px'}}>
          <button className="btn btn-sm btn-default" style={{borderRadius: '50%'}} onClick={this.prevTrack}>&laquo;</button>&nbsp;
          <button className={`btn btn-sm ${track.paused ? "btn-warning" : "btn-success"} ${!this.enablePlay ? "disabled" : ""}`} onClick={this.togglePlay}>{track.paused ? 'Play' : 'Pause'}</button>&nbsp;
          <button className="btn btn-sm btn-default" style={{borderRadius: '50%'}} onClick={this.handleFinish}>&raquo;</button>&nbsp;
        </div>
        <div className="col-xs-7 col-sm-7 col-md-7 col-lg-7">
          <div className="row">
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center">
              <div style={{paddingTop: '12px'}}>{ formatTime(audioData.currentTime) }</div>
            </div>
            <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
              <div className="row text-warning" style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                { track.fname }
              </div>
              <div className="audiobar" onClick={this.seek}></div>
              <div className="audioloaded" style={{width: this.progress()}}>
                <span className="audiothumb"></span>
              </div>
              <div className="audioseeker" onClick={this.seek}></div>
            </div>
            <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 text-center">
              <div style={{paddingTop: '12px'}}>{ formatTime(audioData.duration) }</div>
            </div>
          </div>
        </div>
        <div className="col-xs-2 col-sm-2 col-md-2 col-lg-2" style={{paddingTop: '4px'}}>
          <button className="btn btn-sm btn-info pull-right" onClick={this.loopMusic}>{loopTrack ? "Unloop" : "Loop"}</button>
        </div>
      </div>
    );
  },

  loopMusic() {
    this.props.loopMusic(!this.props.loopTrack);
  },

  togglePlay() {
    if (!this.enablePlay) {
      return;
    }
    this.audio.paused ? this.audio.play() : this.audio.pause();
    this.props.togglePlay(this.props.track);
  },

  prevTrack() {
    this.audio && this.audio.pause();
    let { track, tracks } = this.props;
    let prevIndex = 0;
    tracks.forEach( function (tr, index) {
      if (tr.id === track.id) {
        prevIndex = (index === 0) ? (tracks.length - 1) : (index - 1);
      }
    });
    this.enablePlay = false;
    this.props.playTrack(tracks[prevIndex]);
  },

  handleFinish() {
    this.audio && this.audio.pause();
    let { track, tracks } = this.props;
    let nextIndex = 0;
    tracks.forEach( function (tr, index) {
      if (tr.id === track.id) {
        nextIndex = (index + 1) % (tracks.length);
      }
    });
    this.enablePlay = false;
    this.props.playTrack(tracks[nextIndex]);
  },

  updateProgress(position) {
    if (!this.audio.duration) {
      return;
    }
    this.props.updateProgress({
      currentTime: this.audio.currentTime,
      duration: this.audio.duration
    });
  },

  progress() {
    let audioData = this.props.audioData;
    if (!audioData.duration) {
      return 0;
    }
    return `${ (audioData.currentTime * 100) / audioData.duration }%`;
  },

  seek(evt) {
    if (!this.audio.duration || this.audio.duration === Infinity) {
      return;
    }
    let seekPosition = evt.clientX - evt.target.getBoundingClientRect().left;
    this.audio.currentTime = (seekPosition * this.audio.duration) / evt.target.offsetWidth;
  }

});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
