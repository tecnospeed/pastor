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

## About the Docker image

- CentOS 7
- Node 8.x

### Chromium dependencies
- GConf2
- gtk3
- libX11
- libXScrnSaver
- redhat-lsb

### Supported Fonts
#### A
#### B
##### Bitstream Charter
- Bitstream Charter:style=Bold
- Bitstream Charter:style=Bold Italic
- Bitstream Charter:style=Italic
- Bitstream Charter:style=Regular
#### C
##### Century Schoolbook
- Century Schoolbook L:style=Bold Italic
- Century Schoolbook L:style=Bold
- Century Schoolbook L:style=Italic
- Century Schoolbook L:style=Roman
##### Courier 10 Pitch
- Courier 10 Pitch:style=Bold Italic
- Courier 10 Pitch:style=Italic
- Courier 10 Pitch:style=Regular
#### D
##### DejaVu Sans
- DejaVu Sans:style=Book
- DejaVu Sans:style=Bold Oblique
- DejaVu Sans:style=Oblique
- DejaVu Sans,DejaVu Sans Condensed:style=Condensed,Book
- DejaVu Sans,DejaVu Sans Condensed:style=Condensed Bold Oblique,Bold Oblique
- DejaVu Sans,DejaVu Sans Condensed:style=Condensed Oblique,Oblique
- DejaVu Sans,DejaVu Sans Condensed:style=Condensed Bold,Bold
- DejaVu Sans,DejaVu Sans Light:style=ExtraLight
##### Dingbats
- Dingbats:style=Regular
#### E
#### F
#### G
#### H
#### I
##### IPAGothic,IPAゴシック
- IPAGothic,IPAゴシック:style=Regular
#### J
#### K
#### L
#### M
#### N
##### Nimbus Roman No9 L
- Nimbus Roman No9 L:style=Medium
- Nimbus Roman No9 L:style=Medium Italic
- Nimbus Roman No9 L:style=Regular
##### Nimbus Sans L
- Nimbus Sans L:style=Regular
##### Nimbus Mono L
- Nimbus Mono L:style=Bold Oblique
- Nimbus Mono L:style=Bold
- Nimbus Mono L:style=Regular
- Nimbus Mono L:style=Regular Oblique
##### Nimbus Sans L
- Nimbus Sans L:style=Bold Condensed
- Nimbus Sans L:style=Bold Condensed Italic
- Nimbus Sans L:style=Regular Condensed
- Nimbus Sans L:style=Regular Condensed Italic
- Nimbus Sans L:style=Regular Italic
#### O
##### OpenSymbol
- OpenSymbol:style=Regular
#### P
#### Q
#### R
#### S
##### Standard Symbols L
- Standard Symbols L:style=Regular
#### T
#### U
##### URW Bookman L
- URW Bookman L:style=Demi Bold Italic
- URW Bookman L:style=Light Italic
- URW Bookman L:style=Light
##### URW Gothic L
- URW Gothic L:style=Book
- URW Gothic L:style=Book Oblique
- URW Gothic L:style=Demi
- URW Gothic L:style=Demi Oblique
##### URW Palladio L
- URW Palladio L:style=Bold
- URW Palladio L:style=Bold Italic
- URW Palladio L:style=Italic
- URW Palladio L:style=Roman
##### Utopia
- Utopia:style=Bold Italic
- Utopia:style=Italic
- Utopia:style=Regular
#### W
#### V
#### X
#### Y
#### Z
