/* eslint-disable no-param-reassign */
export const objectToQueryString = (
  queryParameters: { [s: string]: any } | ArrayLike<any>,
) => {
  return queryParameters
    ? Object.entries(queryParameters).reduce((queryString, [key, val]) => {
        const symbol = queryString.length === 0 ? '?' : '&';
        queryString += typeof val === 'string' ? `${symbol}${key}=${val}` : '';
        return queryString;
      }, '')
    : '';
};

export const queryStringToObject = (url: string) => {
  const params = new URLSearchParams(url.split('?')[1]);
  return (params.entries() as any).reduce(
    (a: { [x: string]: any }, [k, v]: any) => ((a[k] = v), a),
    {},
  );
};
