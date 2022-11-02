import { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Banner, CreatorCard, Loader, NFTCard, SearchBar } from '../components';
import images from '../assets';
import { getTopCreators, shortenAddress } from '../utils';
import { IFormattedNFT, useCurrentNFTContext } from '../context/NFTContext';
import { ITopCreator } from '../utils/getTopCreators';
import { ActiveSelectOption } from '../components/SearchBar';

const Home: NextPage = () => {
  const { fetchNFTs } = useCurrentNFTContext();
  const parentRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [hideButtons, setHideButtons] = useState<boolean>(false);
  const [nfts, setNfts] = useState<IFormattedNFT[]>([]);
  const [nftsCopy, setNftsCopy] = useState<IFormattedNFT[]>([]);
  const [activeSelect, setActiveSelect] = useState<ActiveSelectOption>('Recently added');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchNFTs().then((items) => {
      setNfts(items);
      setNftsCopy(items);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    const sortedNfts = [...nfts];

    switch (activeSelect) {
      case 'Price(low to high)':
        setNfts(
          sortedNfts.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)),
        );
        break;
      case 'Price(high to low)':
        setNfts(
          sortedNfts.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)),
        );
        break;
      case 'Recently added':
        setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
        break;
      default:
        setNfts(nfts);
        break;
    }
  }, [activeSelect]);

  const onHandleSearch = (value: string) => {
    const filteredNfts = nfts.filter(({ name }) => name.toLowerCase().includes(value.toLowerCase()));

    if (filteredNfts.length) {
      setNfts(filteredNfts);
    } else {
      setNfts(nftsCopy);
    }
  };

  const onClearSearch = () => {
    if (nfts.length && nftsCopy.length) {
      setNfts(nftsCopy);
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (current) {
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current && parent) {
      if (current?.scrollWidth >= parent?.offsetWidth) {
        setHideButtons(false);
      } else {
        setHideButtons(true);
      }
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener('resize', isScrollable);

    return () => {
      window.removeEventListener('resize', isScrollable);
    };
  });

  const topCreators = getTopCreators(nftsCopy) as ITopCreator[];

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <Banner
          parentStyles="justify-start mb-7 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          childStyles="md:text-4xl sm:text-2xl xs:text-xl text-left"
          name={(
            <>
              Discover, collect, and sell <br />
              extraordinary NTFs
            </>
    )}
        />

        {!isLoading && !nfts.length ? (
          <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
            That&apos;s weird... No NFTs for sale!
          </h1>
        ) : isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="">
              <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
                Top Sellers
              </h1>
              <div
                className="relative flex-1 max-w-full flex mt-3"
                ref={parentRef}
              >
                <div
                  className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                  ref={scrollRef}
                >
                  {topCreators.map((creator, i) => (
                    <CreatorCard
                      key={creator.seller}
                      rank={i + 1}
                      creatorImage={
                      images[`avatar${i + 1}` as keyof typeof images]
                    }
                      creatorName={shortenAddress(creator.seller)}
                      creatorEths={creator.sum}
                    />
                  ))}
                  {/* {[6, 7, 8, 9, 10].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}` as keyof typeof images]}
                  creatorName={`0x${makeId(3)}...${makeId(4)}`}
                  creatorEths={10 - i * 0.5}
                />
              ))} */}
                  {!hideButtons && (
                  <>
                    <div
                      onClick={() => handleScroll('left')}
                      className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                    >
                      <Image
                        src={images.left}
                        layout="fill"
                        objectFit="contain"
                        alt="left_arrow"
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                    <div
                      onClick={() => handleScroll('right')}
                      className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                    >
                      <Image
                        src={images.right}
                        layout="fill"
                        objectFit="contain"
                        alt="left_arrow"
                        className={theme === 'light' ? 'filter invert' : ''}
                      />
                    </div>
                  </>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
                  Hot NFTs
                </h1>
                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                  <SearchBar
                    activeSelect={activeSelect}
                    setActiveSelect={setActiveSelect}
                    handleSearch={onHandleSearch}
                    clearSearch={onClearSearch}
                  />
                </div>
              </div>
              <div className="mt-3 w-full flex flex-wrap justify-center">
                {nfts.map((nft) => (
                  <NFTCard key={nft.tokenId} nft={nft} />
                ))}
                {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <NFTCard
                key={`nft-${i}`}
                nft={{
                  i,
                  name: `Nifty NFT ${i}`,
                  seller: `0x${makeId(3)}...${makeId(4)}`,
                  owner: `0x${makeId(3)}...${makeId(4)}`,
                  description: 'Cool NFT on Sale',
                  price: (10 - i * 0.534).toFixed(2),
                }}
              />
            ))} */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
