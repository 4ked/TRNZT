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







module.exports = route