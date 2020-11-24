const isDev = location.hostname.includes('.dev.') ||
  location.hostname === 'localhost' ||
  location.hostname === '0.0.0.0'

const urlPrefix = isDev
  ? 'http://jsonctr.dev.datastory.com.cn'
  : 'https://jsonctradmin.datastory.com.cn'

export default urlPrefix
