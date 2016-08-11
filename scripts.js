var googleMapsApp = angular.module('googleMapsApp',[]);
googleMapsApp.controller('googleMapsController', function($scope, $http){

	var myLatlng = {lat: 40.0000, lng: -98.0000};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: myLatlng,
        styles: [
            {
              featureType: 'all',
              stylers: [
                { saturation: -80 }
              ]
            },{
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers: [
                { hue: '#00ffee' },
                { saturation: 50 }
              ]
            },{
              featureType: 'poi.business',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' }
              ]
            }
          ]
    });

    var markers = [];

    // creating markers on the map based on the city.js file and the lats and lons
    function createMarker(city){
    	console.log(city);
    	var cityLatlng = {lat: city.lat, lng: city.lon};
	    var marker = new google.maps.Marker({
	        position: cityLatlng,
	       	map: map,
	       	title: city.city
	    });

	    // creating variable infoWindow
	    var infoWindow = new google.maps.InfoWindow({
        content: city.city
    	});

	    // when you click on the marker it opens the infoWindow
    	google.maps.event.addListener(marker, 'click', function(){
    		infoWindow.open(map, marker)
    	});

    	markers.push(marker);
	};

	// when you click on the the triggerclick link in the html file it brings up the infowindow
	$scope.triggerClick = function(index){
		google.maps.event.trigger(markers[index],"click");
	}

	// loop through the cities array in the cities.js file and run the createMarker function them
	$scope.cities = cities;
	for(var i = 0; i < $scope.cities.length; i++){
		createMarker($scope.cities[i])
	}

});