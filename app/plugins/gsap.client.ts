import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

export default defineNuxtPlugin(() => {
  gsap.registerPlugin(ScrollTrigger, Flip)
  gsap.defaults({
    ease: 'power3.out',
    duration: 1,
  })
  ScrollTrigger.config({
    ignoreMobileResize: true,
  })

  return {
    provide: {
      gsap,
      ScrollTrigger,
      Flip,
    },
  }
})
