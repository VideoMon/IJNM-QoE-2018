FROM monroe/base:web

MAINTAINER VideoMon

RUN  echo "export HOME=/" \
		&& export HOME=/ 

RUN echo "install dstat" \
        && apt-get update -q \
        && apt-get install -q -y dstat

RUN echo "install pciutils" \
        && export DEBIAN_FRONTEND=noninteractive \
		&& apt-get install -q -y pciutils


#RUN echo "install numpy, psutil, pandas"
RUN apt-get update -q
#RUN apt-get install -y libblas-dev liblapack-dev liblapacke-dev gfortran
#RUN apt-get install -y python-pip 
#RUN pip install numpy
#RUN pip install psutil
#RUN pip install pandas

# MONROE-Nettest
ARG BUILD_DEPS="git autoconf automake make gcc pkg-config libjson-c-dev libssl-dev uuid-dev liblzma-dev"
ARG PKG_DEPS="libuuid1 traceroute"
ARG NETTEST_URL="https://github.com/lwimmer/rmbt-client"

RUN export DEBIAN_FRONTEND=noninteractive && apt-get install -y --force-yes --no-install-recommends --no-install-suggests \
  $BUILD_DEPS $PKG_DEPS \
  && mkdir -p /opt/monroe \
  && cd /opt/monroe \
  && git clone $NETTEST_URL nettest-client \
  && cd nettest-client && ./autobuild.sh && make install && cd /opt/monroe && rm -rf nettest-client

RUN apt-get install -y --force-yes --no-install-recommends --no-install-suggests \
  iputils-ping

# allow -i option to traceroute for non-root users:
RUN setcap cap_net_raw+ep /usr/bin/traceroute.db

COPY start_combo.sh /opt/monroe/
COPY files_nettest /opt/monroe/
COPY videomon_start.py /opt/monroe/
COPY files_yomo /opt/monroe/
#COPY files_astream /opt/monroe/

COPY files_yomo/autoconfig.js /opt/firefox/defaults/pref
COPY files_yomo/mozilla.cfg  /opt/firefox
COPY files_yomo/{d10d0bf8-f5b5-c8b4-a8b2-2b9879e08c5d}.xpi /opt/firefox/browser/extensions

ENTRYPOINT ["dumb-init", "--", "/usr/bin/python", "/opt/monroe/videomon_start.py"]
