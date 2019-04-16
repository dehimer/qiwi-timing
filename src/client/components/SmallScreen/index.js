import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './index.css';

class SmallScreen extends PureComponent {
  render() {
    return (
      <div className="smallscreen">
        SMALL SCREEN
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
