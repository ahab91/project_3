
// Fetch data
d3.json("./alt_fuel.fuel_stations.json").then(data => {
  const fuelStations = data;

  // Populate state dropdown
  const stateDropdown = document.getElementById("stateDropdown");
  const uniqueStates = [...new Set(fuelStations.map(station => station.state))];
  uniqueStates.forEach(state => {
    const option = document.createElement("option");
    option.text = state;
    stateDropdown.appendChild(option);
  });

  // Function to get fastest charging speed
  function getFastestChargingSpeed(station) {
    if (station.ev_dc_fast_num) return "Fast";
    if (station.ev_level2_evse_num) return "Medium";
    if (station.ev_level1_evse_num) return "Slow";
    return "N/A";
  }

  // Function to create a map
  function createMap(id) {
    const map = L.map(id).setView([39.8283, -98.5795], 4); // Default view of the US

    const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const tileLayer = L.tileLayer(tileLayerUrl, {
      maxZoom: 19,
    }).addTo(map);

    return map;
  }

  // Function to update map markers
  function updateMapMarkers(map, filteredStations) {
    const mapLayer = L.layerGroup().addTo(map);

    filteredStations.forEach(station => {
      const marker = L.marker([station.latitude, station.longitude]);
      marker.bindPopup(
        `<strong>${station.station_name}</strong><br>Status: ${station.status_code}<br>Access: ${station.access_code}<br>Fastest Charging Speed: ${getFastestChargingSpeed(station)}`
      );

      const chargingSpeedColor = getFastestChargingSpeed(station) === "Fast" ? "green" : "blue";
      marker.setIcon(L.icon({ iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${chargingSpeedColor}.png` }));

      mapLayer.addLayer(marker);
    });

    return mapLayer;
  }

  // Update charts and data table
  function updateChartsAndTable(filteredStations) {
    // Update charts and data table using the filteredStations data
    // Code for updating charts and data table goes here
  }

  // Event listener for state dropdown change
  stateDropdown.addEventListener("change", function () {
    const selectedState = stateDropdown.value;

    // Clear existing maps
    document.getElementById("map1").innerHTML = "";
    document.getElementById("map2").innerHTML = "";
    document.getElementById("map3").innerHTML = "";

    const filteredStations = fuelStations.filter(station => station.state === selectedState);

    // Create maps
    const map1 = createMap("map1");
    const map2 = createMap("map2");
    const map3 = createMap("map3");

    // Update map markers
    updateMapMarkers(map1, filteredStations);
    updateMapMarkers(map2, filteredStations);
    updateMapMarkers(map3, filteredStations);

    // Update charts and data table
    updateChartsAndTable(filteredStations);
  });
});
