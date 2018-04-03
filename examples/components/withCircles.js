import React from 'react';

import Map from '../../src/index';
import Circle from '../../src/components/Circle';

const WithCircles = React.createClass({
  render: function() {
    if (!this.props.loaded) {
      return <div>Loading...</div>;
    }

    const center = { lat: 37.784915, lng: -122.402687 };

    return (
      <Map google={this.props.google}
          style={{width: '100%', height: '100%', position: 'relative'}}
          className={'map'}
          zoom={14}>
          <Circle
            center={center}
            strokeColor="#0000FF"
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor="#0000FF"
            fillOpacity={0.2}
            radius={200}
          />
      </Map>
    )
  }
});

export default WithCircles;
