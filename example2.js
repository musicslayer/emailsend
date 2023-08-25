// Example usage of "generateDKIMSignature" and "generateMessageString".

const generateDKIMSignature = require("./js/generateDKIMSignature.js");
const generateMessageString = require("./js/generateMessageString.js");
const secret = require("./js/secret.js");

async function init() {
    let mail = {
        from: "[Insert Address]",
        to: ["[Insert Address]", "[Insert Address]"], // Array of email addresses
        subject: "Sample Email Subject",
        text: "Sample Email Text." // Can also use "html" instead of "text"
    }

    // For the domain name, assume the "from" email is from the domain we wish to use.
    let domainName = _getHost(mail.from);

    // Convert the mail information into a string.
    let messageString = generateMessageString(mail, domainName);

    // Generate a DKIM signature.
    let keySelector = secret.getSecret("dkim_key_selector");
    let privateKey = secret.getSecret("dkim_private_key");
    let signature = generateDKIMSignature(messageString, domainName, keySelector, privateKey);
}
init();

function _getHost(email) {
    const m = /[^@]+@([\w\d\-\.]+)/.exec(email);
    return m && m[1];
}