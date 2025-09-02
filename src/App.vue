<template>
  <Analytics />
  <div>
    <Header />
    <Hero />
    <Products />
    <About />
    <Newsletter />
    <Footer />
    <ChatRobot />
  </div>
</template>

<script setup>
import { Analytics } from '@vercel/analytics/vue';
</script>
 
<template>
  <Analytics />
  <!-- your content -->
</template>

<script>
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import Products from './components/Products.vue'
import About from './components/About.vue'
import Newsletter from './components/Newsletter.vue'
import Footer from './components/Footer.vue'
import ChatRobot from './components/ChatRobot.vue'

export default {
  components: { Header, Hero, Products, About, Newsletter, Footer, ChatRobot }
}
</script>