document.addEventListener("DOMContentLoaded", function() {
    let busData = [];
    const fromSelect = document.getElementById('from-input');
    const toSelect = document.getElementById('to-input');

    // Fetch bus data
    fetch('bus_timing_data.json')
        .then(response => response.json())
        .then(data => {
            busData = data;
            populateLocations(data);
        })
        .catch(error => console.error('Error fetching bus timings:', error));

    // Populate unique locations in dropdowns
    function populateLocations(data) {
        const locations = new Set();
        data.forEach(bus => {
            locations.add(bus.From);
            locations.add(bus.To);
        });

        const sortedLocations = Array.from(locations).sort();
        
        sortedLocations.forEach(location => {
            fromSelect.add(new Option(location, location));
            toSelect.add(new Option(location, location));
        });
    }

    function formatTimings(timingsString) {
        return `<div class="flex flex-wrap gap-1">
            ${timingsString.split(',')
                .map(time => `<span class="inline-block bg-gray-100 rounded px-2 py-1 text-sm">${time.trim()}</span>`)
                .join('')}
        </div>`;
    }

    // Function to display buses
    function displayBuses(buses) {
        const busTimingsBody = document.getElementById('bus-timings-body');
        const noResults = document.getElementById('no-results');
        const searchResultsHeading = document.getElementById('search-results-heading');
        
        busTimingsBody.innerHTML = '';
        
        if (buses.length === 0) {
            noResults.classList.remove('hidden');
            searchResultsHeading.textContent = 'No Results Found';
            return;
        }

        noResults.classList.add('hidden');
        searchResultsHeading.textContent = `Found ${buses.length} bus(es)`;

        buses.forEach(bus => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition-colors duration-200';
            row.innerHTML = `
                <td class="px-6 py-4 border-b border-gray-200">${bus["Sl. No."]}</td>
                <td class="px-6 py-4 border-b border-gray-200">${bus["From"]}</td>
                <td class="px-6 py-4 border-b border-gray-200">${bus["To"]}</td>
                <td class="px-6 py-4 border-b border-gray-200">${bus["Type"] || 'Regular'}</td>
                <td class="px-6 py-4 border-b border-gray-200 max-w-md">
                    ${formatTimings(bus["Departure Timings"])}
                </td>
                <td class="px-6 py-4 border-b border-gray-200">${bus["Route Length"]} km</td>
                <td class="px-6 py-4 border-b border-gray-200">
                    <div class="relative group">
                        <button class="text-blue-600 hover:text-blue-800">
                            View Stops (${bus.Stops.length})
                        </button>
                        <div class="hidden group-hover:block absolute z-10 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px] left-0">
                            <ul class="space-y-2">
                                ${bus.Stops.map(stop => `<li class="text-gray-700">${stop}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </td>
            `;
            busTimingsBody.appendChild(row);
        });
    }

    // Search functionality
    document.getElementById('search-button').addEventListener('click', function() {
        const fromValue = fromSelect.value;
        const toValue = toSelect.value;

        if (!fromValue || !toValue) {
            alert('Please select both source and destination');
            return;
        }

        const filteredBuses = busData.filter(bus => {
            return bus["From"] === fromValue && bus["To"] === toValue;
        });

        displayBuses(filteredBuses);
    });
});