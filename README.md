# Pastor

A RESTful API to generate Portable Document Format (PDF) converting from Hypertext Markup Language (HTML).

## API Usage

### Sending an URL

It's possible to request by GET for an URL (at the query string) to be converted:
```
http://localhost:8080?url=http%3A%2F%2Faddress
```
The URL can also be informed as **multipart/form-data**, an example of `curl` command:
```bash
curl -X POST \
  http://localhost:8080/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F url=http://address
```
Or as JSON (`content-type: application/json`):
```json
{
  "url": "http://address"
}
```

### Sending a HTML file

The way to send the HTML to be converted is send it as **multipart/form-data**, follows an example of `curl` command:
```bash
curl -X POST \
  http://localhost:8080/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'html=@/example'
```

### Specifying a media tpye

Allowed types are `print` (default) and `screen`.
Set your desired mediaType using the query parameter `mediaType`

```bash
  http://localhost:8080/?mediaType=screen
```

or a form field named `mediaType`.

```bash
  curl [...] \
    -F 'mediaType=screen'
```

## Docker

It can be found at the Docker Hub as [tecnospeed/pastor](https://hub.docker.com/r/tecnospeed/pastor/).

More details can be found at the [pastor's Wiki](https://github.com/tecnospeed/pastor/wiki/Docker).

## Demo
The project is running under the name TecnoSpeed Printer at:
```
https://api.tecnospeed.com.br/printer/v1
```
For demonstration, feel free to use the token below:
```
x-api-key: xbVP99TsPA5ZvVTjg41BI9YNfYfxKB549wfZI3FC
```
Just here is necessary to explicitly request for a pdf:
```
Accept: application/pdf
```
