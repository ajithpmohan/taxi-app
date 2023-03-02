class AutocompleteDirectionsHandler {
  constructor(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'DRIVING';
    this.directionsService =
      new window.google.maps.DirectionsService();
    this.directionsRenderer =
      new window.google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);

    const originInput = document.getElementById('origin-input');
    const destinationInput = document.getElementById(
      'destination-input',
    );

    const originAutocomplete =
      new window.google.maps.places.Autocomplete(originInput);
    // Specify just the place data fields that you need.
    originAutocomplete.setFields(['place_id']);

    const destinationAutocomplete =
      new window.google.maps.places.Autocomplete(destinationInput);
    // Specify just the place data fields that you need.
    destinationAutocomplete.setFields(['place_id']);

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
  }

  setupPlaceChangedListener = (autocomplete, mode) => {
    const me = this;
    autocomplete.bindTo('bounds', this.map);

    autocomplete.addListener('place_changed', function () {
      const place = autocomplete.getPlace();

      if (!place.place_id) {
        window.alert(
          'Please select an option from the dropdown list.',
        );
        return;
      }
      if (mode === 'ORIG') {
        me.originPlaceId = place.place_id;
      } else {
        me.destinationPlaceId = place.place_id;
      }
      me.route();
    });
  };

  route = () => {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    const me = this;

    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: this.travelMode,
      },
      function (response, status) {
        if (status === 'OK') {
          me.directionsRenderer.setDirections(response);
        } else {
          window.alert(`Directions request failed due to ${status}`);
        }
      },
    );
  };
}

export default AutocompleteDirectionsHandler;
