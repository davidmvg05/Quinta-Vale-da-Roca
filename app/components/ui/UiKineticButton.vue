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
  to?: string
  href?: string
  type?: 'button' | 'submit' | 'reset'
  ariaLabel?: string
}

const props = withDefaults(defineProps<UiKineticButtonProps>(), {
  variant: 'primary',
  surface: 'dark',
  size: 'md',
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
    return 'bg-[#1D351B] text-[#ffffff] border border-[#1D351B] motion-reduce:hover:bg-[#000000] motion-reduce:hover:border-[#000000]'
  }
  if (props.variant === 'secondary') {
    const textClass =
      props.surface === 'light'
        ? 'text-[#000000]'
        : props.surface === 'vine'
          ? 'text-[#1D351B]'
          : 'text-[#ffffff]'
    return `bg-[#1D351B]/85 backdrop-blur-[2px] border border-[#1D351B] ${textClass} motion-reduce:hover:bg-[#1D351B] motion-reduce:hover:text-[#ffffff]`
  }
  if (props.variant === 'ghost') {
    const textClass =
      props.surface === 'dark'
        ? 'text-[#ffffff] hover:text-[#ffffff]/80'
        : 'text-[#1D351B] hover:text-[#000000]'
    return `bg-transparent ${textClass} border-0 border-transparent`
  }
  return 'bg-transparent text-[#1D351B] border border-[#1D351B] hover:bg-[#1D351B] hover:text-[#ffffff]'
})

const sizeClasses = computed(() => {
  if (props.variant === 'ghost') {
    if (props.size === 'sm') {
      return 'px-1.5 py-1 text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.1em] sm:tracking-[0.12em] whitespace-nowrap'
    }
    if (props.size === 'lg') {
      return 'px-3 md:px-5 py-2 text-xs md:text-sm tracking-[0.18em] whitespace-nowrap'
    }
    return 'px-2 sm:px-2.5 md:px-3.5 lg:px-4 py-1.5 text-[10px] xs:text-[11px] md:text-xs tracking-[0.1em] md:tracking-[0.18em] whitespace-nowrap'
  }
  if (props.size === 'sm') {
    return 'px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2.5 sm:py-1.5 md:px-3.5 md:py-1.5 text-[8.5px] xs:text-[9.5px] sm:text-[10.5px] md:text-xs tracking-[0.08em] xs:tracking-[0.1em] sm:tracking-[0.14em] md:tracking-[0.18em] whitespace-nowrap'
  }
  if (props.size === 'lg') {
    return 'px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3.5 text-[10px] sm:text-xs md:text-[13px] tracking-[0.16em] sm:tracking-[0.2em] md:tracking-[0.22em] whitespace-nowrap'
  }
  return 'px-3 py-1.5 sm:px-5 sm:py-2 md:px-6 md:py-2.5 text-[10px] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] whitespace-nowrap'
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
    class="group relative inline-flex items-center justify-center rounded-none font-sans font-normal uppercase select-none transition-colors duration-300 ease-out focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#1D351B] cursor-pointer overflow-hidden"
    :class="[variantClasses, sizeClasses]"
    @click="handleClick"
  >
    <span class="relative inline-flex overflow-hidden leading-tight py-[3px] -my-[3px]">
      <!-- Primary Label (slides up along Y-axis on hover) -->
      <span
        class="inline-block transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-[180%] group-hover:opacity-0 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:opacity-100 will-change-transform"
      >
        <slot />
      </span>

      <!-- Identical Clone Label (rises from bottom along Y-axis on hover, completely hidden before hover) -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 flex items-center justify-center translate-y-[180%] opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:hidden will-change-transform"
      >
        <slot />
      </span>
    </span>
  </component>
</template>
