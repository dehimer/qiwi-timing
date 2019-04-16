import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import './index.css';

class SmallScreen extends PureComponent {
  render() {
    const { config, selectSpeaker, speaker: currentSpeakerId } = this.props;

    const { timing } = config;
    if (!timing) return null;


    return (
      <div className="smallscreen">
        <div className="list">
          {
            timing.map(({ id, speaker, theme, time }) => {
              return (
                <div
                  key={id}
                  className={classNames({speech: true, selected: id === currentSpeakerId})}
                  onClick={() => selectSpeaker(id)}
                >
                  { speaker && <div className="speaker">{speaker}</div> }
                  <div className={classNames({theme: true, bigger: !speaker})}>{theme}</div>
                  <div className="time">
                    <span>{time[0]}</span> - <span>{time[1]}</span>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    );
  }
}

SmallScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  config: PropTypes.object.isRequired,
  selectSpeaker: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const { config, speaker } = state.server;

  return { config, speaker };
};

const mapDispatchToProps = dispatch => (
  {
    selectSpeaker: (id) => {
      dispatch({
        type: 'server/selectSpeaker',
        payload: id
      });
    },
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SmallScreen);
