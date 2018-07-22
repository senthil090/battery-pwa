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