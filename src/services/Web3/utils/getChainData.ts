import { get } from 'lodash';
import { CHAIN_DATA, CHAIN_KIND, LIST_CHAIN_SUPPORT } from '../../../constant';

export const getChainKind = (chain: string): CHAIN_KIND =>
  //@ts-ignore
  get(CHAIN_DATA[chain], 'kind', CHAIN_KIND.UNKNOWN);

//@ts-ignore
export const getChainData = (chain: LIST_CHAIN_SUPPORT) => CHAIN_DATA[chain];
