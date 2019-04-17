import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './index.css';
import hexToRgba from "hex-to-rgba";
import classNames from "classnames";

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
    // console.log('render');
    const { config, speaker: currentSpeakerId } = this.props;
    // console.log(`currentSpeakerId: ${currentSpeakerId}`);

    const { timing } = config;
    if (!timing) return null;

    const currentSpeaker = timing.find(({id}) => id === currentSpeakerId);

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

    const content = timing.filter(({speaker}) => !!speaker).map(({ id, time, speaker, theme, color, photo, description }) => {
        const isSelected = id === currentSpeakerId;

        const sizeCoefficient = 1;/* + Math.random();*/
        const size = isSelected ? 100 : 15 * sizeCoefficient;
        const fontSize = size;

        // console.log(`${id} === ${currentSpeakerId} ${isSelected}`);
        let top = 0;
        let left = 0;

        if (!isSelected) {
          // console.log('findFreePosition');
          [top, left] = findFreePosition(size*0.9);

          buzySpaces.push({
            id,
            top,
            left,
            size
          });
        }

        const speakerStyles = {
          backgroundColor: hexToRgba(color, isSelected ? 0.5 : 0.1),
          opacity: !isSelected && currentSpeakerId && currentSpeaker.speaker ? 0 : 1,
          zIndex: isSelected ? 10: 1,
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

        const rayLeftStyles = {
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
              <div
                className="long"
                style={
                  isSelected
                    ? {height: '100%', opacity: 1}
                    : {height: '0', opacity: 0}
                }
              >
                <div className="photoqrs">
                  { photo && <img src={`/public/speakers/${photo}`} alt="photo"/> }
                  <img src={`/public/qrs/qr-qiwi-events-tim.svg`} alt="qrqiwi"/>
                  <img src={`/public/qrs/qr-habr-com.svg`} alt="qrhabr"/>
                  <img src={`/public/qrs/qr-youtube-com.svg`} alt="qryoutube"/>
                </div>
                { description && <div className="description">{description}</div> }

              </div>

              <div
                className="short"
                style={
                  !isSelected
                    ? {height: '100%', opacity: 1}
                    : {height: '0', opacity: 0}
                }
              >
                <div className="time"><span>{time[0]}</span> - <span>{time[1]}</span></div>
                <div className="person">{speaker}</div>
                <div className="point">{theme}</div>
              </div>
            </div>
            { !isSelected && <div className="ray-top" style={rayTopStyles}/> }
            { !isSelected && <div className="ray-left" style={rayLeftStyles}/> }
          </Fragment>
        )
      });

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
