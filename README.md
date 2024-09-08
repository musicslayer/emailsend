# emailsend
A simple library for relaying or sending emails to SMTP/LMTP servers. This is a rewriting of "node-sendmail" (https://github.com/guileen/node-sendmail).

## Installation Instructions
npm install @musicslayer/emailsend

## API
> emailsend.sendEmail(mail, options)

Send an email directly.
- This should not require any authentication.
- This requires port 24 (LMTP) or 25 (SMTP) to be open, something that residential ISPs do not always allow.
- If an email is sent from a residential IP address, an email server may reject it before it even gets to the intended recipients.

> emailsend.relayEmail(mail, serverPort, serverHost, options)

Send the email to a relay server, who will then send it to the intended recipients.
- This often requires authentication, but is usually allowed by residential ISPs.
- For example, to relay the email to Gmail so that they can send it to the intended recipient, you might use serverPort = 465 and serverHost = "smtp.gmail.com".

## Arguments
- **mail** is a struct representing the entirety of an email's content. This struct will be passed to "nodemailer/lib/mail-composer" (see [here](https://nodemailer.com/extras/mailcomposer/#e-mail-message-fields) for more information).

    For example:
    ```
    const mail = {
        from: "bob@gmail.com",
        to: "dana@outlook.com",
        subject: "Important Email",
        text: "Here is some very important information."
    }
    ```

- **options** is a struct that allows you to configure how an email is sent. Each field is explained below. If a field is not needed or you want the default value, leave it as undefined.

    - **auth** is a struct whose fields are the authentication credentials. This is usually only needed when relaying an email through a third-party service such as Gmail. Only provide the credentials needed by the third-party service and leave the rest as undefined.
    
        Fields:
        - accessToken
        - authMethod*
        - pass
        - user
        
        *The authentication method is usually determined automatically, but you may manually force a specific authentication method by setting authMethod. This is usually not recommended. Possible options: "PLAIN", "LOGIN", "CRAM-MD5", "XOAUTH2"
    
    - **dkim** is a struct whose fields are the DKIM credentials. If you do not wish to provide any, leave this struct as undefined.
    
        Fields:
        - privateKey
        - keySelector
    
    - **dns** is a struct whose fields are various DNS options.
    
        Fields:
        - domainIPs*
        - domainNames*
        - numTries -> The number of times a DNS query will try contacting each name server before giving up (default = 1).
        - timeout -> The number of milliseconds before a DNS query will give up (default = 3000).
        
        *These must be both undefined (recommended), or else they must be arrays containing an equal number of elements. Normally, DNS name servers (such as Cloudflare) are used to determine where to send emails to. For example, if sending an email to `dana@outlook.com`, the mail exchange for `outlook.com` must be queried. However, you may override this lookup process by manually specifying the IP for a certain domain name.
        
        For example: You wish to send an email to an email server running on localhost to the address `test@mydomain.com`. Specify domainNames = [] and domainIPs = [];
    
    - **email** is a struct whose fields affect the actual process of transmitting the email data.
    
        Fields:
        - crlfClient -> The line ending used by this software when transmitting data (default = "\r\n").
        - crlfServer -> The line ending we expect from an email server we are receiving data from (default = "\r\n").
        - isLMTP -> true if LMTP should be used and false if SMTP should be used (default = false).
        - timeout -> The number of milliseconds before an attempt at sending an email will give up (default = 30000).
    
    - **logger** is a struct whose fields affect how the email sending process is logged. By default, nothing is logged.
    
        Fields:
        - isColor -> true if logged text should be color-coded and false otherwise (default = false).
        - logFcn -> The function called on all text that is to be logged (default = () => {}).
        
        If logging is desired, a recommended value for the logger struct would be:
        ```
        logger: {
            logFcn: console.log,
            isColor: true,
        },
        ```
    
    - **socket** is a struct whose fields affect the sockets used to transmit the emails.
    
        Fields:
        - encoding -> The encoding of the socket (default = "utf8").
        - timeout -> The number of milliseconds before an attempt at connecting a socket will give up (default = 3000).
    
    - **tls** is a struct whose fields are the TLS credentials. If you do not wish to provide any, leave this struct as undefined.
    
        Fields:
        - cert
        - key
        - strict* -> Whether the usage of TLS is required (default = false).
        
        *When connecting to a host, the software will always make the initial connection with an insecure net socket, and then unconditionally attempt to upgrade it to a secure TLS socket regardless of whether credentials are provided or the host we are connecting to supports TLS. If this upgrade fails:
        - If **strict** is true, communication will be immediately severed.
        - If **strict** is false, communication will continue using an insecure net socket if possible.

## Example Usage
example.js demonstrates relaying and sending emails. Note that external modules "dkim-signer" and "nodemailer/lib/mail-composer" are used.

example2.js demonstrates stand-alone functionality to generate message strings and DKIM signatures without "dkim-signer" or "nodemailer/lib/mail-composer".
