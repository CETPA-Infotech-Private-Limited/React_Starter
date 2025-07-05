const DFCCIL_UAT = {
  apiUrl: 'https://uat.guesthouse.cetpainfotech.com/api',
  orgHierarchy: 'https://uatorganization.dfccil.com/api',
  logoutUrl: 'http://uat.dfccil.com/DfcHome',
  exitUrl: 'http://uatlogin.dfccil.com/applications',
  authUrl: 'https://app2.dfccil.com',
  clientId: '7ed4c1b7d4c7444eb1762bd74f7f0e5c',
  postLogout: 'https://uatlogin.dfccil.com/signout',
  redirectPath: 'dashboard',
  applicationId: 8,
};

const DFCCIL_PROD = {
  apiUrl: 'https://vmsapi.dfccil.com/api',
  orgHierarchy: 'https://orgsvc.dfccil.com/api',
  logoutUrl: 'https://it.dfccil.com/Home/Home',
  exitUrl: 'http://uatlogin.dfccil.com/applications',
  authUrl: 'https://app2.dfccil.com',
  clientId: '7ed4c1b7d4c7444eb1762bd74f7f0e5c',
  postLogout: 'https://uatlogin.dfccil.com/signout',
  redirectPath: 'dashboard',
  applicationId: 8,
};

export const environment = DFCCIL_UAT;

export const SESSION_CHECK_INTERVAL = 20 * 60 * 1000;
