import { useParams } from 'react-router-dom';

export default function About() {
  const { slug } = useParams(); // 'brand' | 'store' | 'archive' | undefined

  return (
    <div>
      {(!slug || slug === 'brand') && <div>Brand 내용</div>}
      {slug === 'store'   && <div>Store 내용</div>}
      {slug === 'archive' && <div>Archive 내용</div>}
    </div>
  );
}