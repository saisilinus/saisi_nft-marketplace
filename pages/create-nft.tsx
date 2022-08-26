import { NextPage } from 'next';
import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { Button, Input, Loader } from '../components';
import images from '../assets';
import { useCurrentNFTContext } from '../context/NFTContext';

export interface IFormInput {
  price: string;
  name: string;
  description: string;
}

const CreateNFT: NextPage = () => {
  const { uploadToIPFS, createNFT, isLoadingNFT } = useCurrentNFTContext();
  const { theme } = useTheme();
  const [fileUrl, setFileUrl] = useState<string>('');
  const [formInput, setFormInput] = useState<IFormInput>({ price: '', name: '', description: '' });
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const url = await uploadToIPFS(acceptedFiles[0]);

    setFileUrl(url as string);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: 'image/*',
    maxSize: 5000000,
  });

  const fileStyle = useMemo(() => (
    `dark:bg-nft-black-1 bg-white border dark:border-white border-nft-gray-2 flex flex-col items-center p-5 rounded-sm border-dashed
    ${isDragActive && 'border-file-active'}
    ${isDragAccept && 'border-file-accept'}
    ${isDragReject && 'border-file-reject'}
    `
  ), [isDragActive, isDragAccept, isDragReject]);

  if (isLoadingNFT) {
    return (
      <div className="flex-start min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-3/5 md:w-full">
        <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
          Create new NFT
        </h1>
        <div className="mt-16">
          <p className="flex-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
            Upload file
          </p>
          <div className="mt-4">
            <div {...getRootProps()} className={fileStyle}>
              <input {...getInputProps()} />
              <div className="flexCenter flex-col text-center">
                <p className="flex-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">
                  JPG, PNG, GIF, SVG, WEBM, Max 100mb.
                </p>
                <div className="my-12 w-full flex justify-center">
                  <Image
                    src={images.upload}
                    width={100}
                    height={100}
                    objectFit="contain"
                    alt="file upload"
                    className={theme === 'light' ? 'filter invert' : ''}
                  />
                </div>

                <p className="flex-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">
                  Drag and drop file.
                </p>
                <p className="flex-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">
                  or browse media on your device.
                </p>
              </div>
            </div>
            {fileUrl && (
              <aside className="">
                <div className="">
                  <img src={fileUrl} alt="asset_file" className="" />
                </div>
              </aside>
            )}
          </div>
        </div>
        <Input
          inputType="input"
          title="Name"
          placeholder="NFT Name"
          handleClick={(e) => setFormInput({ ...formInput, name: (e.target as HTMLInputElement).value })}
        />
        <Input
          inputType="textarea"
          title="Description"
          placeholder="NFT Description"
          handleClick={(e) => setFormInput({ ...formInput, description: (e.target as HTMLTextAreaElement).value })}
        />
        <Input
          inputType="number"
          title="Price"
          placeholder="NFT Price"
          handleClick={(e) => setFormInput({ ...formInput, price: (e.target as HTMLInputElement).value })}
        />

        <div className="mt-7 w-full flex justify-end">
          <Button
            btnName="Create NFT"
            classStyles="rounded-xl"
            handleClick={() => createNFT(formInput, fileUrl, router)}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
