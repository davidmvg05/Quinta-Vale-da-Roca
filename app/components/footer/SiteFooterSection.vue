<script setup lang="ts">
import { useSiteLocale } from '~/composables/useLocale'
import { useRooms } from '~/composables/useRooms'

const { locale } = useSiteLocale()
const { rooms } = useRooms()

interface FooterLink {
  label: { pt: string; en: string }
  to: string
  external?: boolean
}

const eventLinks: FooterLink[] = [
  {
    label: { pt: 'Casamentos', en: 'Weddings' },
    to: '/contactos?tipo=casamentos',
  },
  {
    label: { pt: 'Aniversários', en: 'Birthdays' },
    to: '/contactos?tipo=aniversarios',
  },
  {
    label: { pt: 'Eventos Corporativos', en: 'Corporate Events' },
    to: '/contactos?tipo=corporativo',
  },
]

const experienceLinks: FooterLink[] = [
  {
    label: { pt: 'Wellness', en: 'Wellness' },
    to: '/wellness',
  },
  {
    label: { pt: 'Atividades na Região', en: 'Regional Activities' },
    to: '/atividades',
  },
]

const aboutLinks: FooterLink[] = [
  {
    label: { pt: 'História do Hotel', en: 'Hotel History' },
    to: '/sobre-nos',
  },
  {
    label: { pt: 'A Nossa Equipa', en: 'Our Team' },
    to: '/sobre-nos#equipa',
  },
  {
    label: { pt: 'Galeria', en: 'Gallery' },
    to: '/galeria',
  },
  {
    label: { pt: 'Localização', en: 'Location' },
    to: '/localizacao',
  },
]

const supportLinks: FooterLink[] = [
  {
    label: { pt: 'Contactos Gerais', en: 'General Contacts' },
    to: '/contactos',
  },
  {
    label: { pt: 'FAQs', en: 'FAQs' },
    to: '/faqs',
  },
]

interface SocialLink {
  name: string
  href: string
  icon: string
  label: { pt: string; en: string }
}

const socialLinks: SocialLink[] = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/quintavaledaroca',
    icon: 'ph:facebook-logo-light',
    label: { pt: 'Facebook da Quinta Vale da Roca', en: 'Quinta Vale da Roca on Facebook' },
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/quintavaledaroca',
    icon: 'ph:instagram-logo-light',
    label: { pt: 'Instagram da Quinta Vale da Roca', en: 'Quinta Vale da Roca on Instagram' },
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/351219281123',
    icon: 'ph:whatsapp-logo-light',
    label: { pt: 'WhatsApp da Quinta Vale da Roca', en: 'Quinta Vale da Roca on WhatsApp' },
  },
  {
    name: 'Telegram',
    href: 'https://t.me/quintavaledaroca',
    icon: 'ph:telegram-logo-light',
    label: { pt: 'Telegram da Quinta Vale da Roca', en: 'Quinta Vale da Roca on Telegram' },
  },
]
</script>

<template>
  <footer
    id="footer"
    data-site-footer
    :aria-label="locale === 'pt' ? 'Rodapé Quinta Vale da Roca' : 'Quinta Vale da Roca Footer'"
    class="relative z-40 w-full bg-[rgba(29,53,27,0.85)] text-[#ffffff] px-4 xs:px-6 sm:px-8 lg:px-12 pt-16 pb-12 md:pt-20 md:pb-16 lg:pt-24 lg:pb-20 border-t border-[rgba(29,53,27,0.85)]"
  >
    <div class="max-w-7xl mx-auto flex flex-col justify-between">
      <!-- Semantic Accessible Landmark Heading -->
      <h2 class="sr-only">
        {{ locale === 'pt' ? 'Navegação de Rodapé' : 'Footer Navigation' }}
      </h2>

      <!-- Main Footer Area (6 Columns) -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-5 sm:gap-x-8 gap-y-10 sm:gap-y-12 lg:gap-6 xl:gap-8 pb-12 md:pb-16">
        <!-- Column 1: Brand & Social -->
        <div class="flex flex-col items-start">
          <NuxtLink
            to="/"
            :aria-label="locale === 'pt' ? 'Quinta Vale da Roca — Página inicial' : 'Quinta Vale da Roca — Home page'"
            class="inline-block mb-6 group focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
          >
            <NuxtImg
              src="/images/logo/logo.png"
              alt=""
              width="267"
              height="271"
              loading="lazy"
              fetchpriority="low"
              class="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-95 transition-opacity group-hover:opacity-100"
            />
          </NuxtLink>

          <h3 class="font-sans text-xs tracking-[0.14em] uppercase font-normal text-[#ffffff]/80 mb-3.5">
            {{ locale === 'pt' ? 'Siga-nos nas redes sociais' : 'Follow us on social media' }}
          </h3>

          <!-- Social Media Icons (Two by two, larger format) -->
          <div class="grid grid-cols-2 gap-2.5 w-fit">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="locale === 'pt' ? `${social.label.pt} (abre num novo separador)` : `${social.label.en} (opens in a new tab)`"
              class="w-12 h-12 rounded-none border border-[#ffffff]/25 bg-clip-padding flex items-center justify-center text-[#ffffff]/85 hover:text-[#ffffff] hover:border-[#ffffff]/60 hover:bg-[#ffffff]/10 transition-colors focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
              style="background-clip: padding-box;"
            >
              <UIcon :name="social.icon" class="h-6 w-6" aria-hidden="true" />
            </a>
          </div>
        </div>

        <!-- Column 2: Apartamentos -->
        <div class="flex flex-col items-start">
          <h3 class="font-sans text-xs tracking-[0.14em] uppercase font-normal text-[#ffffff]/80 mb-4">
            {{ locale === 'pt' ? 'Apartamentos' : 'Apartments' }}
          </h3>
          <ul v-if="rooms && rooms.length" class="space-y-2.5 font-sans text-xs sm:text-sm text-[#ffffff]/90 font-normal">
            <li v-for="room in rooms" :key="room.id">
              <NuxtLink
                :to="`/quartos/${room.slug}`"
                class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
              >
                {{ room.name[locale] }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 3: Eventos -->
        <div class="flex flex-col items-start">
          <h3 class="font-sans text-xs tracking-[0.14em] uppercase font-normal text-[#ffffff]/80 mb-4">
            {{ locale === 'pt' ? 'Eventos' : 'Events' }}
          </h3>
          <ul class="space-y-2.5 font-sans text-xs sm:text-sm text-[#ffffff]/90 font-normal">
            <li v-for="link in eventLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
              >
                {{ link.label[locale] }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 4: Experiências -->
        <div class="flex flex-col items-start">
          <h3 class="font-sans text-xs tracking-[0.14em] uppercase font-normal text-[#ffffff]/80 mb-4">
            {{ locale === 'pt' ? 'Experiências' : 'Experiences' }}
          </h3>
          <ul class="space-y-2.5 font-sans text-xs sm:text-sm text-[#ffffff]/90 font-normal">
            <li v-for="link in experienceLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
              >
                {{ link.label[locale] }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 5: Quinta Vale da Roca -->
        <div class="flex flex-col items-start">
          <h3 class="font-sans text-xs tracking-[0.14em] uppercase font-normal text-[#ffffff]/80 mb-4">
            Quinta Vale da Roca
          </h3>
          <ul class="space-y-2.5 font-sans text-xs sm:text-sm text-[#ffffff]/90 font-normal">
            <li v-for="link in aboutLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
              >
                {{ link.label[locale] }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Column 6: Apoio ao Cliente -->
        <div class="flex flex-col items-start">
          <h3 class="font-sans text-xs tracking-[0.14em] uppercase font-normal text-[#ffffff]/80 mb-4">
            {{ locale === 'pt' ? 'Apoio ao Cliente' : 'Customer Support' }}
          </h3>
          <ul class="space-y-2.5 font-sans text-xs sm:text-sm text-[#ffffff]/90 font-normal">
            <li v-for="link in supportLinks" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
              >
                {{ link.label[locale] }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Sub-Footer (Bottom Bar) -->
      <div class="pt-8 border-t border-[#ffffff]/15 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-xs text-[#ffffff]/80 text-center md:text-left">
        <p>© 2026 Quinta Vale da Roca. All rights reserved.</p>

        <nav :aria-label="locale === 'pt' ? 'Ligações legais' : 'Legal links'" class="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2">
          <NuxtLink
            to="/privacidade"
            class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
          >
            {{ locale === 'pt' ? 'Política de Privacidade' : 'Privacy Policy' }}
          </NuxtLink>
          <NuxtLink
            to="/cookies"
            class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
          >
            {{ locale === 'pt' ? 'Política de Cookies' : 'Cookie Policy' }}
          </NuxtLink>
          <NuxtLink
            to="/termos"
            class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
          >
            {{ locale === 'pt' ? 'Termos & Condições' : 'Terms & Conditions' }}
          </NuxtLink>
          <a
            href="https://www.livroreclamacoes.pt"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="locale === 'pt' ? 'Livro de Reclamações (abre num novo separador)' : 'Complaints Book (opens in a new tab)'"
            class="hover:text-[#ffffff] transition-colors underline-offset-4 hover:underline inline-flex items-center gap-1 focus-visible:outline-1 focus-visible:outline-[#ffffff] focus-visible:outline-offset-2"
          >
            <span>{{ locale === 'pt' ? 'Livro de Reclamações' : 'Complaints Book' }}</span>
            <UIcon name="solar:arrow-right-up-linear" class="w-3.5 h-3.5 opacity-70" aria-hidden="true" />
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>
