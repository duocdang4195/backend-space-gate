export type ContractType = 'COIN98_PAYMENT';

export type ContractKey = {
  [chainId: string | number]: string | string[];
};

export type ContractAddress = {
  [key in ContractType]: ContractKey;
};
