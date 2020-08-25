import React, { createRef } from 'react';
import AutocompleteDirectionsHandler from '../../services/googlemaps';

class GoogleMap extends React.Component {
  googleMapRef = createRef();

  componentDidMount = () => {
    const googleMapScript = document.createElement('script');

    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`;

    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {
      this.googleMap = this.createGoogleMap();
    });
  };

  createGoogleMap = () => {
    const map = new window.google.maps.Map(
      this.googleMapRef.current,
      {
        zoom: 16,
        center: {
          lat: 8.5241,
          lng: 76.9366,
        },
        disableDefaultUI: true,
      },
    );
    new AutocompleteDirectionsHandler(map);
  };

  render() {
    return (
      <div
        id="map"
        ref={this.googleMapRef}
        style={{ width: '400px', height: '300px' }}
      ></div>
    );
  }
}

export default GoogleMap;
