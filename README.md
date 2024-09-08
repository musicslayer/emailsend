# emailsend
A simple library for relaying or sending emails to SMTP/LMTP servers. This is a streamlined version of "node-sendmail" (https://github.com/guileen/node-sendmail).

## Installation Instructions
npm install @musicslayer/emailsend

## API
> emailsend.relayEmail(mail, options)

Manually relay mail to other domains. This should not require authentication.
- This requires port 24 (LMTP) or 25 (SMTP) to be open, something that residential ISPs do not always allow.
- If an email is sent from a residential IP address, the email server may reject it before it even gets to the recipient.

> emailsend.sendEmail(mail, serverPort, serverHost, options)
Use another server to do the relaying. This often requires authentication, but is usually allowed by residential ISPs.

For example, to relay the email to Gmail so that they can send it to the intended recipient, you might use serverPort = 465 and serverHost = "smtp.gmail.com".

### mail
**mail** is a struct representing the entirety of an email's content that will be passed to "nodemailer/lib/mail-composer".

See [here](https://nodemailer.com/extras/mailcomposer/#e-mail-message-fields) for more information.

For example:
```
const mail = {
    from: "bob@gmail.com",
    to: "dana@outlook.com",
    subject: "Important Email",
    text: "Here is some very important information."
}
```

### options
**options** is a struct that allows you to configure how an email is send. Each field and its possible values are enumerated below.

#### auth
**auth** is a struct whose fields are the authentication credentials. This is usually only needed when relaying an email through a third-party service, such as Gmail.
accessToken
authMethod
pass
user

#### dkim
**dkim** is a struct whose fields are the DKIM credentials. If you do not wish to provide any, leave this struct as undefined.
privateKey
keySelector

#### dns
**dns** is a struct whose fields are various DNS options.
domainIPs
domainNames
numTries
timeout

#### email
**email** is a struct whose fields are various options that affect how the email is sent.

crlfClient
crlfServer
isLMTP
timeout

#### logger
**logger** is a struct whose fields are various options that affect how the email is sent.
isColor
logFcn

#### socket
**socket** is a struct whose fields are various options that affect how the email is sent.
encoding
timeout

#### tls
**tls** is a struct whose fields are various options that affect how the email is sent.
cert
key
strict

## Example Usage
example.js demonstrates relaying and sending emails. Note that external modules "dkim-signer" and "nodemailer/lib/mail-composer" are used.
example2.js demonstrates stand-alone functionality to generate message strings and DKIM signatures without "dkim-signer" or "nodemailer/lib/mail-composer".
