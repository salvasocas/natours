(function () {
  const mapEl = document.getElementById('map');
  if (!mapEl || typeof L === 'undefined') return;

  let locations = [];
  try {
    locations = JSON.parse(mapEl.dataset.locations || '[]');
  } catch (e) {
    return;
  }

  if (!Array.isArray(locations) || locations.length === 0) return;

  const map = L.map('map', {
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  const bounds = L.latLngBounds();

  locations.forEach((loc) => {
    const latlng = [loc.coordinates[1], loc.coordinates[0]];

    L.marker(latlng)
      .addTo(map)
      .bindPopup('Day ' + loc.day + ': ' + loc.description);

    bounds.extend(latlng);
  });

  map.fitBounds(bounds, {
    paddingTopLeft: [100, 200],
    paddingBottomRight: [100, 150],
  });
})();
