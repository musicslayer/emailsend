// Example usage of "emailsend"

const {emailsend} = require("@musicslayer/emailsend");

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

// Send an email directly.
// - This requires port 24 (LMTP) or 25 (SMTP) to be open, something that residential ISPs do not always allow.
// - If an email is sent from a residential IP address, an email server may reject it before it even gets to the intended recipients.
let results = (async () => await emailsend.sendEmail(mail, options))();

// Send the email to a relay server, who will then send it to the intended recipients.
let results2 = (async () => await emailsend.relayEmail(mail, 465, "smtp.gmail.com", options))();