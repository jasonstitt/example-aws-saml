const samlp = require('samlp')
const express = require('express')
const { samlOptions, AWS_ACCOUNT_ID } = require('./config')

if (!AWS_ACCOUNT_ID) {
  console.log('Please set AWS_ACCOUNT_ID')
  process.exit(1)
}

const options = samlOptions()
const app = express()

app.get('/metadata.xml', samlp.metadata(options))
app.get('/saml', samlp.auth(options))
app.listen(3000)
