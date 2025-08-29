<template>
  <div>
    <Header />
    <Hero />
    <Products />
    <About />
    <Newsletter />
    <Footer />
  </div>
</template>

<script>
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import Products from './components/Products.vue'
import About from './components/About.vue'
import Newsletter from './components/Newsletter.vue'
import Footer from './components/Footer.vue'

export default {
  components: { Header, Hero, Products, About, Newsletter, Footer }
}
</script>
