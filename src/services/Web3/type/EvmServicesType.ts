import { LIST_CHAIN_SUPPORT } from '../../../constant';

export type WalletType = {
  chain: LIST_CHAIN_SUPPORT;
  address: string;
  privateKey: string;
};

export type RawTransaction = {
  to: string;
  data: string;

  // optional
  value?: string;
  nonce?: number;
  from?: string;
  chainId?: string; // Can be exclude
  gasLimit?: string;
  gas?: string;
  gasPrice?: string

};

export interface SubmitTransactionOptions {
  isWaitDone?: boolean
  onTransactionReceipt?: (receipt: any) => void
  onTransactionHash?: (hash: string) => void
}