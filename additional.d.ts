/* eslint-disable no-unused-vars */
import { MetaMaskInpageProvider } from '@metamask/providers';

export {};

declare global {
    interface Window {
      ethereum: MetaMaskInpageProvider;
    }
}
