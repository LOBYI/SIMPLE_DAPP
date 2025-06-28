import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import abi from '../abi/Marketplace.json';

const CONTRACT_ADDRESS = '[contract address]';

const UpdateProductPage = () => {
  const [products, setProducts] = useState([]);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [newPrice, setNewPrice] = useState({});
  const [newQuantity, setNewQuantity] = useState({});

  useEffect(() => {
    const setup = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
      setSigner(signer);
      setContract(contract);

      const result = await contract.getMyProducts();
      setProducts(result);
    };

    setup();
  }, []);

  const handleUpdate = async (productId) => {
    if (!contract) return;

    try {
      const price = ethers.parseEther(newPrice[productId] || "0");
      const quantity = parseInt(newQuantity[productId] || "0");
      const tx = await contract.updateProduct(productId, price, quantity);
      await tx.wait();
      alert("fixed");
    } catch (err) {
      console.error(err);
      alert("failed");
    }
  };

  return (
    <div>
      <h2>fix my product</h2>
      {products.map(p => (
        <div key={p.id}>
          <p>name: {p.name}</p>
          <p>price: {ethers.formatEther(p.price)} ETH</p>
          <p>quantity: {p.quantity.toString()}</p>
          <input
            placeholder="new price (ETH)"
            onChange={(e) => setNewPrice({ ...newPrice, [p.id]: e.target.value })}
          />
          <input
            placeholder="new quantity"
            onChange={(e) => setNewQuantity({ ...newQuantity, [p.id]: e.target.value })}
          />
          <button onClick={() => handleUpdate(p.id)}>fix</button>
        </div>
      ))}
    </div>
  );
}

export default UpdateProductPage;