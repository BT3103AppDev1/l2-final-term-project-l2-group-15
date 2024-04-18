<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import CreateListing from '@/mComponents/CreateListing.vue'
  import MyListing from '@/mComponents/MyListing.vue'
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
              <h1>My Listings</h1>
              <button class="create-group-btn" @click="isOpen = true">Create Item</button>
              <div v-if="isOpen" class="modal">
                <div class="modal-content">
                  <button class="close-btn" @click="isOpen = false">Close</button>
                  <br/>
                  <br>
                  <CreateListing/>
                 </div>
              </div>
            </div>
          </div>
          <MyListing/>
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

.create-group-btn {
  background-color: #007bff; /* Bootstrap primary */
  justify-content: flex-end;
  height: 50px;
  align-content: end;
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  color:white;
  border-radius: 5px;
  position: absolute;
  top: 6vh;
  right: 2vh;
}

.btn-container {
  display: flex;
  justify-content: space-between;
}

.close-btn {
  background-color: #dc3545; /* Bootstrap danger */
}

</style>