<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import CreateListing from '@/mComponents/CreateListing.vue'
  import MyListing from '@/mComponents/MyListing.vue'
</script>

<template>
  <div>
    <!-- Global Navbar -->
    <div class="navbar-global">
      <Navbar_global />
    </div>
    <!-- Market Navbar -->
    <div class="navbar-market">
      <NavBar_market />
    </div>

    <!-- Modal -->
    <div v-if="isOpen" class="modal-overlay">
      <div class="modal">
        <button class="close-btn" @click="isOpen = false">Close</button>
        <br/>
        <br/>
        <CreateListing/>
      </div>
    </div>

    <!-- Main Content -->
    <body>
      <div class="container">
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
  </div>
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
/* Global Navbar */
.navbar-global {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure it's above other content */
}

/* Market Navbar */
.navbar-market {
  position: fixed;
  top: 65px; 
  left: 0;
  width: 10px; 
  height: 100%;
  z-index: 1; 
}

.container {
  padding-top: 0px; 
  padding-left: 100px; 
  padding-right: 20px; 
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
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