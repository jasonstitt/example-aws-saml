provider "aws" {
  region = "us-east-1"
}

data "aws_caller_identity" "this" {}

# This will be the assume role policy for all SSO roles
data "aws_iam_policy_document" "this" {
  statement {
    actions = ["sts:AssumeRoleWithSAML"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_saml_provider.this.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "SAML:aud"
      values   = ["https://signin.aws.amazon.com/saml"]
    }
  }
}

# The SAML provider for the account needs the IdP's metadata
# This only contains the public key and is OK to check in
resource "aws_iam_saml_provider" "this" {
  name                   = "sso-test"
  saml_metadata_document = file("${path.module}/metadata.xml")
}

# Role definitions

resource "aws_iam_role" "sso_readonly" {
  name               = "sso-test-readonly"
  assume_role_policy = data.aws_iam_policy_document.this.json
}

resource "aws_iam_role_policy_attachment" "sso_readonly" {
  role       = aws_iam_role.sso_readonly.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

resource "aws_iam_role" "sso_poweruser" {
  name               = "sso-test-poweruser"
  assume_role_policy = data.aws_iam_policy_document.this.json
}

resource "aws_iam_role_policy_attachment" "sso_poweruser" {
  role       = aws_iam_role.sso_poweruser.name
  policy_arn = "arn:aws:iam::aws:policy/PowerUserAccess"
}

# Copy this into the AWS_ACCOUNT_ID env var
output "aws_account_id" {
  value = data.aws_caller_identity.this.account_id
}

output "roles" {
  value = [
    "arn:aws:iam::${data.aws_caller_identity.this.account_id}:role/${aws_iam_role.sso_readonly.name},arn:aws:iam::${data.aws_caller_identity.this.account_id}:saml-provider/${aws_iam_saml_provider.this.name}",
    "arn:aws:iam::${data.aws_caller_identity.this.account_id}:role/${aws_iam_role.sso_poweruser.name},arn:aws:iam::${data.aws_caller_identity.this.account_id}:saml-provider/${aws_iam_saml_provider.this.name}",
  ]
}
