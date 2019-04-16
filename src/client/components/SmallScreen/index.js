import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './index.css';

class SmallScreen extends PureComponent {
  render() {
    const { config } = this.props;
    console.log(config);

    const { timing } = config;
    if (!timing) return null;

    return (
      <div className="smallscreen">
        <div className="list">
          {
            timing.map(({ speaker, theme, time }) => {
              return (
                <div className="speech" key={time[0]}>
                  { speaker && <div className="speaker">{speaker}</div> }
                  <div className="theme">{theme}</div>
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
};

const mapStateToProps = (state) => {
  const { config } = state.server;

  return {
    config
  };
};
export default connect(
  mapStateToProps,
)(SmallScreen);
