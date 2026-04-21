// JDC 메인 — UI 인터랙션 진입점 (퍼블리싱 범위)
// 데이터/콘텐츠는 모두 HTML에 하드코딩. 여기선 상태 토글만 담당한다.
// 기능:
//   1) 헤더 스크롤 상태 토글
//   2) 메가메뉴 열기/닫기 (hover/focus, Esc)
//   3) 히어로 배경 슬라이드 순환 (6s)
//   4) 프로젝트 캐러셀 (scrollBy + 방향키)
//   5) 공지 탭 전환 (패널 hidden 토글)
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
  // 패널이 각 gnb__item 안에 중첩 배치됨 — DOM 탭 순서: 1뎁스 → 2뎁스 → 다음 1뎁스
  const gnbEl = document.getElementById('gnb')
  const backdrop = document.getElementById('mega-backdrop')
  const gnbItems = gnbEl ? gnbEl.querySelectorAll('.gnb__item') : []
  let megaTimer = null

  function openMega (idx) {
    if (!header) return
    clearTimeout(megaTimer)
    gnbItems.forEach((item) => {
      const isActive = Number(item.dataset.menu) === idx
      item.classList.toggle('gnb__item--active', isActive)
      const link = item.querySelector('.gnb__link')
      if (link) link.setAttribute('aria-expanded', isActive ? 'true' : 'false')
    })
    header.classList.add('site-header--mega-open')
  }

  function closeMega () {
    if (!header) return
    megaTimer = setTimeout(() => {
      header.classList.remove('site-header--mega-open')
      gnbItems.forEach((item) => {
        item.classList.remove('gnb__item--active')
        const link = item.querySelector('.gnb__link')
        if (link) link.setAttribute('aria-expanded', 'false')
      })
    }, 120)
  }

  if (gnbEl) {
    gnbItems.forEach((item) => {
      item.addEventListener('mouseenter', () => openMega(Number(item.dataset.menu)))
      item.addEventListener('focusin', () => openMega(Number(item.dataset.menu)))
    })
    gnbEl.addEventListener('mouseleave', closeMega)
    gnbEl.addEventListener('mouseenter', () => clearTimeout(megaTimer))
    gnbEl.addEventListener('focusout', (e) => {
      if (!gnbEl.contains(e.relatedTarget)) closeMega()
    })
    if (backdrop) backdrop.addEventListener('mouseenter', closeMega)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMega()
    })
  }

  // ─── 3) 히어로 배경 슬라이드 순환 ─────────────────────────
  const heroSlides = document.querySelectorAll('.hero__bg-img')
  const slideCur = document.getElementById('slide-cur')
  const slideDots = document.querySelectorAll('.slide-dots__dot')
  let heroIdx = 0

  if (heroSlides.length > 1) {
    setInterval(() => {
      heroIdx = (heroIdx + 1) % heroSlides.length
      heroSlides.forEach((img, i) => {
        img.classList.toggle('hero__bg-img--active', i === heroIdx)
      })
      slideDots.forEach((d, i) => {
        d.classList.toggle('slide-dots__dot--active', i === heroIdx)
      })
      if (slideCur) slideCur.textContent = String(heroIdx + 1).padStart(2, '0')
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

  // ─── 5) 공지 탭 전환 ─────────────────────────────────────
  const noticeTabs = document.querySelectorAll('.notice-board__tab')
  const noticePanelEls = document.querySelectorAll('.notice-board__list, .notice-board__more')

  if (noticeTabs.length && noticePanelEls.length) {
    noticeTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const key = tab.dataset.tab
        noticeTabs.forEach((t) => t.classList.toggle('notice-board__tab--active', t === tab))
        noticePanelEls.forEach((el) => {
          el.hidden = el.dataset.panel !== key
        })
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
