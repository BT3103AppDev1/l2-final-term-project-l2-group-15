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
      <div v-if="isOpen" class="overlay">
        <div class="modal">
            <button class="close-btn" @click="isOpen = false">Close</button>
            <CreateListing/>
        </div>
      </div>
      <div class="list">
        <div class="list-header">
          <h1>My Listings</h1>
          <div class="create-btn-container">
            <button class="create-group-btn" @click="isOpen = true">Create Listing</button>
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
  padding: 0px;
  margin: 0px;
  display: grid;
  grid-template-columns: 3fr 35fr;
}

.nav{
  margin-right: 0.5vh;
  width: 50%;
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


.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* ensure it's above other content */
}

.modal {
  position: relative;
  width: 80%; /* adjustable based on your preference */
  max-width: 600px; /* max width for larger screens */
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto; /* makes modal content scrollable */
  max-height: 90%; /* limits the modal height to encourage scrolling */
}

.modal-content {
  position: relative;
  overflow-y: auto; /* ensure scrollability of content within modal if needed */
}

</style>
