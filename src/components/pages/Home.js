import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import products from '../data/Products.json';
import './Home.css';

const dedup = (arr) => {
  const seen = new Set();
  return arr.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
};

// 메인 이미지 경로 처리 (슬래시 중복 방지 로직 추가)
const getMain = (p) => {
  const src = p.variants[0]?.images?.main || '';
  return `${process.env.PUBLIC_URL}/${src.replace(/^\//, '')}`;
};

const getPrice = (p) => {
  const v = p.variants[0];
  if (!v) return 0;
  return v.discount ? Math.round(v.price * (1 - v.discount / 100)) : v.price;
};

export default function Home() {
  const allProducts = dedup(products);
  const bestItems   = allProducts.filter((p) => p.isBest).slice(0, 4);
  const newItems    = allProducts.filter((p) => p.isNew).slice(0, 4);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.h-reveal').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="home">

      {/* ── VIDEO HERO ── */}
      <section className="video-hero">
        <div className="video-hero__iframe-wrap">
          <iframe
            src="https://www.youtube.com/embed/wqUdEbWOgg8?autoplay=1&mute=1&loop=1&playlist=wqUdEbWOgg8&rel=0&modestbranding=1"
            title="UNVANISH_oil perfume"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </section>

      {/* ── BRAND MESSAGE ── */}
      <section className="brand-msg h-reveal">
        <p className="brand-msg__en">UNVANISH</p>
        <h2 className="brand-msg__ko">사라지지 않는 향,<br />당신의 이야기를 완성합니다.</h2>
        <div className="brand-msg__line" />
      </section>

      {/* ── BEST ── */}
      {bestItems.length > 0 && (
        <section className="product-section h-reveal">
          <div className="product-section__head">
            <span className="product-section__tag">BEST SELLER</span>
            <Link to="/parfum/Extrait" className="product-section__more">VIEW ALL →</Link>
          </div>
          <div className="product-section__grid">
            {bestItems.map((p, i) => <HomeCard key={p.id} product={p} delay={i * 80} />)}
          </div>
        </section>
      )}

      {/* ── NEW ── */}
      {newItems.length > 0 && (
        <section className="product-section h-reveal">
          <div className="product-section__head">
            <span className="product-section__tag">NEW ARRIVAL</span>
            <Link to="/parfum/Extrait" className="product-section__more">VIEW ALL →</Link>
          </div>
          <div className="product-section__grid">
            {newItems.map((p, i) => <HomeCard key={p.id} product={p} delay={i * 80} />)}
          </div>
        </section>
      )}

    </div>
  );
}

function HomeCard({ product, delay }) {
  const [hovered, setHovered] = useState(false);
  const v       = product.variants[0];
  const price   = getPrice(product);
  const soldOut = v?.stock === 0;
  
  // 호버 시 보여줄 상세 이미지 경로 처리 수정
  const detailSrc = v?.images?.detail?.[0];
  const detailFull = detailSrc 
    ? `${process.env.PUBLIC_URL}/${detailSrc.replace(/^\//, '')}` 
    : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="home-card h-reveal"
      style={{ '--delay': `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="home-card__img-wrap">
        <img
          src={hovered && detailFull ? detailFull : getMain(product)}
          alt={product.name}
          className="home-card__img"
          loading="lazy"
        />
        <div className="home-card__badges">
          {product.isNew  && <span className="hbadge hbadge--new">NEW</span>}
          {product.isBest && <span className="hbadge hbadge--best">BEST</span>}
          {v?.discount    && <span className="hbadge hbadge--sale">-{v.discount}%</span>}
        </div>
      </div>
      <div className="home-card__body">
        <p className="home-card__eng">{product.engName}</p>
        <p className="home-card__name">{product.name}</p>
        <p className="home-card__price">{soldOut ? '품절' : `${price.toLocaleString()}원`}</p>
      </div>
    </Link>
  );
}