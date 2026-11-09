<script setup lang="ts">
import gsap from 'gsap'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSiteLocale } from '~/composables/useLocale'
import { useWineExperiences, type WineGallerySlide } from '~/composables/useWineExperiences'
import { useGsapContext } from '~/composables/useGsapContext'

const { locale, copy } = useSiteLocale()
const { experiences, slides } = useWineExperiences()

const sectionRef = ref<HTMLElement | null>(null)
const carouselRef = ref<{
  emblaRef?: any
  emblaApi?: any
} | null>(null)

const isReducedMotion = ref(false)

const autoScrollConfig = ref<{
  playOnInit: boolean
  speed: number
  stopOnInteraction: boolean
  stopOnFocusIn: boolean
  direction: 'forward' | 'backward'
}>({
  playOnInit: true,
  speed: 1.5,
  stopOnInteraction: false,
  stopOnFocusIn: false,
  direction: 'forward',
})

// Repeating slides to provide smooth infinite looping buffer for Embla Auto Scroll
const carouselSlides = computed<WineGallerySlide[]>(() => {
  const base = slides.value
  if (!base || base.length < 2) return []
  const first = base[0]
  const second = base[1]
  if (!first || !second) return []
  return [
    { ...first, id: `${first.id}-1` },
    { ...second, id: `${second.id}-1` },
    { ...first, id: `${first.id}-2` },
    { ...second, id: `${second.id}-2` },
    { ...first, id: `${first.id}-3` },
    { ...second, id: `${second.id}-3` },
    { ...first, id: `${first.id}-4` },
    { ...second, id: `${second.id}-4` },
  ]
})

function getEmblaApi() {
  const instance = carouselRef.value
  if (!instance) return null
  const api = instance.emblaApi
  if (api && typeof api.scrollNext === 'function') {
    return api
  }
  if (api && api.value && typeof api.value.scrollNext === 'function') {
    return api.value
  }
  return null
}

function handlePrev() {
  const api = getEmblaApi()
  if (!api) return

  if (autoScrollConfig.value.direction !== 'backward' || !autoScrollConfig.value.playOnInit) {
    autoScrollConfig.value = {
      ...autoScrollConfig.value,
      direction: 'backward',
      playOnInit: !isReducedMotion.value,
    }
  }

  api.scrollPrev()
  try {
    const autoScroll = api.plugins?.()?.autoScroll
    if (autoScroll && !isReducedMotion.value && typeof autoScroll.play === 'function') {
      autoScroll.play(0)
    }
  } catch {
    // Graceful fallback if plugin is unready
  }
}

function handleNext() {
  const api = getEmblaApi()
  if (!api) return

  if (autoScrollConfig.value.direction !== 'forward' || !autoScrollConfig.value.playOnInit) {
    autoScrollConfig.value = {
      ...autoScrollConfig.value,
      direction: 'forward',
      playOnInit: !isReducedMotion.value,
    }
  }

  api.scrollNext()
  try {
    const autoScroll = api.plugins?.()?.autoScroll
    if (autoScroll && !isReducedMotion.value && typeof autoScroll.play === 'function') {
      autoScroll.play(0)
    }
  } catch {
    // Graceful fallback if plugin is unready
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    isReducedMotion.value = mq.matches
    if (mq.matches) {
      autoScrollConfig.value.playOnInit = false
    }
    const onMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion.value = e.matches
      if (e.matches) {
        autoScrollConfig.value.playOnInit = false
        const api = getEmblaApi()
        api?.plugins?.()?.autoScroll?.stop?.()
      } else {
        autoScrollConfig.value.playOnInit = true
        const api = getEmblaApi()
        api?.plugins?.()?.autoScroll?.play?.()
      }
    }
    mq.addEventListener('change', onMotionChange)

    const onWindowKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isInput = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      if (isInput) return

      const sectionEl = sectionRef.value
      if (!sectionEl) return

      const rect = sectionEl.getBoundingClientRect()
      const isSectionInView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25
      const isSectionFocused = sectionEl.contains(document.activeElement)

      if (isSectionInView || isSectionFocused) {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          handlePrev()
        } else if (event.key === 'ArrowRight') {
          event.preventDefault()
          handleNext()
        }
      }
    }

    window.addEventListener('keydown', onWindowKeyDown)

    onBeforeUnmount(() => {
      mq.removeEventListener('change', onMotionChange)
      window.removeEventListener('keydown', onWindowKeyDown)
    })
  }
})

useGsapContext(sectionRef, (_ctx, conditions) => {
  const sectionEl = sectionRef.value
  if (!sectionEl) return

  const revealTargets = sectionEl.querySelectorAll('[data-wine-reveal]')

  if (conditions.reduce) {
    gsap.set(revealTargets, { autoAlpha: 1, y: 0 })
    return
  }

  gsap.fromTo(
    revealTargets,
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionEl,
        start: 'top 78%',
        once: true,
      },
    },
  )
})
</script>

<template>
  <section
    id="experiencias-vinicas"
    ref="sectionRef"
    data-wine-section
    aria-labelledby="wine-experiences-heading"
    class="relative z-40 w-full bg-[#ffffff] px-3 xs:px-[5vw] pt-12 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32 text-[#1D351B] scroll-mt-14 md:scroll-mt-16 lg:scroll-mt-20 overflow-x-clip"
  >
    <!-- Section Anchor alias for #wines -->
    <span id="wines" class="sr-only">Experiências Vínicas</span>

    <!-- Section Header Row: Title "Experiências Vínicas" on the left -->
    <div
      data-wine-reveal
      class="mb-8 md:mb-10 lg:mb-12 flex items-end justify-between"
    >
      <h2
        id="wine-experiences-heading"
        data-wine-title
        class="font-display text-4xl max-xs:text-3xl md:text-5xl lg:text-6xl font-normal tracking-[0.02em] leading-none text-[#1D351B]"
      >
        {{ copy.wineExperiencesTitle }}
      </h2>
    </div>

    <!-- Centered Editorial Description -->
    <div
      data-wine-reveal
      class="mx-auto max-w-3xl text-center mb-8 sm:mb-10 md:mb-12"
    >
      <p
        class="font-sans text-base sm:text-lg md:text-xl text-[#1D351B]/85 font-normal leading-relaxed"
      >
        {{ copy.wineExperiencesDescription }}
      </p>
    </div>

    <!-- Gallery Carousel with Auto Scroll (arrows only, no dots, auto scroll activates on left/right interaction) -->
    <div
      data-wine-reveal
      class="relative flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-6 w-full max-w-6xl mx-auto"
    >
      <!-- Left Minimalist Navigation Arrow (outside images, green bg on hover) -->
      <button
        type="button"
        data-wine-prev
        :aria-label="copy.wineCarouselPrevLabel"
        class="shrink-0 inline-flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 items-center justify-center rounded-none border border-[#1D351B] bg-[#ffffff] text-[#1D351B] transition-colors duration-300 hover:bg-[#1D351B] hover:text-[#ffffff] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#1D351B] cursor-pointer"
        @click="handlePrev"
        @keydown.left.prevent="handlePrev"
        @keydown.right.prevent="handleNext"
      >
        <UIcon
          name="solar:arrow-left-linear"
          class="h-4 w-4 md:h-5 md:w-5 pointer-events-none"
          aria-hidden="true"
        />
      </button>

      <!-- Nuxt UI Carousel with Auto Scroll, no dots, full 90-degree corners -->
      <UCarousel
        ref="carouselRef"
        v-slot="{ item: slide }"
        :items="carouselSlides"
        :auto-scroll="autoScrollConfig"
        loop
        align="center"
        :slides-to-scroll="1"
        :arrows="false"
        :dots="false"
        tabindex="0"
        aria-label="Galeria de Experiências Vínicas"
        :ui="{
          root: 'relative w-full min-w-0 overflow-hidden focus-visible:outline-none',
          viewport: 'overflow-hidden w-full',
          container: 'flex items-stretch -ms-4 md:-ms-6',
          item: 'min-w-0 shrink-0 basis-full md:basis-1/2 ps-4 md:ps-6'
        }"
        class="flex-1 min-w-0"
        @keydown.left.prevent="handlePrev"
        @keydown.right.prevent="handleNext"
      >
        <figure
          class="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-none bg-[#F8F9F6] select-none"
        >
          <NuxtImg
            :src="slide.src"
            :alt="slide.alt[locale]"
            width="1200"
            height="750"
            loading="lazy"
            fetchpriority="low"
            decoding="async"
            class="h-full w-full object-cover object-center rounded-none"
          />
        </figure>
      </UCarousel>

      <!-- Right Minimalist Navigation Arrow (outside images, green bg on hover) -->
      <button
        type="button"
        data-wine-next
        :aria-label="copy.wineCarouselNextLabel"
        class="shrink-0 inline-flex h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 items-center justify-center rounded-none border border-[#1D351B] bg-[#ffffff] text-[#1D351B] transition-colors duration-300 hover:bg-[#1D351B] hover:text-[#ffffff] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#1D351B] cursor-pointer"
        @click="handleNext"
        @keydown.left.prevent="handlePrev"
        @keydown.right.prevent="handleNext"
      >
        <UIcon
          name="solar:arrow-right-linear"
          class="h-4 w-4 md:h-5 md:w-5 pointer-events-none"
          aria-hidden="true"
        />
      </button>
    </div>

    <!-- Center Smaller Heading: "Visitas e Provas de Vinhos" -->
    <div data-wine-reveal class="mt-14 mb-8 sm:mt-20 sm:mb-10 md:mt-24 md:mb-12 text-center">
      <h3
        data-wine-tastings-heading
        class="font-display text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.02em] leading-tight text-[#1D351B]"
      >
        {{ copy.wineTastingsSubheading }}
      </h3>
    </div>

    <!-- 3 Wine Experience Cards (Matching Apartamentos layout: Title at top, image below, price/duration, button on hover) -->
    <div
      data-wine-reveal
      class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl mx-auto items-stretch"
    >
      <article
        v-for="tour in experiences"
        :key="tour.id"
        :data-tour-id="tour.id"
        data-wine-card
        class="group/card relative flex flex-col w-full h-full text-left rounded-none bg-[#ffffff]"
      >
        <!-- Tour Name (Top left above image, not overlaid) -->
        <h4
          data-wine-card-title
          class="mb-2.5 sm:mb-3 font-display text-xl sm:text-2xl lg:text-[1.5rem] font-normal tracking-[0.04em] leading-tight text-[#1D351B] uppercase w-full text-left"
        >
          {{ tour.title }}
        </h4>

        <!-- Vertical Image (aspect-[3/4], rounded-none, matching Apartamentos) -->
        <figure
          class="relative aspect-[3/4] max-h-[360px] sm:max-h-[400px] md:max-h-[440px] lg:max-h-[460px] w-full overflow-hidden rounded-none bg-[#F8F9F6]"
        >
          <NuxtImg
            :src="tour.image"
            :alt="tour.alt[locale]"
            width="900"
            height="1200"
            loading="lazy"
            fetchpriority="low"
            decoding="async"
            class="h-full w-full object-cover object-center rounded-none"
          />
        </figure>

        <!-- Details Column below image -->
        <div class="mt-4 flex flex-col flex-1">
          <!-- Highlighted Price and Duration -->
          <div class="flex items-baseline gap-2 mb-3">
            <span
              class="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#1D351B]"
            >
              {{ tour.price }}
            </span>
            <span
              class="font-sans text-xs sm:text-sm text-[#1D351B]/70 font-normal"
            >
              {{ tour.unit[locale] }}
            </span>
          </div>

          <!-- Style 1 Button ("RESERVAR EXPERIÊNCIA"): Immediately visible on all screens (width="full" mandatory below image) -->
          <div
            class="mt-auto pt-2 w-full min-h-[38px] md:min-h-[42px] flex items-center"
          >
            <UiKineticButton
              variant="primary"
              size="md"
              width="full"
              :to="`/contactos?experiencia=${tour.id}`"
              :aria-label="`${copy.bookExperience}: ${tour.title}`"
              class="w-full opacity-100 pointer-events-auto"
            >
              {{ copy.bookExperience }}
            </UiKineticButton>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
