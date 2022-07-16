import { isNil } from 'lodash';

export default function parseJsonString(jsonString: string, defaultValue: any = null) {
  if (isNil(jsonString)) return defaultValue;
  let json;
  try {
    json = JSON.parse(jsonString);
  } catch (err) {
    json = defaultValue;
  }
  return json;
}
