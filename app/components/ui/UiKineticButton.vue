<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

export interface UiKineticButtonProps {
  /**
   * Button visual style defined in design-system.md & GEMINI.md:
   * - 'primary' (Style 1): Solid #1D351B background (100%), 1px #1D351B border, #ffffff text. On hover: Y-axis word transition.
   * - 'secondary' (Style 2): Translucent 85% #1D351B background (rgba(29, 53, 27, 0.85)), 1px #1D351B border. On hover: Y-axis word transition.
   * - 'outline' (Style 3): Transparent background, 1px #1D351B border, #1D351B text. On hover: text turns #ffffff over #1D351B and animates in Y.
   * - 'ghost': Transparent background, no border lines, #1D351B text for sticky header over white Section 2.
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  /**
   * Surface context for 'secondary' (85% opacity) buttons:
   * - 'dark' (over video/imagery): crisp #ffffff text for WCAG AA contrast.
   * - 'light' (over off-white/paper): #000000 text.
   * - 'vine': #1D351B text.
   */
  surface?: 'dark' | 'light' | 'vine'
  size?: 'sm' | 'md' | 'lg'
  width?: 'uniform' | 'full'
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

const props = withDefaults(defineProps<UiKineticButtonProps>(), {
  variant: 'primary',
  surface: 'dark',
  size: 'md',
  width: 'uniform',
  to: undefined,
  href: undefined,
  type: 'button',
  ariaLabel: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const componentTag = computed(() => {
  if (props.to || props.href) return NuxtLink
  return 'button'
})

const variantClasses = computed(() => {
  if (props.variant === 'primary') {
    return 'kinetic-variant-primary motion-reduce:hover:bg-[#000000] motion-reduce:hover:border-[#000000]'
  }
  if (props.variant === 'secondary') {
    const textClass =
      props.surface === 'light'
        ? 'text-[#000000]'
        : props.surface === 'vine'
          ? 'text-[#1D351B]'
          : 'text-[#ffffff]'
    return `kinetic-variant-secondary ${textClass} motion-reduce:hover:bg-[#1D351B] motion-reduce:hover:text-[#ffffff]`
  }
  if (props.variant === 'ghost') {
    const textClass =
      props.surface === 'dark'
        ? 'text-[#ffffff] hover:text-[#ffffff]/80'
        : 'text-[#1D351B] hover:text-[#000000]'
    return `bg-transparent ${textClass} border-0 border-transparent`
  }
  return 'kinetic-variant-outline hover:bg-[#1D351B] hover:text-[#ffffff]'
})

const sizeClasses = computed(() => {
  if (props.variant === 'ghost') {
    if (props.size === 'sm') {
      return 'px-1.5 py-0.5 text-[8.5px] xs:text-[9px] sm:text-[10px] md:text-xs tracking-[0.1em] whitespace-nowrap'
    }
    if (props.size === 'lg') {
      return 'px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 text-xs md:text-sm tracking-[0.18em] whitespace-nowrap'
    }
    return 'px-2 py-1 xs:px-2.5 xs:py-1 sm:px-3.5 sm:py-1.5 md:px-4 md:py-2 text-[8.5px] xs:text-[9.5px] sm:text-[10px] md:text-xs tracking-[0.14em] md:tracking-[0.18em] whitespace-nowrap'
  }

  // size="sm": Reserved for tags and non-button labels
  if (props.size === 'sm') {
    return 'px-2 py-0.5 text-[7.5px] xs:text-[8px] sm:text-[8.5px] md:text-[9px] lg:text-[9.5px] tracking-[0.06em] xs:tracking-[0.08em] font-normal uppercase whitespace-nowrap'
  }

  // size="lg": Buttons on individual pages needing maximum prominence (e.g. room booking CTA, checkout submit)
  if (props.size === 'lg') {
    return 'px-4 py-2 xs:px-4.5 xs:py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-3.5 2xl:px-9 2xl:py-4 text-[10.5px] xs:text-[11px] sm:text-xs md:text-xs lg:text-[13px] xl:text-sm 2xl:text-base tracking-[0.1em] sm:tracking-[0.12em] md:tracking-[0.14em] lg:tracking-[0.16em] xl:tracking-[0.18em] 2xl:tracking-[0.2em] whitespace-nowrap font-normal'
  }

  // size="md" (Default): Standard interactive buttons across the site
  // Calibrated font scale and letter-spacing to ensure long words ("CONTACTOS", "SOBRE NÓS") breathe freely without clipping
  return 'px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 lg:px-3.5 lg:py-2 xl:px-4 xl:py-2 2xl:px-5 2xl:py-2.5 text-[8px] max-xs:text-[7.5px] xs:text-[8.5px] sm:text-[9px] md:text-[10.5px] lg:text-[11px] xl:text-[11.5px] 2xl:text-xs tracking-[0.05em] xs:tracking-[0.06em] sm:tracking-[0.08em] md:tracking-[0.09em] lg:tracking-[0.1em] xl:tracking-[0.12em] 2xl:tracking-[0.14em] whitespace-nowrap'
})

const widthClasses = computed(() => {
  if (props.width === 'full') {
    return 'w-full justify-center text-center'
  }
  // 'uniform' (Default for all buttons): Standardized rectangular min-width across media queries
  // Ensures paired buttons have identical footprints while safeguarding against text truncation
  if (props.size === 'sm') {
    return 'min-w-[64px] xs:min-w-[72px] sm:min-w-[84px] md:min-w-[96px] justify-center text-center'
  }
  if (props.size === 'lg') {
    return 'min-w-[120px] xs:min-w-[140px] sm:min-w-[160px] md:min-w-[180px] lg:min-w-[200px] xl:min-w-[220px] justify-center text-center'
  }
  // size="md" (Standard)
  return 'min-w-[68px] max-xs:min-w-[62px] xs:min-w-[74px] sm:min-w-[90px] md:min-w-[124px] lg:min-w-[134px] xl:min-w-[142px] 2xl:min-w-[148px] justify-center text-center'
})

function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>

<template>
  <component
    :is="componentTag"
    :to="to"
    :href="href"
    :type="!to && !href ? type : undefined"
    :aria-label="ariaLabel"
    class="kinetic-btn rounded-none font-sans font-normal uppercase select-none transition-colors duration-300 ease-out focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#1D351B] overflow-hidden"
    :class="[variantClasses, sizeClasses, widthClasses]"
    @click="handleClick"
  >
    <span class="kinetic-inner">
      <!-- Primary Label (slides up along Y-axis on hover) -->
      <span class="kinetic-word-primary">
        <slot />
      </span>

      <!-- Identical Clone Label (rises from bottom along Y-axis on hover, completely hidden before hover) -->
      <span aria-hidden="true" class="kinetic-word-clone">
        <slot />
      </span>
    </span>
  </component>
</template>
