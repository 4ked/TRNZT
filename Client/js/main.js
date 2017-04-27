/************************************
*****
*****		Map Work
*****
************************************/
var pos = {};

var map, infoWindow;
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		styles:  [
		  {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          }
		]
	});
	infoWindow = new google.maps.InfoWindow;

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			
			pos.lat = position.coords.latitude;
			pos.lng = position.coords.longitude;
			
			document.getElementById('startLat').value = pos.lat;
			document.getElementById('startLng').value = pos.lng;
			
			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			infoWindow.open(map);
			map.setCenter(pos);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}  

/************************************
*****
*****	logger that prevents circular object reference in javascript
*****
************************************/
var log = function(msg, obj) {
    console.log('\n');
    if(obj) {
        try {
            console.log(msg + JSON.stringify(obj));
        } catch(err) {
            var simpleObject = {};
            for (var prop in obj ){
                if (!obj.hasOwnProperty(prop)){
                    continue;
                }
                if (typeof(obj[prop]) == 'object'){
                    continue;
                }
                if (typeof(obj[prop]) == 'function'){
                    continue;
                }
                simpleObject[prop] = obj[prop];
            }
            console.log('circular-' + msg + JSON.stringify(simpleObject)); // returns cleaned up JSON
        }        
    } else {
        console.log(msg);
    }
};

/************************************
*****
*****	OpGenerics stuff
*****
************************************/

function route(url) {
  return 'https://local.info:3000' + url;
}

var http = {};

http.post = function(url, json, success, error) {
	$.ajax({
		url: route(url),
		method: 'POST',
		data: json,
		//headers: {
		//	'Authorization': authResponse.id_token
		//},
		success: function(data, statusText, jqXHR) {
			if (success) success(data, statusText, jqXHR);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			if (error) error(jqXHR, textStatus, errorThrown);
		}
	});
};

http.get = function(url, success, error) {
    $.ajax({
        url: route(url),
        method: 'GET',
        headers: {
            'Authorization': authResponse.id_token
        },
        success: function(data, statusText, jqXHR) {
            if (success) success(data, statusText, jqXHR);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (error) error(jqXHR, textStatus, errorThrown);
        }
    });
};

http.put = function(url, json, success, error) {
    $.ajax({
        url: route(url),
        method: 'PUT',
        data: json,
        headers: {
            'Authorization': authResponse.id_token
        },
        success: function(data, statusText, jqXHR) {
            if (success) success(data, statusText, jqXHR);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (error) error(jqXHR, textStatus, errorThrown);
        }
    });
};

http.delete = function(url, success, error) {
    $.ajax({
        url: route(url),
        method: 'DELETE',
        headers: {
            'Authorization': authResponse.id_token
        },
        success: function(data, statusText, jqXHR) {
            if (success) success(data, statusText, jqXHR);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            if (error) error(jqXHR, textStatus, errorThrown);
        }
    });
};

/************************************
*****
*****	Data Manipulation Sect
*****
************************************/

/*
function endpointCreate() {
	var address = {};
	address.location = {}; // where the user currently is
	address.destination = {}; // entered end destination

	address.destination.street 		= $("#address").val();
	address.destination.city 		= $("#city").val();
	address.destination.state 		= $("#state").val();
	address.destination.zip 		= $("#zip").val();
	address.destination.txt 		= address.destination.street + ", " + address.destination.city + ", " + address.destination.state + ", " + address.destination.zip;

	http.post('/api/endpoint', address,
	function(data, statusText, jqXHR) { // success
		if(jqXHR.status === 200) {
			// then it worked for sure - b/c your server said it was a good request
			log("we in");
			
			log(address.destination.txt);
		}
	},
    function() { // error
		//todo: error
		log("it didn't work:(")
	});
};
*/


/************************************
*****
*****	Geocode the target address
*****
************************************/
// establish global variables
var goalat;
var goalng;

$(document).ready(function() {
	// $('#address-form-button').click(endpointCreate);
	
	var button = document.getElementById('address-form-button');

	button.addEventListener("click", function () {
		var address = document.getElementById('address').value;
		getLatitudeLongitude(showResult, address)
	});
	
});

function showResult(result) {
    goalat = result.geometry.location.lat();
	goalng = result.geometry.location.lng()
	document.getElementById('endLat').value = result.geometry.location.lat();
    document.getElementById('endLon').value = result.geometry.location.lng();
	
	log("it worked!");
	
	var uri = '/v1.2/requests?start_latitude=' + pos.lat + '&start_longitude=' + pos.lng + '&end_latitude=' + goalat + '&end_longitude=' + goalng;
	log(uri);
	/*http.get(uri, function(request, response) {
		
	});
	*/
}

function getLatitudeLongitude(callback, address) {
    
	var address = {};
	address.location = {}; // where the user currently is
	address.destination = {}; // entered end destination

	address.destination.street 		= $("#address").val();
	address.destination.city 		= $("#city").val();
	address.destination.state 		= $("#state").val();
	address.destination.zip 		= $("#zip").val();
	address.destination.txt 		= address.destination.street + ", " + address.destination.city + ", " + address.destination.state + ", " + address.destination.zip;
	
	address = address.destination.txt;
    // Initialize the Geocoder
    geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({
            'address': address
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                callback(results[0]);
				log(address);
				var td = distance(pos.lat, pos.lng, goalat, goalng, "M");
            }
        });
    } 
}

/************************************
*****
*****	Geo Distance algorithm
*****
************************************/

// GeoDataSource.com (C) All Rights Reserved 2015

function distance(lat1, lng1, goalat, goalng, unit) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * goalat/180
	var theta = lng1-goalng
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515
	if (unit=="K") { dist = dist * 1.609344 }
	if (unit=="N") { dist = dist * 0.8684 }
	log("start lat: " + lat1 + " start lng: " + lng1);
	log("end lat: " + goalat + " end lng: " + goalng);
	log("Estimated travel distance: " + dist + " miles");
	document.getElementById('travelDist').value = dist;
	return dist
}

/************************************
*****	
*****	Get requests for server
*****
************************************/






