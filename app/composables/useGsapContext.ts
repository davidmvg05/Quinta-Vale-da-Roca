import gsap from 'gsap'
import type { Ref } from 'vue'

export interface GsapMediaConditions {
  reduce: boolean
  motion: boolean
  maxXs: boolean
  maxSm: boolean
  md: boolean
  lg: boolean
  xl: boolean
  xxl: boolean
}

type GsapSetupCallback = (
  ctx: gsap.Context,
  conditions: GsapMediaConditions,
) => void | (() => void)

/**
 * SSR-safe GSAP context & matchMedia composable with automatic cleanup
 * and mandatory prefers-reduced-motion support aligned with the 6 project breakpoints.
 */
export function useGsapContext(
  scope: Ref<HTMLElement | null>,
  setup: GsapSetupCallback,
) {
  let mm: gsap.MatchMedia | undefined

  onMounted(async () => {
    await nextTick()
    if (!scope.value) return

    mm = gsap.matchMedia()
    mm.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        motion: '(prefers-reduced-motion: no-preference)',
        maxXs: '(max-width: 480px)',
        maxSm: '(max-width: 576px)',
        md: '(min-width: 768px)',
        lg: '(min-width: 992px)',
        xl: '(min-width: 1200px)',
        xxl: '(min-width: 1400px)',
      },
      (context) => {
        const conditions = (context.conditions ?? {
          reduce: false,
          motion: true,
          maxXs: false,
          maxSm: false,
          md: true,
          lg: true,
          xl: true,
          xxl: false,
        }) as unknown as GsapMediaConditions

        return setup(context as unknown as gsap.Context, conditions)
      },
      scope.value,
    )
  })

  onBeforeUnmount(() => {
    mm?.revert()
  })

  return {
    revert: () => mm?.revert(),
  }
}
