# emailsend
A simple library for relaying or sending emails to SMTP/LMTP servers.

example.js demonstrates relaying and sending emails. Note that "dkim-signer" and "nodemailer/lib/mail-composer" are used. The former should come with NodeJS, but the latter must be installed:
```
npm install nodemailer
```
example2.js demonstrates stand-alone functionality to generate message strings and DKIM signatures without "nodemailer/lib/mail-composer" or "dkim-signer".
