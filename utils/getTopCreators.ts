import { IFormattedNFT } from '../context/NFTContext';

export interface ITopCreator {
  seller: string;
  sum: number;
}

export const getTopCreators = (nfts: IFormattedNFT[]) => nfts.reduce((creators, currentNFT) => {
  const index = (creators as ITopCreator[]).findIndex((creator) => creator.seller === currentNFT.seller);
  if (index > -1) {
    // eslint-disable-next-line no-param-reassign
    (creators as ITopCreator[])[index].sum += parseFloat(currentNFT.price);
  } else {
    (creators as ITopCreator[]).push({
      seller: currentNFT.seller,
      sum: parseFloat(currentNFT.price),
    });
  }
  return creators;
}, []).sort((a, b) => (b as ITopCreator).sum - (a as ITopCreator).sum);
