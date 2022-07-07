export const objectToQueryString = (queryParameters) => {
  return queryParameters
    ? Object.entries(queryParameters).reduce((queryString, [key, val], index) => {
        const symbol = queryString.length === 0 ? '?' : '&';
        queryString += typeof val === 'string' ? `${symbol}${key}=${val}` : '';
        return queryString;
      }, '')
    : '';
};

/* export const queryStringToObject = (url) => {
  const params = new URLSearchParams(url.split('?')[1]);
  return params.entries().reduce((a, [k, v]) => ((a[k] = v), a), {});
}; */
