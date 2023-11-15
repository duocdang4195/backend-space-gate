import { get } from 'lodash';
import { LIST_CHAIN_SUPPORT } from '../../../../constant';
import { ERC20Abi, coin98Payment } from '../../common/abi';
import { getAddressCoin98Payment, getChainData } from '../../utils';
import Web3Services from '../Web3Services';
import Web3 from 'web3';
import { RegisteredSubscription } from 'web3/lib/commonjs/eth.exports';

type RegisterOneId = {
  payer: string;
  payFor: string;
};

export class Coin98PaymentEvent {
  private _chain: LIST_CHAIN_SUPPORT;
  private chainData: { numChainId: number; chain: string; chainId: string };
  private _socket: Web3<RegisteredSubscription>;
  public web3: Web3Services;

  constructor(chain: LIST_CHAIN_SUPPORT) {
    this._chain = chain;
    this.web3 = new Web3Services(chain);
    this._socket = this.web3.getSocketProvider();
    this.chainData = getChainData(chain);
  }

  getContract() {
    if (!this._socket) {
      this._socket = this.web3.getSocketProvider();
    }
    const numChainId = get(this.chainData, 'numChainId');
    const contractAddress = getAddressCoin98Payment(numChainId) as string;
    const contract = new this._socket.eth.Contract<typeof coin98Payment>(
      coin98Payment,
      contractAddress
    );
    return contract;
  }

  getSocketProvider() {
    const socket = this.web3.getSocketProvider();
    return socket;
  }

  async initEventListen() {
    try {
      const client = this.web3.getClient();
      const currentBlock = await client.eth.getBlockNumber();
      const contract = this.getContract();

      const subscription = await contract.events.Payment({
        fromBlock: Number(currentBlock),
      });

      subscription.on('connected', function (subscriptionId) {
        console.log('subscriptionId', subscriptionId);
      });

      subscription.on('data', (event) => {
        const paymentCode = get(event, 'returnValues.paymentCode');
        const payer = get(event, 'returnValues.payer') as string;
        const payFor = get(event, 'returnValues.payFor') as string;
        const data = get(event, 'returnValues.data');
        const amount = get(event, 'returnValues.amount');

        const hash = get(event, 'transactionHash', '');

        console.log('data event', {
          paymentCode,
          payer,
          payFor,
          data,
          amount,
          hash,
        }); // same results as the optional callback above
        this.registerOneId({ payer, payFor });
      });

      subscription.on('error', function (error) {
        console.log('data error', error); // same results as the optional callback above
      });
    } catch (err) {
      console.log('err here ...');
    }
  }

  async registerOneId({ payer, payFor }: RegisterOneId) {
    const amount = '10000000000000000';
    const RECIPIENT_ADDRESS = '0x83D024dEBc5b215aaaB19ce9aE2A9913E9b0eb98';
    const contractAddress = '0x955F0653215dDAf97303b90DB0f0C304dB15C0d1';
    const wallet = this.web3.createWallet();
    const client = this.web3.getClient();

    const contractErc20 = this.web3.getContract(ERC20Abi, contractAddress);
    const data = contractErc20.methods
      // @ts-ignore
      .transfer(RECIPIENT_ADDRESS, amount)
      .encodeABI();
    const rawTransaction = {
      from: wallet.address,
      to: contractAddress,
      data,
    };
    // @ts-ignore

    const hash = await this.web3.sendTransaction(client, wallet, rawTransaction, {
      isWaitDone: true,
    });
    console.log({ hash, wallet });
  }
}
