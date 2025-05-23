(function(){
	document.addEventListener('DOMContentLoaded',function(){

			var level = document.getElementById('level');
	var charging = document.getElementById('charging');
	var discharging = document.getElementById('discharging');

	var filler = document.getElementById('filler');
	var stopColors = document.getElementsByClassName('stop-color');
	var fillColors = document.getElementsByClassName('fill');
	var strokeColors = document.getElementsByClassName('stroke');
	var safeTheme = ['#27f4b9','#29f4bc'];
	var dangerTheme = ['#e7342d','#e05824'];
	var initFiller = 150;
	function monitorBattery(battery){
		console.log(battery);
		battery.onchargingchange = batteryUI.bind(null,battery);
		battery.onchargingtimechange = batteryUI.bind(null,battery);
		battery.ondischargingtimechange = batteryUI.bind(null,battery);
		battery.onlevelchange = batteryUI.bind(null,battery);
		batteryUI(battery);
	}

	if(navigator.getBattery){
		navigator.getBattery().then(monitorBattery);
	}

	function batteryUI(battery){
		var theme;
		var diff;
		if(battery.level > .3){
			theme = safeTheme;
		}else{
			theme = dangerTheme;
		}
		for(var i=0;i<stopColors.length;i++){
				stopColors[i].setAttribute("stop-color",theme[0]);
		}
		for(var i=0;i<fillColors.length;i++){
			fillColors[i].setAttribute("fill",theme[1]);
		}
		for(var i=0;i<strokeColors.length;i++){
			strokeColors[i].setAttribute("stroke",theme[1]);
		}
		diff = (1 - battery.level)*200;
		filler.setAttribute('cy',initFiller+diff);

		level.innerHTML = ceil(battery.level * 100) ;
		charging.innerHTML = timeCalculator(battery.chargingTime);
		discharging.innerHTML = timeCalculator(battery.dischargingTime);

	}

	function timeCalculator(seconds){
		if(seconds === Infinity) {
			return '&infin;';
		}
		var minutes = seconds / 60;
		if(minutes > 60){
			return floor(minutes/60) + 'hr+'
		}else{
			return ceil(minutes) + 'm';
		}
	}

	function ceil(num){
		return Math.ceil(num);
	}	

	function floor(num){
		return Math.floor(num);
	}

	let map, locationMarker; // Map and marker variables
	const locationLoader = document.getElementById('location-loader');

	// Geolocation functions
	function displayLocation(position) {
		const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;

		if (locationLoader.style.display !== 'none') {
			locationLoader.style.display = 'none';
		}

		document.getElementById('location-details').textContent = `Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} | Accuracy: ${accuracy.toFixed(0)}m`;
		document.getElementById('altitude').textContent = 'Altitude: ' + (altitude ? altitude + ' meters' : 'N/A');
		document.getElementById('altitudeAccuracy').textContent = 'Altitude Accuracy: ' + (altitudeAccuracy ? altitudeAccuracy + ' meters' : 'N/A');
		document.getElementById('heading').textContent = 'Heading: ' + (heading ? heading : 'N/A');
		document.getElementById('speed').textContent = 'Speed: ' + (speed ? speed : 'N/A');
		document.getElementById('timestamp').textContent = 'Timestamp: ' + (new Date(position.timestamp)).toLocaleString();

		if (!map) { // Initialize map if it doesn't exist
			map = L.map('map').setView([latitude, longitude], 13);
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			}).addTo(map);
			locationMarker = L.marker([latitude, longitude]).addTo(map)
				.bindPopup(`You are here! (Accuracy: ${accuracy.toFixed(0)}m)`).openPopup();
		} else { // Update existing map
			map.setView([latitude, longitude], map.getZoom());
			locationMarker.setLatLng([latitude, longitude])
				.setPopupContent(`You are here! (Accuracy: ${accuracy.toFixed(0)}m)`).openPopup();
		}

		fetchWeather(latitude, longitude);
	}

	function handleLocationError(error) {
		console.error('Error getting location:', error.message);
		if (locationLoader.style.display !== 'none') {
			locationLoader.style.display = 'none';
		}
		document.getElementById('location-details').textContent = 'Location: Error - ' + error.message;
	}

	// Navigator info function
	function displayNavigatorInfo() {
		document.getElementById('appCodeName').textContent = 'App Code Name: ' + navigator.appCodeName;
		document.getElementById('appName').textContent = 'App Name: ' + navigator.appName;
		document.getElementById('appVersion').textContent = 'App Version: ' + navigator.appVersion;
		document.getElementById('cookieEnabled').textContent = 'Cookie Enabled: ' + navigator.cookieEnabled;
		document.getElementById('language').textContent = 'Language: ' + navigator.language;
		document.getElementById('onLine').textContent = 'Online: ' + navigator.onLine;
		document.getElementById('platform').textContent = 'Platform: ' + navigator.platform;
		document.getElementById('product').textContent = 'Product: ' + navigator.product;
		document.getElementById('userAgent').textContent = 'User Agent: ' + navigator.userAgent;
	}

	// Weather placeholder function
	const WEATHER_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key
	function fetchWeather(latitude, longitude) {
		document.getElementById('weather-summary').textContent = `Fetching weather for lat: ${latitude}, lon: ${longitude}...`;
		// TODO: Implement actual weather API call here
		// Example using OpenWeatherMap (replace with your chosen API and key)
		// const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`;
		// fetch(weatherApiUrl)
		// .then(response => response.json())
		// .then(data => {
		// 	 document.getElementById('weather-summary').textContent = 'Summary: ' + data.weather[0].description;
		// 	 document.getElementById('weather-temperature').textContent = 'Temperature: ' + data.main.temp + ' °C';
		// 	 document.getElementById('weather-humidity').textContent = 'Humidity: ' + data.main.humidity + '%';
		//   document.getElementById('weather-wind-speed').textContent = 'Wind Speed: ' + data.wind.speed + ' m/s';
		// 	 document.getElementById('weather-visibility').textContent = 'Visibility: ' + (data.visibility ? data.visibility + ' m' : 'N/A');
		// 	 document.getElementById('weather-pressure').textContent = 'Pressure: ' + data.main.pressure + ' hPa';
		// })
		// .catch(error => {
		// 	 console.error('Error fetching weather:', error);
		// 	 document.getElementById('weather-summary').textContent = 'Weather: Error fetching data';
		// });
	}

	// Call functions after DOM content is loaded
	if (navigator.geolocation) {
		locationLoader.style.display = 'block'; // Show loader before starting geolocation
		// Use watchPosition for continuous updates
		navigator.geolocation.watchPosition(displayLocation, handleLocationError, { enableHighAccuracy: true });
	} else {
		if (locationLoader.style.display !== 'none') {
			locationLoader.style.display = 'none';
		}
		document.getElementById('location-details').textContent = 'Location: Geolocation not supported.';
	}

	displayNavigatorInfo();

	// Bluetooth functions
	async function scanBluetoothDevices() {
		const deviceList = document.getElementById('bluetoothDeviceList');
		const statusDisplay = document.getElementById('bluetoothStatus');
		deviceList.innerHTML = ''; // Clear previous results
		statusDisplay.classList.add('scanning');
		statusDisplay.textContent = 'Status: Scanning...';

		try {
			const device = await navigator.bluetooth.requestDevice({
				acceptAllDevices: true,
				optionalServices: ['device_information'] // Requesting an optional service
			});
			statusDisplay.classList.remove('scanning');
			statusDisplay.textContent = 'Status: Device found! Connecting...';
			
			// For now, we'll just display the device name/id.
			const listItem = document.createElement('li');
			listItem.textContent = `Device Name: ${device.name || 'N/A'}, ID: ${device.id}`;
			listItem.style.opacity = 0; // For animation
			deviceList.appendChild(listItem);
			
			// Simple fade-in animation
			setTimeout(() => listItem.style.opacity = 1, 100);

			statusDisplay.textContent = 'Status: Scan complete. Device listed.';
			console.log('Found device:', device);

		} catch (error) {
			statusDisplay.classList.remove('scanning');
			statusDisplay.textContent = `Status: Error - ${error.message}`;
			console.error('Bluetooth scan error:', error);
		}
	}

	// Check for Web Bluetooth API support
	if ('bluetooth' in navigator) {
		document.getElementById('scanBluetoothButton').addEventListener('click', scanBluetoothDevices);
	} else {
		document.getElementById('bluetoothStatus').textContent = 'Status: Web Bluetooth API not supported in this browser.';
		document.getElementById('scanBluetoothButton').disabled = true;
	}

	});
	/**
	* Service Worker initialization
	*/
	if(navigator.serviceWorker){
		navigator.serviceWorker.register('./service-worker.js').then(function(){
			console.log('Service Worker Registered')
		});
	}
})();