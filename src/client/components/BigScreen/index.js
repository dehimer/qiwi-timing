import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';

class BigScreen extends PureComponent {
  state = {
    selected: null
  };

  render() {
    return (
      <div className="bigscreen">
        HERE IS BIG SCREEN
      </div>
    );
  }
}

BigScreen.defaultProps = {
  match: {
    params: {
      from: null
    }
  }
};

BigScreen.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  config: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const { config } = state.server;

  return {
    config,
  };
};

const mapDispatchToProps = dispatch => (
  {
  }
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BigScreen);
