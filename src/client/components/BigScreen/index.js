import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

class BigScreen extends PureComponent {
  render() {
    const { config, speaker: currentSpeakerId } = this.props;

    const { timing } = config;
    if (!timing) return null;

    let content = null;
    if (currentSpeakerId) {
      const { description, theme, time } = timing.find(({ id }) => id === currentSpeakerId);
      content = description
        ? (<div className="description">{description}</div>)
        : (
          <div className="theme">
            <div>{theme}</div>
            <div className="time">
              <span>{time[0]}</span> - <span>{time[1]}</span>
            </div>
          </div>
        )
    } else {
      content = timing.map(({ id, speaker, theme }) => (
        <div key={id} className="speaker">
          <div>{speaker}</div>
          <div>{theme}</div>
        </div>
      ))
    }

    return (
      <div className="bigscreen">
        { content }
      </div>
    );
  }
}
BigScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  config: PropTypes.object.isRequired,
  speaker: PropTypes.number
};

const mapStateToProps = (state) => {
  const { config, speaker } = state.server;

  return { config, speaker };
};

export default connect(
  mapStateToProps,
)(BigScreen);
