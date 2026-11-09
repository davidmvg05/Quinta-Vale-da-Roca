<script setup lang="ts">
import gsap from 'gsap'
import { ref } from 'vue'
import { useSiteLocale } from '~/composables/useLocale'
import { useShop, type ShopProduct } from '~/composables/useShop'
import { useGsapContext } from '~/composables/useGsapContext'

const { locale, copy } = useSiteLocale()
const { products } = useShop()

const sectionRef = ref<HTMLElement | null>(null)

function handleAddToCart(product: ShopProduct) {
  // Direct interaction feedback / toast or navigation to shop checkout
  navigateTo(`/loja?produto=${product.id}`)
}

useGsapContext(sectionRef, (_ctx, conditions) => {
  const sectionEl = sectionRef.value
  if (!sectionEl) return

  const revealTargets = sectionEl.querySelectorAll('[data-shop-reveal]')

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
    id="loja"
    ref="sectionRef"
    data-shop-section
    aria-labelledby="shop-heading"
    class="relative z-40 w-full bg-[#ffffff] px-3 xs:px-[5vw] pt-12 pb-20 md:pt-16 md:pb-28 lg:pt-20 lg:pb-32 text-[#1D351B] scroll-mt-14 md:scroll-mt-16 lg:scroll-mt-20 overflow-x-clip"
  >
    <!-- Section Header Row: Title "Loja" on the left -->
    <div
      data-shop-reveal
      class="mb-8 md:mb-12 lg:mb-14 flex items-end justify-between"
    >
      <h2
        id="shop-heading"
        data-shop-title
        class="font-display text-4xl max-xs:text-3xl md:text-5xl lg:text-6xl font-normal tracking-[0.02em] leading-none text-[#1D351B]"
      >
        {{ copy.shopTitle }}
      </h2>
    </div>

    <!-- Product Showcase Grid: 3 Wine Cards (Title above, photo center, price below, visible Add to Cart button) -->
    <div
      data-shop-reveal
      class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full max-w-6xl mx-auto items-stretch"
    >
      <article
        v-for="product in products"
        :key="product.id"
        :data-product-id="product.id"
        data-shop-card
        class="group/card relative flex flex-col w-full h-full text-left rounded-none bg-[#ffffff]"
      >
        <!-- Product Title Above Photo -->
        <h3
          data-shop-product-title
          class="mb-2.5 sm:mb-3 font-display text-xl sm:text-2xl lg:text-[1.5rem] font-normal tracking-[0.02em] leading-tight text-[#1D351B] uppercase w-full text-left"
        >
          {{ product.name[locale] }}
        </h3>

        <!-- Product Photo in Center (Vertical Aspect Ratio aspect-[3/4], sharp 90-degree corners) -->
        <figure
          class="relative aspect-[3/4] max-h-[360px] sm:max-h-[400px] md:max-h-[440px] lg:max-h-[460px] w-full overflow-hidden rounded-none bg-[#F8F9F6] flex items-center justify-center p-4 sm:p-6"
        >
          <NuxtImg
            :src="product.image"
            :alt="product.name[locale]"
            width="1024"
            height="1536"
            loading="lazy"
            fetchpriority="low"
            decoding="async"
            class="h-full w-full object-contain object-center rounded-none select-none transition-transform duration-500 ease-out group-hover/card:scale-105 motion-reduce:transition-none motion-reduce:group-hover/card:scale-100"
          />
        </figure>

        <!-- Product Details Column Below Photo -->
        <div class="mt-4 flex flex-col flex-1">
          <!-- Price Below Photo -->
          <div class="flex items-baseline gap-2 mb-3">
            <span
              class="font-display text-2xl sm:text-3xl font-medium tracking-tight text-[#1D351B]"
            >
              {{ product.price }}
            </span>
            <span
              class="font-sans text-xs sm:text-sm text-[#1D351B]/70 font-normal"
            >
              {{ copy.perBottle }}
            </span>
          </div>

          <!-- Always Visible Style 1 Primary Button with Cart Icon Before Word (width="full", sharp 90-degree corners) -->
          <div
            class="mt-3 sm:mt-3.5 w-full min-h-[36px] md:min-h-[40px] flex items-center"
          >
            <UiKineticButton
              variant="primary"
              size="md"
              width="full"
              :aria-label="`${copy.addToCart}: ${product.name[locale]}`"
              class="w-full opacity-100 pointer-events-auto cursor-pointer"
              @click="handleAddToCart(product)"
            >
              <span class="inline-flex items-center justify-center gap-2">
                <UIcon
                  name="solar:cart-large-minimalistic-linear"
                  class="h-4 w-4 shrink-0 pointer-events-none"
                  aria-hidden="true"
                />
                <span>{{ copy.addToCart }}</span>
              </span>
            </UiKineticButton>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
