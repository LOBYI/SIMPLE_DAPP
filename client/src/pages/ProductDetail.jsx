import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ethers } from 'ethers';
import abi from '../abi/Marketplace.json';

const CONTRACT_ADDRESS = '[contract address]';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, provider);
      const data = await contract.products(id);
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  const buy = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
    const total = product.price * BigInt(quantity);
    const tx = await contract.buyProduct(id, quantity, { value: total });
    await tx.wait();
    alert('success');
  };

  if (!product) return <p>loading...</p>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>price: {ethers.formatEther(product.price)} ETH</p>
      <p>quantity: {product.quantity.toString()}</p>
      <p>seller: {product.seller}</p>
      <input
        type="number"
        value={quantity}
        min={1}
        max={product.quantity}
        onChange={e => setQuantity(Number(e.target.value))}
      />
      <button onClick={buy}>buy</button>
    </div>
  );
}

export default ProductDetail;
