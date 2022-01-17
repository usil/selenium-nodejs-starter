FROM node:14

RUN echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN echo "Comenzando actualizacion"
RUN apt-get update
RUN echo "Finalizando actualizacion"
RUN apt-get -y install libxpm4 libxrender1 libgtk2.0-0 libnss3 libgconf-2-4
RUN apt-get -y install xvfb gtk2-engines-pixbuf
RUN apt-get -y install xfonts-cyrillic xfonts-100dpi xfonts-75dpi xfonts-base xfonts-scalable
RUN apt-get -y install google-chrome-stable

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app/

COPY . /usr/src/app
RUN ls -la /usr/src/app/

RUN npm install
RUN npm run start
