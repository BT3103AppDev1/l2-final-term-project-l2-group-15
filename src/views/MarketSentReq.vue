<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import SentListing from '@/mComponents/SentListings.vue'
</script>

<template>
  <body>
      <Navbar_global />
      <div class="container">
        <div class="nav">
          <NavBar_market />
        </div>
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
  padding:0px;
  margin: 0px;
  display: grid;
  grid-template-columns: 3fr 35fr;
}


.list {
  width: 100%;
  margin:auto;
}

.list-header {
  margin-left: 1.5vh;
}


.nav{
  margin-right: 0.5vh;
  width:50%;
}

</style>