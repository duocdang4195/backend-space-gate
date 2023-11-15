import Web3, { Contract, ContractAbi } from 'web3';
import { LIST_CHAIN_SUPPORT } from '../../../../constant';
import { RegisteredSubscription } from 'web3/lib/commonjs/eth.exports';
import {
  RawTransaction,
  SubmitTransactionOptions,
  WalletType,
} from '../../type';

export abstract class AbstractServices {
  protected abstract _client: Web3;

  abstract getContract<TAbi extends ContractAbi>(
    ABI: TAbi,
    contractAddress: string,
  ): Contract<TAbi>;
  abstract getClient(
    chain: LIST_CHAIN_SUPPORT,
    rpcs?: { [key: string]: string }
  ): Web3;
  abstract createWallet(): WalletType;
  abstract getSocketProvider(chain: LIST_CHAIN_SUPPORT): Web3<RegisteredSubscription>;
  abstract sendTransaction(
    client: Web3,
    wallet: WalletType,
    rawTransaction: RawTransaction,
    options?: SubmitTransactionOptions
  ): Promise<string>;
  // abstract isValidAddress(address: string): boolean;
}
