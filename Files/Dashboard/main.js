
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

  // Create Leaflet map
  const map = L.map("map").setView([39.8283, -98.5795], 4); // Default view of the US

  const tileLayerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const tileLayer = L.tileLayer(tileLayerUrl, {
    maxZoom: 19,
    attribution: 'Map data © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Function to get fastest charging speed
  function getFastestChargingSpeed(station) {
    if (station.ev_dc_fast_num) return "Fast";
    if (station.ev_level2_evse_num) return "Medium";
    if (station.ev_level1_evse_num) return "Slow";
    return "N/A";
  }

  // Function to update map markers
  function updateMapMarkers(filteredStations) {
    const mapLayer = L.layerGroup().addTo(map);

    filteredStations.forEach(station => {
      const marker = L.marker([station.latitude, station.longitude], { icon: getMarkerIcon(station) });

      marker.bindPopup(
        `<strong>${station.station_name}</strong><br>Status: ${station.status_code}<br>Access: ${station.access_code}<br>Fastest Charging Speed: ${getFastestChargingSpeed(station)}`
      );

      mapLayer.addLayer(marker);
    });

    return mapLayer;
  }

  // Function to get marker icon based on charging speed
  function getMarkerIcon(station) {
    const chargingSpeed = getFastestChargingSpeed(station);
    let markerIconUrl = "";

    switch (chargingSpeed) {
      case "Fast":
        markerIconUrl = "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
        break;
      case "Medium":
        markerIconUrl = "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png";
        break;
      case "Slow":
        markerIconUrl = "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";
        break;
      default:
        markerIconUrl = "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gray.png";
        break;
    }

    return L.icon({ iconUrl: markerIconUrl, iconSize: [20, 30], iconAnchor: [10, 30] });
  }

  // Function to update stacked bar chart
  function updateBarChart(filteredStations) {
    // Calculate station counts by charging speed for electric stations
    const counts = { Fast: 0, Medium: 0, Slow: 0, NA: 0 };
    filteredStations.forEach(station => {
      if (station.fuel_type_code === "ELEC") {
        const chargingSpeed = getFastestChargingSpeed(station);
        counts[chargingSpeed]++;
      }
    });

    // Prepare data for Chart.js
    const labels = ["Fast", "Medium", "Slow", "N/A"];
    const data = labels.map(label => counts[label]);

    // Update or create chart
    const chartContainer = document.getElementById("barChart");
    if (chartContainer.chart) {
      chartContainer.chart.data.labels = labels;
      chartContainer.chart.data.datasets[0].data = data;
      chartContainer.chart.update();
    } else {
      const ctx = chartContainer.getContext("2d");
      chartContainer.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [{
            label: "Number of Electric Stations",
            data,
            backgroundColor: ["#2ca02c", "#ffcc00", "#ff4136", "#d3d3d3"],
          }],
        },
        options: {
          scales: {
            x: { stacked: true },
            y: { stacked: true },
          },
          plugins: {
            title: {
              display: true,
              text: "Number of Electric Stations",
            },
          },
          legend: {
            display: false,
          },
        },
      });
    }
  }

  // Event listener for state dropdown change
  stateDropdown.addEventListener("change", function () {
    const selectedState = stateDropdown.value;

    // Clear existing map markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const filteredStations = fuelStations.filter(station => station.state === selectedState);

    // Update map markers
    updateMapMarkers(filteredStations);

    // Update stacked bar chart
    updateBarChart(filteredStations);
  });
});
