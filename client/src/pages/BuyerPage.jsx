import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getMarketplaceContract } from '../utils/getContract';
import { Link } from 'react-router-dom';

const BuyerPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = getMarketplaceContract(provider);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const result = await contract.getAllProducts();
    const filtered = result.filter(p => p.seller.toLowerCase() !== address.toLowerCase());
    setProducts(filtered);
  }

  async function buyProduct() {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getMarketplaceContract(signer);

    const product = products.find(p => BigInt(p.id) === BigInt(selectedProductId));
    if (!product) {
      alert('no item found.');
      return;
    }

    const value = BigInt(product.price) * BigInt(amount);

    try {
      const tx = await contract.buyProduct(product.id, amount, { value });
      await tx.wait();
      alert('success');
    } catch (err) {
      console.error(err);
      alert('error');
    }
  }


  return (
    <div>
      <h2>product list</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <p>
              <strong>product name:</strong>{' '}
              <Link to={`/product/${p.id}`}>{p.name}</Link>
            </p>
            <p>price: {ethers.formatEther(p.price)} ETH</p>
            <p>quantity: {p.quantity}</p>
            <p>seller: {p.seller}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerPage;
