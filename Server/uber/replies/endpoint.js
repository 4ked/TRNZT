var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var route = express.Router()


app.use(bodyParser.json());
app.use(bodyParser.urlencoded( 
	{ extended: false })
);
app.use(expressValidator()); 

req.sanitizeBody('name').escape();

var addressInput 	= document.getElementById("address");
var cityInput 		= document.getElementById("city");
var stateInput 		= document.getElementById("state");
var zipInput 		= document.getElementById("zipcode");

var address = [
	addressInput, 
	cityInput, 
	stateInput, 
	zipInput
];

function endpointCreate() {
	address.push(addressInput);
	address.push(cityInput);
	address.push(stateInput);
	address.push(zipInput);
	console.log(address);
}



module.exports = route