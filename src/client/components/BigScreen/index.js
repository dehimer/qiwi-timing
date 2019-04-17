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
    const findFreePosition = (sizeV, sizeH, shortWidth) => {
      const top = (100-sizeV)*Math.random();
      const left = (shortWidth-sizeH)*Math.random();

      const foundOverlay = buzySpaces.find(space => {
        return !(
          space.left > (left + sizeH) ||
          (space.left + space.sizeH) < left ||
          space.top > (top + sizeV) ||
          (space.top + space.sizeV) < top
        );
      });

      if (foundOverlay) {
        return findFreePosition(sizeV, sizeH, shortWidth);
      } else {
        return [top, left];
      }

    };

    return (
      <div className="bigscreen">
        <div className="timing">
          {
            timing.filter(({speaker}) => !!speaker).map(({ id, time, speaker, theme, color, photo, description }) => {
              const isSelected = id === currentSpeakerId;

              // const sizeCoefficient = 1;/* + Math.random();*/
              const shortWidth = 84;
              const sizeH = isSelected ? shortWidth : 15;
              const sizeV = isSelected ? 100 : 16;
              const fontSize = sizeV;

              // console.log(`${id} === ${currentSpeakerId} ${isSelected}`);
              let top = 0;
              let left = 0;

              if (!isSelected) {
                // console.log('findFreePosition');
                [top, left] = findFreePosition(sizeV*0.9, sizeH*0.9, shortWidth);

                buzySpaces.push({
                  id,
                  top,
                  left,
                  sizeV,
                  sizeH
                });
              }

              const speakerStyles = {
                backgroundColor: hexToRgba(color, isSelected ? 0.5 : 0.1),
                opacity: !isSelected && currentSpeakerId && currentSpeaker.speaker ? 0 : 1,
                zIndex: isSelected ? 10: 1,
                height: `${sizeV}vh`,
                width: `${sizeH}vw`,
                top: `${top}vh`,
                left: `${left}vw`,
                fontSize: `${fontSize}px`

              };

              const rayTopStyles = {
                backgroundColor: color,
                opacity: 0.1,
                width: `${sizeH}vw`,
                height:  `${Math.abs(50-top)}vh`,
                top: top < 50 ? `${top}vh` : `50vh`,
                left: `${left}vw`,
                // transform: `skewX(${(left+size/2)-50}deg)`
              };

              const rayLeftStyles = {
                backgroundColor: color,
                opacity: 0.1,
                height:  `${sizeV}vh`,
                width:  `${Math.abs(shortWidth/2-left)}vw`,
                top: `${top}vh`,
                left: left < shortWidth/2 ? `${left}vw` : `${shortWidth/2}vw`,
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
            })
          }
        </div>
        <div className="qrs">

          <img alt='back' src={`/public/qiwi_logo_cmyk.svg`} className="qiwilogo" />

          <img src={`/public/qrs/qr-qiwi-events-tim.svg`} alt="qrqiwi"/>
          <img src={`/public/qrs/qr-habr-com.svg`} alt="qrhabr"/>
          <img src={`/public/qrs/qr-youtube-com.svg`} alt="qryoutube"/>
        </div>
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
