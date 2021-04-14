import sass from 'sass';
import { get } from 'lodash-es';
import config from '../config/development.js';

export default {
  'get-config-value($key)': (key) => {
    const value = get(config, key.getValue().split('.'));
    if (typeof value === 'string') {
      return new sass.types.String(value);
    }
    return key;
  },
};
