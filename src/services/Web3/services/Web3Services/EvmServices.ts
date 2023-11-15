import Web3, { ContractAbi } from 'web3';
import {
  RawTransaction,
  SubmitTransactionOptions,
  WalletType,
} from '../../type';
import { RegisteredSubscription } from 'web3/lib/commonjs/eth.exports';
import { CHAIN_DATA, LIST_CHAIN_SUPPORT } from '../../../../constant';
import { AbstractServices } from '../AbstractServices';

const GAS_LIMIT = 21000;
const { isHex, toHex } = Web3.utils;

export default class EvmServices extends AbstractServices {
  protected _client: Web3;
  protected _socket: Web3<RegisteredSubscription>;

  chain: LIST_CHAIN_SUPPORT;

  constructor(chain: LIST_CHAIN_SUPPORT) {
    super();
    this.chain = chain;
    this._client = this.getClient(chain);
    this._socket = this.getSocketProvider(chain);
  }

  getClient = (chain: LIST_CHAIN_SUPPORT): Web3 => {
    // @ts-ignore
    const chainData = CHAIN_DATA[chain];

    if (!this._client) {
      const rpcUrl = chainData.rpcURL as string;
      const client = new Web3(new Web3.providers.HttpProvider(rpcUrl));
      this._client = client;
      return client;
    }
    return this._client;
  };

  getSocketProvider = (
    chain: LIST_CHAIN_SUPPORT
  ): Web3<RegisteredSubscription> => {
    // @ts-ignore
    const chainData = CHAIN_DATA[chain];

    if (!this._socket) {
      const socketURL = chainData.socket as string;
      const socketProvider = new Web3(
        new Web3.providers.WebsocketProvider(socketURL)
      );
      this._socket = socketProvider;
      return socketProvider;
    }
    return this._socket;
  };

  getContract<TAbi extends ContractAbi>(abi: TAbi, contractAddress: string) {
    const client = this._client;
    const contract = new client.eth.Contract(abi, contractAddress);

    return contract;
  }

  createWallet(): WalletType {
    const client = this.getClient(this.chain);
    const node = client.eth.accounts.privateKeyToAccount(
      process.env.PRIVATE_KEY_EVM as string
    );

    return {
      address: node.address,
      privateKey: node.privateKey,
      chain: this.chain,
    };
  }

  async sendTransaction(
    client: Web3,
    wallet: WalletType,
    rawTransaction: RawTransaction,
    options?: SubmitTransactionOptions
  ): Promise<string> {
    if (!rawTransaction.nonce) {
      const nonceWallet = await client.eth.getTransactionCount(wallet.address);
      rawTransaction.nonce = Number(nonceWallet.toString());
    }

    if (rawTransaction.value && !isHex(rawTransaction.value)) {
      rawTransaction.value = toHex(rawTransaction.value);
    }

    if (rawTransaction.gasPrice && !isHex(rawTransaction.gasPrice)) {
      rawTransaction.gasPrice = toHex(rawTransaction.gasPrice);
    } else {
      const gasPrice = await client.eth.getGasPrice()
      rawTransaction.gasPrice = toHex(gasPrice)
    }

    const gasEstimated =
      rawTransaction.gasLimit ||
      (await this.estimateGas(client, rawTransaction));
    rawTransaction.gas = String(gasEstimated);

    const { rawTransaction: signedTransaction } =
      await client.eth.accounts.signTransaction(
        rawTransaction,
        wallet.privateKey
      );

    return await new Promise((resolve, reject) => {
      client.eth
        .sendSignedTransaction(signedTransaction as string)
        .once('transactionHash', (hash: string) => {
          if (!options?.isWaitDone) {
            options?.onTransactionHash && options?.onTransactionHash(hash);
            resolve(hash);
          }
        })
        .on('receipt', (receipt: any) => {
          options?.onTransactionReceipt &&
            options?.onTransactionReceipt(receipt);
          resolve(receipt.transactionHash);
        })
        .catch(reject);
    });
  }

  async estimateGas(client: Web3, rawTransaction: RawTransaction) {
    try {
      const gas = await client.eth.estimateGas(rawTransaction);
      return gas < GAS_LIMIT ? toHex(GAS_LIMIT) : toHex(gas);
    } catch (err) {
      return toHex(GAS_LIMIT);
    }
  }
}
