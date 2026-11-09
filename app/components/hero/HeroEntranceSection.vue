<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ref, watch, nextTick } from 'vue'

const { locale, copy } = useSiteLocale()

const rootRef = ref<HTMLElement | null>(null)
const centerBrandRef = ref<HTMLElement | null>(null)
const hotelTitleRef = ref<HTMLElement | null>(null)
const headerLogoRef = ref<HTMLElement | null>(null)
const wineTitleRef = ref<HTMLElement | null>(null)
const videoWrapperRef = ref<HTMLElement | null>(null)
const videoElementRef = ref<HTMLVideoElement | null>(null)
const topNavRef = ref<HTMLElement | null>(null)
const bottomLeftRef = ref<HTMLElement | null>(null)

export type HeaderSection = 'hero' | 'section2_3' | 'wine' | 'shop' | 'footer'

const isAnimating = ref(false)
const hasCompletedEntrance = ref(false)
const isScrolledSection2 = ref(false)
const currentSection = ref<HeaderSection>('hero')
const currentStage = ref<'stage-1' | 'stage-2' | 'stage-3' | 'stage-4'>('stage-1')

let activeTimeline: gsap.core.Timeline | undefined
let scrollTransitionTrigger: ScrollTrigger | undefined
let wineSectionTrigger: ScrollTrigger | undefined
let shopSectionTrigger: ScrollTrigger | undefined
let footerSectionTrigger: ScrollTrigger | undefined
let animationStartTime: number | null = null

function ensureVideoPlayback() {
  const video = videoElementRef.value
  if (!video) return
  video.muted = true
  const playPromise = video.play()
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay fallback handled silently if browser policy intervenes
    })
  }
}

function syncStageFromTime(elapsedSec: number) {
  if (elapsedSec >= 3.57) {
    currentStage.value = 'stage-4'
  } else if (elapsedSec >= 1.95) {
    currentStage.value = 'stage-3'
  } else if (elapsedSec >= 0.8) {
    currentStage.value = 'stage-2'
  } else {
    currentStage.value = 'stage-1'
  }
}

// In Sections 1, 2, 3 and 6: Show secondary nav items (Quartos, Sobre Nós, Contactos)
const showSecondaryNav = computed(() => {
  if (!hasCompletedEntrance.value) return true
  return currentSection.value === 'hero' || currentSection.value === 'section2_3' || currentSection.value === 'footer'
})

// In Section 6 (Footer): Show RESERVAR as secondary button beside VINHOS
const showFooterReservar = computed(() => {
  return hasCompletedEntrance.value && currentSection.value === 'footer'
})

// Primary action button in the rightmost slot:
// In Sections 1, 2, 3: "RESERVAR" (Style 1 primary, to="#book")
// In Sections 4, 5, 6: "VINHOS" (Style 1 primary, to="#loja")
const primaryActionConfig = computed(() => {
  if (hasCompletedEntrance.value && (currentSection.value === 'wine' || currentSection.value === 'shop' || currentSection.value === 'footer')) {
    return {
      key: 'wines-action',
      label: copy.value.nav.wines,
      to: '#loja',
    }
  }
  return {
    key: 'reservar-action',
    label: copy.value.nav.book,
    to: '#book',
  }
})

function computeActiveSection(): HeaderSection {
  if (typeof document === 'undefined') return 'hero'

  const footerEl = document.getElementById('footer')
  const shopEl = document.getElementById('loja')
  const wineEl = document.getElementById('experiencias-vinicas')
  const apartmentsEl = document.getElementById('apartments')

  const threshold = 110
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800

  if (footerEl) {
    const fRect = footerEl.getBoundingClientRect()
    const scrollHeight = document.documentElement.scrollHeight
    const isAtPageBottom = typeof window !== 'undefined' && (window.innerHeight + window.scrollY >= scrollHeight - 80)
    if (fRect.top <= vh * 0.8 || isAtPageBottom) {
      return 'footer'
    }
  }

  if (shopEl) {
    const sRect = shopEl.getBoundingClientRect()
    if (sRect.top <= threshold) {
      return 'shop'
    }
  }

  if (wineEl) {
    const wRect = wineEl.getBoundingClientRect()
    if (wRect.top <= threshold) {
      return 'wine'
    }
  }

  if (apartmentsEl) {
    const aRect = apartmentsEl.getBoundingClientRect()
    if (aRect.top <= 100) {
      return 'section2_3'
    }
  }

  return 'hero'
}

function updateHeaderLeft(section: HeaderSection) {
  const hotelEl = hotelTitleRef.value
  const headerLogoEl = headerLogoRef.value

  if (section === 'hero') {
    if (hotelEl) gsap.to(hotelEl, { autoAlpha: 1, color: '#ffffff', duration: 0.3, overwrite: 'auto' })
    if (headerLogoEl) gsap.to(headerLogoEl, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' })
  } else {
    // From Section 2 all the way to footer: logo is continuously displayed on the left
    if (hotelEl) gsap.to(hotelEl, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' })
    if (headerLogoEl) gsap.to(headerLogoEl, { autoAlpha: 1, duration: 0.35, overwrite: 'auto' })
  }
}

function buildEntranceTimeline(reducedMotion: boolean) {
  const root = rootRef.value
  const centerBrand = centerBrandRef.value
  const hotelEl = hotelTitleRef.value
  const headerLogoEl = headerLogoRef.value
  const wineEl = wineTitleRef.value
  const videoWrapper = videoWrapperRef.value
  const videoEl = videoElementRef.value
  const topNav = topNavRef.value
  const bottomLeft = bottomLeftRef.value

  if (
    !root ||
    !centerBrand ||
    !hotelEl ||
    !wineEl ||
    !videoWrapper ||
    !topNav ||
    !bottomLeft
  ) {
    return
  }

  activeTimeline?.kill()

  const navButtons = topNav.querySelectorAll('[data-hero-nav-item]')
  const bottomItems = bottomLeft.querySelectorAll('[data-hero-bottom-item]')

  const now = performance.now()
  if (animationStartTime === null) {
    animationStartTime = now
  }
  const elapsedSeconds = Math.max(0, (now - animationStartTime) / 1000)
  const isAlreadyScrolled = typeof window !== 'undefined' && window.scrollY > 60

  // Reduced motion, scrolled down, or already-completed entrance: lock directly in the final revealed Hero state
  if (reducedMotion || hasCompletedEntrance.value || elapsedSeconds >= 4.55 || isAlreadyScrolled) {
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
    const initialSection = computeActiveSection()
    const isPastHero = initialSection !== 'hero'
    isScrolledSection2.value = isPastHero
    currentSection.value = initialSection

    gsap.set(centerBrand, { autoAlpha: 0 })
    gsap.set(hotelEl, {
      autoAlpha: initialSection === 'hero' ? 1 : 0,
      opacity: initialSection === 'hero' ? (isAlreadyScrolled ? 0.5 : 1) : 0,
      x: 0,
      y: 0,
      color: '#ffffff',
      clearProps: 'transform',
    })
    gsap.set(headerLogoEl, {
      autoAlpha: initialSection !== 'hero' ? 1 : 0,
    })
    gsap.set(wineEl, {
      autoAlpha: 1,
      opacity: isAlreadyScrolled ? 0.5 : 1,
      x: 0,
      y: 0,
      color: '#ffffff',
      clearProps: 'transform',
    })
    gsap.set(videoWrapper, {
      autoAlpha: 1,
      scale: 1,
      clipPath: 'inset(0% 0% round 0px)',
    })
    if (videoEl) gsap.set(videoEl, { scale: 1 })
    gsap.set(navButtons, { autoAlpha: 1 })
    gsap.set(bottomItems, { autoAlpha: 1, y: 0 })
    isAnimating.value = false
    hasCompletedEntrance.value = true
    currentStage.value = 'stage-4'
    ensureVideoPlayback()
    setupScrollTransition(reducedMotion)
    return
  }

  // Reset elements to natural final layout coordinates so we can measure exact deltas
  gsap.set([hotelEl, wineEl], { x: 0, y: 0, clearProps: 'transform' })
  gsap.set(centerBrand, { autoAlpha: 1, scale: 1, y: 0 })

  const vw = window.innerWidth
  const vh = window.innerHeight
  const isCompactMobile = vw < 768

  const centerRect = centerBrand.getBoundingClientRect()
  const hotelRect = hotelEl.getBoundingClientRect()
  const wineRect = wineEl.getBoundingClientRect()

  // Stage 1 starting coordinates:
  // "HOTEL" and "EXPERIÊNCIAS VÍNICAS" must be strictly equidistant from the center logo:
  // distance(HOTEL.right, logo.left) === distance(logo.right, WINE.left)
  // while preserving ample lateral travel room so "EXPERIÊNCIAS VÍNICAS" does not occupy >50% of the half-screen
  // and has a clear, balanced movement to reach the outer margin in Stage 2.
  const availableRightSpace = Math.max(24, wineRect.left - centerRect.right)
  const availableLeftSpace = Math.max(24, centerRect.left - hotelRect.left - hotelRect.width)
  const equidistantGap = Math.max(
    20,
    Math.min(
      availableRightSpace * 0.48,
      availableLeftSpace - 20,
    ),
  )

  const startHotelLeft = isCompactMobile
    ? vw * 0.15
    : centerRect.left - equidistantGap - hotelRect.width
  const startHotelTop = isCompactMobile
    ? vh * 0.26 - hotelRect.height * 0.5
    : vh * 0.5 - hotelRect.height * 0.5

  const startWineLeft = isCompactMobile
    ? vw * 0.85 - wineRect.width
    : centerRect.right + equidistantGap
  const startWineTop = isCompactMobile
    ? vh * 0.74 - wineRect.height * 0.5
    : vh * 0.5 - wineRect.height * 0.5

  const deltaHotelX = startHotelLeft - hotelRect.left
  const deltaHotelY = startHotelTop - hotelRect.top

  const deltaWineX = startWineLeft - wineRect.left
  const deltaWineY = startWineTop - wineRect.top

  // Stage 3a: Compact centered rounded-edge video (~28% width on desktop, 44% width on mobile)
  // so it never occupies >50% of the screen initially and has a dramatic, smooth expansion to 100%.
  // Canonical 2-value inset(V% H% round Rpx) ensures 100% token consistency across GSAP tweens.
  const minRightClearancePct = Math.ceil(((vw - wineRect.left + 20) / vw) * 1000) / 10
  const desktopSideInsetPct = Math.min(41, Math.max(36, minRightClearancePct))
  const desktopWidthPx = vw * ((100 - desktopSideInsetPct * 2) / 100)
  const targetDesktopHeightPx = Math.min(vh * 0.34, desktopWidthPx * 0.75)
  const rawVertInsetPct = Math.round(((vh - targetDesktopHeightPx) / (2 * vh)) * 1000) / 10
  const desktopVertInsetPct =
    Math.abs(rawVertInsetPct - desktopSideInsetPct) < 0.2
      ? Math.round((rawVertInsetPct - 0.5) * 10) / 10
      : rawVertInsetPct
  const initialVideoClip = isCompactMobile
    ? 'inset(39% 28% round 0px)'
    : `inset(${desktopVertInsetPct}% ${desktopSideInsetPct}% round 0px)`

  // Set Stage 1 initial state
  isAnimating.value = true
  currentStage.value = 'stage-1'

  gsap.set(centerBrand, {
    autoAlpha: 1,
    opacity: 1,
    clearProps: 'transform',
  })

  gsap.set(hotelEl, {
    autoAlpha: 1,
    opacity: 1,
    x: deltaHotelX,
    y: deltaHotelY,
    color: '#1D351B',
  })

  gsap.set(headerLogoEl, {
    autoAlpha: 0,
  })

  gsap.set(wineEl, {
    autoAlpha: 1,
    opacity: 1,
    x: deltaWineX,
    y: deltaWineY,
    color: '#1D351B',
  })

  gsap.set(videoWrapper, {
    autoAlpha: 0,
    scale: 0.9,
    clipPath: initialVideoClip,
  })

  if (videoEl) {
    gsap.set(videoEl, { scale: 1.12 })
  }

  gsap.set(navButtons, {
    autoAlpha: 0,
  })

  gsap.set(bottomItems, {
    autoAlpha: 0,
    y: 22,
  })

  ensureVideoPlayback()

  const tl = gsap.timeline({
    defaults: { ease: 'power3.inOut' },
    onComplete: () => {
      isAnimating.value = false
      hasCompletedEntrance.value = true
      currentStage.value = 'stage-4'
      gsap.set([hotelEl, wineEl], { clearProps: 'transform' })
      if (topNav) {
        const btns = topNav.querySelectorAll('[data-hero-nav-item]')
        gsap.set(btns, { clearProps: 'opacity,visibility' })
      }
      setupScrollTransition(reducedMotion)
    },
  })

  // Stage 1: Hold initial composition (white background, center logo + "Quinta Vale da Roca",
  // "HOTEL" on left and "EXPERIÊNCIAS VÍNICAS" on right strictly equidistant from logo)
  tl.addLabel('stage1Hold', 0)
  tl.to({}, { duration: 0.8 })

  // Stage 2: Logo fades out (autoAlpha: 0, scale: 0.75), "HOTEL" and "EXPERIÊNCIAS VÍNICAS" slide laterally to outer margins
  tl.addLabel('stage2Lateral', '>')
  tl.call(
    () => {
      currentStage.value = 'stage-2'
    },
    undefined,
    'stage2Lateral',
  )
  tl.to(
    hotelEl,
    {
      x: 0,
      duration: 1.15,
      ease: 'power3.inOut',
    },
    'stage2Lateral',
  )
  tl.to(
    wineEl,
    {
      x: 0,
      duration: 1.15,
      ease: 'power3.inOut',
    },
    'stage2Lateral',
  )
  tl.to(
    centerBrand,
    {
      autoAlpha: 0,
      opacity: 0,
      duration: 0.95,
      ease: 'power2.inOut',
    },
    'stage2Lateral',
  )

  // Stage 3a: Video appears smoothly centered strictly between the two words on white background without touching either word
  tl.addLabel('stage3VideoCenterAppear', '>')
  tl.call(
    () => {
      currentStage.value = 'stage-3'
    },
    undefined,
    'stage3VideoCenterAppear',
  )
  tl.to(
    videoWrapper,
    {
      autoAlpha: 1,
      scale: 1,
      duration: 0.55,
      ease: 'power2.out',
    },
    'stage3VideoCenterAppear',
  )

  // Stage 3b: Video gradually expands to fill 100% of the screen width smoothly.
  // As the expanding video boundaries overlap "HOTEL" and "EXPERIÊNCIAS VÍNICAS",
  // the words smoothly interpolate their color from #1D351B to #ffffff,
  // with "HOTEL" moving up to the top-left header position and "EXPERIÊNCIAS VÍNICAS" moving down to the bottom-right.
  // When the video reaches 100% width, both words are pure white #ffffff.
  tl.addLabel('stage3ExpandAndVertical', '>+0.12')
  tl.fromTo(
    videoWrapper,
    {
      clipPath: initialVideoClip,
    },
    {
      clipPath: 'inset(0% 0% round 0px)',
      duration: 1.4,
      ease: 'expo.inOut',
      immediateRender: false,
    },
    'stage3ExpandAndVertical',
  )
  if (videoEl) {
    tl.to(
      videoEl,
      {
        scale: 1,
        duration: 1.75,
        ease: 'power3.out',
      },
      'stage3ExpandAndVertical',
    )
  }
  tl.to(
    hotelEl,
    {
      y: 0,
      color: '#ffffff',
      duration: 1.4,
      ease: 'expo.inOut',
    },
    'stage3ExpandAndVertical',
  )
  tl.to(
    wineEl,
    {
      y: 0,
      color: '#ffffff',
      duration: 1.4,
      ease: 'expo.inOut',
    },
    'stage3ExpandAndVertical',
  )

  // Stage 4: Top-right navigation buttons and bottom-left phrase + "VINHOS" button reveal smoothly
  tl.addLabel('stage4UiReveal', 'stage3ExpandAndVertical+=0.95')
  tl.call(
    () => {
      currentStage.value = 'stage-4'
    },
    undefined,
    'stage4UiReveal',
  )
  tl.to(
    navButtons,
    {
      autoAlpha: 1,
      duration: 0.75,
      stagger: 0.08,
      ease: 'power2.out',
    },
    'stage4UiReveal',
  )
  tl.to(
    bottomItems,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.85,
      stagger: 0.1,
      ease: 'power3.out',
    },
    'stage4UiReveal+=0.05',
  )

  if (elapsedSeconds > 0.02) {
    tl.time(elapsedSeconds)
    syncStageFromTime(elapsedSeconds)
  }

  activeTimeline = tl
}

function setupScrollTransition(reducedMotion: boolean) {
  const root = rootRef.value
  const wineEl = wineTitleRef.value
  const hotelEl = hotelTitleRef.value
  const headerLogoEl = headerLogoRef.value

  if (!root || !wineEl || !hotelEl || !headerLogoEl) return

  scrollTransitionTrigger?.kill()
  wineSectionTrigger?.kill()
  shopSectionTrigger?.kill()
  footerSectionTrigger?.kill()

  const checkAndApply = () => {
    if (!hasCompletedEntrance.value) return
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
    const nextSection = computeActiveSection()
    const isPastHero = nextSection !== 'hero'

    isScrolledSection2.value = isPastHero
    currentSection.value = nextSection

    updateHeaderLeft(nextSection)
  }

  // Scrub opacity of BOTH "HOTEL" and "EXPERIÊNCIAS VÍNICAS" from 1 down to 0.5 as Section 1 scrolls up
  if (!reducedMotion) {
    gsap.fromTo(
      [hotelEl, wineEl],
      { opacity: 1 },
      {
        opacity: 0.5,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom 100px',
          scrub: true,
        },
      },
    )
  }

  // When scrolling down and entering Section 2 (when Section 2 reaches header ~100px):
  // The logo appears on the left, replacing "HOTEL"
  scrollTransitionTrigger = ScrollTrigger.create({
    trigger: '#apartments',
    start: 'top 100px',
    onEnter: () => checkAndApply(),
    onLeaveBack: () => checkAndApply(),
    onEnterBack: () => checkAndApply(),
    onRefresh: () => checkAndApply(),
  })

  // When scrolling down and entering Section 4:
  wineSectionTrigger = ScrollTrigger.create({
    trigger: '#experiencias-vinicas',
    start: 'top 110px',
    end: 'bottom 110px',
    onEnter: () => checkAndApply(),
    onLeave: () => checkAndApply(),
    onLeaveBack: () => checkAndApply(),
    onEnterBack: () => checkAndApply(),
    onRefresh: () => checkAndApply(),
  })

  // When scrolling down and entering Section 5 (Loja):
  shopSectionTrigger = ScrollTrigger.create({
    trigger: '#loja',
    start: 'top 110px',
    end: 'bottom 110px',
    onEnter: () => checkAndApply(),
    onLeave: () => checkAndApply(),
    onLeaveBack: () => checkAndApply(),
    onEnterBack: () => checkAndApply(),
    onRefresh: () => checkAndApply(),
  })

  // When scrolling down and entering Section 6 (Footer):
  // Logo on the left, all 5 buttons on the right
  footerSectionTrigger = ScrollTrigger.create({
    trigger: '#footer',
    start: 'top 80%',
    onEnter: () => checkAndApply(),
    onLeaveBack: () => checkAndApply(),
    onEnterBack: () => checkAndApply(),
    onRefresh: () => checkAndApply(),
  })

  checkAndApply()
}

useGsapContext(rootRef, (ctx, conditions) => {
  buildEntranceTimeline(conditions.reduce)

  const handleScroll = () => {
    const scrollY = window.scrollY
    if (!hasCompletedEntrance.value) {
      if (scrollY > 40 && isAnimating.value && activeTimeline) {
        activeTimeline.progress(1)
      }
      return
    }

    const nextSection = computeActiveSection()
    const isPastHero = nextSection !== 'hero'

    if (nextSection !== currentSection.value || isPastHero !== isScrolledSection2.value) {
      currentSection.value = nextSection
      isScrolledSection2.value = isPastHero
      updateHeaderLeft(nextSection)
    }

    if (
      scrollY > 40 &&
      isAnimating.value &&
      activeTimeline &&
      !hasCompletedEntrance.value
    ) {
      activeTimeline.progress(1)
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      if (isAnimating.value && !hasCompletedEntrance.value) {
        ctx.add(() => {
          buildEntranceTimeline(conditions.reduce)
        })
      }
    })
  }

  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  const handleResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      if (isAnimating.value && !hasCompletedEntrance.value) {
        ctx.add(() => {
          buildEntranceTimeline(conditions.reduce)
        })
      }
      ScrollTrigger.refresh()
    }, 100)
  }

  window.addEventListener('resize', handleResize, { passive: true })

  return () => {
    clearTimeout(resizeTimer)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll)
    activeTimeline?.kill()
    scrollTransitionTrigger?.kill()
    wineSectionTrigger?.kill()
    shopSectionTrigger?.kill()
    footerSectionTrigger?.kill()
  }
})

watch(locale, async () => {
  await nextTick()
  if (isAnimating.value && activeTimeline) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    buildEntranceTimeline(reduceMotion)
  }
})
</script>

<template>
  <section
    ref="rootRef"
    aria-label="Quinta Vale da Roca — Hotel & Experiências Vínicas"
    :data-stage="currentStage"
    :data-header-scrolled="isScrolledSection2 ? 'true' : 'false'"
    class="relative h-dvh min-h-[640px] w-full overflow-hidden bg-[#ffffff] text-[#1D351B]"
  >
    <!-- STAGE 3+: Centered Full-Width Video (100% screen width, Muted, Loop, Playsinline, Autoplay) -->
    <div
      ref="videoWrapperRef"
      data-hero-video-wrapper
      class="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden rounded-none opacity-0 will-change-[clip-path,transform,opacity]"
    >
      <video
        ref="videoElementRef"
        data-hero-video
        class="h-full w-full object-cover object-center"
        src="/videos/hero/video-Hotel_Horiz_new.mp4"
        poster="/images/hero/Vale-Da-Roca-View.jpg"
        width="1920"
        height="1080"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        aria-hidden="true"
      />
      <!-- Subtle vignette gradient to ensure WCAG AA contrast for top & bottom editorial lines -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-[#000000]/55 via-[#000000]/15 to-[#000000]/65"
        aria-hidden="true"
      />
    </div>

    <!-- STAGE 1: Center Emblem Logo + "Quinta Vale da Roca" -->
    <div
      ref="centerBrandRef"
      data-hero-center-brand
      class="pointer-events-none absolute inset-0 m-auto h-fit w-fit z-20 flex flex-col items-center text-center select-none"
    >
      <img
        src="/images/logo/logo.png"
        alt="Emblema Quinta Vale da Roca"
        width="267"
        height="271"
        fetchpriority="high"
        class="h-auto w-24 md:w-28 lg:w-32 xl:w-36 object-contain"
      />
      <p
        class="mt-3.5 font-display text-base md:text-lg lg:text-xl xl:text-2xl font-normal tracking-[0.06em] text-[#1D351B] whitespace-nowrap antialiased"
      >
        {{ copy.brandSubtitle }}
      </p>
    </div>

    <!-- FIXED / STICKY TOP HEADER: "HOTEL" on the left | Navigation Menu on the right -->
    <!-- In Hero: Logo does NOT appear. Buttons follow the Design System rules. -->
    <!-- In Section 2: Menu becomes the logo on the left and buttons maintain Design System structure. -->
    <header
      data-sticky-header
      class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-0 border-transparent outline-none ring-0 px-3 xs:px-4 sm:px-[5vw] transition-all duration-300"
      :class="isScrolledSection2 && hasCompletedEntrance ? 'bg-[#ffffff]/90 backdrop-blur-md py-2.5 xs:py-3 md:py-4' : 'bg-transparent py-3 xs:py-4 sm:py-5 md:py-7 lg:py-8'"
    >
      <div class="relative flex items-center shrink min-w-0 max-w-[34vw] xs:max-w-[40vw] sm:max-w-[48vw] md:max-w-none">
        <!-- In Hero: "HOTEL" (loses 50% opacity on scroll, hides in Section 2) -->
        <h1
          ref="hotelTitleRef"
          data-hero-title-hotel
          class="font-display text-sm xs:text-base sm:text-lg md:text-2xl lg:text-[1.75rem] xl:text-[2rem] font-normal uppercase tracking-[0.06em] leading-none text-[#1D351B] opacity-0 will-change-[transform,opacity] select-none whitespace-nowrap"
          :class="isScrolledSection2 ? 'pointer-events-none' : 'pointer-events-auto'"
        >
          {{ copy.leftTitle }}
        </h1>

        <!-- From Section 2 to Footer: Transparent PNG Logo without background where "HOTEL" was -->
        <div
          ref="headerLogoRef"
          data-header-sticky-logo
          class="absolute left-0 top-1/2 -translate-y-1/2 border-0 outline-none opacity-0 invisible will-change-[transform,opacity]"
          :class="isScrolledSection2 && hasCompletedEntrance ? 'pointer-events-auto' : 'pointer-events-none'"
        >
          <NuxtLink
            to="/"
            aria-label="Quinta Vale da Roca — Início"
            class="inline-flex items-center border-0 outline-none"
          >
            <img
              src="/images/logo/logo.png"
              alt="Quinta Vale da Roca"
              width="267"
              height="271"
              class="h-7 xs:h-8 md:h-10 lg:h-12 w-auto object-contain border-0 outline-none"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- Navigation buttons on the right: Sticky, following Design System rules (Style 1 & Style 2) -->
      <nav
        ref="topNavRef"
        aria-label="Navegação Principal do Hotel"
        class="relative flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 shrink-0 max-w-full overflow-x-auto scrollbar-none py-1"
      >
        <!-- Buttons 1, 2, 3: Quartos, Sobre Nós, Contactos (shown in sections 1, 2, 3 and 6; smoothly folds away in 4 & 5) -->
        <Transition name="fade-btn">
          <div
            v-if="showSecondaryNav"
            class="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 shrink-0"
          >
            <UiKineticButton
              key="nav-rooms"
              data-hero-nav-item
              variant="secondary"
              size="md"
              width="uniform"
              to="#apartments"
              class="whitespace-nowrap"
            >
              {{ copy.nav.rooms }}
            </UiKineticButton>

            <UiKineticButton
              key="nav-about"
              data-hero-nav-item
              variant="secondary"
              size="md"
              width="uniform"
              to="#about-us"
              class="whitespace-nowrap"
            >
              {{ copy.nav.aboutUs }}
            </UiKineticButton>

            <UiKineticButton
              key="nav-contacts"
              data-hero-nav-item
              variant="secondary"
              size="md"
              width="uniform"
              to="#contacts"
              class="whitespace-nowrap"
            >
              {{ copy.nav.contacts }}
            </UiKineticButton>
          </div>
        </Transition>

        <!-- Button 4 in Section 6: RESERVAR appears as Style 1 primary button alongside VINHOS in Footer -->
        <Transition name="fade-btn">
          <UiKineticButton
            v-if="showFooterReservar"
            key="nav-footer-book"
            data-hero-nav-item
            variant="primary"
            size="md"
            width="uniform"
            to="#book"
            class="whitespace-nowrap shrink-0"
          >
            {{ copy.nav.book }}
          </UiKineticButton>
        </Transition>

        <!-- Rightmost Action Button:
             - Sections 1, 2, 3: "RESERVAR" (Style 1)
             - Sections 4 & 5: Only "VINHOS" remains on the right, strictly in the same position and Style 1 design
             - Section 6: "VINHOS" (Style 1) completing all 5 buttons
        -->
        <div class="relative shrink-0 flex items-center justify-center">
          <Transition name="rightmost-crossfade">
            <UiKineticButton
              :key="primaryActionConfig.key"
              data-hero-nav-item
              variant="primary"
              size="md"
              width="uniform"
              :to="primaryActionConfig.to"
              class="whitespace-nowrap shrink-0"
            >
              {{ primaryActionConfig.label }}
            </UiKineticButton>
          </Transition>
        </div>
      </nav>
    </header>

    <!-- HERO CONTENT BOTTOM LINE: Subtitle (4 words top, 4 words bottom) + "Wines" Button on left | "Experiências Vínicas" on right -->
    <!-- Fixed at bottom-0 with safe-area padding for mobile browsers so content is always above the home bar / browser toolbar -->
    <div
      data-hero-bottom-bar
      class="fixed bottom-0 left-0 right-0 z-30 px-3 xs:px-4 sm:px-[5vw] pt-2 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] sm:pb-6 md:pb-8 lg:pb-10 pointer-events-none border-0 border-transparent outline-none ring-0 transition-all duration-300"
      :class="isScrolledSection2 ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'"
    >
      <div
        class="flex flex-row items-end justify-between gap-2 xs:gap-3 sm:gap-4 md:gap-6 w-full"
      >
        <!-- Left Side: Phrase (4 words top, 4 words bottom) + "Wines" Button -->
        <div
          ref="bottomLeftRef"
          class="pointer-events-auto flex flex-col items-start gap-1.5 xs:gap-2 sm:gap-3 md:gap-5 min-w-0 shrink"
        >
          <div
            data-hero-bottom-item
            data-hero-main-headline
            class="font-display text-[9px] xs:text-[10px] sm:text-xs md:text-[clamp(1.05rem,1.35vw,1.35rem)] lg:text-[clamp(1.2rem,1.6vw,1.65rem)] font-normal uppercase leading-tight sm:leading-snug tracking-[0.02em] sm:tracking-[0.04em] text-[#ffffff] drop-shadow-xs opacity-0 whitespace-nowrap"
          >
            <p class="whitespace-nowrap">{{ copy.wineSubtitleLines[0] }}</p>
            <p class="whitespace-nowrap">{{ copy.wineSubtitleLines[1] }}</p>
          </div>

          <div
            data-hero-bottom-item
            class="flex flex-wrap items-center gap-2 sm:gap-3 opacity-0"
          >
            <!-- Style 1: Solid Primary Button (size="md", width="uniform": strictly identical geometric footprint to "RESERVAR") -->
            <UiKineticButton
              variant="primary"
              size="md"
              width="uniform"
              to="#experiencias-vinicas"
              class="whitespace-nowrap"
            >
              {{ copy.winesCta }}
            </UiKineticButton>
          </div>
        </div>

        <!-- Right Side: "Experiências Vínicas" (On the SAME horizontal line as the left content across all screens) -->
        <h2
          ref="wineTitleRef"
          data-hero-title-wine
          class="pointer-events-auto self-end ml-auto text-right shrink-0 font-display text-[10.5px] xs:text-xs sm:text-sm md:text-2xl lg:text-[1.75rem] xl:text-[2rem] font-normal tracking-[0.04em] sm:tracking-[0.06em] leading-none text-[#1D351B] whitespace-nowrap opacity-0 will-change-[transform,opacity] select-none pb-0.5"
        >
          {{ copy.rightTitle }}
        </h2>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fade-btn-enter-active,
.fade-btn-leave-active {
  transition: opacity 0.3s ease;
}

.fade-btn-enter-from,
.fade-btn-leave-to {
  opacity: 0;
}

.rightmost-crossfade-enter-active,
.rightmost-crossfade-leave-active {
  transition: opacity 0.3s ease;
}

.rightmost-crossfade-enter-from,
.rightmost-crossfade-leave-to {
  opacity: 0;
}

.rightmost-crossfade-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .fade-btn-enter-active,
  .fade-btn-leave-active,
  .rightmost-crossfade-enter-active,
  .rightmost-crossfade-leave-active {
    transition: none !important;
  }
}
</style>
