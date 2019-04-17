import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import hexToRgba from 'hex-to-rgba';

import './index.css';

class SmallScreen extends PureComponent {
  render() {
    const { config, selectSpeaker, speaker: currentSpeakerId } = this.props;

    const { timing } = config;
    if (!timing) return null;

    return (
      <div className="smallscreen">
        <div className="header">
          <img alt='back' src={`/public/qiwi_logo_cmyk.svg`} />
        </div>
        <div className="list" style={{ height: `${24 * timing.length}vh` }}>
          {
            timing.map(({ id, speaker, theme, time, color }) => {
              console.log(`${id} === ${currentSpeakerId} ${id === currentSpeakerId}`);
              let backgroundColor = color ? hexToRgba(color, 0) : 'rgba(0,0,0,0)';
              if (color && id === currentSpeakerId) {
                backgroundColor = hexToRgba(color, 0.2);
              }

              return (
                <div
                  key={id}
                  className="speech" style={{ backgroundColor }}
                  onClick={() => selectSpeaker(id)}
                >
                  <div className="speakertime">
                    <div className="time">
                      <span>{time[0]}</span> - <span>{time[1]}</span>
                    </div>
                    { speaker && <div className="speaker">{speaker}</div> }
                  </div>
                  <div className={classNames({theme: true, bigger: !speaker})}>{theme}</div>
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
  speaker: PropTypes.number
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
