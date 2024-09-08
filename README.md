# emailsend
A simple library for relaying or sending emails to SMTP/LMTP servers. This is a streamlined version of "node-sendmail" (https://github.com/guileen/node-sendmail).

example.js demonstrates relaying and sending emails. Note that external modules "dkim-signer" and "nodemailer/lib/mail-composer" are used.

example2.js demonstrates stand-alone functionality to generate message strings and DKIM signatures without "dkim-signer" or "nodemailer/lib/mail-composer".
