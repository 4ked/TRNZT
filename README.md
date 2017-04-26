[![npm](https://img.shields.io/npm/l/express.svg)](https://github.com/4ked/TRNZT/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://github.com/4ked/TRNZT) 
[![node.js](https://img.shields.io/badge/node.js-v6.0.0-orange.svg)](https://github.com/4ked/TRNZT) 


TRNZT
=========
This project is to repurpose and rebuild the uber service to expand and renew its original structure. TRNZT offers more to the user and is an open source project incoporating many smaller projects into one, allowing various parts to be picked and used elsewhere.


## Contents

- [Installed Packages](#installed-packages)
- [Usage](#usage)
  	- [Requesting a Self Signed Certificate](#step-one-requesting-a-self-signed-certificate)
  	- [Bypassing the Chrome QUIC Protocol](#step-two-bypassing-the-chrome-quic-protocol)
  	- [Deleting your target IP from the host file](#step-three-deleting-your-target-ip-from-the-host-file)
  	- [Getting the necessary API keys](#step-four-getting-the-necessary-api-keys)
- [Credits](#credits)
- [License](#license)

## Installed Packages

- Bluebird
- Body Parser
- Chai
- Cookie Parser
- Express
- Express-validator
- Fs-Extra
- Geocoder
- MongoDB
- Nock
- Node-uber
- OAuth
- Qs
- Request
- Socket.io

## Usage

TRNZT was written on https, which uses SSL certs specific to each project. So in order for you to get TRNZT working, you will need to get your own.


### Step one: Requesting a Self Signed Certificate
Inside the Server file run:
```sh
openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out client.csr
openssl x509 -req -in client.csr -signkey key.pem -out cert.pem
```
> **Note**: After the second command fill in the optional slots with your own project attributes

For  more information, go to the [setups-https.sh](https://github.com/4ked/TRNZT/blob/master/setup-https.sh) bash script

### Step two: Bypassing the Chrome QUIC Protocol
Now that we've written ourselves a certificate, we need to make a few changes to settings on the chrome browser and your machine to enable a successful run...

To bypass modern web browser security risks with self signed certificates you will need to disable the chrome QUIC protocol. From the chrome browser enter:
```sh
chrome://flags/#enable-quic 
```

### Step three: Deleting your target IP from the host file
Additionally you must make sure that the local.info target IP is not in your host file. You can check by opening terminal and entering:
```sh
sudo vim /etc/hosts 
```
> **Note**: You must be in your root directory

Now TRNZT should be able to run on https://local.info:3000, speaking for the server at least.

### Step four: Getting the necessary API keys
In order for your own modifications to work you will need to get your own API keys/ accounts, but don't worry the process is straight forward.

##### Thankfully there are only two of these...
* [Google Maps API](https://developers.google.com/maps/documentation/javascript/), click the link and select 'Get a key'
* [Uber App API](https://get.uber.com/new-signup/?source=auth&next_url=https%3A%2F%2Fdeveloper.uber.com%2Fdashboard%2F)
> **Note**: Both of these are used throughout the entire TRNZT project, make sure to substitute your own keys appropriately.

You are now officially capable of running TRNZT in the chrome browser on an https server, congratulations!

## Credits

**Outside Sources**
- J.W. Clark's [OpGenerics](https://github.com/JamesWClark/OpGenerics) repo
- Shernshiou's [Node-uber sdk](https://github.com/shernshiou/node-uber) for a Node.js version of the uber API
- Salvador Dali's [Geo Distance Algorithm](http://stackoverflow.com/users/1090562/salvador-dali) for calculating the distance between 2 points
- J.W. Clark's [https server route](https://github.com/JamesWClark/TC/blob/master/server.js) to enable https on local.info
- A modified version of Alvaro Aneiros' [Geocoding Latitude and Longitude script](https://jsfiddle.net/alvaroAV/qn8bb8q5/) which turns an address into coordinates.

**API Uses**
- [UBER](https://developer.uber.com/docs/riders/introduction)
- [Express](https://expressjs.com/en/4x/api.html)
- [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial)
- [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/start)

## LICENSE

[MIT](https://github.com/4ked/TRNZT/blob/master/LICENSE)

**- Built by Max Goeke**