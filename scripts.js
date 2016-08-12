var googleMapsApp = angular.module('googleMapsApp',[]);
googleMapsApp.controller('googleMapsController', function($scope, $http){

  $scope.filteredCities = [];


  $scope.placesTypes = [
    'accounting',
    'airport',
    'amusement_park',
    'aquarium',
    'art_gallery',
    'atm',
    'bakery',
    'bank',
    'bar',
    'beauty_salon',
    'bicycle_store',
    'book_store',
    'bowling_alley',
    'bus_station',
    'cafe',
    'campground',
    'car_dealer',
    'car_rental',
    'car_repair',
    'car_wash',
    'casino',
    'cemetery',
    'church',
    'city_hall',
    'clothing_store',
    'convenience_store',
    'courthouse',
    'dentist',
    'department_store',
    'doctor',
    'electrician',
    'electronics_store',
    'embassy',
    'establishment (deprecated)',
    'finance (deprecated)',
    'fire_station',
    'florist',
    'food (deprecated)',
    'funeral_home',
    'furniture_store',
    'gas_station',
    'general_contractor (deprecated)',
    'grocery_or_supermarket',
    'gym',
    'hair_care',
    'hardware_store',
    'health (deprecated)',
    'hindu_temple',
    'home_goods_store',
    'hospital',
    'insurance_agency',
    'jewelry_store',
    'laundry',
    'lawyer',
    'library',
    'liquor_store',
    'local_government_office',
    'locksmith',
    'lodging',
    'meal_delivery',
    'meal_takeaway',
    'mosque',
    'movie_rental',
    'movie_theater',
    'moving_company',
    'museum',
    'night_club',
    'painter',
    'park',
    'parking',
    'pet_store',
    'pharmacy',
    'physiotherapist',
    'place_of_worship (deprecated)',
    'plumber',
    'police',
    'post_office',
    'real_estate_agency',
    'restaurant',
    'roofing_contractor',
    'rv_park',
    'school',
    'shoe_store',
    'shopping_mall',
    'spa',
    'stadium',
    'storage',
    'store',
    'subway_station',
    'synagogue',
    'taxi_stand',
    'train_station',
    'transit_station',
    'travel_agency',
    'university',
    'veterinary_care',
    'zoo'
];

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
    var infoWindow = new google.maps.InfoWindow({});
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);

    // creating markers on the map based on the city.js file and the lats and lons
    function createMarker(city){
      var icon = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2%7CFE7569'
      // if(city.yearRank == 1){
      //   icon = 'images/1.png';
      // }else if(city.yearRank == 39){
      //   icon = 'images/atl.png'
      // }
    	// console.log(city);
      var contentString = city.city + '<p>Population: ' + city.lastCensus + '</p>' + 
                          '<p><img src="images/'+city.city+'.jpg"></p>';
    	var cityLatlng = {lat: city.lat, lng: city.lon};
	    var marker = new google.maps.Marker({
	        position: cityLatlng,
	       	map: map,
	       	title: city.city,
          icon: icon
	    });
    	
	    // when you click on the marker it opens the infoWindow
    	google.maps.event.addListener(marker, 'click', function(){
        infoWindow.setContent(contentString);
    		infoWindow.open(map, marker)
    	});

    	markers.push(marker);
	};

	// when you click on the the triggerclick link in the html file it brings up the infowindow
	$scope.triggerClick = function(index, city){
    var chicago = {lat: 41.85, lng: -87.65};
		google.maps.event.trigger(markers[index],"click");
    // map.setCenter(chicago);
	}

	// loop through the cities array in the cities.js file and run the createMarker function them
	$scope.cities = cities;
	for(var i = 0; i < $scope.cities.length; i++){
		createMarker($scope.cities[i])
	}

  $scope.updateMarkers = function(){
    for(var i=0; i < markers.length; i++){
      markers[i].setMap(null);
    }
    for(var i=0; i < $scope.filteredCities.length; i++){
      createMarker($scope.filteredCities[i]);
    }

  };

  $scope.getDirections = function(lat, lon){

    var destination = new google.maps.LatLng(lat, lon);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('modalDirections'));
    directionsService.route({
            origin: 'Atlanta',
            destination: destination,
            travelMode: 'DRIVING'
          }, function(response, status) {
            if (status === 'OK') {
              directionsDisplay.setDirections(response);
            } else {
              window.alert('Directions request failed due to ' + status);
            }
          });

  }

  $scope.zoomToCity = function(lat, lon){
    var bounds = new google.maps.LatLngBounds();
    var cityLatLon = new google.maps.LatLng(lat, lon);
    map = new google.maps.Map(document.getElementById('map'),
      {
        zoom: 10,
        center: cityLatLon
      }

      );

      infowindow = new google.maps.InfoWindow();
        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch({
          location: cityLatLon,
          radius: 2000,
          type: $scope.myPlaces
        }, callback);

        function callback(results, status) {
          console.log(results);
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createPointOfInterest(results[i]);
          }
        }
      }

      function createPointOfInterest(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(map, this);
        });
        bounds.extend(marker.getPosition());

      }

      // map.fitBounds(bounds);

  }

});

















