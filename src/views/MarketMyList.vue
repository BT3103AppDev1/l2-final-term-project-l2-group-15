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
          <h1>My Listings</h1>
          <div class="create-btn-container">
            <button class="create-group-btn" @click="isOpen = true">Create Listing</button>
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

.nav{
  margin-right: 0.5vh;
  width:50%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.create-btn-container {
  position: relative;
}

.create-group-btn {
  background-color: #007bff; /* Bootstrap primary */
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  color:white;
  border-radius: 5px;
}

.close-btn {
  background-color: #dc3545; /* Bootstrap danger */
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
  padding: 20px;
  border-radius: 5px;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
}

</style>
