<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

export interface UiKineticButtonProps {
  /**
   * Button visual style defined in design-system.md & GEMINI.md:
   * - 'primary' (Style 1): Solid #1D351B background (100%), 1px #1D351B border, #ffffff text. On hover: Y-axis word transition.
   * - 'secondary' (Style 2): Translucent 85% #1D351B background (rgba(29, 53, 27, 0.85)), 1px #1D351B border. On hover: Y-axis word transition.
   * - 'outline' (Style 3): Transparent background, 1px #1D351B border, #1D351B text. On hover: text turns #ffffff over #1D351B and animates in Y.
   */
  variant?: 'primary' | 'secondary' | 'outline'
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
    return 'bg-[#1D351B] text-[#ffffff] border-[#1D351B] motion-reduce:hover:bg-[#000000] motion-reduce:hover:border-[#000000]'
  }
  if (props.variant === 'secondary') {
    const textClass =
      props.surface === 'light'
        ? 'text-[#000000]'
        : props.surface === 'vine'
          ? 'text-[#1D351B]'
          : 'text-[#ffffff]'
    return `bg-[#1D351B]/85 backdrop-blur-[2px] border-[#1D351B] ${textClass} motion-reduce:hover:bg-[#1D351B] motion-reduce:hover:text-[#ffffff]`
  }
  return 'bg-transparent text-[#1D351B] border-[#1D351B] hover:bg-[#1D351B] hover:text-[#ffffff]'
})

const sizeClasses = computed(() => {
  if (props.size === 'sm') {
    return 'px-4 py-2 text-[11px] tracking-[0.18em]'
  }
  if (props.size === 'lg') {
    return 'px-8 py-3.5 text-xs md:text-[13px] tracking-[0.22em]'
  }
  return 'px-6 py-2.5 text-xs tracking-[0.2em]'
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
    class="group relative inline-flex items-center justify-center rounded-none border font-sans font-normal uppercase select-none transition-colors duration-300 ease-out focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#ffffff] cursor-pointer"
    :class="[variantClasses, sizeClasses]"
    @click="handleClick"
  >
    <span class="relative inline-flex overflow-hidden leading-tight">
      <!-- Primary Label (slides up along Y-axis on hover) -->
      <span
        class="inline-block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      >
        <slot />
      </span>

      <!-- Identical Clone Label (rises from bottom along Y-axis on hover) -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 flex items-center justify-center translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 motion-reduce:hidden"
      >
        <slot />
      </span>
    </span>
  </component>
</template>
