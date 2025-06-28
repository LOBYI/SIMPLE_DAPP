import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getMarketplaceContract } from '../utils/getContract';

const SellerPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  async function addProduct() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getMarketplaceContract(signer);

    const priceInWei = ethers.parseEther(price);
    const tx = await contract.addProduct(name, priceInWei, Number(quantity));
    await tx.wait();
    alert('product loaded');
  }

  return (
    <div>
      <h2>product load</h2>
      <input type="text" placeholder="name" value={name} onChange={e => setName(e.target.value)} />
      <input type="text" placeholder="price(ETH)" value={price} onChange={e => setPrice(e.target.value)} />
      <input type="number" placeholder="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <button onClick={addProduct}>load</button>
    </div>
  );
};

export default SellerPage;
