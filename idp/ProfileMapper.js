const ATTR_NAMEID = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
const ATTR_EMAIL = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
const ATTR_ROLE = 'https://aws.amazon.com/SAML/Attributes/Role'
const ATTR_SESSION_NAME = 'https://aws.amazon.com/SAML/Attributes/RoleSessionName'
const FORMAT_NAMEID = 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'

/*
samlp requires its mapper class to be an old-school "function class",
which has a prototype attribute but is constructed without the "new" keyword
*/
function ProfileMapper (user) {
  if (!(this instanceof ProfileMapper)) {
    return new ProfileMapper(user)
  }
  this.user = user
}

ProfileMapper.prototype.metadata = [
  {
    id: 'email',
    optional: false,
    displayName: 'E-Mail Address',
    multiValue: false
  },
  {
    id: ATTR_ROLE,
    optional: false,
    displayName: 'Role',
    multiValue: false
  },
  {
    id: ATTR_SESSION_NAME,
    optional: false,
    displayName: 'RoleSessionName',
    multiValue: false
  }
]

ProfileMapper.prototype.getClaims = function () {
  return {
    [ATTR_NAMEID]: this.user.email,
    [ATTR_EMAIL]: this.user.email,
    [ATTR_SESSION_NAME]: this.user.email,
    [ATTR_ROLE]: this.user.roles
  }
}

ProfileMapper.prototype.getNameIdentifier = function () {
  return {
    nameIdentifier: this.user.email,
    nameIdentifierFormat: FORMAT_NAMEID
  }
}

module.exports = ProfileMapper
