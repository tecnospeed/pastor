FROM centos:7

LABEL project="Pastor"
LABEL version="0.1.0"
LABEL maintainer="rafael.gumieri@tecnospeed.com.br"

RUN curl --silent --location https://rpm.nodesource.com/setup_10.x | bash - \
  && yum install -y \
    nodejs \
    GConf2 \
    gtk3 \
    libX11 \
    libXScrnSaver \
    redhat-lsb \
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

RUN curl --silent --location --output /usr/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 \
  && chmod +x /usr/bin/dumb-init

ENTRYPOINT ["/usr/bin/dumb-init", "--"]

RUN useradd --no-log-init --create-home pastor

USER pastor

WORKDIR /home/pastor

ENV PORT 8080

EXPOSE 8080

COPY --chown=pastor:pastor package.json package-lock.json ./

RUN npm install --production

COPY --chown=pastor:pastor ./ ./

CMD ["node", "index.js"]
