import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';

import './index.css';

class SmallScreen extends PureComponent {
  selectSpeaker = (id) => {

  }

  render() {
    const { config, selectSpeaker } = this.props;

    const { timing } = config;
    if (!timing) return null;

    return (
      <div className="smallscreen">
        <div className="list">
          {
            timing.map(({ id, speaker, theme, time }) => {
              return (
                <div className="speech" key={id} onClick={selectSpeaker}>
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
  console.log('mapStateToProps');
  const { config } = state.server;

  return { config };
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
