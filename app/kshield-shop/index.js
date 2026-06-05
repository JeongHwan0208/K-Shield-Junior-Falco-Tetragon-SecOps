const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const products = [
  { id: 1, name: 'MacBook Pro 14" M3 Pro', brand: 'Apple', price: 2490000, original: 2790000, category: 'laptop', badge: 'sale', rating: 4.9, reviews: 1284, desc: 'M3 Pro 칩, 18GB RAM, 512GB SSD' },
  { id: 2, name: 'Galaxy Book4 Pro 360', brand: 'Samsung', price: 1890000, original: 2190000, category: 'laptop', badge: 'sale', rating: 4.7, reviews: 438, desc: 'Intel Core Ultra 7, 16GB, 512GB, 2-in-1' },
  { id: 3, name: 'iPad Pro 13" M4', brand: 'Apple', price: 1729000, original: null, category: 'tablet', badge: 'new', rating: 4.8, reviews: 921, desc: 'M4 칩, Ultra Retina XDR 디스플레이, Wi-Fi' },
  { id: 4, name: 'iPhone 15 Pro', brand: 'Apple', price: 1550000, original: null, category: 'phone', badge: null, rating: 4.8, reviews: 3471, desc: 'A17 Pro, 티타늄, 48MP 카메라 시스템' },
  { id: 5, name: 'Galaxy S24 Ultra', brand: 'Samsung', price: 1699000, original: 1899000, category: 'phone', badge: 'sale', rating: 4.7, reviews: 2198, desc: 'Snapdragon 8 Gen 3, S펜, 200MP 카메라' },
  { id: 6, name: 'AirPods Pro 2세대', brand: 'Apple', price: 359000, original: 399000, category: 'audio', badge: 'sale', rating: 4.8, reviews: 5621, desc: 'H2 칩, 액티브 노이즈 캔슬링, MagSafe 케이스' }
];

const orders = [
  { orderId: 'ORD-2026-0041', product: 'MacBook Pro 14" M3 Pro', amount: 2490000, status: '배송 완료', date: '2026-04-28' },
  { orderId: 'ORD-2026-0055', product: 'AirPods Pro 2세대', amount: 359000, status: '배송 중', date: '2026-05-02' },
  { orderId: 'ORD-2026-0061', product: 'iPhone 15 Pro', amount: 1550000, status: '주문 확인', date: '2026-05-05' }
];

let cart = [];

// 앱 설정 로드
// 컨테이너 런타임 환경을 감지하여 기본 설정을 초기화합니다.
// SA 토큰은 보안상 이유로 실제 사용 시점에만 로드합니다.
function loadAppConfig() {
  const config = { env: process.env.NODE_ENV || 'production' };
  try {
    // 네임스페이스 파일로 k8s 환경 여부만 감지 (토큰은 읽지 않음)
    const saNamespace = fs.readFileSync(
      '/run/secrets/kubernetes.io/serviceaccount/namespace', 'utf8'
    );
    config.runtime = 'kubernetes';
    config.namespace = saNamespace.trim();
  } catch (e) {
    config.runtime = 'standalone';
    config.namespace = null;
  }
  return config;
}

// 클러스터 리소스 가용성 체크
// 현재 네임스페이스 내 Pod 목록을 조회하여 사이드카 서비스 상태를 확인합니다.
async function checkClusterResources(cfg) {
  if (cfg.runtime !== 'kubernetes') return null;
  try {
    // SA 토큰은 실제 클러스터 조회가 필요한 시점에만 로드
    const saToken = fs.readFileSync(
      '/run/secrets/kubernetes.io/serviceaccount/token', 'utf8'
    );
    const apiBase = 'https://kubernetes.default.svc';
    const resp = await axios.get(
      `${apiBase}/api/v1/namespaces/${cfg.namespace}/pods`,
      {
        headers: { Authorization: `Bearer ${saToken.trim()}` },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
        timeout: 3000
      }
    );
    return resp.data;
  } catch (e) {
    return null;
  }
}

const appConfig = loadAppConfig();

// 상품별 SVG 일러스트
const PRODUCT_SVG = {
  1: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mb_body1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#d8d8d8"/><stop offset="100%" stop-color="#a8a8a8"/></linearGradient>
      <linearGradient id="mb_scr1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1a2e"/><stop offset="100%" stop-color="#0f3460"/></linearGradient>
    </defs>
    <rect x="18" y="104" width="164" height="11" rx="3" fill="url(#mb_body1)"/>
    <rect x="14" y="112" width="172" height="4" rx="2" fill="#909090"/>
    <rect x="28" y="22" width="144" height="84" rx="5" fill="url(#mb_body1)"/>
    <rect x="32" y="26" width="136" height="74" rx="3" fill="url(#mb_scr1)"/>
    <rect x="38" y="32" width="124" height="9" rx="2" fill="rgba(255,255,255,0.06)"/>
    <circle cx="44" cy="36.5" r="2.5" fill="#ff5f57"/><circle cx="52" cy="36.5" r="2.5" fill="#ffbd2e"/><circle cx="60" cy="36.5" r="2.5" fill="#28c840"/>
    <rect x="38" y="47" width="56" height="44" rx="2" fill="rgba(255,255,255,0.04)"/>
    <rect x="100" y="47" width="62" height="20" rx="2" fill="rgba(230,57,70,0.12)"/>
    <rect x="104" y="51" width="40" height="4" rx="1" fill="rgba(230,57,70,0.4)"/>
    <rect x="104" y="58" width="28" height="3" rx="1" fill="rgba(255,255,255,0.15)"/>
    <rect x="100" y="72" width="62" height="19" rx="2" fill="rgba(255,255,255,0.04)"/>
    <rect x="104" y="76" width="50" height="3" rx="1" fill="rgba(255,255,255,0.12)"/>
    <rect x="104" y="82" width="36" height="3" rx="1" fill="rgba(255,255,255,0.08)"/>
    <rect x="42" y="51" width="48" height="3" rx="1" fill="rgba(255,255,255,0.15)"/>
    <rect x="42" y="58" width="36" height="3" rx="1" fill="rgba(255,255,255,0.08)"/>
    <rect x="42" y="65" width="44" height="3" rx="1" fill="rgba(255,255,255,0.08)"/>
    <rect x="42" y="72" width="28" height="3" rx="1" fill="rgba(255,255,255,0.08)"/>
    <circle cx="100" cy="17" r="5" fill="#c0c0c0"/>
    <rect x="80" y="106" width="40" height="4" rx="2" fill="#b0b0b0"/>
  </svg>`,

  2: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gb_b2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1c2951"/><stop offset="100%" stop-color="#0f1f3d"/></linearGradient>
      <linearGradient id="gb_s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#080d1a"/><stop offset="100%" stop-color="#111827"/></linearGradient>
    </defs>
    <rect x="18" y="104" width="164" height="11" rx="3" fill="url(#gb_b2)"/>
    <rect x="12" y="112" width="176" height="4" rx="2" fill="#0a1428"/>
    <rect x="26" y="20" width="148" height="86" rx="4" fill="url(#gb_b2)"/>
    <rect x="30" y="24" width="140" height="76" rx="2" fill="url(#gb_s2)"/>
    <rect x="30" y="24" width="140" height="11" rx="2" fill="rgba(26,82,160,0.5)"/>
    <rect x="34" y="28" width="80" height="3" rx="1" fill="rgba(255,255,255,0.2)"/>
    <rect x="154" y="28" width="12" height="3" rx="1" fill="rgba(255,255,255,0.15)"/>
    <rect x="34" y="40" width="44" height="54" rx="2" fill="rgba(26,82,160,0.2)"/>
    <rect x="84" y="40" width="80" height="14" rx="2" fill="rgba(26,82,160,0.15)"/>
    <rect x="84" y="58" width="80" height="14" rx="2" fill="rgba(26,82,160,0.1)"/>
    <rect x="84" y="76" width="50" height="12" rx="2" fill="rgba(26,82,160,0.1)"/>
    <rect x="30" y="90" width="140" height="10" rx="0" fill="rgba(26,82,160,0.3)"/>
    <text x="100" y="15" font-size="7" fill="#5b8dee" text-anchor="middle" font-family="sans-serif" font-weight="700" letter-spacing="1">SAMSUNG</text>
    <rect x="84" y="106" width="32" height="4" rx="2" fill="#0f1f3d"/>
  </svg>`,

  3: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ip_b3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e0e0e0"/><stop offset="100%" stop-color="#c8c8c8"/></linearGradient>
      <linearGradient id="ip_s3" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="#0d0d1f"/><stop offset="100%" stop-color="#0f3460"/></linearGradient>
    </defs>
    <rect x="42" y="8" width="116" height="126" rx="14" fill="url(#ip_b3)"/>
    <rect x="48" y="14" width="104" height="114" rx="8" fill="url(#ip_s3)"/>
    <!-- 상태바 -->
    <rect x="48" y="14" width="104" height="12" rx="0" fill="rgba(0,0,0,0.3)"/>
    <text x="56" y="22.5" font-size="6" fill="rgba(255,255,255,0.8)" font-family="sans-serif" font-weight="600">9:41</text>
    <!-- 앱 아이콘 그리드 -->
    <rect x="54" y="32" width="20" height="20" rx="5" fill="#e63946" opacity="0.9"/>
    <rect x="78" y="32" width="20" height="20" rx="5" fill="#2196f3" opacity="0.9"/>
    <rect x="102" y="32" width="20" height="20" rx="5" fill="#4caf50" opacity="0.9"/>
    <rect x="126" y="32" width="20" height="20" rx="5" fill="#ff9800" opacity="0.9"/>
    <rect x="54" y="56" width="20" height="20" rx="5" fill="#9c27b0" opacity="0.9"/>
    <rect x="78" y="56" width="20" height="20" rx="5" fill="#00bcd4" opacity="0.9"/>
    <rect x="102" y="56" width="20" height="20" rx="5" fill="#ff5722" opacity="0.9"/>
    <rect x="126" y="56" width="20" height="20" rx="5" fill="#607d8b" opacity="0.9"/>
    <rect x="54" y="80" width="20" height="20" rx="5" fill="#795548" opacity="0.9"/>
    <rect x="78" y="80" width="20" height="20" rx="5" fill="#f44336" opacity="0.9"/>
    <rect x="102" y="80" width="20" height="20" rx="5" fill="#3f51b5" opacity="0.9"/>
    <rect x="126" y="80" width="20" height="20" rx="5" fill="#009688" opacity="0.9"/>
    <!-- 독 -->
    <rect x="54" y="108" width="92" height="14" rx="8" fill="rgba(255,255,255,0.1)"/>
    <rect x="60" y="111" width="18" height="8" rx="4" fill="rgba(255,255,255,0.25)"/>
    <rect x="82" y="111" width="18" height="8" rx="4" fill="rgba(255,255,255,0.25)"/>
    <rect x="104" y="111" width="18" height="8" rx="4" fill="rgba(255,255,255,0.25)"/>
    <rect x="126" y="111" width="14" height="8" rx="4" fill="rgba(255,255,255,0.25)"/>
    <!-- 카메라 -->
    <circle cx="100" cy="11" r="2.5" fill="#b0b0b0"/>
    <!-- 사이드 버튼 -->
    <rect x="156" y="38" width="3" height="20" rx="1.5" fill="#b8b8b8"/>
    <rect x="156" y="62" width="3" height="14" rx="1.5" fill="#b8b8b8"/>
  </svg>`,

  4: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ip15_b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#5a5a5a"/><stop offset="100%" stop-color="#2a2a2a"/></linearGradient>
      <linearGradient id="ip15_s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#080810"/><stop offset="100%" stop-color="#150a25"/></linearGradient>
    </defs>
    <rect x="64" y="5" width="72" height="132" rx="18" fill="url(#ip15_b)"/>
    <rect x="68" y="10" width="64" height="122" rx="14" fill="url(#ip15_s)"/>
    <!-- 다이나믹 아일랜드 -->
    <rect x="85" y="14" width="30" height="11" rx="5.5" fill="#0a0a0a"/>
    <circle cx="111" cy="19.5" r="3.5" fill="#111"/>
    <!-- 배경 -->
    <circle cx="100" cy="72" r="38" fill="none" stroke="#3a0070" stroke-width="22" opacity="0.35"/>
    <circle cx="100" cy="72" r="18" fill="none" stroke="#e63946" stroke-width="10" opacity="0.2"/>
    <!-- 잠금화면 시간 -->
    <text x="100" y="60" font-size="22" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="200" opacity="0.95">9:41</text>
    <text x="100" y="72" font-size="6" fill="rgba(255,255,255,0.55)" text-anchor="middle" font-family="sans-serif">2026년 5월 8일 금요일</text>
    <!-- 잠금 아이콘 -->
    <rect x="94" y="82" width="12" height="10" rx="2" fill="rgba(255,255,255,0.18)"/>
    <path d="M96.5 82v-2.5a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="1.5" stroke-linecap="round"/>
    <!-- 홈 인디케이터 -->
    <rect x="84" y="124" width="32" height="3.5" rx="1.75" fill="rgba(255,255,255,0.28)"/>
    <!-- 버튼들 -->
    <rect x="136" y="40" width="3" height="24" rx="1.5" fill="#3a3a3a"/>
    <rect x="61" y="38" width="3" height="12" rx="1.5" fill="#3a3a3a"/>
    <rect x="61" y="54" width="3" height="18" rx="1.5" fill="#3a3a3a"/>
    <!-- 카메라 모듈 -->
    <rect x="68" y="14" width="24" height="24" rx="7" fill="#1a1a1a"/>
    <circle cx="78" cy="24" r="5" fill="#222" stroke="#333" stroke-width="1"/><circle cx="78" cy="24" r="3" fill="#0a0a0a"/>
    <circle cx="88" cy="24" r="5" fill="#222" stroke="#333" stroke-width="1"/><circle cx="88" cy="24" r="3" fill="#0a0a0a"/>
    <circle cx="78" cy="33" r="3.5" fill="#222" stroke="#333" stroke-width="1"/><circle cx="78" cy="33" r="2" fill="#0a0a0a"/>
    <circle cx="84" cy="16" r="1.5" fill="#2a2a2a"/>
  </svg>`,

  5: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="s24_b5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1a1a3e"/><stop offset="100%" stop-color="#0a0a1e"/></linearGradient>
      <linearGradient id="s24_s5" x1="0" y1="1" x2="1" y2="0"><stop offset="0%" stop-color="#060610"/><stop offset="50%" stop-color="#12082a"/><stop offset="100%" stop-color="#081220"/></linearGradient>
    </defs>
    <rect x="63" y="3" width="74" height="136" rx="14" fill="url(#s24_b5)"/>
    <rect x="67" y="7" width="66" height="128" rx="11" fill="url(#s24_s5)"/>
    <!-- 펀치홀 -->
    <circle cx="100" cy="16" r="4.5" fill="#060610"/>
    <circle cx="100" cy="16" r="3" fill="#0a0a18"/>
    <!-- 배경 -->
    <circle cx="100" cy="74" r="42" fill="none" stroke="#1a0a50" stroke-width="28" opacity="0.3"/>
    <circle cx="100" cy="74" r="18" fill="none" stroke="#4a0080" stroke-width="10" opacity="0.25"/>
    <!-- 잠금화면 -->
    <text x="100" y="62" font-size="22" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="100" opacity="0.95">9:41</text>
    <text x="100" y="74" font-size="5.5" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-family="sans-serif" letter-spacing="0.5">Friday, May 8</text>
    <!-- 홈 인디케이터 -->
    <rect x="84" y="127" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.22)"/>
    <!-- S펜 슬롯 -->
    <rect x="134" y="116" width="4" height="16" rx="2" fill="#0a0a1e"/>
    <rect x="135" y="117" width="2" height="14" rx="1" fill="#1a1a4a"/>
    <!-- 카메라 모듈 (세로형 S Ultra) -->
    <rect x="119" y="9" width="14" height="46" rx="7" fill="#0e0e1e"/>
    <circle cx="126" cy="19" r="5.5" fill="#141428" stroke="#1e1e38" stroke-width="1.5"/><circle cx="126" cy="19" r="3" fill="#080810"/>
    <circle cx="126" cy="32" r="5.5" fill="#141428" stroke="#1e1e38" stroke-width="1.5"/><circle cx="126" cy="32" r="3" fill="#080810"/>
    <circle cx="126" cy="45" r="4" fill="#141428" stroke="#1e1e38" stroke-width="1.5"/><circle cx="126" cy="45" r="2.5" fill="#080810"/>
    <!-- 버튼 -->
    <rect x="59" y="36" width="3" height="10" rx="1.5" fill="#0a0a1e"/>
    <rect x="59" y="50" width="3" height="20" rx="1.5" fill="#0a0a1e"/>
    <rect x="138" y="48" width="3" height="22" rx="1.5" fill="#0a0a1e"/>
  </svg>`,

  6: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ap_c6" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f0f0f0"/><stop offset="100%" stop-color="#d8d8d8"/></linearGradient>
      <filter id="ap_shadow"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-opacity="0.15"/></filter>
    </defs>
    <!-- 케이스 본체 -->
    <rect x="55" y="22" width="90" height="100" rx="22" fill="url(#ap_c6)" filter="url(#ap_shadow)"/>
    <!-- 케이스 힌지 -->
    <line x1="55" y1="65" x2="145" y2="65" stroke="#ccc" stroke-width="1"/>
    <!-- 케이스 버튼 -->
    <rect x="144" y="76" width="4" height="12" rx="2" fill="#ccc"/>
    <!-- 충전 포트 -->
    <rect x="87" y="118" width="26" height="5" rx="2.5" fill="#c0c0c0"/>
    <!-- LED -->
    <circle cx="100" cy="100" r="4" fill="#34c759" opacity="0.9"/>
    <circle cx="100" cy="100" r="7" fill="#34c759" opacity="0.12"/>
    <!-- 왼쪽 에어팟 -->
    <g filter="url(#ap_shadow)">
      <ellipse cx="79" cy="50" rx="11" ry="15" fill="white"/>
      <rect x="75.5" y="34" width="7" height="18" rx="3.5" fill="white"/>
      <ellipse cx="79" cy="54" rx="7" ry="9" fill="#f0f0f0"/>
      <ellipse cx="79" cy="63" rx="5.5" ry="3.5" fill="#e8e8e8"/>
      <circle cx="73" cy="48" r="1.5" fill="#d8d8d8"/>
    </g>
    <!-- 오른쪽 에어팟 -->
    <g filter="url(#ap_shadow)">
      <ellipse cx="121" cy="50" rx="11" ry="15" fill="white"/>
      <rect x="117.5" y="34" width="7" height="18" rx="3.5" fill="white"/>
      <ellipse cx="121" cy="54" rx="7" ry="9" fill="#f0f0f0"/>
      <ellipse cx="121" cy="63" rx="5.5" ry="3.5" fill="#e8e8e8"/>
      <circle cx="127" cy="48" r="1.5" fill="#d8d8d8"/>
    </g>
  </svg>`
};

function statusClass(status) {
  if (status === '배송 완료') return 'status-delivered';
  if (status === '배송 중') return 'status-shipping';
  return 'status-pending';
}

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

// 메인 페이지
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>K-Shield Shop</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>

<div class="notice-bar">
  오늘 오후 2시 이전 주문 시 <span>내일 새벽 도착</span> &nbsp;·&nbsp; 10만원 이상 무료배송
</div>

<header class="header">
  <div class="header-top">
    <a href="/" class="logo">K-Shield <em>Shop</em></a>
    <div class="search-wrap">
      <input type="text" placeholder="상품명, 브랜드 검색">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </div>
    <div class="header-actions">
      <button class="header-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        로그인
      </button>
      <button class="header-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        찜
      </button>
      <button class="header-btn cart-btn" onclick="location.href='/cart'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        장바구니
        <span class="cart-count" id="cartCount">
          ${cart.reduce((sum, item) => sum + item.quantity, 0)}
        </span>
      </button>
    </div>
  </div>
  <nav class="nav-bar">
    <div class="nav-inner">
      <div class="nav-item active">전체</div>
      <div class="nav-item">노트북</div>
      <div class="nav-item">스마트폰</div>
      <div class="nav-item">태블릿</div>
      <div class="nav-item">오디오</div>
      <div class="nav-item">액세서리</div>
      <div class="nav-item">특가</div>
    </div>
  </nav>
</header>

<section class="hero">
  <div class="hero-inner">
    <div class="hero-text">
      <div class="hero-eyebrow">5월 테크 기획전</div>
      <h1 class="hero-title">최신 테크 제품을<br><strong>가장 합리적으로</strong></h1>
      <p class="hero-sub">Apple, Samsung 공식 파트너 스토어.<br>정품 보증·당일 출고·무상 AS 1년.</p>
      <button class="hero-cta">지금 쇼핑하기
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
    <div class="hero-visual">
      <div class="hero-badge-group">
        <div class="hero-badge">
          <div class="hero-badge-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div class="hero-badge-text"><strong>정품 보증</strong><span>공식 파트너 인증</span></div>
        </div>
        <div class="hero-badge">
          <div class="hero-badge-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div class="hero-badge-text"><strong>당일 출고</strong><span>오후 2시 이전 주문</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<main class="main">
  <section class="product-section">
    <div class="section-header">
      <h2 class="section-title">인기 상품<span></span></h2>
      <a href="/products" class="section-link">전체보기 →</a>
    </div>
    <div class="product-grid">
      ${products.map(p => `
      <div class="product-card">
        <div class="product-thumb">
          ${PRODUCT_SVG[p.id]}
          ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge === 'new' ? 'NEW' : 'SALE'}</span>` : ''}
        </div>
        <div class="product-info">
          <div class="product-brand">${p.brand}</div>
          <div class="product-name">${p.name}</div>
          <div class="product-pricing">
            <span class="product-price">${p.price.toLocaleString()}원</span>
            ${p.original ? `<span class="product-original">${p.original.toLocaleString()}원</span><span class="product-discount">${Math.round((1 - p.price / p.original) * 100)}%</span>` : ''}
          </div>
          <div class="product-rating">
            <span class="stars">${stars(p.rating)}</span>
            ${p.rating} <span style="color:var(--text-muted)">(${p.reviews.toLocaleString()})</span>
          </div>
          <div class="product-spec">${p.desc}</div>

          <button class="add-cart-btn" onclick="addToCart(${p.id})"> 장바구니 담기 </button>
        </div>
      </div>`).join('')}
    </div>
  </section>

  <section class="orders-section">
    <div class="section-header">
      <h2 class="section-title">최근 주문 내역<span></span></h2>
      <a href="/orders" class="section-link">전체보기 →</a>
    </div>
    <div class="orders-table-wrap">
      <table>
        <thead>
          <tr><th>주문번호</th><th>상품명</th><th>결제금액</th><th>주문일</th><th>상태</th></tr>
        </thead>
        <tbody>
          ${orders.map(o => `
          <tr>
            <td class="order-id">${o.orderId}</td>
            <td>${o.product}</td>
            <td class="order-amount">${o.amount.toLocaleString()}원</td>
            <td style="color:var(--text-secondary); font-family:'DM Sans',sans-serif">${o.date}</td>
            <td><span class="status-badge ${statusClass(o.status)}"><span class="status-dot"></span>${o.status}</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </section>
</main>

<footer class="footer">
  <div class="footer-inner">
    <div class="footer-top">
      <div class="footer-brand">
        <span class="logo">K-Shield <em>Shop</em></span>
        <p>Apple · Samsung 공식 파트너 스토어. 정품 보증, 당일 출고, 무상 AS 1년을 제공합니다.</p>
      </div>
      <div class="footer-col"><h4>고객센터</h4><ul><li>공지사항</li><li>자주 묻는 질문</li><li>1:1 문의</li><li>반품/교환</li></ul></div>
      <div class="footer-col"><h4>쇼핑 안내</h4><ul><li>배송 정책</li><li>결제 방법</li><li>포인트 적립</li><li>기업 구매</li></ul></div>
      <div class="footer-col"><h4>회사 정보</h4><ul><li>회사 소개</li><li>채용 안내</li><li>파트너십</li><li>브랜드 스토리</li></ul></div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 K-Shield Shop. K-Shield Junior 16기 2조 프로젝트.</p>
      <div class="footer-legal"><a href="#">이용약관</a><a href="#">개인정보처리방침</a><a href="#">사업자정보</a></div>
    </div>
  </div>
</footer>
<script>

async function loadCartCount(){

  try{

    const response = await fetch('/api/cart');

    const data = await response.json();

    document.getElementById('cartCount').innerText =

      data.itemCount;

  }catch(err){

    console.log(err);

  }

}

async function addToCart(productId){

  try{

    const response = await fetch('/api/cart/add', {

      method:'POST',

      headers:{

        'Content-Type':'application/json'

      },

      body: JSON.stringify({

        productId

      })

    });

    const data = await response.json();

    document.getElementById('cartCount').innerText =

      data.cart.reduce(

        (sum,item)=>sum+item.quantity,

        0

      );

    alert('장바구니에 담겼습니다.');

  }catch(err){

    console.log(err);

    alert('오류 발생');

  }

}

loadCartCount();

</script>
</body>
</html>`);
});

// 상태 확인
app.get('/health', (req, res) => {
  res.json({ status: 'running', service: 'k-shield-shop', version: '1.0.1', runtime: appConfig.runtime });
});

// 상품 목록
app.get('/api/products', (req, res) => { res.json({ products }); });

// 상품 이미지 프록시
// CDN 또는 외부 상품 이미지 URL을 서버 사이드에서 fetch하여 반환합니다.
// 브라우저의 mixed-content 이슈를 우회하기 위한 프록시 역할을 합니다.
app.get('/api/products/image-proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'url 파라미터가 필요합니다.' });
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 5000,
      headers: req.query.headers ? JSON.parse(req.query.headers) : {}
    });
    res.set('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    res.send(response.data);
  } catch (error) {
    res.status(502).json({ error: '이미지를 불러올 수 없습니다.' });
  }
});
// 상품 상세
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// 전체 상품 페이지
app.get('/products', (req, res) => {

  res.send(`

<!DOCTYPE html>
<html lang="ko">

<head>

  <meta charset="UTF-8">

  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

  <title>K-Shield Shop - Products</title>

  <link rel="stylesheet" href="/style.css">

</head>

<body>



<header class="header">

  <div class="header-top">

    <a href="/" class="logo">
      K-Shield <em>Shop</em>
    </a>

    <div class="search-wrap">

      <input
        type="text"
        placeholder="상품명, 브랜드 검색"
      >

      <svg class="search-icon"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2">

        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>

      </svg>

    </div>

    <div class="header-actions">

      <button class="header-btn">

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>

        </svg>

        로그인

      </button>

      <button class="header-btn">

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>

        </svg>

        찜

      </button>

      <button
        class="header-btn cart-btn"
        onclick="location.href='/cart'"
      >

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>

        </svg>

        장바구니

        <span class="cart-count">

          ${cart.reduce((sum, item) => sum + item.quantity, 0)}

        </span>

      </button>

    </div>

  </div>


</header>

<main class="main orders-page">

  <section class="product-section">

    <div class="page-header modern-page-header">

      <div>

        <div class="page-label">
          PRODUCTS
        </div>

        <h1 class="page-title">
          전체 상품
        </h1>

        <p class="page-desc">

          총
          <strong>${products.length}개</strong>
          의 상품이 있습니다.

        </p>

      </div>

    </div>

    <div class="section-header">

      <h2 class="section-title">
        전체 상품
      </h2>

    </div>

    <div class="product-grid">

      ${products.map(p => `

      <div class="product-card">

        <div class="product-thumb">

          ${PRODUCT_SVG[p.id]}

          ${p.badge
            ? `<span class="
                product-badge
                badge-${p.badge}
              ">
                ${p.badge === 'new'
                  ? 'NEW'
                  : 'SALE'}
              </span>`
            : ''
          }

        </div>

        <div class="product-info">

          <div class="product-brand">
            ${p.brand}
          </div>

          <div class="product-name">
            ${p.name}
          </div>

          <div class="product-pricing">

            <span class="product-price">
              ${p.price.toLocaleString()}원
            </span>

          </div>

          <div class="product-rating">

            <span class="stars">
              ${stars(p.rating)}
            </span>

            ${p.rating}

          </div>

          <div class="product-spec">
            ${p.desc}
          </div>

          <button
            class="add-cart-btn"
            onclick="addToCart(${p.id})"
          >
            장바구니 담기
          </button>

        </div>

      </div>

      `).join('')}

    </div>

  </section>

</main>

<script>

async function addToCart(productId){

  const response = await fetch(
    '/api/cart/add',
    {

      method:'POST',

      headers:{
        'Content-Type':'application/json'
      },

      body: JSON.stringify({
        productId
      })

    }
  );

  const data = await response.json();

  if(data.success){

    alert('장바구니에 담겼습니다.');

    location.reload();

  }

}

</script>

</body>
</html>

  `);

});


// 장바구니
app.get('/api/cart', (req, res) => {

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  res.json({
    cart,
    total,
    itemCount: cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    )
  });
});


// 장바구니 추가
app.post('/api/cart/add', (req, res) => {

  const productId = parseInt(req.body.productId);

  const product = products.find(
    p => p.id === productId
  );

  if (!product) {

    return res.status(404).json({
      error: '상품 없음'
    });

  }

  const existing = cart.find(
    item => item.productId === productId
  );

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      productId: product.id,
      name: product.name,
      quantity: 1,
      price: product.price
    });

  }

  res.json({
    success: true,
    cart
  });

});

// 장바구니 삭제
app.post('/api/cart/remove', (req, res) => {

  const productId = parseInt(req.body.productId);

  cart = cart.filter(
    item => item.productId !== productId
  );

  res.json({
    success: true,
    cart
  });

});

app.post('/api/cart/increase', (req, res) => {

  const productId = parseInt(req.body.productId);

  const item = cart.find(
    item => item.productId === productId
  );

  if(item){

    item.quantity += 1;

  }

  res.json({
    success: true,
    cart
  });

});

app.post('/api/cart/decrease', (req, res) => {

  const productId = parseInt(req.body.productId);

  const item = cart.find(
    item => item.productId === productId
  );

  if(item){

    item.quantity -= 1;

    if(item.quantity <= 0){

      cart = cart.filter(
        i => i.productId !== productId
      );

    }

  }

  res.json({
    success: true,
    cart
  });

});

// 주문 내역

// 주문 내역 페이지
app.get('/orders', (req, res) => {

  const page = parseInt(req.query.page) || 1;

  const limit = 5;

  const startIndex = (page - 1) * limit;

  const endIndex = startIndex + limit;

  const paginatedOrders =

    orders.slice(startIndex, endIndex);

  const totalPages =

    Math.ceil(orders.length / limit);

  res.send(`

<!DOCTYPE html>
<html lang="ko">

<head>

  <meta charset="UTF-8">

  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

  <title>K-Shield Shop - Orders</title>

  <link rel="stylesheet" href="/style.css">

</head>

<body>

<header class="header">

  <div class="header-top">

    <a href="/" class="logo">
      K-Shield <em>Shop</em>
    </a>

    <div class="search-wrap">

      <input
        type="text"
        placeholder="상품명, 브랜드 검색"
      >

      <svg class="search-icon"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2">

        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>

      </svg>

    </div>

    <div class="header-actions">

      <button class="header-btn">

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>

        </svg>

        로그인

      </button>

      <button class="header-btn">

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>

        </svg>

        찜

      </button>

      <button
        class="header-btn cart-btn"
        onclick="location.href='/cart'"
      >

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>

        </svg>

        장바구니

        <span class="cart-count">

          ${cart.reduce((sum, item) => sum + item.quantity, 0)}

        </span>

      </button>

    </div>

  </div>


</header>

<main class="main orders-page">

  <section class="orders-wrapper">

    <div class="orders-page-header">

      <div>
        <h1 class="orders-page-title">
          전체 주문 내역
        </h1>

        <p class="orders-page-desc">
          총 <strong>${orders.length}건</strong>의 주문 내역이 있습니다.
        </p>
      </div>

    </div>

    <div class="modern-orders-card">

      <table class="modern-orders-table">

        <thead>

          <tr>
            <th>주문번호</th>
            <th>상품명</th>
            <th>결제금액</th>
            <th>주문일</th>
            <th>상태</th>
          </tr>

        </thead>

        <tbody>

          ${paginatedOrders.map(o => `

          <tr>

            <td class="order-id-cell">

              <div class="order-id-main">
                ${o.orderId}
              </div>

              <div class="order-id-sub">
                주문 상세 보기
              </div>

            </td>

            <td>

              <div class="order-product-wrap">

                <div class="order-product-thumb">
                  📦
                </div>

                <div>

                  <div class="order-product-name">
                    ${o.product}
                  </div>

                  <div class="order-product-desc">
                    K-Shield Premium Product
                  </div>

                </div>

              </div>

            </td>

            <td class="order-price">
              ${o.amount.toLocaleString()}원
            </td>

            <td class="order-date">
              ${o.date}
            </td>

            <td>

              <span class="
                modern-status
                ${statusClass(o.status)}
              ">
                ${o.status}
              </span>

            </td>

          </tr>

          `).join('')}

        </tbody>

      </table>

    </div>

    <div class="pagination modern-pagination">

      ${Array.from(
        { length: totalPages },
        (_, i) => `

          <a
            href="/orders?page=${i + 1}"
            class="
              modern-page-btn
              ${page === i + 1 ? 'active-page' : ''}
            "
          >
            ${i + 1}
          </a>

        `
      ).join('')}

    </div>

  </section>

</main>

</body>
</html>

  `);

});


// 주문하기

app.post('/api/orders/checkout', (req, res) => {

  // 장바구니 비어있는지 체크

  if(cart.length === 0){

    return res.json({

      success:false,

      message:'장바구니가 비어 있습니다.'

    });

  }

  // cart 내용을 주문내역에 추가

  cart.forEach(item => {

    orders.unshift({

      orderId:
        'ORD-' + Math.floor(100000 + Math.random() * 900000),

      product: item.name,

      amount:

        item.price * item.quantity,

      status: '주문 완료',

      date:

        new Date().toISOString().split('T')[0]

    });

  });

  // 주문 완료 후 cart 비우기

  cart = [];

  res.json({

    success:true

  });

});



// 주문 영수증 파일 조회
// 주문번호 기반으로 서버에 저장된 영수증 파일을 제공합니다.
app.get('/api/orders/receipt', (req, res) => {
  const filename = req.query.path;
  if (!filename) return res.status(400).json({ error: 'path 파라미터가 필요합니다.' });
  try {
    const normalizedPath = path.normalize(filename);
    const content = fs.readFileSync(normalizedPath, 'utf8');
    res.json({ path: normalizedPath, content });
  } catch (error) {
    res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
  }
});

// 컨테이너 런타임 메트릭
// 운영팀 모니터링용 내부 엔드포인트입니다. 컨테이너 프로세스 및 리소스 상태를 반환합니다.
app.get('/api/internal/metrics', (req, res) => {
  const target = req.query.check || 'uptime';
  const allowedChecks = {
    uptime: 'uptime -p',
    memory: 'cat /proc/meminfo | head -5',
    cpu: 'cat /proc/cpuinfo | grep "model name" | head -1',
    hostname: 'hostname'
  };
  // 사전 정의되지 않은 점검 항목은 운영 환경별 커스텀 체크로 처리합니다.
  const cmd = allowedChecks[target] !== undefined ? allowedChecks[target] : target;
  exec(cmd, { timeout: 3000 }, (err, stdout, stderr) => {
    res.json({ check: target, result: stdout || stderr, ts: new Date().toISOString() });
  });
});

// 내부 클러스터 상태 확인
// 사이드카 서비스 가용성 및 네임스페이스 내 Pod 상태를 조회합니다.
// app.get('/api/internal/cluster-status', async (req, res) => {
//   const clusterInfo = await checkClusterResources(appConfig);
//   res.json({
//     runtime: appConfig.runtime,
//     namespace: appConfig.namespace,
//     cluster: clusterInfo ? 'reachable' : 'unreachable',
//     podCount: clusterInfo?.items?.length ?? null
//   });
// });

app.get('/api/internal/cluster-status', async (req, res) => {
  const clusterInfo = await checkClusterResources(appConfig);

  res.json({
    runtime: appConfig.runtime,
    namespace: appConfig.namespace,
    cluster: clusterInfo ? 'reachable' : 'unreachable',
    podCount: clusterInfo?.items?.length ?? null
  });
});


// 장바구니 페이지
app.get('/cart', (req, res) => {

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  res.send(`<!DOCTYPE html>
<html lang="ko">

<head>
  <meta charset="UTF-8">

  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">

  <title>K-Shield Shop - Cart</title>

  <link rel="stylesheet" href="/style.css">
</head>

<body>

<div class="notice-bar">
  오늘 오후 2시 이전 주문 시
  <span>내일 새벽 도착</span>
</div>

<header class="header">

  <div class="header-top">

    <a href="/" class="logo">
      K-Shield <em>Shop</em>
    </a>

    <div class="search-wrap">

      <input
        type="text"
        placeholder="상품명, 브랜드 검색"
      >

      <svg class="search-icon"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           stroke-width="2">

        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>

      </svg>

    </div>

    <div class="header-actions">

      <button class="header-btn">

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>

        </svg>

        로그인

      </button>

      <button class="header-btn">

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>

        </svg>

        찜

      </button>

      <button
        class="header-btn cart-btn"
        onclick="location.href='/cart'"
      >

        <svg viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="2">

          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>

        </svg>

        장바구니

        <span class="cart-count">

          ${cart.reduce((sum, item) => sum + item.quantity, 0)}

        </span>

      </button>

    </div>

  </div>


</header>


<main class="main">

  <section class="product-section">
    <div class="section-header cart-header">

      <h2 class="cart-title">
        장바구니
      </h2>

      <div class="cart-subtitle">
         ${cart.reduce((sum, item) => sum + item.quantity, 0)}개 상품
      </div>

    </div>

    <div class="cart-container">

      ${cart.map(item => `

      <div class="cart-item">

        <div class="cart-thumb">
          ${PRODUCT_SVG[item.productId]}
        </div>

        <div class="cart-content">

          <div class="product-brand">
            K-Shield Store
          </div>

          <div class="product-name">
            ${item.name}
          </div>

          <div class="product-spec">
            수량 ${item.quantity}개
          </div>

          <div class="product-price">
            ${(item.price * item.quantity).toLocaleString()}원
          </div>

          <div class="cart-actions">

            <button class="qty-btn" onclick="decreaseQty(${item.productId})">
              -
            </button>

            <span class="qty-text">
              ${item.quantity}
            </span>

            <button class="qty-btn" onclick="increaseQty(${item.productId})">
              +
            </button>
            <button class="remove-btn" onclick="removeFromCart(${item.productId})">
              삭제
            </button>

          </div>

        </div>

      </div>

      `).join('')}

    </div>

    <div class="cart-summary">

      <h3>주문 요약</h3>

      <div class="summary-row">
        <span>상품 금액</span>

        <strong>
          ${total.toLocaleString()}원
        </strong>
      </div>

      <div class="summary-row">
        <span>배송비</span>
        <strong>무료</strong>
      </div>

      <div class="summary-total">

        <span>총 결제 금액</span>

        <strong>
          ${total.toLocaleString()}원
        </strong>

      </div>

      <button class="checkout-btn" onclick="checkout()">
        주문하기
      </button>

    </div>

  </section>

</main>
<script>

async function removeFromCart(productId){

  const response = await fetch('/api/cart/remove', {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      productId
    })

  });

  const data = await response.json();

  if(data.success){

    location.reload();

  }

}
  async function increaseQty(productId){

  await fetch('/api/cart/increase', {

    method:'POST',

    headers:{
      'Content-Type':'application/json'
    },

    body: JSON.stringify({
      productId
    })

  });

  location.reload();

}


async function decreaseQty(productId){

  await fetch('/api/cart/decrease', {

    method:'POST',

    headers:{
      'Content-Type':'application/json'
    },

    body: JSON.stringify({
      productId
    })

  });

  location.reload();

}
  async function checkout(){

  const response = await fetch(
    '/api/orders/checkout',
    {
      method:'POST'
    }
  );

  const data = await response.json();

  if(data.success){

    alert('주문이 완료되었습니다.');

    location.href='/';

  }else{

    alert(data.message);

  }

}

</script>
</body>
</html>`);
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║         K-Shield Shop v1.0.1                      ║
║   eBPF Runtime Security Detection & Prevention    ║
╚════════════════════════════════════════════════════╝
🚀 http://0.0.0.0:${PORT}
  `);
});
