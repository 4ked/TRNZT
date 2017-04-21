var Uber 			= require('node-uber'); // import uber api
var geocoder		= require('geocoder'); // coordinate geocoder

// create new Uber instance
var uber = new Uber({
  client_id: 'LJGpana69PX47lPLFP5PpIdySYT5CT-G',
  client_secret: 'mgtzL4Ok7Ibyfb4ecvO-PpQhQJbgTLF3SC_vS8RN',
  server_token: 'Drp9ApEpmWdRKUIsf3CS3RGCmvo-tTDRGzYV6BDv',
  redirect_uri: 'https://local.info:3000',
  name: 'TRNZT',
  language: 'en_US', // optional, defaults to en_US
  sandbox: true // optional, defaults to false
});

var authUrl = uber.getAuthorizeUrl(['history','profile', 'request', 'places', 'all_trips', 'ride_widgets']);

// redirect user to the authURL

// the authorizarion_code will be provided via the callback after logging in using the authURL
uber.authorizationAsync({
        authorization_code: 'YOUR AUTH CODE'
    })
    .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
        // store the user id and associated access_token, refresh_token, scopes and token expiration date
        console.log('New access_token retrieved: ' + access_token);
        console.log('... token allows access to scopes: ' + authorizedScopes);
        console.log('... token is valid until: ' + tokenExpiration);
        console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

        // chain the promise to retrive all products for location
        return uber.products.getAllForLocationAsync(3.1357169, 101.6881501);
    })
    .then(function(res) {
        // response with all products
        console.log(res);
    })
    .error(function(err) {
        console.error(err);
    });