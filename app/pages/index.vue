<script setup lang="ts">
import EventsSection from '~/components/events/EventsSection.vue'
import WineExperiencesSection from '~/components/wine/WineExperiencesSection.vue'
import ShopSection from '~/components/shop/ShopSection.vue'
import SiteFooterSection from '~/components/footer/SiteFooterSection.vue'

useSeoMeta({
  title: 'Quinta Vale da Roca — Hotel & Experiências Vínicas em Sintra',
  description:
    'Entre a serra de Sintra e o Atlântico, descubra o refúgio de enoturismo, alojamento boutique e vinhos de carácter único da Quinta Vale da Roca.',
  ogTitle: 'Quinta Vale da Roca — Hotel & Experiências Vínicas',
  ogDescription:
    'Enoturismo, natureza e luxo sereno em Sintra. Alojamento boutique e vinhos de colheita própria.',
  ogImage: '/images/brand/vdr-social-sharing.jpg',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <main class="min-h-dvh w-full bg-[#ffffff]">
    <HeroEntranceSection />
    <RoomsApartmentsSection />
    <EventsSection />
    <WineExperiencesSection />
    <ShopSection />
    <SiteFooterSection />
  </main>
</template>

