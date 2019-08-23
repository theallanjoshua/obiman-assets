import { CognitoAuth } from 'amazon-cognito-auth-js-promises';

const authData = {
  ClientId: '453ot3cp4d5q8jn0htqgd05p93',
  AppWebDomain: 'auth.theobiman.com',
  TokenScopesArray: ['phone', 'email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
  RedirectUriSignIn: window.location.origin,
  RedirectUriSignOut: window.location.origin,
  UserPoolId:'ap-south-1_Ayhn0HEhE'
}

class Credentials {
  constructor() {
    this.auth = new CognitoAuth(authData);
    this.auth.useCodeGrantFlow();
  }
  authenticate = async () => {
    try {
      const signInUserSession = await this.auth.getSignInUserSession();
      if(!signInUserSession.isValid()) {
        const href = window.location.href;
        if (href.includes('?code=')) {
          const newUrl = window.location.href.split('?code=')[0];
          window.history.replaceState(undefined, document.title, newUrl);
          await this.auth.parseCognitoWebResponse(href);
        } else {
          await this.auth.getSession();
        }
        return await this.auth.getSignInUserSession();
      } else {
        return signInUserSession;
      }
    } catch(error) {
      throw error;
    }
  }
  logout = async () => {
    try {
      await this.auth.signOut();
    } catch (error) {
      throw error;
    }
  }
}

export default new Credentials();