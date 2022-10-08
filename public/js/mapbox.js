/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);

// from Mapbox
// mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken =
    'pk.eyJ1IjoibWthd3NraSIsImEiOiJjbDkwMXpmMzUwcTB1M3dtdHFvZWI1MzM1In0.vyKhzArskXL3bsfq4ubimQ';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mkawski/cl90445ko005715pr399fv6bh',
    // center: [-118.113491, 34.111745],
    // zoom: 10,
    // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // create marker
    const marker = document.createElement('div');
    marker.className = 'marker';

    // add marker
    new mapboxgl.Marker({
        element: marker,
        anchor: 'bottom', // bottom of the image = exact GPS location
    })
        .setLngLat(loc.coordinates)
        .addTo(map);

    // extend map bounds to include marker
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        // in pixels
        top: 200,
        bottom: 200,
        left: 100,
        right: 100,
    },
});
