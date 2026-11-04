<script setup lang="ts">
import gsap from 'gsap'
import { ref, watch, nextTick } from 'vue'

const { locale, copy } = useSiteLocale()

const rootRef = ref<HTMLElement | null>(null)
const centerBrandRef = ref<HTMLElement | null>(null)
const hotelTitleRef = ref<HTMLElement | null>(null)
const wineTitleRef = ref<HTMLElement | null>(null)
const videoWrapperRef = ref<HTMLElement | null>(null)
const videoElementRef = ref<HTMLVideoElement | null>(null)
const topNavRef = ref<HTMLElement | null>(null)
const bottomLeftRef = ref<HTMLElement | null>(null)

const isAnimating = ref(false)
const hasCompletedEntrance = ref(false)
const currentStage = ref<'stage-1' | 'stage-2' | 'stage-3' | 'stage-4'>('stage-1')

let activeTimeline: gsap.core.Timeline | undefined
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

function buildEntranceTimeline(reducedMotion: boolean) {
  const root = rootRef.value
  const centerBrand = centerBrandRef.value
  const hotelEl = hotelTitleRef.value
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

  // Reduced motion or already-completed entrance: lock directly in the final revealed Hero state
  if (reducedMotion || hasCompletedEntrance.value || elapsedSeconds >= 4.55) {
    gsap.set(centerBrand, { autoAlpha: 0 })
    gsap.set([hotelEl, wineEl], {
      autoAlpha: 1,
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
    return
  }

  // Reset elements to natural final layout coordinates so we can measure exact deltas
  gsap.set([hotelEl, wineEl], { x: 0, y: 0 })
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
  // so it never occupies >50% of the screen initially and has a dramatic expansion range to 100%.
  // Use canonical 2-value inset(V% H% round Rpx) so browser CSSOM and GSAP share identical 3-number token structure.
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
    ? 'inset(39% 28% round 20px)'
    : `inset(${desktopVertInsetPct}% ${desktopSideInsetPct}% round 28px)`

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
    x: deltaHotelX,
    y: deltaHotelY,
    color: '#1D351B',
  })

  gsap.set(wineEl, {
    autoAlpha: 1,
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
    },
  })

  // Stage 1: Hold initial composition (off-white bg, center logo + "Quinta Vale da Roca",
  // "HOTEL" and "EXPERIÊNCIAS VÍNICAS" strictly equidistant on either side of the center logo)
  tl.addLabel('stage1Hold', 0)
  tl.to({}, { duration: 0.8 })

  // Stage 2: "The logo fades as the words move to the sides."
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
      scale: 0.95,
      duration: 1.05,
      ease: 'power2.inOut',
    },
    'stage2Lateral',
  )

  // Stage 3a: "When the logo disappears, a video appears in the center with rounded edges..."
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

  // Stage 3b: "...and animates to fill 100% of the width." while "HOTEL" moves up and "EXPERIÊNCIAS VÍNICAS" moves down
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

  // Stage 4: Reveal Top-Right Menu ("Rooms", "About Us", "Contacts" in Style 2 85% Opacity + "Book" in Style 1)
  // and Bottom-Left Description + "Wines" Button (in Style 1)
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
      y: 0,
      duration: 0.75,
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

useGsapContext(rootRef, (ctx, conditions) => {
  buildEntranceTimeline(conditions.reduce)

  let resizeTimer: ReturnType<typeof setTimeout> | undefined
  const handleResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      if (isAnimating.value && !hasCompletedEntrance.value) {
        ctx.add(() => {
          buildEntranceTimeline(conditions.reduce)
        })
      }
    }, 100)
  }

  window.addEventListener('resize', handleResize, { passive: true })

  return () => {
    clearTimeout(resizeTimer)
    window.removeEventListener('resize', handleResize)
    activeTimeline?.kill()
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
    class="relative h-dvh min-h-[640px] w-full overflow-hidden bg-[#F8F9F6] text-[#1D351B] select-none"
  >
    <!-- STAGE 3+: Centered Rounded-Edge Video expanding to 100% Full-Width (Muted, Loop, Playsinline, No Controls) -->
    <div
      ref="videoWrapperRef"
      data-hero-video-wrapper
      class="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-hidden opacity-0 will-change-[clip-path,transform,opacity]"
    >
      <video
        ref="videoElementRef"
        data-hero-video
        class="h-full w-full object-cover"
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
        src="/images/logo/vdr-logo.svg"
        alt="Emblema Quinta Vale da Roca"
        width="160"
        height="135"
        fetchpriority="high"
        class="h-auto w-24 md:w-28 lg:w-32 xl:w-36 object-contain"
      />
      <p
        class="mt-3.5 font-display text-base md:text-lg lg:text-xl xl:text-2xl font-medium tracking-[0.06em] text-[#1D351B] whitespace-nowrap"
      >
        {{ copy.brandSubtitle }}
      </p>
    </div>

    <!-- HERO CONTENT GRID: Top Line ("HOTEL") & Bottom Line ("EXPERIÊNCIAS VÍNICAS") -->
    <div
      class="relative z-30 flex h-full w-full flex-col justify-between px-[5vw] py-8 md:py-10 lg:py-12"
    >
      <!-- TOP LINE: "HOTEL" on the left | Menu ("Rooms", "About Us", "Contacts" Style 2 + "Book" Style 1) on the right -->
      <header
        class="flex flex-wrap items-center justify-between gap-4 max-sm:flex-col max-sm:items-start"
      >
        <h1
          ref="hotelTitleRef"
          data-hero-title-hotel
          class="font-display text-xl max-xs:text-lg md:text-[clamp(1.05rem,1.45vw,1.3rem)] lg:text-[clamp(1.3rem,1.8vw,2.3rem)] font-normal uppercase tracking-[0.03em] lg:tracking-[0.04em] leading-none text-[#1D351B] opacity-0 will-change-transform"
        >
          {{ copy.leftTitle }}
        </h1>

        <nav
          ref="topNavRef"
          aria-label="Navegação Principal do Hotel"
          class="flex flex-wrap items-center gap-2.5 md:gap-3.5"
        >
          <!-- Style 2: Translucent Secondary Buttons (85% Opacity) -->
          <UiKineticButton
            data-hero-nav-item
            variant="secondary"
            surface="dark"
            to="#rooms"
            class="opacity-0"
          >
            {{ copy.nav.rooms }}
          </UiKineticButton>

          <UiKineticButton
            data-hero-nav-item
            variant="secondary"
            surface="dark"
            to="#about-us"
            class="opacity-0"
          >
            {{ copy.nav.aboutUs }}
          </UiKineticButton>

          <UiKineticButton
            data-hero-nav-item
            variant="secondary"
            surface="dark"
            to="#contacts"
            class="opacity-0"
          >
            {{ copy.nav.contacts }}
          </UiKineticButton>

          <!-- Style 1: Solid Primary Button -->
          <UiKineticButton
            data-hero-nav-item
            variant="primary"
            to="#book"
            class="opacity-0"
          >
            {{ copy.nav.book }}
          </UiKineticButton>
        </nav>
      </header>

      <!-- BOTTOM LINE: 8-Word Subtitle (4 above, 4 below) + "Wines" Button (Style 1) on the left | "EXPERIÊNCIAS VÍNICAS" on the right -->
      <div
        class="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
      >
        <!-- Left Side of the "EXPERIÊNCIAS VÍNICAS" line: 8-Word Subtitle + "Wines" Button (Style 1) -->
        <div
          ref="bottomLeftRef"
          class="flex max-w-xs md:max-w-sm lg:max-w-md flex-col items-start gap-4 md:gap-5"
        >
          <p
            data-hero-bottom-item
            data-hero-wine-subtitle
            class="font-sans text-sm md:text-base lg:text-[17px] font-light leading-snug tracking-[0.02em] text-[#ffffff]/95 drop-shadow-xs opacity-0"
          >
            <span data-subtitle-line="1" class="whitespace-nowrap">{{ copy.wineSubtitleLines[0] }}</span>
            <br />
            <span data-subtitle-line="2" class="whitespace-nowrap">{{ copy.wineSubtitleLines[1] }}</span>
          </p>

          <div
            data-hero-bottom-item
            class="flex flex-wrap items-center gap-3 opacity-0"
          >
            <!-- Style 1: Solid Primary Button -->
            <UiKineticButton
              variant="primary"
              size="lg"
              to="#wines"
            >
              {{ copy.winesCta }}
            </UiKineticButton>
          </div>
        </div>

        <!-- Right Side: "EXPERIÊNCIAS VÍNICAS" -->
        <h2
          ref="wineTitleRef"
          data-hero-title-wine
          class="self-end ml-auto text-right shrink-0 font-display text-xl max-xs:text-lg md:text-[clamp(1.05rem,1.45vw,1.3rem)] lg:text-[clamp(1.3rem,1.8vw,2.3rem)] font-normal uppercase tracking-[0.03em] lg:tracking-[0.04em] leading-none text-[#1D351B] whitespace-nowrap opacity-0 will-change-transform"
        >
          {{ copy.rightTitle }}
        </h2>
      </div>
    </div>
  </section>
</template>


The above content shows the entire, complete file contents of the requested file.
