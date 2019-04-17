import React, { PureComponent, Fragment } from 'react';
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
        // const backgroundColor = hexToRgba(color, 0.1);
        // const scale =
        const sizeCoefficient = 1;/* + Math.random()*/;
        const size = 15 * sizeCoefficient;
        const fontSize = size;

        const [top, left] = findFreePosition(size*0.9);

        buzySpaces.push({
          top,
          left,
          size
        });

        const speakerStyles = {
          backgroundColor: hexToRgba(color, 0.1),
          height: `${size}vh`,
          width: `${size}vw`,
          top: `${top}vh`,
          left: `${left}vw`,
          fontSize: `${fontSize}px`
        };

        const rayTopStyles = {
          backgroundColor: color,
          opacity: 0.1,
          width: `${size}vw`,
          height:  `${Math.abs(50-top)}vh`,
          top: top < 50 ? `${top}vh` : `50vh`,
          left: `${left}vw`,
          // transform: `skewX(${(left+size/2)-50}deg)`
        };

        const rayBottomStyles = {
          backgroundColor: color,
          opacity: 0.1,
          height:  `${size}vh`,
          width:  `${Math.abs(50-left)}vw`,
          top: `${top}vh`,
          left: left < 50 ? `${left}vw` : `50vw`,
          // transform: `skewX(${(left+size/2)-50}deg)`
        };

        return (
          <Fragment key={id} >
            <div className="speaker" style={speakerStyles}>
              <div className="time"><span>{time[0]}</span> - <span>{time[1]}</span></div>
              <div className="person">{speaker}</div>
              <div className="point">{theme}</div>
            </div>
            <div className="ray-top" style={rayTopStyles}/>
            <div className="ray-bottom" style={rayBottomStyles}/>
          </Fragment>
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
