FROM centos:7

LABEL project="Pastor"
LABEL version="0.1.0"
LABEL maintainer="rafael@gumieri.com"

RUN curl --silent --location https://rpm.nodesource.com/setup_8.x | bash - \
  && yum install -y \
    nodejs \
# Chromium dependencies
    GConf2 \
    gtk3 \
    libX11 \
    libXScrnSaver \
    redhat-lsb \
# Fonts
    xorg-x11-utils \
    xorg-x11-fonts-misc \
    xorg-x11-fonts-75dpi \
    xorg-x11-fonts-100dpi \
    xorg-x11-fonts-Type1 \
    xorg-x11-fonts-cyrillic \
    adobe-source-code-pro-fonts \
    dejavu-sans-fonts \
    ipa-gothic-fonts \
    libreoffice-opensymbol-fonts \
  && yum clean all

WORKDIR pastor

COPY package.json package-lock.json ./

RUN npm install --production

COPY ./index.js ./

ENV PORT 8080

EXPOSE 8080

CMD ["node", "index.js"]
