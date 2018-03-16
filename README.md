# sendcrypt (new name pending)
Send files anywhere->anywhere securely

The concept is that it's 2018 and there's no really good general purpose file sharing tool that lets you.

  * self host like FTP, but modern interface.
  * encrypt on the client, so it's trustless
  * totally cross platform.
  * send direct to another device running the service, or to a server instance you control.
  * requires no authentication, generate a secure URL instead.
  * works with `curl -X post`
  * open source so it can be trusted not to be evil, like leak keys to the server or a 3rd party.

This would be useful for any transmission of sensitive data you don't want a trail of in emails, or for files too big for email. The closest thing I've found to this service is things like wetransfer.com but they only fill half the above bullets.

TODO: 
  - client encryption
  - client receive mode
  - electron / cordova / whatever packaging for devices?
