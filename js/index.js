let map; // gebruik dit om de map gemakkelijk aan te spreken doorheen de applicatie

init();

function init() {
	// initialise de kaart
	map = L.map("map").setView([50.8466, 4.3517], 13);
	// voeg een tile layer toe, met URL https://a.tile.openstreetmap.org/{z}/{x}/{y}.png
	L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);
	// vergeet openstreetmap attributie niet

	// gebruik de functie "loadMarkers" om de markers toe te voegen
	loadMarkers();
}

function loadMarkers() {
	// fetch de data van opendata.brussels.be
	// als er coordinaten beschikbaar zijn, kan je de addMarker functie gebruiken om een marker toe te voegen op de kaart
	fetch(
		"https://opendata.bruxelles.be/api/explore/v2.1/catalog/datasets/toilettes_publiques_vbx/records?limit=20"
	)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			for (let i = 0; i < data.results.length; i++) {
				let toilet = data.results[i];
				if (
					toilet.geo_point_2d &&
					toilet.geo_point_2d.lat &&
					toilet.geo_point_2d.lon
				) {
					addMarker(toilet.geo_point_2d.lat, toilet.geo_point_2d.lon);
				}
			}
		})
		.catch(function (error) {
			console.error("Data error:", error);
		});
}

function addMarker(lat, lon) {
	var marker = L.marker([lat, lon]).addTo(map);
	marker.bindPopup("<b>Openbaar toilet</b>");

	var circle = L.circle([lat, lon], {
		color: "blue",
		fillColor: "#30f",
		fillOpacity: 0.2,
		radius: 100,
	}).addTo(map);

	marker = L.marker([50.8411, 4.3238]).addTo(map);
	marker.bindPopup("<b>Erasmushogeschool Campus Kaai</b>");

	circle = L.circle([50.8411, 4.3238], {
		color: "red",
		fillColor: "#30f",
		fillOpacity: 0.2,
		radius: 100,
	}).addTo(map);

	var popup = L.popup();

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You clicked the map at " + e.latlng.toString())
			.openOn(map);
	}

	map.on("click", onMapClick);
}
