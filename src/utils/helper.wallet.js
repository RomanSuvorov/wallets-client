import { useState, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { generateAccount } from '@tronprotocol/wallet-api/src/utils/account';
import { passwordToAddress, isAddressValid } from '@tronprotocol/wallet-api/src/utils/crypto';
import Wallet from 'ethereumjs-wallet';
import * as BitcoinJS from 'bitcoinjs-lib';
import CryptoJS from 'crypto-js';

// BTC
const generateBTCWallet = () => {
  console.log('generate BTC Wallet');
  const keyPair = BitcoinJS.ECPair.makeRandom();
  const { address } = BitcoinJS.payments.p2pkh({ pubkey: keyPair.publicKey });
  const privateKey = keyPair.toWIF();

  return { address, privateKey };
};

const importBTCWalletFromPrivate = ({ privateKey, withValidation = false }) => {
  try {
    console.log('import BTC Wallet')
    let isValid = true, error = undefined;
    const keyPair = BitcoinJS.ECPair.fromWIF(privateKey);
    const { address } = BitcoinJS.payments.p2pkh({ pubkey: keyPair.publicKey });

    if (withValidation) {
      if (!BitcoinJS.address.toOutputScript(address)) {
        return { isValid: false, error: 'Incorrect private key string' };
      } else {
        return { isValid: true, address, privateKey };
      }
    }

    return { address, privateKey, isValid, error };
  } catch (e) {
    console.error(e);
    return { isValid: false, error: 'Incorrect private key string' };
  }
};

// ERC20
const generateERC20Wallet = () => {
  console.log('generate ERC20 Wallet');
  const wallet = Wallet.generate();
  const address = wallet.getAddressString();
  const privateKey = wallet.getPrivateKeyString();

  return { address, privateKey };
};

const importERC20WalletFromPrivateKey = ({ privateKey, withValidation = false }) => {
  try {
    let isValid = true, error = undefined, key = privateKey;

    if (key.startsWith('0x')) key = key.substring(2);
    const privateKeyBuffer = Buffer.from(key, 'hex');
    const wallet = Wallet.fromPrivateKey(privateKeyBuffer);
    const address = wallet.getAddressString();

    if (withValidation) {
      if (
        address === null
        || address === undefined
        || address.slice(0, 2) !== "0x"
        || typeof address !== "string"
        || address.length !== 42
        || !/^0x[0-9a-fA-F]{40}$/.test(address)
    ) {
        return { isValid: false, error: 'Incorrect private key string' }
      } else {
        return { address, privateKey, isValid: true };
      }
    }

    return { address, privateKey, isValid, error };
  } catch (e) {
    console.error(e);
    return { isValid: false, error: 'Incorrect private key string' };
  }
};

// TRON
const generateTronWallet = () => {
  console.log('generate Tron Wallet');
  const { address, privateKey } = generateAccount();

  return { address, privateKey };
};

const importTronWalletFromPrivateKey = ({ privateKey, withValidation = false }) => {
  console.log('import Tron Wallet');
  let isValid = true, error = undefined;
  const address = passwordToAddress(privateKey);

  if (withValidation) {
    isValid = isAddressValid(address);
    if (!isValid) {
      return { isValid: false, error:'Incorrect private key string' }
    } else {
      return { isValid: true, address, privateKey };
    }
  }

  return { address, privateKey, isValid, error };
};

// copy value to buffer
const useCopy = () => {
  const [copiedValue, setCopiedValue] = useState(null);
  let result = null;
  const { enqueueSnackbar } = useSnackbar();

  const fallbackCopy = async (value) => {
    const textArea = document.createElement('textarea');
    textArea.value = value;

    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.append(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = await document.execCommand('copy');

      if (successful) {
        setCopiedValue(value);
        enqueueSnackbar('Successful copied', { variant: 'success', autoHideDuration: 3000 });
      } else {
        enqueueSnackbar('Something wrong during coping', { variant: 'error', autoHideDuration: 3000 });
      }
    } catch (e) {
      enqueueSnackbar('Something wrong during coping', { variant: 'error', autoHideDuration: 3000 });
    }

    document.body.removeChild(textArea);
  };

  const copyHandler = useCallback(async (value) => {
    // if during 5sec user clicked on another copyHandler
    clearTimeout(result);
    result = setTimeout(() => setCopiedValue(null), 5000);

    if (!value) {
      enqueueSnackbar('Nothing to copy', { variant: 'warning', autoHideDuration: 3000 });
      return;
    }

    if (!navigator.clipboard) {
      await fallbackCopy(value);
      return;
    }

    await navigator.clipboard.writeText(value).then(
      () => {
        setCopiedValue(value);
        enqueueSnackbar('Successful copied', { variant: 'success', autoHideDuration: 3000 });
      },
      (err) => {
        enqueueSnackbar('Something wrong during coping', { variant: 'error', autoHideDuration: 3000 });
      },
    );
  }, []);

  return { copyHandler, copiedValue };
};

const useShowSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccess = useCallback(
    ({ text }) =>
      enqueueSnackbar(text, { variant: 'success', autoHideDuration: 3000 }),
    [],
    );

  const showError = useCallback(
    ({ text }) =>
      enqueueSnackbar(text, { variant: 'error', autoHideDuration: 3000 }),
    [],
  );

  const showWarning = useCallback(
    ({ text }) =>
      enqueueSnackbar(text, { variant: 'warning', autoHideDuration: 3000 }),
    [],
  );

  return { showSuccess, showError, showWarning };
};

const encryptKey = ({ key, data }) => CryptoJS.AES.encrypt(key, data).toString();

const decryptKey = ({ key, data }) => CryptoJS.AES.decrypt(key, data).toString(CryptoJS.enc.Utf8);

const savePrKeyToLS = ({ address, privateKey }) => {
  const walletsFromLS = JSON.parse(localStorage.getItem('wallets')) || {};
  walletsFromLS[address] = privateKey;
  localStorage.setItem('wallets', JSON.stringify(walletsFromLS));
};

export {
  generateBTCWallet,
  importBTCWalletFromPrivate,
  generateERC20Wallet,
  importERC20WalletFromPrivateKey,
  generateTronWallet,
  importTronWalletFromPrivateKey,
  useCopy,
  useShowSnackbar,
  encryptKey,
  decryptKey,
  savePrKeyToLS,
};
