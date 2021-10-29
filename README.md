# AWS SAML test provider

This is a non-production SAML identity provider (IdP) for testing with the AWS Console. For a more detailed explanation of the purpose of this IdP, see my blog post, [Complete AWS SAML setup using Terraform and aws-credful](https://jasonstitt.com/aws-saml-terraform).

*Step 1*: install and generate keypair and metadata files

```
npm install
export AWS_ACCOUNT_ID=<my aws account id>
npm run generate
```

*Step 2*: apply Terraform to a test AWS account

```
(
  cd tf
  terraform init
  terraform apply
)
```

*Step 3*: run identity provider

```
npm start
```

*Step 4*: access AWS console

Navigate in a browser to [`http://localhost:3000/saml`](http://localhost:3000/saml)
