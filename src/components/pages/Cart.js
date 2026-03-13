import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateQty, removeItem, removeSelected } from '../store/AppStore';
import './Cart.css';

const SHIPPING_FREE_THRESHOLD = 50000;
const SHIPPING_FEE = 3000;

export default function Cart() {
  const items = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(() => new Set(items.map((i) => i.cartId)));

  const toggleCheck = (cartId) => {
    setChecked((prev) => {
      const s = new Set(prev);
      s.has(cartId) ? s.delete(cartId) : s.add(cartId);
      return s;
    });
  };

  const toggleAll = () => {
    if (checked.size === items.length) setChecked(new Set());
    else setChecked(new Set(items.map((i) => i.cartId)));
  };

  const handleRemoveSelected = () => {
    dispatch(removeSelected([...checked]));
    setChecked(new Set());
  };

  const checkedItems = items.filter((i) => checked.has(i.cartId));
  const subtotal = checkedItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty__icon">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M8 8h4l5.6 22.4A4 4 0 0021.5 34h17a4 4 0 003.88-3.04L46 16H14"
              stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="22" cy="41" r="2" fill="#ccc"/>
            <circle cx="37" cy="41" r="2" fill="#ccc"/>
          </svg>
        </div>
        <p className="cart-empty__msg">장바구니가 비어있습니다.</p>
        <Link to="/" className="cart-empty__btn">쇼핑 계속하기</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="cart-header__title">CART</h1>
        <p className="cart-header__count">{items.length}개 상품</p>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          <div className="cart-select-all">
            <label className="cart-check">
              <input
                type="checkbox"
                checked={checked.size === items.length && items.length > 0}
                onChange={toggleAll}
              />
              <span className="cart-check__box" />
              <span className="cart-check__label">전체 선택 ({checked.size}/{items.length})</span>
            </label>
            {checked.size > 0 && (
              <button className="cart-select-all__del" onClick={handleRemoveSelected}>
                선택 삭제
              </button>
            )}
          </div>

          <div className="cart-divider" />

          {items.map((item) => (
            <div key={item.cartId} className={`cart-item ${!checked.has(item.cartId) ? 'dimmed' : ''}`}>
              <label className="cart-check">
                <input
                  type="checkbox"
                  checked={checked.has(item.cartId)}
                  onChange={() => toggleCheck(item.cartId)}
                />
                <span className="cart-check__box" />
              </label>

              <Link to={`/product/${item.productId}`} className="cart-item__img-wrap">
                <img src={process.env.PUBLIC_URL + item.img} alt={item.name} className="cart-item__img" />
              </Link>

              <div className="cart-item__info">
                <p className="cart-item__eng">{item.engName}</p>
                <p className="cart-item__name">{item.name}</p>
                <p className="cart-item__variant">{item.variant}</p>

                <div className="cart-item__bottom">
                  <div className="cart-qty">
                    <button
                      className="cart-qty__btn"
                      onClick={() => dispatch(updateQty({ cartId: item.cartId, delta: -1 }))}
                      disabled={item.qty <= 1}
                    >−</button>
                    <span className="cart-qty__num">{item.qty}</span>
                    <button
                      className="cart-qty__btn"
                      onClick={() => dispatch(updateQty({ cartId: item.cartId, delta: 1 }))}
                      disabled={item.qty >= (item.stock || 99)}
                    >+</button>
                  </div>

                  <div className="cart-item__price-wrap">
                    {item.originalPrice && item.originalPrice !== item.price && (
                      <span className="cart-item__original">
                        {(item.originalPrice * item.qty).toLocaleString()}원
                      </span>
                    )}
                    <span className="cart-item__price">
                      {(item.price * item.qty).toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>

              <button className="cart-item__del" onClick={() => dispatch(removeItem(item.cartId))}>×</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2 className="cart-summary__title">ORDER SUMMARY</h2>
          <div className="cart-divider" />

          <div className="cart-summary__row">
            <span>상품 금액</span>
            <span>{subtotal.toLocaleString()}원</span>
          </div>
          <div className="cart-summary__row">
            <span>배송비</span>
            <span>{shipping === 0 && subtotal > 0 ? '무료' : `${SHIPPING_FEE.toLocaleString()}원`}</span>
          </div>

          {subtotal > 0 && subtotal < SHIPPING_FREE_THRESHOLD && (
            <p className="cart-summary__ship-notice">
              {(SHIPPING_FREE_THRESHOLD - subtotal).toLocaleString()}원 더 담으면 무료배송
            </p>
          )}

          <div className="cart-divider" />

          <div className="cart-summary__total">
            <span>총 결제금액</span>
            <span className="cart-summary__total-price">{total.toLocaleString()}원</span>
          </div>

          <button className="cart-order-btn" disabled={checked.size === 0}>
            {checked.size === 0 ? '상품을 선택해주세요' : `${checkedItems.length}개 상품 주문하기`}
          </button>

          <Link to="/" className="cart-continue">쇼핑 계속하기</Link>
        </div>
      </div>
    </div>
  );
}