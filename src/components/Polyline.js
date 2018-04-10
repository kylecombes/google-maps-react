import React from 'react'
import PropTypes from 'prop-types'

import { camelize } from '../lib/String'
const evtNames = ['click', 'mouseout', 'mouseover'];

const wrappedPromise = function() {
    var wrappedPromise = {},
        promise = new Promise(function (resolve, reject) {
            wrappedPromise.resolve = resolve;
            wrappedPromise.reject = reject;
        });
    wrappedPromise.then = promise.then.bind(promise);
    wrappedPromise.catch = promise.catch.bind(promise);
    wrappedPromise.promise = promise;

    return wrappedPromise;
}

export class Polyline extends React.Component {
  componentDidMount() {
    this.polylinePromise = wrappedPromise();
    this.renderPolyline();
  }

  componentDidUpdate(prevProps) {
    const propsToCheckForChanges = [
      'map',
      'path',
      'strokeColor',
      'strokeOpacity',
      'strokeWeight',
      'name',
    ];
    let propChanged = false;
    for (let i in propsToCheckForChanges) {
      const propName = propsToCheckForChanges[i];
      if ((Object.hasOwnProperty.call(this.props, propName) || Object.hasOwnProperty.call(prevProps, propName)) &&
        (this.props[propName] !== prevProps[propName])) {
        propChanged = true;
        break;
      }
    }
    if (propChanged) {
      if (this.polyline) {
        this.polyline.setMap(null);
      }
      this.renderPolyline();
    }
  }

  componentWillUnmount() {
    if (this.polyline) {
      this.polyline.setMap(null);
    }
  }

  renderPolyline() {
    const {
      map,
      google,
      path,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      ...props
    } = this.props;

    if (!google) {
        return null;
    }

    const params = {
      map,
      path,
      strokeColor,
      strokeOpacity,
      strokeWeight,
      ...props
    };

    this.polyline = new google.maps.Polyline(params);

    evtNames.forEach(e => {
      this.polyline.addListener(e, this.handleEvent(e));
    });

    this.polylinePromise.resolve(this.polyline);
  }

  getPolyline() {
    return this.polylinePromise;
  }

  handleEvent(evt) {
    return (e) => {
      const evtName = `on${camelize(evt)}`
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.polyline, e);
      }
    }
  }

  render() {
    return null;
  }
}

Polyline.propTypes = {
  path: PropTypes.array,
  strokeColor: PropTypes.string,
  strokeOpacity: PropTypes.number,
  strokeWeight: PropTypes.number
}

evtNames.forEach(e => Polyline.propTypes[e] = PropTypes.func)

Polyline.defaultProps = {
  name: 'Polyline'
}

export default Polyline
