
// Fetch data
d3.json("alt_fuel.fuel_stations.json").then(data => {
  let fuelStations = data.filter(station => station.fuel_type_code === "E");

  // Populate state dropdown
  let stateDropdown = document.getElementById("stateDropdown");
  let uniqueStates = [...new Set(fuelStations.map(station => station.state))];
  uniqueStates.forEach(state => {
    let option = document.createElement("option");
    option.text = state;
    stateDropdown.appendChild(option);
  });

  // Event listener for state dropdown change
  stateDropdown.addEventListener("change", function () {
    let selectedState = stateDropdown.value;
    updateCharts(selectedState);
  });

  // Update charts and summary table
  function updateCharts(selectedState) {
    let filteredStations = fuelStations.filter(station => station.state === selectedState);
    
    // Update summary table
    updateSummaryTable(filteredStations);

    // Update stacked bar chart
    updateStackedBarChart(filteredStations);

    // Update pie chart
    updatePieChart(filteredStations);
  }

  // Function to update summary table
  function updateSummaryTable(filteredStations) {
    // Calculate counts and display in summary table
    let totalCount = filteredStations.length;
    let level1Count = filteredStations.filter(station => station.ev_level1_evse_num).length;
    let level2Count = filteredStations.filter(station => station.ev_level2_evse_num).length;
    let dcFastCount = filteredStations.filter(station => station.ev_dc_fast_num).length;
    let publicCount = filteredStations.filter(station => station.access_code === "public").length;
    let privateCount = totalCount - publicCount;

    document.getElementById("totalStations").textContent = totalCount;
    document.getElementById("level1Stations").textContent = level1Count;
    document.getElementById("level2Stations").textContent = level2Count;
    document.getElementById("dcFastStations").textContent = dcFastCount;
    document.getElementById("publicStations").textContent = publicCount;
    document.getElementById("privateStations").textContent = privateCount;
  }

  // Function to update stacked bar chart
  function updateStackedBarChart(filteredStations) {
    // Calculate data for the chart
    let fuelTypes = ["ELEC", "LPG", "CNG"];
    let data = fuelTypes.map(fuelType => {
      let publicCount = filteredStations.filter(station => station.access_code === "public" && station.fuel_type_code === fuelType).length;
      let privateCount = filteredStations.filter(station => station.access_code === "private" && station.fuel_type_code === fuelType).length;
      return { fuelType, publicCount, privateCount };
    });

    // Update the chart using the data
    // Replace this part with your actual code to update the chart
    // Example using Chart.js:
    // UpdateChart("stackedBarChart", data);
  }

  // Function to update pie chart
  function updatePieChart(filteredStations) {
    // Calculate data for the chart
    let availabilityCounts = {};
    filteredStations.forEach(station => {
      if (!availabilityCounts[station.status_code]) {
        availabilityCounts[station.status_code] = 0;
      }
      availabilityCounts[station.status_code]++;
    });

    let labels = Object.keys(availabilityCounts);
    let data = labels.map(label => availabilityCounts[label]);

    // Update the chart using the data
    // Replace this part with your actual code to update the chart
    // Example using Chart.js:
    // UpdateChart("pieChart", labels, data);
  }

  // Initial update with the first state in the dropdown
  updateCharts(uniqueStates[0]);
});
