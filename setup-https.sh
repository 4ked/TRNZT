### 
### Help commands
###

# which git 	--> 	user path
# man which		-->		BSD Command manual
# git status	--> 	current git status
# sudo su		-->		back out to root directory
# cd /etc		-->		Access system properties

###
### OpenSSL	keygen (Created inside root directory)
###

# navigate to Server > bin folder

openssl genrsa -out key.pem 2048
openssl req -new -key key.pem -out client.csr

#	Country Name (2 letter code) [AU]:US
#	State or Province Name (full name) [Some-State]:Missouri
#	Locality Name (eg, city) []:Kansas City
#	Organization Name (eg, company) [Internet Widgits Pty Ltd]: TRNZT
#	Organizational Unit Name (eg, section) []: AppDev
#	Common Name (e.g. server FQDN or YOUR name) []:local.info
#	Email Address []: max.goeke0@gmail.com
#	Please enter the following 'extra' attributes
#	to be sent with your certificate request
#	A challenge password []: Rock
#	An optional company name []:

openssl x509 -req -in client.csr -signkey key.pem -out cert.pem

# disable QUIC protocol on Chrome flags --> chrome://flags/#enable-quic

# remove target IP from hosts file
#	From root... 
sudo vim /etc/hosts

# Pass chrome security restraints

https://local.info:3000