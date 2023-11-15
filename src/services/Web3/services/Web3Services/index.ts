// @ts-ignore
import { LIST_CHAIN_SUPPORT } from '../../constant';
import EvmServices from './EvmServices';
import Web3, { Contract, ContractAbi } from 'web3';
import { getChainKind } from '../../utils';
import { CHAIN_KIND } from '../../../../constant';
import {
  RawTransaction,
  SubmitTransactionOptions,
  WalletType,
} from '../../type';
import { AbstractServices } from '../AbstractServices';

export default class Web3Services {
  chain: LIST_CHAIN_SUPPORT;
  service: AbstractServices;

  constructor(chain: LIST_CHAIN_SUPPORT) {
    this.chain = chain;
    // @ts-ignore
    this.service = this.initService() as AbstractServices;
  }

  initService() {
    const chain = this.chain;
    const chainKind = getChainKind(chain);

    switch (chainKind) {
      case CHAIN_KIND.EVM:
        return new EvmServices(chain);

      default:
        throw `${chain} is not supported`;
    }
  }

  getClient() {
    return this.service.getClient(this.chain);
  }

  getSocketProvider() {
    return this.service.getSocketProvider(this.chain);
  }

  getContract<TAbi extends ContractAbi>(
    abi: TAbi,
    contractAddress: string
  ): Contract<TAbi> {
    return this.service.getContract(abi, contractAddress);
  }

  createWallet() {
    return this.service.createWallet();
  }

  async sendTransaction(
    client: Web3,
    wallet: WalletType,
    rawTransaction: RawTransaction,
    options?: SubmitTransactionOptions
  ) {
    return await this.service.sendTransaction(
      client,
      wallet,
      rawTransaction,
      options
    );
  }
}
