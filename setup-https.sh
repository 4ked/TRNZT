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
openssl x509 -req -in client.csr -signkey key.pem -out cert.pem

# disable QUIC protocol on Chrome flags --> chrome://flags/#enable-quic

# remove target IP from hosts file
#	From root... 
sudo vim /etc/hosts

# Pass chrome security restraints