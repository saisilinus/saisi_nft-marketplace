import React, { useEffect, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

import images from '../assets';
import { Button } from '.';
import { useCurrentNFTContext } from '../context/NFTContext';

type ActiveOption = 'Explore NFTs' | 'Listed NFTs' | 'My NFTs' | '';
const activeOptionList: ActiveOption[] = ['Explore NFTs', 'Listed NFTs', 'My NFTs'];

type MenuProps = {
  active: ActiveOption;
  setActive: React.Dispatch<React.SetStateAction<ActiveOption>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile?: boolean;
};

const MenuItems = ({ isMobile, active, setActive, setIsOpen }: MenuProps) => {
  const generateLink = (i: number) => {
    switch (i) {
      case 0:
        return '/';
      case 1:
        return '/listed-nfts';
      case 2:
        return '/my-nfts';
      default:
        return '/';
    }
  };

  return (
    <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
      {activeOptionList.map((item, i) => (
        <li
          key={i}
          onClick={() => {
            setActive(item);
            if (isMobile) setIsOpen(false);
          }}
          className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3 ${active === item ? 'dark:text-white text-nft-black-1' : 'dark:text-nft-gray-3 text-nft-gray-2'}`}
        >
          <Link href={generateLink(i)}>{item}</Link>
        </li>
      ))}
    </ul>
  );
};

MenuItems.defaultProps = {
  isMobile: false,
};

type ButtonGroupProps = {
  setActive: React.Dispatch<React.SetStateAction<ActiveOption>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  router: NextRouter;
};

const ButtonGroup = ({ setActive, router, setIsOpen }: ButtonGroupProps) => {
  const { connectWallet, currentAccount } = useCurrentNFTContext();

  return currentAccount ? (
    <Button
      btnName="Create"
      classStyles="mx-2 rounded-xl"
      handleClick={() => {
        setActive('');

        router.push('/create-nft');
        setIsOpen(false);
      }}
    />
  ) : (
    <Button
      btnName="Connect"
      classStyles="mx-2 rounded-xl"
      handleClick={connectWallet}
    />
  );
};

const checkActive = (active: ActiveOption, setActive: React.Dispatch<React.SetStateAction<ActiveOption>>, router: NextRouter) => {
  switch (router.pathname) {
    case '/':
      if (active !== 'Explore NFTs') setActive('Explore NFTs');
      break;
    case '/listed-nfts':
      if (active !== 'Listed NFTs') setActive('Listed NFTs');
      break;
    case '/my-nfts':
      if (active !== 'My NFTs') setActive('My NFTs');
      break;
    case '/create-nft':
      setActive('');
      break;

    default:
      setActive('');
      break;
  }
};

const Navbar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState<ActiveOption>('Explore NFTs');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setTheme('dark');
  }, []);

  useEffect(() => {
    checkActive(active, setActive, router);
  }, [router.pathname]);

  return (
    <nav className="flexBetween w-full fixed z-10 p-4 flex-row border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1">
      <div className="flex flex-1 flex-row justify-start">
        <Link href="/">
          <div
            className="flexCenter md:hidden cursor-pointer"
            onClick={() => {
              setActive('Explore NFTs');
            }}
          >
            <Image src={images.techiveLogo} objectFit="contain" width={32} height={32} alt="logo" className="rounded-xl" />
            <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1">tecHive</p>
          </div>
        </Link>
        <Link href="/">
          <div
            className="hidden md:flex"
            onClick={() => {
              setActive('Explore NFTs');
              setIsOpen(false);
            }}
          >
            <Image src={images.techiveLogo} objectFit="contain" width={32} height={32} alt="logo" className="rounded-xl" />
          </div>
        </Link>
      </div>
      <div className="flex flex-initial flex-row justify-end">
        <div className="flex items-center mr-2">
          <input type="checkbox" name="checkbox" id="checkbox" className="checkbox" onChange={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
          <label htmlFor="checkbox" className="flexBetween w-8 h-4 bg-black rounded-2xl p-1 relative label">
            <i className="fas fa-sun" />
            <i className="fas fa-moon" />
            <div className="w-3 h-3 absolute bg-white rounded-full ball" />
          </label>
        </div>

        <div className="flex md:hidden">
          <MenuItems active={active} setActive={setActive} setIsOpen={setIsOpen} />
          <div className="ml-4">
            <ButtonGroup setActive={setActive} router={router} setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>

      <div className="hidden md:flex ml-2">
        {isOpen ? (
          <Image
            src={images.cross}
            objectFit="contain"
            width={20}
            height={20}
            alt="close"
            onClick={() => setIsOpen(false)}
            className={theme === 'light' ? 'filter invert' : ''}
          />
        ) : (
          <Image
            src={images.menu}
            objectFit="contain"
            width={25}
            height={25}
            alt="menu"
            onClick={() => setIsOpen(true)}
            className={theme === 'light' ? 'filter invert' : ''}
          />
        )}

        {isOpen && (
          <div className="fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col">
            <div className="flex-1 p-4">
              <MenuItems active={active} setActive={setActive} isMobile setIsOpen={setIsOpen} />
            </div>
            <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
              <ButtonGroup setActive={setActive} router={router} setIsOpen={setIsOpen} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
