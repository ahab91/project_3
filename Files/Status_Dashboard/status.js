d3.json("./alt_fuel.fuel_stations.json").then(data => {
  const fuelStations = data;

  // Populate state dropdown
const stateDropdown = document.getElementById("stateDropdown");
const uniqueStates = [...new Set(fuelStations.map(station => station.state))];
const sortedStates = uniqueStates.sort(); // Sort the states alphabetically

sortedStates.forEach(state => {
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

  // Function to update map markers
  function updateMapMarkers(filteredStations) {
    const mapLayer = L.layerGroup().addTo(map);

    filteredStations.forEach(station => {
      const marker = L.marker([station.latitude, station.longitude], { icon: getMarkerIcon(station) });

      marker.bindPopup(
        `<strong>${station.station_name}</strong><br>Status: ${getStatusDescription(station.status_code)}<br>Access: ${station.access_code}`
      );

      mapLayer.addLayer(marker);
    });

    return mapLayer;
  }

  // Function to get marker icon based on status_code
  function getMarkerIcon(station) {
    const statusCode = station.status_code || "null";
    let markerIconUrl = "";

    switch (statusCode) {
      case "E":
        markerIconUrl = "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
        break;
      case "P":
        markerIconUrl = "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png";
        break;
      case "T":
        markerIconUrl = "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";
        break;
      default:
        markerIconUrl = "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gray.png";
        break;
    }

    return L.icon({ iconUrl: markerIconUrl, iconSize: [20, 30], iconAnchor: [10, 30] });
  }

  // Function to get status code description
  function getStatusDescription(statusCode) {
    switch (statusCode) {
      case "E":
        return "Available";
      case "P":
        return "Planned";
      case "T":
        return "Temporarily Unavailable";
      default:
        return "Unknown";
    }
  }

  // Function to update stacked bar chart
  function updateBarChart(filteredStations) {
    // Calculate station counts by status_code for electric stations
    const counts = { E: 0, P: 0, T: 0, null: 0 };
    filteredStations.forEach(station => {
      if (station.fuel_type_code === "ELEC") {
        const statusCode = station.status_code || "null";
        counts[statusCode]++;
      }
    });

    // Prepare data for Chart.js
    const labels = ["Available", "Planned", "Temporarily Unavailable", "Unknown"];
    const data = labels.map(label => counts[getStatusLetter(label)]);

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
            label: "Number of Electric Stations by Availability",
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
              text: "Number of Electric Stations by Availability",
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

function getStatusLetter(description) {
  switch (description) {
    case "Available":
      return "E";
    case "Planned":
      return "P";
    case "Temporarily Unavailable":
      return "T";
    default:
      return "null";
  }
}
