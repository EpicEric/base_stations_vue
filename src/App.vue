<template>
  <div id="app">
    <div id="nav">
      <Header />
      <Content />
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Content from '@/components/Content'

export default {
  components: {
    Header,
    Footer,
    Content
  }
}
</script>
