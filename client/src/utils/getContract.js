// src/utils/getContract.js
import { ethers } from 'ethers';
import abi from '../abi/Marketplace.json';

const CONTRACT_ADDRESS = "[contract address]";

export function getMarketplaceContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signerOrProvider);
}
