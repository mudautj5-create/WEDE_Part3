/* Interactive Leaflet map showing more than one service location (contact.html).
   Locations are fictional service hubs for this hypothetical organisation. */
(function () {
  'use strict';

  var el = document.getElementById('map');
  if (!el) { return; }
  if (typeof L === 'undefined') {
    el.innerHTML = '<p class="no-results">The map could not be loaded. Our service areas are Polokwane, Mbombela, Bloemfontein and Pietermaritzburg.</p>';
    return;
  }

  var locations = [
    { name: 'Polokwane hub (Limpopo)', lat: -23.9045, lng: 29.4689, note: 'Head office and field support' },
    { name: 'Mbombela hub (Mpumalanga)', lat: -25.4753, lng: 30.9694, note: 'Orchard and drip irrigation projects' },
    { name: 'Bloemfontein hub (Free State)', lat: -29.0852, lng: 26.1596, note: 'Maize and grain farm installations' },
    { name: 'Pietermaritzburg hub (KwaZulu-Natal)', lat: -29.6006, lng: 30.3794, note: 'Cooperative and community projects' }
  ];

  var map = L.map('map', { scrollWheelZoom: false }).setView([-26.9, 28.6], 5);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  var bounds = [];
  locations.forEach(function (loc) {
    var marker = L.marker([loc.lat, loc.lng], { title: loc.name }).addTo(map);
    var popup = document.createElement('div');
    var strong = document.createElement('strong');
    strong.textContent = loc.name;
    var p = document.createElement('p');
    p.style.margin = '.3rem 0 0';
    p.textContent = loc.note;
    popup.appendChild(strong);
    popup.appendChild(p);
    marker.bindPopup(popup);
    bounds.push([loc.lat, loc.lng]);
  });
  map.fitBounds(bounds, { padding: [30, 30] });

  /* Enable scroll zoom only after the map is clicked, so page scrolling on phones is not hijacked */
  map.on('click', function () { map.scrollWheelZoom.enable(); });
  map.on('mouseout', function () { map.scrollWheelZoom.disable(); });
})();
