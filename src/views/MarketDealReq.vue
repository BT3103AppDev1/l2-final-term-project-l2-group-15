<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import DealReqListing from '@/mComponents/DealReqListings.vue'
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
            <div class="create-btn-container">
              <h1>View Deal Requests</h1>
            </div>
          </div>
          <DealReqListing/>
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

.create-btn-container {
  display: flex;
  align-items: center;
}

.nav{
  margin-right: 0.5vh;
  width:50%;
}
</style>