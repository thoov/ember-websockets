'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    contentSecurityPolicyHeader: 'Content-Security-Policy-Report-Only',
    contentSecurityPolicy: {
        'connect-src': "*",
      }
  };
};
