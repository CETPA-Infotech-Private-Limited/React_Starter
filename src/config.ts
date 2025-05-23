const DEV_CONFIG = {
  apiUrl: 'https://tms-services.cetpainfotech.com/api',
  orgHierarchy: 'https://uat.dfccilorganization.services.cetpainfotech.com/api',
  loginUrl: 'https://uat.tourservices.cetpainfotech.com/api',
  logoutUrl: 'http://localhost:3001/',
  powerOffUrl: 'http://localhost',
};
const CETPA_UAT = {
  baseUrl: 'https://gms.cetpainfotech.com',
  apiUrl: 'https://uat.grivance.services.dfccil.cetpainfotech.com/api',
  orgHierarchy: 'https://uat.dfccilorganization.services.cetpainfotech.com/api',
  loginUrl: 'https://uat.tourservices.cetpainfotech.com/api',
  logoutUrl: 'https://gms.cetpainfotech.com',
  powerOffUrl: 'http://localhost',
};

const DFCCIL_UAT = {
  apiUrl: 'https://uattaskmanageapi.dfccil.com/api',
  orgHierarchy: 'https://uatorganization.dfccil.com/api',
  logoutUrl: 'http://uat.dfccil.com/DfcHome',
  powerOffUrl: 'http://localhost',
};

const PROD_DFCCIL = {
  apiUrl: 'https://vmsapi.dfccil.com/api',
  orgHierarchy: 'https://orgsvc.dfccil.com/api',
  logoutUrl: 'https://it.dfccil.com/Home/Home',
  powerOffUrl: 'http://localhost',
};

export const environment = CETPA_UAT;
