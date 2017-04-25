var SessionsHelper = {};

SessionsHelper.destroySessionPath = () => `/sessions?_method=delete`;

module.exports = SessionsHelper;