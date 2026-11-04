<script setup lang="ts">
import gsap from 'gsap'
import { ref, onMounted } from 'vue'
import { useSiteLocale } from '~/composables/useLocale'
import { useRooms } from '~/composables/useRooms'
import { useGsapContext } from '~/composables/useGsapContext'

const { locale, copy } = useSiteLocale()
const { rooms } = useRooms()

const sectionRef = ref<HTMLElement | null>(null)
const carouselRef = ref<{
  emblaRef?: any
  emblaApi?: any
} | null>(null)

const isReducedMotion = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined') {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    isReducedMotion.value = mq.matches
    mq.addEventListener('change', (e) => {
      isReducedMotion.value = e.matches
    })
  }
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
  api?.scrollPrev()
}

function handleNext() {
  const api = getEmblaApi()
  api?.scrollNext()
}

useGsapContext(sectionRef, (_ctx, conditions) => {
  const sectionEl = sectionRef.value
  if (!sectionEl) return

  const revealTargets = sectionEl.querySelectorAll('[data-apartments-reveal]')

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
    id="apartments"
    ref="sectionRef"
    data-apartments-section
    aria-labelledby="apartments-heading"
    class="relative z-40 w-full min-h-screen bg-[#ffffff] px-[5vw] pt-28 pb-24 md:pt-36 md:pb-32 lg:pt-40 lg:pb-36 text-[#1D351B]"
  >
    <!-- Section Header Row: Category Title "Apartamentos" on the left (No dividing lines) -->
    <div
      data-apartments-reveal
      class="mb-8 md:mb-12 lg:mb-14 flex items-end justify-between"
    >
      <h2
        id="apartments-heading"
        data-apartments-title
        class="font-display text-4xl max-xs:text-3xl md:text-5xl lg:text-6xl font-normal tracking-[0.02em] leading-none text-[#1D351B]"
      >
        {{ copy.apartmentsTitle }}
      </h2>
    </div>

    <!-- Room Editorial Grid: Left Arrow + Carousel Track + Right Arrow -->
    <div
      v-if="rooms && rooms.length"
      data-apartments-reveal
      class="relative flex items-center justify-center gap-3 sm:gap-4 md:gap-6 w-full max-w-6xl mx-auto"
    >
      <!-- Left Minimalist Navigation Arrow (OUTSIDE the images, static icon, green bg + white arrow on hover) -->
      <button
        type="button"
        data-apartments-prev
        :aria-label="copy.apartmentsPrevLabel"
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

      <!-- Embla-powered Spring Physics Carousel (no dots, arrows navigation only, drag disabled) -->
      <UCarousel
        ref="carouselRef"
        v-slot="{ item: room }"
        :items="rooms"
        :ui="{
          root: 'relative w-full min-w-0 overflow-hidden',
          viewport: 'overflow-hidden w-full',
          container: 'flex items-stretch -ms-5 lg:-ms-6 xl:-ms-8',
          item: 'min-w-0 shrink-0 basis-full md:basis-1/2 lg:basis-1/3 ps-5 lg:ps-6 xl:ps-8'
        }"
        loop
        align="start"
        :slides-to-scroll="1"
        :duration="isReducedMotion ? 0 : 25"
        :arrows="false"
        :dots="false"
        :watch-drag="false"
        class="flex-1 min-w-0"
      >
        <!-- Room Card Container (Per-image container extending to CTA button) -->
        <article
          :data-room-id="room.id"
          data-room-card
          class="group/card relative flex flex-col w-full h-full text-left"
        >
          <!-- Vertical Image (No borders, NO zoom hover effect, aspect-[3/4]) -->
          <NuxtLink
            :to="`/quartos/${room.slug}`"
            tabindex="-1"
            aria-hidden="true"
            class="block focus:outline-none"
          >
            <figure
              class="relative aspect-[3/4] max-h-[360px] sm:max-h-[400px] md:max-h-[440px] lg:max-h-[460px] w-full overflow-hidden rounded-none bg-[#F8F9F6] cursor-pointer"
            >
              <NuxtImg
                :src="room.image"
                :alt="room.alt[locale]"
                width="900"
                height="1200"
                loading="lazy"
                fetchpriority="low"
                decoding="async"
                class="h-full w-full rounded-none object-cover object-center"
              />
            </figure>
          </NuxtLink>

          <!-- Room / Suite Info & CTA Container: Name + "VER QUARTO" Button (Style 1) on hover -->
          <div class="mt-3 sm:mt-3.5 flex flex-col items-start gap-2.5 sm:gap-3">
            <h3
              data-room-name
              class="font-display text-xl sm:text-2xl lg:text-[1.5rem] font-normal tracking-[0.02em] leading-tight text-[#1D351B] truncate"
            >
              <NuxtLink
                :to="`/quartos/${room.slug}`"
                class="transition-opacity hover:opacity-80 focus-visible:outline-1 focus-visible:outline-[#1D351B]"
              >
                {{ room.name[locale] }}
              </NuxtLink>
            </h3>

            <!-- Style 1 Button ("VER QUARTO"): Appears on hover over this room container -->
            <div class="pt-0.5 min-h-[36px] flex items-center">
              <UiKineticButton
                variant="primary"
                size="sm"
                :to="`/quartos/${room.slug}`"
                :aria-label="`${copy.viewRoom}: ${room.name[locale]}`"
                class="transition-all duration-300 ease-out max-md:opacity-100 max-md:translate-y-0 max-md:pointer-events-auto md:opacity-0 md:translate-y-1.5 md:pointer-events-none md:group-hover/card:opacity-100 md:group-hover/card:translate-y-0 md:group-hover/card:pointer-events-auto group-focus-within/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:pointer-events-auto motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0"
              >
                {{ copy.viewRoom }}
              </UiKineticButton>
            </div>
          </div>
        </article>
      </UCarousel>

      <!-- Right Minimalist Navigation Arrow (OUTSIDE the images, static icon, green bg + white arrow on hover) -->
      <button
        type="button"
        data-apartments-next
        :aria-label="copy.apartmentsNextLabel"
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
  </section>
</template>
