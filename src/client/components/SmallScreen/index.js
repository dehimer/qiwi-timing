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
        {
          timing.map(({ theme, time }) => {
            return <div key={time[0]}>{theme}</div>
          })
        }
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
