import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';
import hexToRgba from "hex-to-rgba";

class BigScreen extends PureComponent {
  state = {
    counter: 1
  };

  componentDidMount() {
    setInterval(() => {
      this.setState({
        counter: this.state.counter + 1,
      })
    }, 15000);
  }

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
      const buzySpaces = [];
      const findFreePosition = (size) => {
        const top = (100-size)*Math.random();
        const left = (100-size)*Math.random();

        const foundOverlay = buzySpaces.find(space => {
          return !(
            space.left > (left + size) ||
            (space.left + space.size) < left ||
            space.top > (top + size) ||
            (space.top + space.size) < top
          );
        });

        if (foundOverlay) {
          return findFreePosition(size);
        } else {
          return [top, left];
        }

      };

      content = timing.filter(({speaker}) => !!speaker).map(({ id, time, speaker, theme, color }) => {
        const backgroundColor = hexToRgba(color, 0.1);
        const sizeCoefficient = 0.5 + Math.random();
        const size = 15 * sizeCoefficient;
        const fontSize = size;

        const [top, left] = findFreePosition(size*0.9);

        buzySpaces.push({
          top,
          left,
          size
        });

        const styles = {
          backgroundColor,
          height: `${size}vh`,
          width: `${size}vw`,
          top: `${top}vh`,
          left: `${left}vw`,
          fontSize: `${fontSize}px`
        };

        return (
          <div key={id} className="speaker" style={styles}>
            <div><span>{time[0]}</span> - <span>{time[1]}</span></div>
            <div>{speaker}</div>
            <div>{theme}</div>
          </div>
        )
      })
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
