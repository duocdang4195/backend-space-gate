import { ContractKey } from '../common/type';
import { CONTRACT_ADDRESS } from '../constant/address';

export const getAddress = (address: ContractKey, chainId: string | number) => {
  return address[chainId] ? address[chainId] : address[56];
};

export const getAddressCoin98Payment = (chainId: number) => {
  return getAddress(CONTRACT_ADDRESS.COIN98_PAYMENT, chainId);
};
