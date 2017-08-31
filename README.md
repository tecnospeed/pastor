# Pastor

A RESTful API to generate Portable Document Format (PDF) converting from Hypertext Markup Language (HTML).

## API Usage

### GET

#### Query String
```
http://localhost:8080?url=http://address
```

```
http://localhost:8080?url=http%3A%2F%2Faddress
```

### POST/PUT/PATCH

#### JSON with the URL
```json
{
  "url": "http://address"
}
```

#### multipart/form-data with the HTML
```bash
curl -X POST \
  http://localhost:8080/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'html=@/example'
```

## Docker

It's being stored on Docker Hub [tecnospeed/pastor](https://hub.docker.com/r/tecnospeed/pastor/). Based on `centos:7` and installing `Node 8.x` following the [official instructions](https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora).

Some dependencies (GConf2, gtk3, libX11, libXScrnSaver and redhat-lsb) are installed to run properly the Chromium on CentOS 7.

The [puppeteer](https://github.com/GoogleChrome/puppeteer) `install.js` script is responsible for downloading the Chromium during the `npm install`.

## Demo
The project is running under the name TecnoSpeed Printer at:
```
https://api.tecnospeed.com.br/printer/v1
```
For demonstration, feel free to use the token (as header) below:
```
x-api-key: xbVP99TsPA5ZvVTjg41BI9YNfYfxKB549wfZI3FC
```
Just here is necessary to explicitly request (header too) for a pdf:
```
Accept: application/pdf
```
