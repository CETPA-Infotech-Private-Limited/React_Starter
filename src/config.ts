const DFCCIL_UAT = {
  apiUrl: 'https://uatcvcqrpapi.dfccil.com/api',
  dmsApiUrl: 'https://uatdmsapi.dfccil.com/api',
  orgHierarchy: 'https://uatorganization.dfccil.com/api',
  exitUrl: 'https://uatlogin.dfccil.com/applications',
  openApiUrl:'https://uatopenpoapi.dfccil.com/api',
  authUrl: 'https://app2.dfccil.com',
  clientId: '7ed4c1b7d4c7444eb1762bd74f7f0e5c',
  postLogout: 'https://uatlogin.dfccil.com/signout',
  redirectPath: 'dashboard',
  applicationId: 84,
};

const DFCCIL_PROD = {
  apiUrl: 'https://vmsapi.dfccil.com/api',
  dmsApiUrl: 'https://dmsapi.dfccil.com/api',
  orgHierarchy: 'https://orgsvc.dfccil.com/api',
  exitUrl: 'https://dashboard.dfccil.com/applications',
  openApiUrl:'https://uatopenpoapi.dfccil.com/api',
  authUrl: 'https://auth.dfccil.com',
  clientId: '7ed4c1b7d4c7444eb1762bd74f7f0e5c',
  postLogout: 'https://dashboard.dfccil.com/signout',
  redirectPath: 'dashboard',
  applicationId: 84,
};

export const environment = import.meta.env.VITE_ENV === 'production' ? DFCCIL_PROD : DFCCIL_UAT;

export const SESSION_CHECK_INTERVAL = 20 * 60 * 1000;
