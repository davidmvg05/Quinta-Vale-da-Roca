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

const isAnimating = ref(false)
const hasCompletedEntrance = ref(false)
const isScrolledSection2 = ref(false)
const currentStage = ref<'stage-1' | 'stage-2' | 'stage-3' | 'stage-4'>('stage-1')

let activeTimeline: gsap.core.Timeline | undefined
let scrollTransitionTrigger: ScrollTrigger | undefined
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
  if (elapsedSec >= 4.5) {
    currentStage.value = 'stage-4'
  } else if (elapsedSec >= 2.3) {
    currentStage.value = 'stage-3'
  } else if (elapsedSec >= 0.9) {
    currentStage.value = 'stage-2'
  } else {
    currentStage.value = 'stage-1'
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
  if (reducedMotion || hasCompletedEntrance.value || elapsedSeconds >= 5.8 || isAlreadyScrolled) {
    const apartmentsEl = typeof document !== 'undefined' ? document.getElementById('apartments') : null
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
    const isPastApartments = Boolean(
      apartmentsEl && apartmentsEl.getBoundingClientRect().top <= 100,
    )
    isScrolledSection2.value = isPastApartments

    gsap.set(centerBrand, { autoAlpha: 0 })
    gsap.set(hotelEl, {
      autoAlpha: isPastApartments ? 0 : 1,
      opacity: isPastApartments ? 0 : (isAlreadyScrolled ? 0.5 : 1),
      x: 0,
      y: 0,
      color: '#ffffff',
      clearProps: 'transform',
    })
    gsap.set(headerLogoEl, {
      autoAlpha: isPastApartments ? 1 : 0,
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
    gsap.set(navButtons, { autoAlpha: 1, y: 0 })
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

  const centerRect = centerBrand.getBoundingClientRect()
  const hotelRect = hotelEl.getBoundingClientRect()
  const wineRect = wineEl.getBoundingClientRect()

  const centerCenterX = centerRect.left + centerRect.width / 2
  const centerCenterY = centerRect.top + centerRect.height / 2

  const availableLeft = centerRect.left - 16
  const availableRight = vw - centerRect.right - 16
  const canFitSideBySide =
    availableLeft >= hotelRect.width + 10 &&
    availableRight >= wineRect.width + 10
  const isCompactLayout = !canFitSideBySide

  let startHotelLeft = 0
  let startHotelTop = 0
  let startWineLeft = 0
  let startWineTop = 0

  if (!isCompactLayout) {
    // Stage 1 starting coordinates (Desktop & Mobile when words fit side-by-side):
    // "HOTEL" and "EXPERIÊNCIAS VÍNICAS" must be strictly equidistant from the center logo:
    // distance(HOTEL.right, logo.left) === distance(logo.right, WINE.left) === gap
    const maxGapLeft = availableLeft - hotelRect.width
    const maxGapRight = availableRight - wineRect.width
    const gap = Math.max(12, Math.min(maxGapLeft, maxGapRight, 52))

    startHotelLeft = centerRect.left - gap - hotelRect.width
    startWineLeft = centerRect.right + gap

    startHotelTop = centerCenterY - hotelRect.height / 2
    startWineTop = centerCenterY - wineRect.height / 2
  } else {
    // Stage 1 starting coordinates (Extremely narrow screens under 360px):
    const availableTop = centerRect.top - 20
    const availableBottom = vh - centerRect.bottom - 20
    const maxGapTop = availableTop - hotelRect.height
    const maxGapBottom = availableBottom - wineRect.height
    const vGap = Math.max(12, Math.min(maxGapTop, maxGapBottom, 24))

    startHotelTop = centerRect.top - vGap - hotelRect.height
    startWineTop = centerRect.bottom + vGap

    startHotelLeft = centerCenterX - hotelRect.width / 2
    startWineLeft = centerCenterX - wineRect.width / 2
  }

  const deltaHotelX = startHotelLeft - hotelRect.left
  const deltaHotelY = startHotelTop - hotelRect.top

  const deltaWineX = startWineLeft - wineRect.left
  const deltaWineY = startWineTop - wineRect.top

  // Stage 3a: Video appears strictly between "HOTEL" (on left) and "EXPERIÊNCIAS VÍNICAS" (on right)
  // Compute safe horizontal insets so the initial centered video sits cleanly between both words without touching either word
  const hotelEndPercent = Math.ceil(((hotelRect.right + 36) / vw) * 100)
  const wineStartPercent = Math.ceil(((vw - wineRect.left + 36) / vw) * 100)
  const safeInsetH = Math.max(hotelEndPercent, wineStartPercent, 32)

  // Straight edges (0px) per Design System
  const initialVideoClip = isCompactLayout
    ? 'inset(18% 12% round 0px)'
    : `inset(14% ${safeInsetH}% round 0px)`

  // Set Stage 1 initial state
  isAnimating.value = true
  currentStage.value = 'stage-1'

  gsap.set(centerBrand, {
    autoAlpha: 1,
    scale: 1,
    y: 0,
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
    scale: 0.96,
    clipPath: initialVideoClip,
  })

  if (videoEl) {
    gsap.set(videoEl, { scale: 1.06 })
  }

  gsap.set(navButtons, {
    autoAlpha: 0,
    y: -18,
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
      setupScrollTransition(reducedMotion)
    },
  })

  // Stage 1: Hold initial composition (white/off-white bg, center logo + "Quinta Vale da Roca",
  // "HOTEL" on left and "EXPERIÊNCIAS VÍNICAS" on right strictly equidistant from logo)
  tl.addLabel('stage1Hold', 0)
  tl.to({}, { duration: 0.9 })

  // Stage 2: Logo fades out as the words move to the sides
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
      duration: 1.2,
      ease: 'power3.inOut',
    },
    'stage2Lateral',
  )
  tl.to(
    wineEl,
    {
      x: 0,
      duration: 1.2,
      ease: 'power3.inOut',
    },
    'stage2Lateral',
  )
  tl.to(
    centerBrand,
    {
      autoAlpha: 0,
      scale: 0.75,
      duration: 1.0,
      ease: 'power2.inOut',
    },
    'stage2Lateral',
  )

  // Pause after the logo is completely gone ("o vídeo aparece depois do logo sair")
  tl.to({}, { duration: 0.25 })

  // Stage 3a: Video appears in the center ("entra vídeo no centro")
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
      duration: 0.75,
      ease: 'power2.out',
    },
    'stage3VideoCenterAppear',
  )

  // Hold video in the center so the user clearly sees it before expansion
  tl.to({}, { duration: 0.6 })

  // Stage 3b: Gradually widens until it reaches 100%, at which point the words turn white
  tl.addLabel('stage3ExpandAndVertical', '>')
  tl.to(
    videoWrapper,
    {
      clipPath: 'inset(0% 0% round 0px)',
      duration: 1.8,
      ease: 'power3.inOut',
    },
    'stage3ExpandAndVertical',
  )
  if (videoEl) {
    tl.to(
      videoEl,
      {
        scale: 1,
        duration: 1.9,
        ease: 'power3.out',
      },
      'stage3ExpandAndVertical',
    )
  }
  // As the video expands over the words and reaches 100%, words glide to final positions and turn white
  tl.to(
    hotelEl,
    {
      y: 0,
      color: '#ffffff',
      duration: 1.7,
      ease: 'power3.inOut',
    },
    'stage3ExpandAndVertical',
  )
  tl.to(
    wineEl,
    {
      y: 0,
      color: '#ffffff',
      duration: 1.7,
      ease: 'power3.inOut',
    },
    'stage3ExpandAndVertical',
  )

  // Stage 4: Reveal Top-Right Menu and Bottom-Left Main Headline + "Wines" Button
  tl.addLabel('stage4UiReveal', 'stage3ExpandAndVertical+=1.1')
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
      y: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
    },
    'stage4UiReveal',
  )
  tl.to(
    bottomItems,
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
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

  const checkAndApply = () => {
    if (!hasCompletedEntrance.value) return
    const scrollY = typeof window !== 'undefined' ? window.scrollY : 0
    const apartmentsEl = typeof document !== 'undefined' ? document.getElementById('apartments') : null
    const inSection2 = Boolean(apartmentsEl && apartmentsEl.getBoundingClientRect().top <= 100)

    isScrolledSection2.value = inSection2

    if (inSection2) {
      gsap.to(hotelEl, {
        autoAlpha: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
      gsap.to(headerLogoEl, {
        autoAlpha: 1,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    } else {
      const targetOpacity = scrollY > 40 ? 0.5 : 1
      gsap.to(hotelEl, {
        autoAlpha: 1,
        opacity: targetOpacity,
        color: '#ffffff',
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
      gsap.to(headerLogoEl, {
        autoAlpha: 0,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      })
      gsap.to(wineEl, {
        opacity: targetOpacity,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }
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

    const apartmentsEl = document.getElementById('apartments')
    const inSection2 = Boolean(apartmentsEl && apartmentsEl.getBoundingClientRect().top <= 100)

    if (inSection2 !== isScrolledSection2.value) {
      isScrolledSection2.value = inSection2
      if (inSection2) {
        if (hotelTitleRef.value) {
          gsap.to(hotelTitleRef.value, { autoAlpha: 0, duration: 0.3, overwrite: 'auto' })
        }
        if (headerLogoRef.value) {
          gsap.to(headerLogoRef.value, { autoAlpha: 1, duration: 0.35, overwrite: 'auto' })
        }
      } else {
        const targetOpacity = scrollY > 40 ? 0.5 : 1
        if (hotelTitleRef.value) {
          gsap.to(hotelTitleRef.value, { autoAlpha: 1, opacity: targetOpacity, color: '#ffffff', duration: 0.3, overwrite: 'auto' })
        }
        if (headerLogoRef.value) {
          gsap.to(headerLogoRef.value, { autoAlpha: 0, duration: 0.25, overwrite: 'auto' })
        }
        if (wineTitleRef.value) {
          gsap.to(wineTitleRef.value, { opacity: targetOpacity, duration: 0.3, overwrite: 'auto' })
        }
      }
    } else if (!inSection2 && hasCompletedEntrance.value) {
      const targetOpacity = scrollY > 40 ? 0.5 : 1
      if (hotelTitleRef.value) hotelTitleRef.value.style.opacity = String(targetOpacity)
      if (wineTitleRef.value) wineTitleRef.value.style.opacity = String(targetOpacity)
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
      class="pointer-events-none absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
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
        class="mt-3.5 font-display text-base md:text-lg lg:text-xl xl:text-2xl font-medium tracking-[0.06em] text-[#1D351B] whitespace-nowrap"
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
      <div class="relative flex items-center shrink-0">
        <!-- In Hero: "HOTEL" (loses 50% opacity on scroll, hides in Section 2) -->
        <h1
          ref="hotelTitleRef"
          data-hero-title-hotel
          class="font-display text-sm xs:text-base sm:text-lg md:text-2xl lg:text-[1.75rem] xl:text-[2rem] font-normal uppercase tracking-[0.06em] leading-none text-[#1D351B] opacity-0 will-change-[transform,opacity] transition-opacity duration-300 select-none whitespace-nowrap"
          :class="isScrolledSection2 ? 'pointer-events-none' : 'pointer-events-auto'"
        >
          {{ copy.leftTitle }}
        </h1>

        <!-- In Section 2 Scroll: Transparent PNG Logo without background where "HOTEL" was -->
        <div
          v-show="isScrolledSection2 && hasCompletedEntrance"
          ref="headerLogoRef"
          data-header-sticky-logo
          class="absolute left-0 top-1/2 -translate-y-1/2 border-0 outline-none transition-all duration-300"
          :class="isScrolledSection2 && hasCompletedEntrance ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible hidden'"
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
        class="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 shrink-0"
      >
        <UiKineticButton
          data-hero-nav-item
          variant="secondary"
          size="sm"
          to="#apartments"
          class="opacity-0 whitespace-nowrap"
        >
          {{ copy.nav.rooms }}
        </UiKineticButton>

        <UiKineticButton
          data-hero-nav-item
          variant="secondary"
          size="sm"
          to="#about-us"
          class="opacity-0 whitespace-nowrap"
        >
          {{ copy.nav.aboutUs }}
        </UiKineticButton>

        <UiKineticButton
          data-hero-nav-item
          variant="secondary"
          size="sm"
          to="#contacts"
          class="opacity-0 whitespace-nowrap"
        >
          {{ copy.nav.contacts }}
        </UiKineticButton>

        <UiKineticButton
          data-hero-nav-item
          variant="primary"
          size="sm"
          to="#book"
          class="opacity-0 font-medium whitespace-nowrap"
        >
          {{ copy.nav.book }}
        </UiKineticButton>
      </nav>
    </header>

    <!-- HERO CONTENT BOTTOM LINE: Subtitle (4 words top, 4 words bottom) + "Wines" Button on left | "EXPERIÊNCIAS VÍNICAS" on right -->
    <!-- Fixed at bottom-0 so words remain in place and don't move with scroll during Section 1 -->
    <div
      data-hero-bottom-bar
      class="fixed bottom-0 left-0 right-0 z-30 px-3 xs:px-4 sm:px-[5vw] py-4 xs:py-5 sm:py-6 md:py-10 lg:py-12 pointer-events-none border-0 border-transparent outline-none ring-0 transition-all duration-300"
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
            <!-- Style 1: Solid Primary Button -->
            <UiKineticButton
              variant="primary"
              size="sm"
              to="#wines"
              class="max-xs:!px-2 max-xs:!py-1 max-xs:!text-[8.5px] max-sm:!px-2.5 max-sm:!py-1.5 max-sm:!text-[9.5px] sm:!px-4 sm:!py-2 sm:!text-[10.5px] md:!px-6 md:!py-2.5 md:!text-xs whitespace-nowrap"
            >
              {{ copy.winesCta }}
            </UiKineticButton>
          </div>
        </div>

        <!-- Right Side: "EXPERIÊNCIAS VÍNICAS" (On the SAME horizontal line as the left content across all screens) -->
        <h2
          ref="wineTitleRef"
          data-hero-title-wine
          class="pointer-events-auto self-end ml-auto text-right shrink-0 font-display text-[10.5px] xs:text-xs sm:text-sm md:text-2xl lg:text-[1.75rem] xl:text-[2rem] font-normal uppercase tracking-[0.04em] sm:tracking-[0.06em] leading-none text-[#1D351B] whitespace-nowrap opacity-0 will-change-[transform,opacity] transition-opacity duration-300 select-none pb-0.5"
        >
          {{ copy.rightTitle }}
        </h2>
      </div>
    </div>
  </section>
</template>
