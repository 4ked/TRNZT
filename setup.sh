### start-up static IP connection
ssh -i ~/.ssh/my-ssh-key mgoeke@[IP_ADDRESS]

sudo apt-get update
sudo apt-get upgrade -y

sudo apt-get install git -y

git config --global user.email $GIT_EMAIL
git config --global user.name $GIT_NAME

git clone https://github.com/4ked/TRNZT.git
mkdir TRNZT/bin

###
### Node.js
###

# Node.js is available from the NodeSource Debian and Ubuntu binary distributions repository (formerly Chris Lea's Launchpad PPA). Support for this repository, along with its scripts, can be found on GitHub at nodesource/distributions.
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install nodejs -y

# symlink the `nodejs` executable as `node` instead
sudo ln -s "$(which nodejs)" /usr/local/bin/node

###
### MONGODB
###

# 1. Import the public key used by the package management system.
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6

# 2. Create a /etc/apt/sources.list.d/mongodb-org-3.4.list file for MongoDB.
echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list

# 3. Reload local package database.
sudo apt-get update

# 4. Install the MongoDB packages.
sudo apt-get install -y mongodb-org

# Once MongoDB installs, start the service, and ensure it starts when your server reboots:
sudo systemctl enable mongod.service
sudo systemctl start mongod

###
### Letsencrypt
###

# Step 1: Install Certbot, the Let's Encrypt Client
# Add the backports repository to your server by typing:
echo 'deb http://ftp.debian.org/debian jessie-backports main' | sudo tee /etc/apt/sources.list.d/backports.list

# After adding the new repository, update the apt package index to download information about the new packages:
sudo apt-get update

# Once the repository is updated, you can install the python-certbot-apache package, which pulls in certbot, by targeting the backports repository:
#sudo apt-get install python-certbot-apache -t jessie-backports -y
sudo apt-get install certbot -t jessie-backports -y

sudo certbot certonly --standalone -d mg.jwclark.info -m max.goeke0@gmail.com --agree-tos

cp /etc/letsencrypt/live/mg.jwclark.info/privkey.pem /home/mgoeke/TC/bin/privkey.pem
cp /etc/letsencrypt/live/mg.jwclark.info/fullchain.pem /home/mgoeke/TC/bin/fullchain.pem

# Debian 8 - Update Iptables on boot
# http://unix.stackexchange.com/questions/209393/debian-8-update-iptables-on-boot
sudo apt-get install iptables-persistent -y

# setup port forwarding
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 443 -j REDIRECT --to-port 4043

# persist the IP tables
sudo netfilter-persistent save -y

# TODO
# run node as service
# http://stackoverflow.com/a/28542093/1161948



# Notes
# How To Secure Apache with Let's Encrypt on Debian 8
# https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-debian-8
#
# Installing Node.js via package manager
# https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
