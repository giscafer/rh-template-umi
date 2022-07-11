import { isArray } from 'lodash';

type DataIndex = string | number | readonly (string | number)[];

export function convertDataIndex(dataIndex: DataIndex) {
  if (isArray(dataIndex)) {
    return dataIndex;
  }
  if (typeof dataIndex === 'string') {
    const arr = dataIndex.split('.');
    return arr?.length > 1 ? arr : dataIndex;
  }

  return dataIndex || 'unknown';
}
