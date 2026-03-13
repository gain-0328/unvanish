import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import { SiNaver } from 'react-icons/si';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = '이메일을 입력해주세요.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = '올바른 이메일 형식이 아닙니다.';
    if (!form.password) e.password = '비밀번호를 입력해주세요.';
    else if (form.password.length < 6) e.password = '비밀번호는 6자 이상이어야 합니다.';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((er) => ({ ...er, [field]: '' }));
  };

  return (
    <div className="login-page">
      <div className="login-box">

        <div className="login-brand">
          <span className="login-brand_name">UNVANISH</span>
          <div className="login-brand_line" />
          <p className="login-brand_sub">향기로운 일상을 시작하세요</p>
        </div>

        <div className="login-form">
          {/* 이메일 */}
          <div className={`lf-field ${errors.email ? 'error' : ''} ${form.email ? 'filled' : ''}`}>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={handleChange('email')}
              autoComplete="email"
            />
            <label htmlFor="email">이메일</label>
            {errors.email && <p className="lf-error">{errors.email}</p>}
          </div>

          {/* 비밀번호 */}
          <div className={`lf-field ${errors.password ? 'error' : ''} ${form.password ? 'filled' : ''}`}>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={handleChange('password')}
              autoComplete="current-password"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <label htmlFor="password">비밀번호</label>
            {errors.password && <p className="lf-error">{errors.password}</p>}
          </div>

          <div className="login-opts">
            <Link to="/find-password" className="login-opts_link">비밀번호 찾기</Link>
            <Link to="/signup" className="login-opts_link">회원가입</Link>
          </div>

          <button
            className={`login-btn ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="login-btn_spinner" /> : 'LOGIN'}
          </button>
        </div>

        {/* 소셜 로그인 */}
        <div className="login-social">
          <div className="login-social_divider">
            <span>또는 소셜 계정으로 로그인</span>
          </div>
          <div className="login-social_btns">
            <button className="social-btn social-btn--kakao">
              <RiKakaoTalkFill />
              카카오로 시작하기
            </button>
            <button className="social-btn social-btn--naver">
              <SiNaver />
              네이버로 시작하기
            </button>
            <button className="social-btn social-btn--google">
              <FcGoogle />
              Google로 시작하기
            </button>
          </div>
        </div>

      </div>

      {/* 배경 장식 */}
      <div className="login-deco login-deco--1" />
      <div className="login-deco login-deco--2" />
    </div>
  );
}