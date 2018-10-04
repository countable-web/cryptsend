# CryptSend.io

### Stop leaking private data on the cloud.
Share files with people you trust, and not all the cloud providers in between.

## Quickstart

Before you start, make sure you have docker and docker-compose installed on your machine

1. Grab the repo
```
git clone git@github.com:countable-web/cryptsend.git
```

2. Run docker setup
```
docker-compose up
```

Your site should now be running at 0.0.0.0:1234

## Concept

Send files anywhere -> anywhere securely

The concept is that it's 2018 and there's no really good general purpose file sharing tool.

| Feature | WeTransfer etc. | FTP | email | CryptSend |
| --- | --- | --- | --- | --- |
| open source | no | yes | some | yes |
| trustless client encryption | no | no | no | yes |
| self host | no | some | some | yes |
| web interface | yes | some | some | yes |
| secure link / no auth | no | no | no | yes |
| works with big files | some | yes | no | yes |
| dependency free (javascript) | no | some | no | yes |

This would be useful for any transmission of sensitive data you don't want a trail of in emails, or for files too big for email. The closest thing I've found to this service is things like wetransfer.com but they only fill some of the above bullets.

## Discussion

We manage issues and features in [Trello](https://trello.com/b/8NzklvZI/cryptsend-public), not the GitHub issues.
