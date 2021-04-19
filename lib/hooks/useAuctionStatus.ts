import { useEffect, useState } from 'react';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { getAuctionStatus } from 'lib/api';
import { RAY, WAD, RAD } from 'lib/utils';

async function fetchAuctionStatus(id): Promise<any> {
  const response = await getAuctionStatus(id);

  return response;
}

export function useAuctionStatus(id: number): any {
  const [auctionPrice, setAuctionPrice] = useState('0');
  const [daiNeeded, setDaiNeeded] = useState('0');
  const [collateralAmount, setCollateralAmount] = useState('0');
  const [needsRedo, setNeedsRedo] = useState(false);

  const { data, error } = useSWR(`/auctions/getStatus-${id}`, () => fetchAuctionStatus(id));

  useEffect(() => {
    if (data) {
      setCollateralAmount(new BigNumber(data.lot).div(WAD).toString());
      setAuctionPrice(new BigNumber(data.price).div(RAY).toString());
      setDaiNeeded(new BigNumber(data.tab).div(RAD).toString());
      setNeedsRedo(data.needsRedo);
    }
  }, [data]);

  return {
    collateralAmount,
    auctionPrice,
    daiNeeded,
    needsRedo,
    loading: !error && !data,
    error: error
  };
}