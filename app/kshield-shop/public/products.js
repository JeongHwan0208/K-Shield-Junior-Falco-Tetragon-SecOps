// 상품별 SVG 일러스트 (인라인)
window.PRODUCT_SVGS = {

  // MacBook Pro
  1: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="mb_body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d4d4d4"/>
        <stop offset="100%" stop-color="#a8a8a8"/>
      </linearGradient>
      <linearGradient id="mb_screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1a1a2e"/>
        <stop offset="100%" stop-color="#16213e"/>
      </linearGradient>
    </defs>
    <!-- 하판 -->
    <rect x="20" y="105" width="160" height="10" rx="2" fill="url(#mb_body)"/>
    <rect x="16" y="112" width="168" height="4" rx="2" fill="#888"/>
    <!-- 상판(화면) -->
    <rect x="30" y="25" width="140" height="82" rx="4" fill="url(#mb_body)"/>
    <rect x="34" y="29" width="132" height="72" rx="2" fill="url(#mb_screen)"/>
    <!-- 화면 내용 -->
    <rect x="40" y="35" width="120" height="8" rx="1" fill="#2d2d4a" opacity="0.8"/>
    <rect x="40" y="47" width="80" height="4" rx="1" fill="#3a3a5a" opacity="0.6"/>
    <rect x="40" y="55" width="100" height="4" rx="1" fill="#3a3a5a" opacity="0.4"/>
    <rect x="40" y="63" width="60" height="4" rx="1" fill="#3a3a5a" opacity="0.4"/>
    <rect x="40" y="75" width="120" height="18" rx="2" fill="#e63946" opacity="0.15"/>
    <rect x="44" y="79" width="60" height="6" rx="1" fill="#e63946" opacity="0.5"/>
    <!-- 애플 로고 -->
    <circle cx="100" cy="18" r="4" fill="#b0b0b0"/>
    <!-- 노치 -->
    <rect x="92" y="107" width="16" height="3" rx="1.5" fill="#999"/>
  </svg>`,

  // Galaxy Book
  2: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gb_body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a237e"/>
        <stop offset="100%" stop-color="#283593"/>
      </linearGradient>
      <linearGradient id="gb_screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0d0d1a"/>
        <stop offset="100%" stop-color="#1a1a2e"/>
      </linearGradient>
    </defs>
    <rect x="20" y="105" width="160" height="9" rx="2" fill="url(#gb_body)"/>
    <rect x="14" y="111" width="172" height="4" rx="2" fill="#0d47a1"/>
    <rect x="28" y="22" width="144" height="85" rx="3" fill="url(#gb_body)"/>
    <rect x="32" y="26" width="136" height="75" rx="2" fill="url(#gb_screen)"/>
    <!-- 윈도우 UI -->
    <rect x="32" y="26" width="136" height="10" rx="0" fill="#1565c0" opacity="0.6"/>
    <circle cx="40" cy="31" r="2.5" fill="#ef5350" opacity="0.8"/>
    <circle cx="48" cy="31" r="2.5" fill="#ffa726" opacity="0.8"/>
    <circle cx="56" cy="31" r="2.5" fill="#66bb6a" opacity="0.8"/>
    <rect x="38" y="42" width="40" height="28" rx="2" fill="#1a237e" opacity="0.5"/>
    <rect x="84" y="42" width="76" height="12" rx="1" fill="#283593" opacity="0.4"/>
    <rect x="84" y="58" width="50" height="8" rx="1" fill="#283593" opacity="0.3"/>
    <rect x="38" y="76" width="122" height="18" rx="2" fill="#1565c0" opacity="0.2"/>
    <!-- 삼성 로고 -->
    <text x="100" y="19" font-size="7" fill="#90caf9" text-anchor="middle" font-family="sans-serif" font-weight="600">SAMSUNG</text>
    <rect x="90" y="107" width="20" height="3" rx="1.5" fill="#1a237e"/>
  </svg>`,

  // iPad Pro
  3: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ipad_body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#e0e0e0"/>
        <stop offset="100%" stop-color="#bdbdbd"/>
      </linearGradient>
      <linearGradient id="ipad_screen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1a2e"/>
        <stop offset="100%" stop-color="#0f3460"/>
      </linearGradient>
    </defs>
    <!-- 본체 -->
    <rect x="45" y="10" width="110" height="122" rx="10" fill="url(#ipad_body)"/>
    <!-- 화면 -->
    <rect x="52" y="17" width="96" height="108" rx="4" fill="url(#ipad_screen)"/>
    <!-- 앱 아이콘 그리드 -->
    <rect x="58" y="24" width="18" height="18" rx="4" fill="#e63946" opacity="0.8"/>
    <rect x="80" y="24" width="18" height="18" rx="4" fill="#2196f3" opacity="0.8"/>
    <rect x="102" y="24" width="18" height="18" rx="4" fill="#4caf50" opacity="0.8"/>
    <rect x="124" y="24" width="18" height="18" rx="4" fill="#ff9800" opacity="0.8"/>
    <rect x="58" y="46" width="18" height="18" rx="4" fill="#9c27b0" opacity="0.8"/>
    <rect x="80" y="46" width="18" height="18" rx="4" fill="#00bcd4" opacity="0.8"/>
    <rect x="102" y="46" width="18" height="18" rx="4" fill="#ff5722" opacity="0.8"/>
    <rect x="124" y="46" width="18" height="18" rx="4" fill="#607d8b" opacity="0.8"/>
    <!-- 독 -->
    <rect x="60" y="108" width="80" height="12" rx="6" fill="rgba(255,255,255,0.08)"/>
    <rect x="67" y="111" width="14" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
    <rect x="85" y="111" width="14" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
    <rect x="103" y="111" width="14" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
    <!-- 홈버튼 없음 + 카메라 -->
    <circle cx="100" cy="14" r="2" fill="#aaa"/>
    <!-- 사이드 버튼 -->
    <rect x="153" y="35" width="3" height="18" rx="1.5" fill="#b0b0b0"/>
  </svg>`,

  // iPhone 15 Pro
  4: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="iphone_body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#4a4a4a"/>
        <stop offset="100%" stop-color="#2a2a2a"/>
      </linearGradient>
      <linearGradient id="iphone_screen" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0a0a1a"/>
        <stop offset="100%" stop-color="#1a0a2e"/>
      </linearGradient>
    </defs>
    <!-- 본체 -->
    <rect x="62" y="6" width="76" height="130" rx="16" fill="url(#iphone_body)"/>
    <!-- 화면 -->
    <rect x="66" y="12" width="68" height="118" rx="12" fill="url(#iphone_screen)"/>
    <!-- 다이나믹 아일랜드 -->
    <rect x="86" y="16" width="28" height="10" rx="5" fill="#111"/>
    <circle cx="108" cy="21" r="3" fill="#1a1a1a"/>
    <!-- 배경화면 그라데이션 효과 -->
    <circle cx="100" cy="70" r="35" fill="none" stroke="#4a0080" stroke-width="20" opacity="0.3"/>
    <circle cx="100" cy="70" r="20" fill="none" stroke="#e63946" stroke-width="10" opacity="0.2"/>
    <!-- 잠금화면 시간 -->
    <text x="100" y="58" font-size="18" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="300" opacity="0.9">9:41</text>
    <text x="100" y="70" font-size="6" fill="rgba(255,255,255,0.6)" text-anchor="middle" font-family="sans-serif">2026년 5월 8일 금요일</text>
    <!-- 잠금 아이콘 -->
    <rect x="93" y="80" width="14" height="11" rx="2" fill="rgba(255,255,255,0.2)"/>
    <path d="M96 80v-3a4 4 0 0 1 8 0v3" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
    <!-- 홈 인디케이터 -->
    <rect x="86" y="122" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.3)"/>
    <!-- 사이드 버튼 -->
    <rect x="138" y="40" width="3" height="22" rx="1.5" fill="#3a3a3a"/>
    <!-- 볼륨 버튼 -->
    <rect x="59" y="38" width="3" height="14" rx="1.5" fill="#3a3a3a"/>
    <rect x="59" y="56" width="3" height="14" rx="1.5" fill="#3a3a3a"/>
    <!-- 카메라 모듈 -->
    <rect x="72" y="18" width="22" height="22" rx="6" fill="#1a1a1a"/>
    <circle cx="81" cy="27" r="4.5" fill="#2a2a2a" stroke="#3a3a3a" stroke-width="1"/>
    <circle cx="90" cy="27" r="4.5" fill="#2a2a2a" stroke="#3a3a3a" stroke-width="1"/>
    <circle cx="81" cy="35" r="3" fill="#2a2a2a" stroke="#3a3a3a" stroke-width="1"/>
    <circle cx="81" cy="27" r="2" fill="#111"/>
    <circle cx="90" cy="27" r="2" fill="#111"/>
  </svg>`,

  // Galaxy S24 Ultra
  5: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="s24_body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1a1a3a"/>
        <stop offset="100%" stop-color="#0d0d1f"/>
      </linearGradient>
      <linearGradient id="s24_screen" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stop-color="#0a0a1a"/>
        <stop offset="50%" stop-color="#1a0a30"/>
        <stop offset="100%" stop-color="#0a1a30"/>
      </linearGradient>
    </defs>
    <!-- 본체 (더 얇고 각진 S Ultra 특유 디자인) -->
    <rect x="63" y="4" width="74" height="134" rx="12" fill="url(#s24_body)"/>
    <!-- 화면 -->
    <rect x="66" y="8" width="68" height="126" rx="10" fill="url(#s24_screen)"/>
    <!-- 펀치홀 카메라 -->
    <circle cx="100" cy="16" r="4" fill="#0a0a1a"/>
    <circle cx="100" cy="16" r="2.5" fill="#111"/>
    <!-- 배경화면 -->
    <circle cx="100" cy="72" r="40" fill="none" stroke="#1a237e" stroke-width="25" opacity="0.25"/>
    <circle cx="100" cy="72" r="20" fill="none" stroke="#4a148c" stroke-width="12" opacity="0.2"/>
    <!-- 잠금화면 -->
    <text x="100" y="58" font-size="20" fill="white" text-anchor="middle" font-family="sans-serif" font-weight="200" opacity="0.9">9:41</text>
    <text x="100" y="70" font-size="5.5" fill="rgba(255,255,255,0.5)" text-anchor="middle" font-family="sans-serif">Friday, May 8</text>
    <!-- S펜 슬롯 표시 -->
    <rect x="133" y="118" width="4" height="14" rx="2" fill="#1a1a3a"/>
    <rect x="134" y="119" width="2" height="12" rx="1" fill="#2a2a5a"/>
    <!-- 카메라 모듈 (우측 상단, S Ultra 특유) -->
    <rect x="118" y="10" width="16" height="42" rx="6" fill="#111"/>
    <circle cx="126" cy="20" r="5" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="1"/>
    <circle cx="126" cy="20" r="3" fill="#0a0a0a"/>
    <circle cx="126" cy="32" r="5" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="1"/>
    <circle cx="126" cy="32" r="3" fill="#0a0a0a"/>
    <circle cx="126" cy="44" r="4" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="1"/>
    <circle cx="126" cy="44" r="2" fill="#0a0a0a"/>
    <!-- 홈 인디케이터 -->
    <rect x="85" y="126" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.25)"/>
    <!-- 볼륨/빅스비 버튼 -->
    <rect x="59" y="36" width="3" height="10" rx="1.5" fill="#0d0d1f"/>
    <rect x="59" y="50" width="3" height="18" rx="1.5" fill="#0d0d1f"/>
    <rect x="138" y="46" width="3" height="20" rx="1.5" fill="#0d0d1f"/>
  </svg>`,

  // AirPods Pro
  6: `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="case_body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#f5f5f5"/>
        <stop offset="100%" stop-color="#e0e0e0"/>
      </linearGradient>
      <linearGradient id="case_shadow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
        <stop offset="100%" stop-color="rgba(0,0,0,0.15)"/>
      </linearGradient>
    </defs>
    <!-- 케이스 본체 -->
    <rect x="62" y="28" width="76" height="90" rx="20" fill="url(#case_body)"/>
    <rect x="62" y="28" width="76" height="90" rx="20" fill="url(#case_shadow)"/>
    <!-- 케이스 힌지 라인 -->
    <path d="M62 68 Q62 68 62 68 L138 68" stroke="#d0d0d0" stroke-width="1"/>
    <!-- 케이스 버튼 (뒷면이지만 앞에서 살짝) -->
    <rect x="138" y="78" width="3" height="10" rx="1.5" fill="#d0d0d0"/>
    <!-- 케이스 충전 포트 -->
    <rect x="91" y="114" width="18" height="4" rx="2" fill="#c0c0c0"/>
    <!-- LED 인디케이터 -->
    <circle cx="100" cy="96" r="3" fill="#34c759" opacity="0.8"/>
    <circle cx="100" cy="96" r="5" fill="#34c759" opacity="0.1"/>
    <!-- 에어팟 왼쪽 (케이스 열린 상태) -->
    <ellipse cx="82" cy="52" rx="10" ry="14" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"/>
    <rect x="79" y="38" width="6" height="18" rx="3" fill="white"/>
    <ellipse cx="82" cy="56" rx="6" ry="8" fill="#f0f0f0"/>
    <!-- 에어팟 오른쪽 -->
    <ellipse cx="118" cy="52" rx="10" ry="14" fill="white" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"/>
    <rect x="115" y="38" width="6" height="18" rx="3" fill="white"/>
    <ellipse cx="118" cy="56" rx="6" ry="8" fill="#f0f0f0"/>
    <!-- 이어팁 -->
    <ellipse cx="82" cy="64" rx="5" ry="3" fill="#e8e8e8"/>
    <ellipse cx="118" cy="64" rx="5" ry="3" fill="#e8e8e8"/>
    <!-- 노이즈 캔슬링 마이크 홀 -->
    <circle cx="76" cy="50" r="1.5" fill="#d8d8d8"/>
    <circle cx="112" cy="50" r="1.5" fill="#d8d8d8"/>
  </svg>`
};
