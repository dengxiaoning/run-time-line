<template>
  <div id="app">
   <testPage />
</div>
</template>

<script>
import testPage from './components/test.vue'

export default {
  name: 'App',
  components: {
    testPage
  }
}
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
