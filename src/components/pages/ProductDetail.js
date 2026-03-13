import { useDispatch } from 'react-redux';
import { addToCart } from '../store/AppStore';
import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import products from '../data/Products.json';
import './ProductDetail.css';

const dedup = (arr) => {
  const seen = new Set();
  return arr.filter((p) => { if (seen.has(p.id)) return false; seen.add(p.id); return true; });
};
const allProducts = dedup(products);

const getPrice = (v) =>
  v.discount ? Math.round(v.price * (1 - v.discount / 100)) : v.price;

/* ── 듀오 옵션 목록 ── */
const DUO_OPTIONS = [
  { id: 'pear-cascade', name: '페어 카스케이드', engName: 'PEAR CASCADE' },
  { id: 'sea-of-green', name: '씨 오브 그린', engName: 'SEA OF GREEN' },
  { id: 'foggy-hinoki', name: '포기 히노키 포레스트', engName: 'FOGGY HINOKI FOREST' },
  { id: 'first-body', name: '퍼스트 바디', engName: 'FIRST BODY' },
  { id: 'virgin-fantasy', name: '버진 판타지', engName: 'VIRGIN FANTASY' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const product = allProducts.find((p) => p.id === Number(id));

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);
  const [noteTab, setNoteTab] = useState('top');

  /* 듀오 향 선택 */
  const [duo1, setDuo1] = useState('');
  const [duo2, setDuo2] = useState('');
  const [duoError, setDuoError] = useState('');

  const revealRef = useRef([]);

  const isDuo = product?.isDuo === true || product?.id === 13;

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
      setActiveImg(0);
      setQty(1);
      setDuo1('');
      setDuo2('');
      setDuoError('');
      window.scrollTo(0, 0);
    }
  }, [id, product]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    revealRef.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  });
  const addRef = (el) => { if (el && !revealRef.current.includes(el)) revealRef.current.push(el); };

  if (!product) {
    return (
      <div className="pd-notfound">
        <p>상품을 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>← 뒤로가기</button>
      </div>
    );
  }

  const v = selectedVariant || product.variants[0];
  const price = getPrice(v);
  const soldOut = v.stock === 0;

  // 이미지 배열 생성 (경로 결합 방식 최적화)
  const images = [v.images.main, ...(v.images.detail || [])]
    .filter(Boolean)
    .map((src) => `${process.env.PUBLIC_URL}/${src.replace(/^\//, '')}`);

  const handleAdd = () => {
    if (soldOut) return;
    if (isDuo) {
      if (!duo1 || !duo2) { setDuoError('향 2가지를 모두 선택해주세요.'); return; }
      if (duo1 === duo2) { setDuoError('서로 다른 향을 선택해주세요.'); return; }
      setDuoError('');
    }
    dispatch(addToCart({
      cartId: `${product.id}-${v.id}`,
      productId: product.id,
      name: product.name,
      engName: product.engName,
      variant: isDuo ? duoSummary : `${v.volumeMl}ml`,
      price: price,
      originalPrice: v.price,
      qty: qty,
      stock: v.stock,
      // 장바구니 이미지 경로 수정
      img: `${process.env.PUBLIC_URL}/${v.images.main.replace(/^\//, '')}`,
    }));
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };

  const related = allProducts
    .filter((p) => p.id !== product.id && (p.collection === product.collection || p.type === product.type))
    .slice(0, 4);

  const duoSummary = duo1 && duo2
    ? `${DUO_OPTIONS.find(o => o.id === duo1)?.name} + ${DUO_OPTIONS.find(o => o.id === duo2)?.name}`
    : null;

  return (
    <div className="pd-page">
      {/* BREADCRUMB */}
      <nav className="pd-breadcrumb">
        <Link to="/">HOME</Link>
        <span>·</span>
        {product.category === 'body' ? (
          <Link to={`/body/${product.type}`}>{product.type?.toUpperCase()}</Link>
        ) : product.category === 'parfum' ? (
          <Link to={`/parfum/${product.type}`}>{product.type?.toUpperCase()}</Link>
        ) : (
          <Link to={`/${product.category}`}>{product.category?.toUpperCase()}</Link>
        )}
        <span>·</span>
        <span>{product.engName}</span>
      </nav>

      <div className="pd-main">
        {/* 갤러리 */}
        <div className="pd-gallery reveal" ref={addRef}>
          <div className="pd-gallery_thumbs">
            {images.map((src, i) => (
              <button key={i} className={`pd-thumb ${activeImg === i ? 'active' : ''}`} onClick={() => setActiveImg(i)}>
                <img src={src} alt={`${product.name} ${i + 1}`} />
              </button>
            ))}
          </div>
          <div className="pd-gallery_main">
            <img src={images[activeImg]} alt={product.name} className="pd-gallery_img" />
            {product.isNew && <span className="pd-badge pd-badge--new">NEW</span>}
            {product.isBest && <span className="pd-badge pd-badge--best">BEST</span>}
          </div>
        </div>

        {/* 상품 정보 */}
        <div className="pd-info reveal" ref={addRef} style={{ '--delay': '120ms' }}>
          {product.collection && (
            <p className="pd-info_collection">{product.collection} Collection</p>
          )}
          <h1 className="pd-info_name">{product.name}</h1>
          <p className="pd-info_eng">{product.engName}</p>

          {product.engKeywords && (
            <div className="pd-keywords">
              {product.engKeywords.map((k, i) => (
                <span key={i} className="pd-keyword">{k}</span>
              ))}
            </div>
          )}

          <div className="pd-divider" />

          {/* 가격 */}
          <div className="pd-price-area">
            {v.discount && (
              <>
                <span className="pd-price_original">{v.price.toLocaleString()}원</span>
                <span className="pd-price_discount">-{v.discount}%</span>
              </>
            )}
            <p className="pd-price_final">
              {soldOut ? '품절' : `${price.toLocaleString()}원`}
            </p>
          </div>

          {/* 듀오 향 선택 */}
          {isDuo && (
            <div className="pd-duo">
              <p className="pd-label">향 선택 <span className="pd-duo__req">2가지 선택 필수</span></p>
              <div className="pd-duo__row">
                <div className="pd-duo__select-wrap">
                  <span className="pd-duo__num">1</span>
                  <select
                    className={`pd-duo__select ${duo1 ? 'selected' : ''}`}
                    value={duo1}
                    onChange={(e) => { setDuo1(e.target.value); setDuoError(''); }}
                  >
                    <option value="">향 선택</option>
                    {DUO_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id} disabled={o.id === duo2}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="pd-duo__plus">+</span>
                <div className="pd-duo__select-wrap">
                  <span className="pd-duo__num">2</span>
                  <select
                    className={`pd-duo__select ${duo2 ? 'selected' : ''}`}
                    value={duo2}
                    onChange={(e) => { setDuo2(e.target.value); setDuoError(''); }}
                  >
                    <option value="">향 선택</option>
                    {DUO_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id} disabled={o.id === duo1}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {duoSummary && <p className="pd-duo__summary">선택: {duoSummary}</p>}
              {duoError && <p className="pd-duo__error">{duoError}</p>}
            </div>
          )}

          {/* 용량 선택 */}
          {!isDuo && (
            <div className="pd-variants">
              <p className="pd-label">용량 선택</p>
              <div className="pd-variant-btns">
                {product.variants.map((vr) => (
                  <button
                    key={vr.id}
                    className={`pd-var-btn ${selectedVariant?.id === vr.id ? 'active' : ''} ${vr.stock === 0 ? 'sold' : ''}`}
                    onClick={() => { setSelectedVariant(vr); setActiveImg(0); }}
                    disabled={vr.stock === 0}
                  >
                    {vr.volumeMl ? `${vr.volumeMl}ml` : vr.id}
                    {vr.stock === 0 && <span className="var-sold"> · 품절</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 수량 */}
          {!soldOut && (
            <div className="pd-qty">
              <p className="pd-label">수량</p>
              <div className="pd-qty-ctrl">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(v.stock, q + 1))}>+</button>
              </div>
            </div>
          )}

          {/* 구매 버튼 */}
          <div className="pd-actions">
            <button
              className={`pd-btn pd-btn--cart ${soldOut ? 'disabled' : ''} ${addedMsg ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={soldOut}
            >
              {addedMsg ? '✓ 담겼습니다' : soldOut ? '품절' : '장바구니 담기'}
            </button>
            <button className={`pd-btn pd-btn--buy ${soldOut ? 'disabled' : ''}`} disabled={soldOut}>
              바로 구매
            </button>
          </div>

          {product.perfumer && <p className="pd-perfumer">Perfumer · {product.perfumer}</p>}
        </div>
      </div>

      {/* DETAIL */}
      <div className="pd-detail">
        {product.notes && (
          <div className="pd-notes reveal" ref={addRef}>
            <p className="pd-section-label">FRAGRANCE NOTES</p>
            <div className="pd-note-tabs">
              {['top', 'middle', 'base'].map((tab) =>
                product.notes[tab]?.length > 0 && (
                  <button
                    key={tab}
                    className={`pd-note-tab ${noteTab === tab ? 'active' : ''}`}
                    onClick={() => setNoteTab(tab)}
                  >
                    {tab.toUpperCase()}
                  </button>
                )
              )}
            </div>
            <div className="pd-note-pills">
              {(product.notes[noteTab] || []).map((n, i) => (
                <span key={i} className="pd-note-pill">{n}</span>
              ))}
            </div>
          </div>
        )}

        <div className="pd-desc reveal" ref={addRef}>
          <p className="pd-section-label">DESCRIPTION</p>
          {product.description?.map((block, i) =>
            block.type === 'text' ? (
              <p key={i} className="pd-desc_text">
                {block.content.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}
              </p>
            ) : block.type === 'image' ? (
              // 상세 설명 이미지 경로 수정
              <img key={i} src={`${process.env.PUBLIC_URL}/${block.src.replace(/^\//, '')}`} alt="" className="pd-desc_img" />
            ) : null
          )}
        </div>

        {/* INGREDIENTS 생략 가능 (원본 유지) */}
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="pd-related">
          <p className="pd-section-label pd-section-label--center">YOU MAY ALSO LIKE</p>
          <div className="pd-related-grid">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="pd-rel-card reveal" ref={addRef}>
                <div className="pd-rel-card_img-wrap">
                  {/* 관련 상품 이미지 경로 수정 */}
                  <img src={`${process.env.PUBLIC_URL}/${p.variants[0].images.main.replace(/^\//, '')}`} alt={p.name} />
                </div>
                <p className="pd-rel-card_eng">{p.engName}</p>
                <p className="pd-rel-card_name">{p.name}</p>
                <p className="pd-rel-card_price">{getPrice(p.variants[0]).toLocaleString()}원</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}