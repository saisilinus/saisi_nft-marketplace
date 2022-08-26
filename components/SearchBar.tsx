import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

import images from '../assets';

export type ActiveSelectOption = 'Recently added' | 'Price(low to high)' | 'Price(high to low)';

const activeSelectList: ActiveSelectOption[] = ['Recently added', 'Price(low to high)', 'Price(high to low)'];

type SearchBarProps = {
  activeSelect: ActiveSelectOption;
  setActiveSelect: React.Dispatch<React.SetStateAction<ActiveSelectOption>>;
  // eslint-disable-next-line no-unused-vars
  handleSearch: (value: string) => void;
  clearSearch: () => void;
}

const SearchBar = ({ activeSelect, setActiveSelect, handleSearch, clearSearch }: SearchBarProps) => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [toggle, setToggle] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(debouncedSearch);
    }, 1000);

    return () => clearTimeout(timer);
  }, [debouncedSearch]);

  useEffect(() => {
    if (search) {
      handleSearch(search);
    } else {
      clearSearch();
    }
  }, [search]);

  return (
    <>
      <div className="flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 rounded-md py-3">
        <Image
          src={images.search}
          objectFit="contain"
          width={20}
          height={20}
          alt="search"
          className={theme === 'light' ? 'filter invert' : ''}
        />
        <input
          type="text"
          placeholder="Search NFT here"
          className="dark:bg-nft-black-2 bg-white mx-4 w-full dark:text-white text-nft-black-1 font-normal text-xs outline-none"
          onChange={(e) => setDebouncedSearch((e.target as HTMLInputElement).value)}
          value={debouncedSearch}
        />
      </div>
      <div className="relative flexBetween ml-4 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 rounded-md py-3" onClick={() => setToggle((prevToogle) => !prevToogle)}>
        <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs">{activeSelect}</p>
        <Image
          src={images.arrow}
          objectFit="contain"
          width={15}
          height={15}
          alt="arrow"
          className={theme === 'light' ? 'filter invert' : ''}
        />
        {toggle && (
        <div className="absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 py-3 px-4 rounded-md">
          {activeSelectList.map((item, i) => (
            <p
              key={`${item}-${i}`}
              className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs my-3 cursor-pointer"
              onClick={() => setActiveSelect(item)}
            >{item}
            </p>
          ))}
        </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
