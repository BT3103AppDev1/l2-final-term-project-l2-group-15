<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import SentListing from '@/mComponents/SentListings.vue'
</script>

<template>
  <body>
      <div class="global-nav">
        <Navbar_global />
      </div>

      <div class="nav">
          <NavBar_market />
      </div>
      <div class="container">
        <div class="list">
          <div class="list-header">
            <h1>Sent Requests</h1>
          </div>
          <SentListing/>
        </div>
      </div>
  </body>
</template>



<script>
export default {

  data() {
    return {
      isOpen:false,
    }
  }
}
</script>


<style scoped>

.container {
  padding: 0;
  margin-left: 100px;
  margin-top:67px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
}

.list {
  width: 85%; 
}

img {
  padding-top: 25px;
  max-width: 100px;
}

.nav {
  width: 15%; 
  position: fixed;
  border-top: 66px;
  overflow-y: auto;
}

.global-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

</style>