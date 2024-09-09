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

async function init() {
    // Send an email directly.
    // - This requires port 24 (LMTP) or 25 (SMTP) to be open, something that residential ISPs do not always allow.
    // - If an email is sent from a residential IP address, an email server may reject it before it even gets to the intended recipients.
    let results = await emailsend.sendEmail(mail, options);

    if(Object.keys(results).length >= 0) {
        console.log("sendEmail errors:");
        for(let domain in results) {
            let error = results[domain];
            console.log(domain + "\n" + error.message + "\n" + error.stack);
        }
    }

    // Send the email to a relay server, who will then send it to the intended recipients.
    let results2 = await emailsend.relayEmail(mail, 465, "smtp.gmail.com", options);

    if(Object.keys(results2).length >= 0) {
        console.log("relayEmail errors:");
        for(let domain in results2) {
            let error = results2[domain];
            console.log(domain + "\n" + error.message + "\n" + error.stack);
        }
    }
}
init();