<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
</script>

<template>
  <body>
      <Navbar_global />
      <div class="container">
        <div class="nav">
          <NavBar_market />
        </div>
        <div class="list">
          <br/>
          <h1> DealReq </h1>
        </div>
      </div>
  </body>
</template>

<script>
</script>


<style scoped>

.container {
  padding:0px;
  margin: 0px;
  display:flex;
}

.list {
  width: 100%;
}

.nav{
  margin-right: 0.5vh;
  width:8%;
}
</style>