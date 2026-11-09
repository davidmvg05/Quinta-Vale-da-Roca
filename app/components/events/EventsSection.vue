<script setup lang="ts">
import gsap from 'gsap'
import { ref, computed } from 'vue'
import { useSiteLocale } from '~/composables/useLocale'
import { useEvents, type EventCatalogItem } from '~/composables/useEvents'
import { useGsapContext } from '~/composables/useGsapContext'

const { locale, copy } = useSiteLocale()
const { events } = useEvents()

const sectionRef = ref<HTMLElement | null>(null)

// Current ordered list of events representing positions 1, 2, and 3
const orderedEvents = ref<EventCatalogItem[]>([...events.value])

const defaultEvent = events.value[0] as EventCatalogItem

// The active event is strictly the one at Position 1 (index 0)
const currentEvent = computed<EventCatalogItem>(() => {
  return orderedEvents.value[0] ?? defaultEvent
})

const slot1Event = computed<EventCatalogItem>(() => {
  return orderedEvents.value[0] ?? defaultEvent
})
const slot2Event = computed<EventCatalogItem>(() => {
  return orderedEvents.value[1] ?? defaultEvent
})
const slot3Event = computed<EventCatalogItem>(() => {
  return orderedEvents.value[2] ?? defaultEvent
})

// Transition throttle lock to safeguard against rapid click racing conditions
const isRotating = ref(false)

/**
 * Forward rotation:
 * Image 1 moves to position 3 via clean fade.
 * Image 2 moves to position 1 seamlessly without jumping/sliding.
 * Image 3 moves to position 2 via fade.
 */
function nextEvent() {
  if (isRotating.value || orderedEvents.value.length < 2) return
  isRotating.value = true

  const first = orderedEvents.value[0]
  if (!first) {
    isRotating.value = false
    return
  }
  const rest = orderedEvents.value.slice(1)
  orderedEvents.value = [...rest, first]

  setTimeout(() => {
    isRotating.value = false
  }, 400)
}

/**
 * Backward rotation:
 * Image 3 moves to position 1 seamlessly without jumping/sliding.
 * Image 1 moves to position 2 via fade.
 * Image 2 moves to position 3 via fade.
 */
function prevEvent() {
  if (isRotating.value || orderedEvents.value.length < 2) return
  isRotating.value = true

  const last = orderedEvents.value[orderedEvents.value.length - 1]
  if (!last) {
    isRotating.value = false
    return
  }
  const initial = orderedEvents.value.slice(0, -1)
  orderedEvents.value = [last, ...initial]

  setTimeout(() => {
    isRotating.value = false
  }, 400)
}

function handleCardClick(index: number) {
  if (index === 1) {
    nextEvent()
  } else if (index === 2) {
    prevEvent()
  }
}

/**
 * Stepped card classes calibrated to match the natural portrait 3:4 aspect ratio.
 * Fixed slot dimensions anchor the carousel track so navigation arrows never move or shift.
 * Position 1 (Active, largest) matching apartment images format/size.
 * Position 2 (medium) and Position 3 (smallest) decrease proportionally in 3:4 aspect ratio.
 * 100% sharp and visible across all viewports with zero clipping or mask fade.
 */
function getSlotClasses(index: number) {
  if (index === 0) {
    // Position 1 (Active): Largest card with 3:4 format/size matching apartment images
    return [
      'h-[132px] xs:h-[200px] sm:h-[240px] md:h-[280px] lg:h-[280px] xl:h-[360px] 2xl:h-[420px]',
      'w-[99px] xs:w-[150px] sm:w-[180px] md:w-[210px] lg:w-[210px] xl:w-[270px] 2xl:w-[315px]',
      'shrink-0 opacity-100 z-20 cursor-default border-0 ring-0 outline-none shadow-none',
    ]
  }
  if (index === 1) {
    // Position 2: Medium card, proportionally stepped down (~67%-70% of Position 1) in 3:4 ratio
    return [
      'h-[88px] xs:h-[140px] sm:h-[168px] md:h-[192px] lg:h-[188px] xl:h-[240px] 2xl:h-[280px]',
      'w-[66px] xs:w-[105px] sm:w-[126px] md:w-[144px] lg:w-[141px] xl:w-[180px] 2xl:w-[210px]',
      'shrink-0 opacity-100 z-10 hover:opacity-95 cursor-pointer border-0 ring-0 outline-none shadow-none',
    ]
  }
  // Position 3: Smallest card, proportionally stepped down (~40%-43% of Position 1) in 3:4 ratio, 100% visible & sharp
  return [
    'h-[56px] xs:h-[84px] sm:h-[104px] md:h-[120px] lg:h-[112px] xl:h-[144px] 2xl:h-[168px]',
    'w-[42px] xs:w-[63px] sm:w-[78px] md:w-[90px] lg:w-[84px] xl:w-[108px] 2xl:w-[126px]',
    'shrink-0 opacity-100 z-0 hover:opacity-95 cursor-pointer border-0 ring-0 outline-none shadow-none',
  ]
}

useGsapContext(sectionRef, (_ctx, conditions) => {
  const sectionEl = sectionRef.value
  if (!sectionEl) return

  const revealTargets = sectionEl.querySelectorAll('[data-events-reveal]')

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
    id="eventos"
    ref="sectionRef"
    data-events-section
    aria-labelledby="events-heading"
    class="relative z-40 w-full bg-[#ffffff] px-3 xs:px-[5vw] pt-12 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32 text-[#1D351B] scroll-mt-14 md:scroll-mt-16 lg:scroll-mt-20 overflow-x-clip"
  >
    <!-- Section Header Row: Title "Eventos" on the left, strictly aligned with "APARTAMENTOS" -->
    <div
      data-events-reveal
      class="mb-8 md:mb-12 lg:mb-14 flex items-end justify-between"
    >
      <h2
        id="events-heading"
        data-events-title
        class="font-display text-4xl max-xs:text-3xl md:text-5xl lg:text-6xl font-normal tracking-[0.02em] leading-none text-[#1D351B]"
      >
        {{ copy.eventsTitle }}
      </h2>
    </div>

    <!-- Main Editorial Row: Left Details + Right Carousel Track (full width, flush left with heading) -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-6 xl:gap-8 2xl:gap-10 items-center w-full"
    >
      <!-- Left Column: Active Event Title, Description, and Style 1 Button (Size lg, Uniform width) -->
      <div
        data-events-reveal
        class="lg:col-span-4 xl:col-span-4 2xl:col-span-4 flex flex-col items-start justify-center text-left min-h-[220px] xs:min-h-[230px] sm:min-h-[240px] md:min-h-[250px] lg:min-h-[270px]"
      >
        <Transition mode="out-in" name="event-content">
          <div :key="currentEvent.id" class="flex flex-col items-start w-full">
            <!-- Event Title -->
            <h3
              data-events-item-title
              class="font-display text-3xl max-xs:text-2xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-normal tracking-[0.02em] leading-[1.1] text-[#1D351B]"
            >
              {{ currentEvent.title[locale] }}
            </h3>

            <!-- Event Description -->
            <p
              class="font-sans text-sm sm:text-base md:text-lg text-[#1D351B]/80 font-normal leading-relaxed mt-4 md:mt-6 mb-8 md:mb-10 max-w-lg"
            >
              {{ currentEvent.description[locale] }}
            </p>

            <!-- Style 1 (Primary) Button, Size lg, with Uniform Geometric Width -->
            <div>
              <UiKineticButton
                variant="primary"
                size="lg"
                width="uniform"
                :to="currentEvent.href"
                :aria-label="`${currentEvent.title[locale]}: ${currentEvent.ctaText[locale]}`"
              >
                {{ currentEvent.ctaText[locale] }}
              </UiKineticButton>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Right Column: Left Arrow + 3 Decreasing Vertical Images + Right Arrow -->
      <div
        data-events-reveal
        class="lg:col-span-8 xl:col-span-8 2xl:col-span-8 flex items-center justify-center lg:justify-end gap-1 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-2 xl:gap-3 2xl:gap-3 w-full"
      >
        <!-- Left Arrow (outside the images, stationary anchor, green bg on hover) -->
        <button
          type="button"
          data-events-prev
          :aria-label="copy.eventsPrevLabel"
          class="shrink-0 inline-flex h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-10 lg:w-10 xl:h-11 xl:w-11 items-center justify-center rounded-none border border-[#1D351B] bg-[#ffffff] text-[#1D351B] transition-colors duration-300 hover:bg-[#1D351B] hover:text-[#ffffff] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#1D351B] cursor-pointer"
          @click="prevEvent"
          @keydown.left.prevent="prevEvent"
          @keydown.right.prevent="nextEvent"
        >
          <UIcon
            name="solar:arrow-left-linear"
            class="h-4 w-4 md:h-5 md:w-5 pointer-events-none"
            aria-hidden="true"
          />
        </button>

        <!-- Carousel Track Wrapper: fixed dimensions ensure navigation arrows remain completely stationary -->
        <div
          class="relative flex items-center justify-center shrink-0 w-[223px] xs:w-[338px] sm:w-[408px] md:w-[472px] lg:w-[455px] xl:w-[586px] 2xl:w-[679px] h-[132px] xs:h-[200px] sm:h-[240px] md:h-[280px] lg:h-[280px] xl:h-[360px] 2xl:h-[420px] overflow-visible"
        >
          <div
            class="events-carousel-track flex items-center justify-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5 lg:gap-2.5 xl:gap-3.5 2xl:gap-3.5 w-full h-full"
          >
            <!-- Slot 1 (Position 1: Active, largest) - seamless placement without jump/slide animation -->
            <article
              data-position="1"
              :data-event-id="slot1Event.id"
              class="event-card group/card relative overflow-hidden rounded-none select-none border-0 ring-0 outline-none shadow-none"
              :class="getSlotClasses(0)"
              :aria-label="`${slot1Event.title[locale]} - Posição 1 (Ativo)`"
              tabindex="0"
              @keydown.left.prevent="prevEvent"
              @keydown.right.prevent="nextEvent"
            >
              <figure class="relative w-full h-full overflow-hidden rounded-none bg-[#F8F9F6] border-0 ring-0 outline-none shadow-none">
                <NuxtImg
                  :src="slot1Event.image"
                  :alt="slot1Event.alt[locale]"
                  width="800"
                  height="1200"
                  loading="lazy"
                  fetchpriority="low"
                  decoding="async"
                  class="h-full w-full rounded-none object-cover object-center border-0 ring-0 outline-none shadow-none"
                />
              </figure>
            </article>

            <!-- Slot 2 (Position 2: Medium) - smoothly transitions via subtle fade -->
            <article
              data-position="2"
              :data-event-id="slot2Event.id"
              class="event-card group/card relative overflow-hidden rounded-none select-none border-0 ring-0 outline-none shadow-none"
              :class="getSlotClasses(1)"
              :aria-label="`${slot2Event.title[locale]} - Posição 2`"
              tabindex="0"
              @click="handleCardClick(1)"
              @keydown.enter="handleCardClick(1)"
              @keydown.space.prevent="handleCardClick(1)"
              @keydown.left.prevent="prevEvent"
              @keydown.right.prevent="nextEvent"
            >
              <div class="relative w-full h-full overflow-hidden rounded-none bg-[#F8F9F6] border-0 ring-0 outline-none shadow-none">
                <Transition name="slot-fade">
                  <figure
                    :key="slot2Event.id"
                    class="relative w-full h-full overflow-hidden rounded-none border-0 ring-0 outline-none shadow-none"
                  >
                    <NuxtImg
                      :src="slot2Event.image"
                      :alt="slot2Event.alt[locale]"
                      width="800"
                      height="1200"
                      loading="lazy"
                      fetchpriority="low"
                      decoding="async"
                      class="h-full w-full rounded-none object-cover object-center border-0 ring-0 outline-none shadow-none"
                    />
                  </figure>
                </Transition>
              </div>
            </article>

            <!-- Slot 3 (Position 3: Smallest, 100% visible & sharp) - receives position 1 via fade -->
            <article
              data-position="3"
              :data-event-id="slot3Event.id"
              class="event-card group/card relative overflow-hidden rounded-none select-none border-0 ring-0 outline-none shadow-none"
              :class="getSlotClasses(2)"
              :aria-label="`${slot3Event.title[locale]} - Posição 3`"
              tabindex="0"
              @click="handleCardClick(2)"
              @keydown.enter="handleCardClick(2)"
              @keydown.space.prevent="handleCardClick(2)"
              @keydown.left.prevent="prevEvent"
              @keydown.right.prevent="nextEvent"
            >
              <div class="relative w-full h-full overflow-hidden rounded-none bg-[#F8F9F6] border-0 ring-0 outline-none shadow-none">
                <Transition name="slot-fade">
                  <figure
                    :key="slot3Event.id"
                    class="relative w-full h-full overflow-hidden rounded-none border-0 ring-0 outline-none shadow-none"
                  >
                    <NuxtImg
                      :src="slot3Event.image"
                      :alt="slot3Event.alt[locale]"
                      width="800"
                      height="1200"
                      loading="lazy"
                      fetchpriority="low"
                      decoding="async"
                      class="h-full w-full rounded-none object-cover object-center border-0 ring-0 outline-none shadow-none"
                    />
                  </figure>
                </Transition>
              </div>
            </article>
          </div>
        </div>

        <!-- Right Arrow (outside the images, stationary anchor, green bg on hover) -->
        <button
          type="button"
          data-events-next
          :aria-label="copy.eventsNextLabel"
          class="shrink-0 inline-flex h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 lg:h-10 lg:w-10 xl:h-11 xl:w-11 items-center justify-center rounded-none border border-[#1D351B] bg-[#ffffff] text-[#1D351B] transition-colors duration-300 hover:bg-[#1D351B] hover:text-[#ffffff] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#1D351B] cursor-pointer"
          @click="nextEvent"
          @keydown.left.prevent="prevEvent"
          @keydown.right.prevent="nextEvent"
        >
          <UIcon
            name="solar:arrow-right-linear"
            class="h-4 w-4 md:h-5 md:w-5 pointer-events-none"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slot-fade-enter-active {
  transition: opacity 0.35s ease-out;
}

.slot-fade-leave-active {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: opacity 0.35s ease-in;
  pointer-events: none;
}

.slot-fade-enter-from,
.slot-fade-leave-to {
  opacity: 0;
}

.event-content-enter-active,
.event-content-leave-active {
  transition: opacity 0.22s ease-out, transform 0.22s ease-out;
}

.event-content-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.event-content-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (prefers-reduced-motion: reduce) {
  .slot-fade-enter-active,
  .slot-fade-leave-active,
  .event-content-enter-active,
  .event-content-leave-active {
    transition: none !important;
    transform: none !important;
  }
}
</style>
