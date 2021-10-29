const fs = require('fs')
const path = require('path')
const ProfileMapper = require('./ProfileMapper')

// Must be set to your numeric account ID
const AWS_ACCOUNT_ID = process.env.AWS_ACCOUNT_ID

// Hardcoded test user with the roles that are set up in the Terraform module
const user = {
  email: 'sampleuser@example.com',
  roles: [
    `arn:aws:iam::${AWS_ACCOUNT_ID}:role/sso-test-readonly,arn:aws:iam::${AWS_ACCOUNT_ID}:saml-provider/sso-test`,
    `arn:aws:iam::${AWS_ACCOUNT_ID}:role/sso-test-poweruser,arn:aws:iam::${AWS_ACCOUNT_ID}:saml-provider/sso-test`
  ]
}

module.exports = {
  certPath: path.join(__dirname, 'pem', 'idp-public-cert.pem'),
  keyPath: path.join(__dirname, 'pem', 'idp-private-key.pem'),
  metadataPath: path.join(__dirname, '..', 'tf', 'metadata.xml'),
  samlOptions: () => ({
    // Issuer can be whatever
    issuer: 'urn:example:idp',
    // Note, for purposes of the AWS STS AssumeRoleWithSAML call, the "Audience" is actually filled with the recipient value
    recipient: 'https://signin.aws.amazon.com/saml',
    // These files should be generated uniquely for your own example
    cert: fs.readFileSync(module.exports.certPath),
    key: fs.readFileSync(module.exports.keyPath),
    // samlp will use these to construct the assertion
    profileMapper: ProfileMapper,
    getUserFromRequest: () => user,
    // This just tells the samlp library where to send the SAML POST
    getPostURL: (audience, authnRequestDom, req, callback) => callback(null, 'https://signin.aws.amazon.com/saml')
  })
}
