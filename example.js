// Example usage of "emailsend"

const emailsend = require("./js/emailsend.js");

const mail = {
    from: "[Insert Address]",
    to: "[Insert Address]",
    subject: "Test of emailsend",
    text: "This email was sent using emailsend."
}

const options = {
    auth: {
        user: "[Insert Username]",
        pass: "[Insert Password]",
        accessToken: "[Insert Access Token]",
    },

    logger: {
        logFcn: console.log,
        isColor: true,
    },
}

// Manually relay mail to other domains. This should not require authentication.
// - This requires port 25 to be open, something that residential ISPs do not always allow.
// - If an email is sent from a residential IP address, the email server may reject it before it even gets to the recipient.
let results = (async () => await emailsend.relayEmail(mail, options))();

// Use another server to do the relaying. This often requires authentication.
let results2 = (async () => await emailsend.sendEmail(mail, 465, "smtp.gmail.com", options))();