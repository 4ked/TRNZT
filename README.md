# TRNZT [![npm](https://img.shields.io/npm/v/npm.svg)](https://github.com/4ked/TRNZT) [![node.js](https://img.shields.io/badge/node.js-v6.0.0-orange.svg)](https://github.com/4ked/TRNZT) [![MyGet](https://img.shields.io/myget/mongodb/v/MongoDB.Driver.Core.svg)](https://github.com/4ked/TRNZT) [![socket.io](https://img.shields.io/badge/socket.io-v1.7.3-green.svg)](https://github.com/4ked/TRNZT)

Rather than worrying about your next transport, Tranzyt makes things simple. Select your ride options, and you're set, everything you could imagine is available around you. Easily see what's currently available and at what cost, even the amount of time it's going to take.

Installed Packages
------------

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

Running
------------
Assuming you have already cloned the directory, to bypass google chromes security protocols for self signed certificates(which we are using), we must make a few minor changes. 

In order to run the app on local.info with https routes you will need to disable the chrome QUIC protocol. From the chrome browser enter:
```sh
chrome://flags/#enable-quic 
```
Note that additionally you must make sure that the local.info target IP is not in your host file. You can check by opening terminal and entering:
```sh
sudo vim /etc/hosts 
```
> **Note**: You must be in your root directory for this command to work

Now TRNZT should be able to run on https://local.info:3000

Credits
------------
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


**- Built by Max Goeke**