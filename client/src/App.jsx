import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BuyerPage from './pages/BuyerPage';
import SellerPage from './pages/SellerPage';
import ProductDetail from './pages/ProductDetail'; 
import UpdateProductPage from './pages/UpdateProductPage';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/buy">buy</Link> | <Link to="/add-product">add</Link> | <Link to="/update-product">update</Link>
      </nav>
      <Routes>
        <Route path="/buy" element={<BuyerPage />} />
        <Route path="/add-product" element={<SellerPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/update-product/" element={<UpdateProductPage />} />
      </Routes>
    </Router>
  );
}

export default App;