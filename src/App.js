import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';

// page
import Home from './components/pages/Home';
import About from './components/pages/About';
import Cart from './components/pages/Cart';
import Login from './components/pages/Login';
import Mypage from './components/pages/Mypage';
import ProductList from './components/pages/ProductList';
import ProductDetail from './components/pages/ProductDetail';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 상품 상세 */}
        <Route path="/product/:id" element={<ProductDetail />} />

        {/* About */}
        <Route path="/about" element={<About />} />
        <Route path="/about/:slug" element={<About />} />

        {/* slug 없는 단독 경로 — /:section/:slug 보다 반드시 먼저 등록 */}
        <Route path="/giftset" element={<ProductList />} />
        <Route path="/acc"     element={<ProductList />} />

        {/* 상품 목록 (section + slug) */}
        <Route path="/:section/:slug" element={<ProductList />} />

        {/* 유저 */}
        <Route path="/cart"   element={<Cart />} />
        <Route path="/login"  element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </div>
  );
}

export default App;