export const googleAuthConfig = {
    clientId: '802082904766-1jnflfjtqhjfopa8105ocr5de6eerol1.apps.googleusercontent.com',
    redirectUri: window.location.origin,  // Make sure the redirect URI matches one of the registered URIs
    loginUrl: 'https://accounts.google.com/o/oauth2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    scope: 'openid profile email',  // Scopes to request from Google
    requireHttps: false  // Set to `true` in production for secure requests
  };
  
  export const facebookAuthConfig = {
    clientId: 'YOUR_FACEBOOK_CLIENT_ID',
    redirectUri: window.location.origin + '/index.html',
    loginUrl: 'https://www.facebook.com/v10.0/dialog/oauth',
    tokenEndpoint: 'https://graph.facebook.com/v10.0/oauth/access_token',
    scope: 'email',
    requireHttps: true
  };
  
  export const githubAuthConfig = {
    clientId: 'YOUR_GITHUB_CLIENT_ID',
    redirectUri: window.location.origin + '/index.html',
    loginUrl: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: 'https://github.com/login/oauth/access_token',
    scope: 'read:user user:email',
    requireHttps: true
  };
  