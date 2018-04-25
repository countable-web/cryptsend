# CryptSend.io

## run

```
docker-compose up
```

visit localhost:1234

## concept

Send files anywhere->anywhere securely

The concept is that it's 2018 and there's no really good general purpose file sharing tool.

| Feature | WeTransfer etc. | FTP | email | Our Product |
| --- | --- | --- | --- | --- |
| open source | no | yes | some | yes |
| trustless client encryption | no | no | no | yes |
| self host | no | some | some | yes |
| web interface | yes | some | some | yes |
| secure link / no auth | no | no | no | yes |
| works with big files | some | yes | no | yes |

This would be useful for any transmission of sensitive data you don't want a trail of in emails, or for files too big for email. The closest thing I've found to this service is things like wetransfer.com but they only fill half the above bullets.

TODO: 
  - client receive mode
  - electron / cordova / whatever packaging for devices?
