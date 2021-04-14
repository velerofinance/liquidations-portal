import Auction from 'types/auction';
import create from 'zustand';
import getMaker from '../lib/maker';
import { transactionsApi } from './transactions';

type Store = {
  submitBid: (id, amount, maxPrice, address) => Promise<void>;
};

const [useAuctionStore] = create<Store>((set, get) => ({
  submitBid: async (id, amount, maxPrice, address) => {
    const maker = await getMaker();

    const txCreator = () => maker.service('liquidation').take(id, amount, maxPrice, address);
    await transactionsApi.getState().track(txCreator, `Submit bid on ID: ${id}`, {
      pending: txId => {
        console.log('bid tx pending', txId);
      },
      mined: txId => {
        console.log('bid tx mined', txId);
        transactionsApi.getState().setMessage(txId, `Submit bid finished for ID: ${id}`);
      }
    });
  }
}));

export default useAuctionStore;
