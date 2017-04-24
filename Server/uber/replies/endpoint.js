var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var route = express.Router()


// logger that prevents circular object reference in javascript
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( 
	{ extended: false })
);
app.use(expressValidator()); 

req.sanitizeBody('name').escape();

/***** Data Manipulation Sect *****/

var address = [];

var addressInput 	= document.getElementById("address");
var cityInput 		= document.getElementById("city");
var stateInput 		= document.getElementById("state");
var zipInput 		= document.getElementById("zipcode");

function endpointCreate() {
	address.push(addressInput);
	address.push(cityInput);
	address.push(stateInput);
	address.push(zipInput);
	log(address);
}

module.exports = route;