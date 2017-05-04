/************************************
*****
*****		Map Design
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
*****	JS to get queried string from url
*****
************************************/

// Read a page's GET URL variables and return them as an associative array.
function urlStrngz(name, url) {
    if (!url) url = window.location.search;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

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
		headers: {
			'Authorization': access_token
		},
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
            'Authorization': access_token
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
*****	Geocode the target address
*****
************************************/
// establish global variables
var goalat;
var goalng;

$(document).ready(function() {
	
	var button = document.getElementById('address-form-button');
	button.addEventListener("click", function () {
		var address = document.getElementById('address').value;
		getLocation(showResult, address)
	});
	
	var access_token = urlStrngz('access_token');
	
	productDisplays();
});

function productDisplays() {
	// Get the seperate strings from the queried url
	var product_names = urlStrngz('product_names');
	var product_descriptions = urlStrngz('product_descriptions');
	
	// Seperate items of the strings with jquery
	var namesarr = product_names.split(',');
	var descsarr = product_descriptions.split(',');
	
	// pushing new data into the alloted index positions
	document.getElementById('productID1').value = namesarr[0];
	document.getElementById('productID2').value = namesarr[1];
	document.getElementById('productID3').value = namesarr[2];
	document.getElementById('productID1d').value = descsarr[0];
	document.getElementById('productID2d').value = descsarr[1];
	document.getElementById('productID3d').value = descsarr[2];
}

function showResult(result) {
    goalat = result.geometry.location.lat();
	goalng = result.geometry.location.lng()
	
	document.getElementById('endLat').value = result.geometry.location.lat();
    document.getElementById('endLon').value = result.geometry.location.lng();
	
	log("it worked!");
	
	var uri = '/v1.2/requests?start_latitude=' + pos.lat + '&start_longitude=' + pos.lng + '&end_latitude=' + goalat + '&end_longitude=' + goalng;
	log(uri);
	/*
	http.get(uri, function(request, response) {
		
	});
	*/
}

function getLocation(callback, address) {
    
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


