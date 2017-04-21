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
uber.authorization({
    authorization_code: 'YOUR AUTH CODE'
}, function(err, res) {
    if (err) {
        console.error(err);
    } else {
        // store the user id and associated properties:
        // access_token = res[0], refresh_token = res[1], scopes = res[2]),and token expiration date = res[3]
        console.log('New access_token retrieved: ' + res[0]);
        console.log('... token allows access to scopes: ' + res[2]);
        console.log('... token is valid until: ' + res[3]);
        console.log('... after token expiration, re-authorize using refresh_token: ' + res[1]);

        uber.products.getAllForLocation(3.1357169, 101.6881501, function(err, res) {
            if (err) console.error(err);
            else console.log(res);
        });
    }
});