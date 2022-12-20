FROM ubuntu:latest
RUN apt install systemd
RUN timedatectl set-timezone Asia/Kolkata
RUN apt update
RUN apt install -y net-tools postgresql curl unzip
RUN service postgresql start
RUN bash -c "curl -fsSL https://raw.githubusercontent.com/FusionAuth/fusionauth-install/master/install.sh | bash -s"
RUN //fusionauth/bin/startup.sh