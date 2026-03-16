import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { oidcConfig } from './config';

export const userManager = new UserManager({
  ...oidcConfig,
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
});
