const MailComposer = require("nodemailer/lib/mail-composer");

const Logger = require("./Logger.js");
const EmailProcessor = require("./EmailProcessor.js");
const Socket = require("./Socket.js");
const Timer = require("./Timer.js");

const dnsUtil = require("./dns_util.js");
const emailUtil = require("./email_util.js");

const LMTP_PORT = 24;
const SMTP_PORT = 25;

/*
*   Options:
*       auth.accessToken
*       auth.authMethod
*       auth.pass
*       auth.user
*
*       dkim.privateKey
*       dkim.keySelector
*
*       dns.domainIPs
*       dns.domainNames
*       dns.numTries
*       dns.timeout
*
*       email.crlfClient
*       email.crlfServer
*       email.isLMTP
*       email.timeout
*
*       logger.isColor
*       logger.logFcn
*
*       socket.encoding
*       socket.timeout
*
*       tls.cert
*       tls.key
*       tls.strict
*
*/

async function relayEmail(mail, serverPort, serverHost, options) {
    isRelay = true;
    return await transmitEmail(isRelay, mail, serverPort, serverHost, options);
}

async function sendEmail(mail, options) {
    isRelay = false;
    serverPort = options?.email?.isLMTP ? LMTP_PORT : SMTP_PORT;
    serverHost = undefined;
    return await transmitEmail(isRelay, mail, serverPort, serverHost, options);
}

async function transmitEmail(isRelay, mail, serverPort, serverHost, options) {
    try {
        return await _transmitEmail(isRelay, mail, serverPort, serverHost, options); 
    }
    finally {
        // Failsafe cleanup to make sure nodejs execution can actually complete.
        Socket.destroySockets();
        Timer.destroyTimers();
    }
}

async function _transmitEmail(isRelay, mail, serverPort, serverHost, options) {
    dnsUtil.validateOptions(options?.dns)

    let from = emailUtil.getAddress(mail.from);
    let srcHost = emailUtil.getHost(from);

    let message = await new MailComposer(mail).compile().build();
    message = emailUtil.addDKIMSignatureHeader(message, srcHost, options?.dkim);

    let results = {};
    let promiseArray = [];
    let groups = {};

    if(isRelay) {
        // Send all the emails at once to the relay server.
        let domain = "email";
        groups[domain] = emailUtil.getRecipients(mail);
        promiseArray.push(processDomain(domain));
    }
    else {
        // Send all the emails grouped by domain.
        groups = emailUtil.createDomainGroup(mail);
        for(let domain in groups) {
            promiseArray.push(processDomain(domain));
        }
    }

    await Promise.all(promiseArray);

    return results;

    async function processDomain(domain) {
        try {
            await sendToServer(isRelay, serverPort, serverHost, domain, options, srcHost, from, groups[domain], message);
        }
        catch(err) {
            // Only assign results for domains that produced errors.
            results[domain] = err;
        }
    }
}

async function sendToServer(isRelay, serverPort, serverHost, domain, options, srcHost, from, recipients, message) {
    let logger = new Logger(domain, options?.logger);

    // Create a net socket and try to upgrade it to TLS before doing anything.
    // This upgrade attempt is optional unless the user set the tls.strict option.
    let socket = await connectMX(isRelay, serverPort, serverHost, domain, options, logger);
    socket._hostname = dnsUtil.convertToName(socket.host, options?.dns);
    await socket.upgradeToTLS(options?.socket, options?.tls, logger);

    // Communicate with the server to send the email.
    let processor = new EmailProcessor(socket, logger, options);
    await processor.processTransaction(srcHost, from, recipients, message);
}

async function connectMX(isRelay, serverPort, serverHost, domain, options, logger) {
    if(isRelay) {
        // Connect to the relay server.
        return await Socket.createSocket(serverPort, serverHost, logger, options?.socket);
    }
    else {
        // We are sending the emails ourselves so we need to search the MX records to find a host to connect to.
        logger.logMX("MX DNS Resolving...");

        let [serverHostArray, priorities] = await dnsUtil.resolveMX(domain, options?.dns);

        logger.logMX("MX DNS Resolved:");
        for(let i = 0; i < serverHostArray.length; i++) {
            logger.logMX("    " + serverHostArray[i] + " (" + priorities[i] + ")");
        }

        return await Socket.createSocketFromHostArray(serverPort, serverHostArray, logger, options?.socket);
    }
}

module.exports.relayEmail = relayEmail;
module.exports.sendEmail = sendEmail;