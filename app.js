const myMap = L.map('map').setView([9.072264, 7.491302], 6);  
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>&mdash;<a>GoldenHeart_007</a>'
const OSM = L.tileLayer(tileUrl, { attribution });
OSM.addTo(myMap);

function generateList() {
    const ul = document.querySelector('.list');
    storeList.forEach((shop) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        const a = document.createElement('a');
        const p = document.createElement('p');  
        a.addEventListener('click', () => {
            flyToStore(shop);
        });        
        div.classList.add('shop-item');
        a.innerText = shop.properties.name;
        a.href = '#';
        p.innerText = shop.properties.address;

        div.appendChild(a);
        div.appendChild(p);
        li.appendChild(div);
        ul.appendChild(li); 
    });
}

generateList();

function makePopupContent(shop) {
    return `
        <div>
            <h4>${shop.properties.name}</h4>
            <p>${shop.properties.address}</p>
            <div class="phone-number">
                <a href="tel:${shop.properties.phone}">${shop.properties.phone}</a>
            </div>
        </div>
    `;
}
function onEachFeature(feature, layer) {
    layer.bindPopup(makePopupContent(feature), { closeButton: true, offset: L.point(0, -8) });
}

const shopsLayer = L.geoJSON(storeList, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.shapeMarker(latlng, {
	shape: "triangle",
	rotation: 180,
        fillColor: "blue",
        fillOpacity: 0.7,
	color: "blue",
        radius: "10"
})
}
});shopsLayer.addTo(myMap);

function flyToStore(store) {
    const lat = store.geometry.coordinates[1]; 
    const lng = store.geometry.coordinates[0];
    myMap.flyTo([lat, lng], 14, {
        duration: 3
    });
    setTimeout(() => {
        L.popup({closeButton: true, offset: L.point(0, -8)})
        .setLatLng([lat, lng])
        .setContent(makePopupContent(store))
        .openOn(myMap);
    }, 3000);
}

//Google Satellite_Map Initialization
const googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
attribution: 'Tiles &copy; <a>Google Map Data, 2022</a>',
maxZoom: 20,
subdomains:['mt0','mt1','mt2','mt3']
}).addTo(myMap);

//Google Street_Map Initialization
const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
attribution: 'Tiles &copy; <a>Google Map Data, 2022</a>',  
maxZoom: 20,
subdomains:['mt0','mt1','mt2','mt3']
}).addTo(myMap);

//Environmental Systems Research Institute (ESRI)_World Street_Map Initialization
const Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
attribution: 'Tiles &copy; <a>Esri</a>&mdash;<a>GoldenHeart_007</a>'
}).addTo(myMap);

//All Map Layers Controls
const baseMaps = {
"Open Street Map": OSM,
"Google Streets": googleStreets,
"Google Satellite": googleSat,
"World Street Map": Esri_WorldStreetMap
};

const overlayMaps = {
"Open Street Map": OSM
};
const layerControl = L.control.layers (baseMaps, overlayMaps, {collapsed: true}).addTo(myMap);

//North Arrow
var north = L.control({position: "topright"});
north.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML = '<img src="compass-icon.png">';
    return div;
}
north.addTo(myMap);

//Leaflet Scalebar
L.control.betterscale({
    position: "bottomleft",
    maxWidth: 150,
    imperial: false,
    metric: true,
    updateWhenIdle: !1
}).addTo(myMap);

//Realtime Geolocation I
L.geolet({ position: 'topright' }).addTo(myMap);

//Realtime Geolocation II
L.control.locate({ position: 'topright'}).addTo(myMap);







