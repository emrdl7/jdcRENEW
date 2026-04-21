// JDC 메인 — 인터랙션 진입점
// 기능:
//   1) 헤더 스크롤 상태 토글
//   2) 메가메뉴 (데이터 기반 렌더 + hover/focus 제어)
//   3) 히어로 이미지 로테이션 (6s)
//   4) 프로젝트 캐러셀 (스크롤 + 방향키)
//   5) 공지 탭 전환 (데이터 객체 기반)
//   6) Reveal on scroll (IntersectionObserver)

;(function () {
  'use strict'

  // ─── 1) 헤더 스크롤 ───────────────────────────────────────
  const header = document.getElementById('site-header')
  if (header) {
    const onScroll = () => {
      header.classList.toggle('site-header--scrolled', window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
  }

  // ─── 2) 메가메뉴 ──────────────────────────────────────────
  const megaData = [
    {
      title: '사업정보',
      eyebrow: 'Projects',
      desc: '제주 전역에 걸친 JDC 8대 핵심사업. 교육·산업·관광·의료의 경계를 넘는 미래 도시를 설계합니다.',
      cols: [
        { h: '완성사업', items: ['제주첨단과학기술단지', '영어교육도시', '신화역사공원', '제주항공우주박물관', '공공임대주택'] },
        { h: '진행사업', items: ['제주헬스케어타운', '제주첨단과학기술단지 2단지', '제주제2첨단과학기술단지', '미래사업'] },
        { h: '면세·유통', items: ['JDC 지정면세점', '면세상품안내', '매장안내'] },
        { h: '사업지원', items: ['투자유치', '분양·임대정보', '사업자 지원·협약'] },
        { h: '자료마당', items: ['사업수행현황', '발간자료'] },
        { h: '용어안내', items: ['국제자유도시', '고유목적사업'] }
      ]
    },
    {
      title: 'ESG경영',
      eyebrow: 'ESG Management',
      desc: '환경·사회·지배구조의 균형을 맞춘 지속가능경영으로 제주와 함께 성장합니다.',
      cols: [
        { h: 'ESG경영', items: ['ESG 추진체계', 'ESG 경영전략', '지속가능경영보고서', '친환경경영'] },
        { h: '일자리창출', items: ['일자리창출사업', '청년 취업지원', '사회적 경제 지원'] },
        { h: '인재양성', items: ['JDC 인재양성 프로그램', '장학사업', 'HRA 아카데미'] },
        { h: '지역상생', items: ['도민지원사업', '사회공헌 봉사단', '상생협력 기업', '지역인재 채용'] },
        { h: '환경보전', items: ['곶자왈 보전', '탄소중립 전략', '친환경 에너지', '자원순환'] },
        { h: '인권경영', items: ['인권경영 선언', '고충처리', '성희롱예방'] }
      ]
    },
    {
      title: '홍보센터',
      eyebrow: 'Press Center',
      desc: 'JDC의 생생한 소식과 제주의 이야기를 다양한 채널로 만나보세요.',
      cols: [
        { h: '뉴스광장', items: ['보도자료', '언론보도', 'JDC 소식'] },
        { h: '공지사항', items: ['공지사항', '채용공고', '입찰공고'] },
        { h: '분양·입찰', items: ['분양정보', '임대공고', '낙찰자 현황'] },
        { h: '소셜광장', items: ['YouTube', 'Instagram', 'Facebook', 'Blog', 'Newsletter'] },
        { h: '기업사보', items: ['『제주의 꿈』 월간', '사보 아카이브'] },
        { h: 'VR·영상', items: ['VR 가이드', '홍보영상', '드론 영상'] }
      ]
    },
    {
      title: '열린경영',
      eyebrow: 'Open Management',
      desc: '투명경영·청렴경영으로 국민과 도민의 신뢰를 쌓아갑니다.',
      cols: [
        { h: '경영공시', items: ['종합경영정보', '사전공표정보', '통합공시', '감사결과'] },
        { h: '청렴활동', items: ['청렴신고', '청렴활동 이행실적', '임직원 행동강령', '부패방지 시책'] },
        { h: '규정·제도', items: ['사내규정', '정관', '기록물 관리'] },
        { h: '안전경영', items: ['안전경영체계', '안전보건 활동', '재난대응'] },
        { h: '공익제보', items: ['공익제보 신고안내', '신고자 보호', '신고심사협의회'] },
        { h: '국민참여', items: ['제안함', '도민소통공간', '고객헌장'] }
      ]
    },
    {
      title: '정보공개',
      eyebrow: 'Information Disclosure',
      desc: 'JDC의 활동과 행정정보를 국민 누구에게나 투명하게 공개합니다.',
      cols: [
        { h: '제도안내', items: ['정보공개제도', '공공기관 정보공개 포털', '유의사항'] },
        { h: '정보목록', items: ['사전정보공표', '정보목록', '경영공시'] },
        { h: '정보공개청구', items: ['청구안내', '청구서 작성', '청구현황 조회'] },
        { h: '공공데이터', items: ['공공데이터 목록', 'API·오픈API', '이용사례'] },
        { h: '사전정보공개', items: ['사전공표정보', '비공개세부기준'] },
        { h: '상시간행물', items: ['상시간행물 목록', '발간자료비'] }
      ]
    },
    {
      title: '기관소개',
      eyebrow: 'About JDC',
      desc: '2002년 설립 이래 제주 국제자유도시를 만들어가는 공공기관, JDC를 소개합니다.',
      cols: [
        { h: '기관소개', items: ['인사말', '기관연혁', '주요기능', '미션·비전'] },
        { h: 'CEO소개', items: ['CEO 인사말', 'CEO 프로필', 'CEO 뉴스'] },
        { h: '경영비전', items: ['미션·비전', '경영전략', '핵심가치', '중장기경영목표'] },
        { h: '조직구성', items: ['조직도', '부서안내', '임직원현황', '직원검색'] },
        { h: '채용정보', items: ['채용공고', '채용제도', '인재상', 'FAQ'] },
        { h: '오시는길', items: ['본사', '서울사무소', '시설 안내'] }
      ]
    }
  ]

  const megaInner = document.getElementById('megamenu-inner')
  const megaEl = document.getElementById('megamenu')
  const gnbEl = document.getElementById('gnb')
  const backdrop = document.getElementById('mega-backdrop')
  let megaTimer = null

  function escapeHtml (s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]))
  }

  function renderMega (idx) {
    if (!megaInner) return
    const d = megaData[idx]
    if (!d) return
    const cols = d.cols
      .map(
        (c) => `
        <div class="megamenu__col">
          <div class="megamenu__col-title">${escapeHtml(c.h)}</div>
          ${c.items.map((i) => `<a class="megamenu__link" href="#">${escapeHtml(i)}</a>`).join('')}
        </div>
      `
      )
      .join('')

    megaInner.innerHTML = `
      <div class="megamenu__intro">
        <div class="megamenu__intro-eyebrow">${escapeHtml(d.eyebrow)}</div>
        <div class="megamenu__intro-title">${escapeHtml(d.title)}</div>
        <div class="megamenu__intro-desc">${escapeHtml(d.desc)}</div>
      </div>
      ${cols}
    `
  }

  function openMega (idx) {
    if (!header || !megaEl) return
    clearTimeout(megaTimer)
    renderMega(idx)
    header.classList.add('site-header--mega-open')
    megaEl.setAttribute('aria-hidden', 'false')
  }

  function closeMega () {
    if (!header || !megaEl) return
    megaTimer = setTimeout(() => {
      header.classList.remove('site-header--mega-open')
      megaEl.setAttribute('aria-hidden', 'true')
    }, 120)
  }

  if (gnbEl) {
    gnbEl.querySelectorAll('.gnb__item').forEach((item) => {
      item.addEventListener('mouseenter', () => openMega(Number(item.dataset.menu)))
      item.addEventListener('focusin', () => openMega(Number(item.dataset.menu)))
    })
    ;[gnbEl, megaEl].forEach((el) => {
      if (!el) return
      el.addEventListener('mouseleave', closeMega)
      el.addEventListener('mouseenter', () => clearTimeout(megaTimer))
    })
    if (backdrop) backdrop.addEventListener('mouseenter', closeMega)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMega()
    })
  }

  // ─── 3) 히어로 이미지 로테이션 ────────────────────────────
  const heroImages = [
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=2000&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000&q=80',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=2000&q=80',
    'https://images.unsplash.com/photo-1504567961542-e24d9439a724?w=2000&q=80'
  ]
  const heroImg = document.getElementById('hero-image')
  const slideCur = document.getElementById('slide-cur')
  const dots = document.querySelectorAll('.slide-dots__dot')
  let heroIdx = 0

  if (heroImg) {
    setInterval(() => {
      heroIdx = (heroIdx + 1) % heroImages.length
      heroImg.classList.add('is-hidden')
      setTimeout(() => {
        heroImg.src = heroImages[heroIdx]
        heroImg.classList.remove('is-hidden')
      }, 300)
      if (slideCur) slideCur.textContent = String(heroIdx + 1).padStart(2, '0')
      dots.forEach((d, i) => d.classList.toggle('slide-dots__dot--active', i === heroIdx))
    }, 6000)
  }

  // ─── 4) 프로젝트 캐러셀 ──────────────────────────────────
  ;(function () {
    const track = document.querySelector('.project-showcase__track')
    if (!track) return
    const cards = track.querySelectorAll('.project-card')
    const total = cards.length
    const curEl = document.getElementById('projectCur')
    const totEl = document.getElementById('projectTotal')
    const prevBtn = document.querySelector('[data-project-dir="prev"]')
    const nextBtn = document.querySelector('[data-project-dir="next"]')

    if (totEl) totEl.textContent = String(total).padStart(2, '0')

    const step = () => {
      if (!cards[0]) return 0
      const w = cards[0].getBoundingClientRect().width
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0
      return w + gap
    }

    const scrollByStep = (dir) => {
      track.scrollBy({ left: dir * step(), behavior: 'smooth' })
    }

    const update = () => {
      const s = step()
      const idx = s ? Math.round(track.scrollLeft / s) : 0
      if (curEl) curEl.textContent = String(Math.min(idx + 1, total)).padStart(2, '0')
      const atStart = track.scrollLeft <= 4
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4
      if (prevBtn) prevBtn.disabled = atStart
      if (nextBtn) nextBtn.disabled = atEnd
    }

    if (prevBtn) prevBtn.addEventListener('click', () => scrollByStep(-1))
    if (nextBtn) nextBtn.addEventListener('click', () => scrollByStep(1))
    track.addEventListener('scroll', update, { passive: true })
    track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        scrollByStep(-1)
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        scrollByStep(1)
      }
    })
    window.addEventListener('resize', update)
    update()
  })()

  // ─── 5) 공지 탭 ───────────────────────────────────────────
  const noticeData = {
    notice: [
      { tag: '공지', title: '개인정보 영향평가서 요약본(전자영수증 발급서비스)', date: '2026.04.10' },
      { tag: '공지', title: '불용물품(가구) 매각 공고 (최종)', date: '2026.04.01' },
      { tag: '공지', title: '2026년 제4차 JDC지정면세점 신규 입점 협력업체 제안 공모', date: '2026.03.23' },
      { tag: '공지', title: '2026년도 제주첨단과학기술단지 스마트빌딩 임대 공고', date: '2026.03.11' },
      { tag: '공지', title: '2026년 JDC 사회공헌 공모사업 참여자 모집', date: '2026.03.05' }
    ],
    parcel: [
      { tag: '분양', title: '제주헬스케어타운 의료서비스센터 2026년 상반기 임대공고', date: '2026.03.16' },
      { tag: '분양', title: 'JDC 보유 비축토지 수의계약(선착순) 공급 결과', date: '2025.08.12' },
      { tag: '분양', title: 'JDC 보유 비축토지 수의계약(선착순) 공급 공고', date: '2024.12.11' },
      { tag: '분양', title: '제주영어교육도시 도시개발사업 조성용지 수의계약 공급 결과', date: '2024.11.12' },
      { tag: '분양', title: '제주첨단과학기술단지 조성용지 공급 공고', date: '2024.10.04' }
    ],
    bid: [
      { tag: '입찰', title: 'JDC 본사 업무시스템 유지보수 용역 입찰공고', date: '2026.04.12' },
      { tag: '입찰', title: '2026년도 종합홍보 대행용역 제안서 평가', date: '2026.04.05' },
      { tag: '입찰', title: '제주첨단과학기술단지 2단지 조경공사 입찰', date: '2026.03.28' },
      { tag: '입찰', title: 'JDC 통합 정보시스템 구축사업 입찰공고', date: '2026.03.20' },
      { tag: '입찰', title: '제주혁신성장센터 루트330 전기공사 입찰', date: '2026.03.11' }
    ],
    support: [
      { tag: '지원', title: '2026년 JDC 도민지원사업 공모 안내', date: '2026.04.01' },
      { tag: '지원', title: '제주형 지역인재 육성사업 참여자 모집', date: '2026.03.25' },
      { tag: '지원', title: 'RE START 지역상생특화사업 참여기업 모집', date: '2026.03.10' },
      { tag: '지원', title: 'JDC 드림나눔 봉사단 신규 단원 모집', date: '2026.02.28' },
      { tag: '지원', title: '청년 취업역량강화 아카데미(HRA) 2기 모집', date: '2026.02.14' }
    ]
  }

  const noticeListEl = document.getElementById('notice-list')

  function renderNotice (key) {
    if (!noticeListEl) return
    const rows = noticeData[key] || []
    noticeListEl.innerHTML = rows
      .map(
        (n) => `
        <li class="notice-board__item">
          <span class="notice-board__tag">${escapeHtml(n.tag)}</span>
          <span class="notice-board__title">${escapeHtml(n.title)}</span>
          <span class="notice-board__date">${escapeHtml(n.date)}</span>
        </li>
      `
      )
      .join('')
  }

  if (noticeListEl) {
    renderNotice('notice')
    document.querySelectorAll('.notice-board__tab').forEach((t) => {
      t.addEventListener('click', () => {
        document
          .querySelectorAll('.notice-board__tab')
          .forEach((x) => x.classList.remove('notice-board__tab--active'))
        t.classList.add('notice-board__tab--active')
        renderNotice(t.dataset.tab)
      })
    })
  }

  // ─── 6) Reveal on scroll ─────────────────────────────────
  const reveals = document.querySelectorAll('[data-reveal]')
  if (reveals.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    reveals.forEach((el) => io.observe(el))
  } else {
    reveals.forEach((el) => el.classList.add('is-in'))
  }
})()
