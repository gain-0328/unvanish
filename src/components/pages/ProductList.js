import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import products from '../data/Products.json';
import './ProductList.css';

/* ── 유틸리티 함수 ── */
const dedup = (arr) => {
  const seen = new Set();
  return arr.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
};

const getMain = (p) => process.env.PUBLIC_URL + (p.variants[0]?.images?.main || '');
const getPrice = (p) => {
  const v = p.variants[0];
  if (!v) return 0;
  return v.discount ? Math.round(v.price * (1 - v.discount / 100)) : v.price;
};

/* ── 매핑 데이터 ── */
const COLLECTION_MAP = {
  nature: '자연',
  love: '사랑',
  instinct: '본능',
};

const META = {
  'parfum-Extrait':      { title: 'Extrait de Parfum', sub: '최고 부향률의 퍼퓸 등급' },
  'parfum-Oil':          { title: 'Oil Perfume',        sub: '피부에 녹아드는 롤온 오일 퍼퓸' },
  'parfum-Bespoke':      { title: 'Bespoke Layering',   sub: '나만의 향으로 레이어링' },
  'body-HandCream':      { title: 'Hand Cream',         sub: '향기로운 퍼퓸드 핸드크림' },
  'body-BodyHairOil':    { title: 'Body & Hair Oil',    sub: '전신을 감싸는 퍼퓸드 바디오일' },
  'body-HandBodyWash':   { title: 'Hand & Body Wash',   sub: '고농축 오일 함유 젤 워시' },
  'collection-nature':   { title: '자연 Collection',    sub: 'Sea, Forest & Earth' },
  'collection-love':     { title: '사랑 Collection',    sub: 'Romance & Intimacy' },
  'collection-instinct': { title: '본능 Collection',    sub: 'Desire & Impulse' },
  'giftset':             { title: 'Gift Set',           sub: '소중한 사람을 위한 선물' },
  'acc':                 { title: 'Accessories',        sub: 'Unvanish Acc' },
};

const TYPE_LABEL = {
  Extrait:      'EXTRAIT',
  Oil:          'OIL PERFUME',
  Bespoke:      'BESPOKE',
  HandCream:    'HAND CREAM',
  BodyHairOil:  'BODY OIL',
  HandBodyWash: 'BODY WASH',
};

const SORT_OPTIONS = [
  { value: 'default',    label: '기본 정렬' },
  { value: 'price_asc',  label: '가격 낮은순' },
  { value: 'price_desc', label: '가격 높은순' },
  { value: 'new',        label: '신상품순' },
];

export default function ProductList() {
  // /:section/:slug 패턴일 때만 값이 있음
  const { section: paramSection, slug } = useParams();
  const { pathname } = useLocation();

  // /giftset, /acc 처럼 slug 없는 단독 경로 대응
  // pathname = '/giftset' → section = 'giftset'
  const section = paramSection ?? pathname.replace('/', '');

  const [sort, setSort] = useState('default');
  const [tabFilter, setTabFilter] = useState('all');

  // 1. URL 변경 시 상태 초기화
  useEffect(() => {
    setTabFilter('all');
    setSort('default');
    window.scrollTo(0, 0);
  }, [section, slug]);

  // 2. 탭 목록용 — 탭 필터 적용 전 전체 아이템
  const allItems = useMemo(() => {
    const result = dedup(products);
    if (section === 'collection' && slug) {
      return result.filter((p) => p.collection === (COLLECTION_MAP[slug] || slug));
    }
    return result;
  }, [section, slug]);

  // 3. 실제 렌더링용 — 탭 필터 + 정렬 적용
  const items = useMemo(() => {
    let result = dedup(products);

    if (section === 'collection' && slug) {
      const koCollection = COLLECTION_MAP[slug] || slug;
      result = result.filter((p) => p.collection === koCollection);
    } else if (section === 'parfum' && slug) {
      result = result.filter((p) => p.category === 'parfum' && p.type === slug);
    } else if (section === 'body' && slug) {
      result = result.filter((p) => p.category === 'body' && p.type === slug);
    } else if (section === 'giftset') {
      result = result.filter((p) => p.category === 'gift set');
    } else if (section === 'acc') {
      result = result.filter((p) => p.category === 'acc');
    }

    // 컬렉션 내부 탭 필터
    if (section === 'collection' && tabFilter !== 'all') {
      result = result.filter((p) => p.type === tabFilter);
    }

    // 정렬
    return [...result].sort((a, b) => {
      if (sort === 'price_asc')  return getPrice(a) - getPrice(b);
      if (sort === 'price_desc') return getPrice(b) - getPrice(a);
      if (sort === 'new')        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });
  }, [section, slug, tabFilter, sort]);

  // 4. Intersection Observer (애니메이션)
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    const targets = document.querySelectorAll('.reveal');
    targets.forEach((el) => {
      el.classList.remove('visible');
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  // allItems 기준으로 탭 목록 생성
  const typeTabOptions = section === 'collection'
    ? ['all', ...new Set(allItems.map((p) => p.type).filter(Boolean))]
    : [];

  const metaKey = section === 'collection'
    ? `collection-${slug}`
    : slug ? `${section}-${slug}` : section;
  const meta = META[metaKey] || { title: 'Products', sub: '' };

  return (
    <div className="pl-page">
      <div className="pl-header reveal">
        <p className="pl-header_eyebrow">UNVANISH</p>
        <h1 className="pl-header_title">{meta.title}</h1>
        <p className="pl-header_sub">{meta.sub}</p>
      </div>

      <div className="pl-controls">
        {typeTabOptions.length > 1 && (
          <div className="pl-tabs">
            {typeTabOptions.map((t) => (
              <button
                key={t}
                className={`pl-tab ${tabFilter === t ? 'active' : ''}`}
                onClick={() => setTabFilter(t)}
              >
                {t === 'all' ? 'ALL' : (TYPE_LABEL[t] || t.toUpperCase())}
              </button>
            ))}
          </div>
        )}
        <div className="pl-controls_right">
          <span className="pl-count">{items.length}개 상품</span>
          <select className="pl-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="pl-empty"><p>준비 중인 상품입니다.</p></div>
      ) : (
        <div className="pl-grid">
          {items.map((p, i) => (
            <PLCard key={`${p.id}-${i}`} product={p} delay={i * 60} />
          ))}
        </div>
      )}
    </div>
  );
}

function PLCard({ product, delay }) {
  const [hovered, setHovered] = useState(false);
  const price = getPrice(product);
  const v = product.variants[0];
  const soldOut = v?.stock === 0;
  const detail = v?.images?.detail?.[0];

  return (
    <Link
      to={`/product/${product.id}`}
      className="pl-card reveal"
      style={{ '--delay': `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="pl-card_img-wrap">
        <img
          src={hovered && detail ? detail : getMain(product)}
          alt={product.name}
          className="pl-card_img"
          loading="lazy"
        />
        {soldOut && <div className="pl-card_sold-out">SOLD OUT</div>}
        <div className="pl-card_badges">
          {product.isNew  && <span className="badge badge--new">NEW</span>}
          {product.isBest && <span className="badge badge--best">BEST</span>}
          {v?.discount    && <span className="badge badge--sale">-{v.discount}%</span>}
        </div>
      </div>

      <div className="pl-card_body">
        <p className="pl-card_eng">{product.engName}</p>
        <p className="pl-card_name">{product.name}</p>
        {product.keywords && (
          <p className="pl-card_keywords">{product.keywords.join(' · ')}</p>
        )}
        <div className="pl-card_price-row">
          {v?.discount && (
            <span className="pl-card_original">{v.price.toLocaleString()}원</span>
          )}
          <span className={`pl-card_price ${soldOut ? 'sold' : ''}`}>
            {soldOut ? '품절' : `${price.toLocaleString()}원`}
          </span>
        </div>
      </div>
    </Link>
  );
}