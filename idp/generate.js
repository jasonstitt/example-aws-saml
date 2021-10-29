const { pki } = require('node-forge')
const fs = require('fs')
const samlp = require('samlp')
const { samlOptions, certPath, keyPath, metadataPath } = require('./config')

/*
Create a PKCS#8 private key and X.509 public certificate for our IdP to use.
*/
function generatePem () {
  const keypair = pki.rsa.generateKeyPair()
  const cert = pki.createCertificate()
  cert.publicKey = keypair.publicKey
  cert.validity.notBefore = new Date()
  cert.validity.notAfter = new Date()
  cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)
  cert.setSubject([{ name: 'commonName', value: 'example.com' }])
  cert.sign(keypair.privateKey)
  const outputCert = pki.certificateToPem(cert)
  const outputKey = pki.privateKeyInfoToPem(pki.wrapRsaPrivateKey(pki.privateKeyToAsn1(keypair.privateKey)))
  return { cert: outputCert, key: outputKey }
}

/*
Create a metadata.xml for local use
samlp doesn't provide good internals access so it's actually easier to fake out its Express request handler
than to try to get it to just generate the metadata string
*/
function generateMetadata () {
  const fakeReq = {
    originalUrl: '',
    protocol: 'http',
    headers: {
      host: 'localhost:3000'
    }
  }
  const fakeRes = {
    set: () => {},
    send: value => { fakeRes.value = value }
  }
  samlp.metadata(samlOptions())(fakeReq, fakeRes)
  return fakeRes.value
}

const { cert, key } = generatePem()
fs.writeFileSync(certPath, cert, 'utf-8')
console.log(certPath)
fs.writeFileSync(keyPath, key, 'utf-8')
console.log(keyPath)
const metadata = generateMetadata()
fs.writeFileSync(metadataPath, metadata, 'utf-8')
console.log(metadataPath)
