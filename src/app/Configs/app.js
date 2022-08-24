let apiUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_LIVE_API_URL : process.env.REACT_APP_LOCAL_API_URL;
let assetUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_LIVE_ASSET_URL : process.env.REACT_APP_LOCAL_ASSET_URL;

export default {
  appName: 'RKCRM',
  perPage: 10,
  apiUrl,
  assetUrl
}