import { pick } from 'lodash';

type PickDataType = {
  object: Object;
  keys: string[];
};

export const pickDataFromObject = (params: PickDataType) => {
  try {
    const { object, keys } = params;
    return pick(object, keys);
  } catch (err) {
    throw err;
  }
};
