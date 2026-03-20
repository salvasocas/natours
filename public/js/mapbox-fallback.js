(function () {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof mapboxgl === 'undefined') return;

  const token = mapEl.dataset.mapboxToken;
  if (!token) return;

  let locations = [];
  try {
    locations = JSON.parse(mapEl.dataset.locations || '[]');
  } catch (e) {
    return;
  }

  if (!Array.isArray(locations) || locations.length === 0) return;

  // Skip if a map has already been rendered into the container.
  if (mapEl.querySelector('.mapboxgl-canvas')) return;

  mapboxgl.accessToken = token;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML('<p>Day ' + loc.day + ': ' + loc.description + '</p>')
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
})();
