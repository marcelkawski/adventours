/* eslint-disable */

const locations = JSON.parse(document.getElementById('map').dataset.locations);

// from Mapbox
// mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken =
    'pk.eyJ1IjoibWthd3NraSIsImEiOiJjbDkwMXpmMzUwcTB1M3dtdHFvZWI1MzM1In0.vyKhzArskXL3bsfq4ubimQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
});
