// Example usage of "generateDKIMSignature" and "generateMessageString".

const {generateDKIMSignature, generateMessageString} = require("@musicslayer/emailsend");

async function init() {
    let mail = {
        from: "[Insert Address]",
        to: ["[Insert Address]", "[Insert Address]"], // Array of email addresses
        subject: "Sample Email Subject",
        text: "Sample Email Text." // Can also use "html" instead of "text"
    }

    // For the domain name, use the host of the "from" email address.
    let domainName = _getHost(mail.from);

    // Convert the mail information into a string.
    let messageString = generateMessageString(mail, domainName);

    // Generate a DKIM signature.
    let keySelector = "[Insert DKIM Key Selector]";
    let privateKey = "[Insert Private Key]";
    let signature = generateDKIMSignature(messageString, domainName, keySelector, privateKey);
}
init();

function _getHost(email) {
    const m = /[^@]+@([\w\d\-\.]+)/.exec(email);
    return m && m[1];
}