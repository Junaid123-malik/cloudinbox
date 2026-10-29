
import { Amplify } from 'aws-amplify';
import 'aws-amplify/auth/enable-oauth-listener';

const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const userPoolClientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
const domain = import.meta.env.VITE_COGNITO_DOMAIN;

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId,
      userPoolClientId,
      loginWith: {
        oauth: {
          domain: domain.replace(/^https?:\/\//, '').replace(/\/$/, ''),
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [
            'http://localhost:5175/',
            'https://d1s9nan316s8zl.cloudfront.net/',
          ],
          redirectSignOut: [
            'http://localhost:5175/',
            'https://d1s9nan316s8zl.cloudfront.net/',
          ],
          responseType: 'code',
        },
      },
    },
  },
});
