<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import CreateListing from '@/mComponents/CreateListing.vue'
  import MyListing from '@/mComponents/MyListing.vue'
  import MarketSuccess from '@/mComponents/MarketSuccess.vue'
  
</script>

<template>
  <div>
    <div class="navbar-global">
      <Navbar_global />
    </div>
    <div class="navbar-market">
      <NavBar_market />
    </div>

    <div v-if="isOpen" class="modal-overlay">
      <div class="modal">
        <button class="close-btn" @click="isOpen = false">Close</button>
        <br/>
        <br/>
        <CreateListing @open="toggleSuccess"/>
      </div>
    </div>
    <body>
      <div v-if="showSuccess" class="success">
        <MarketSuccess :message="message" @close="toggleSuccessClose"/>
      </div>

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
  components: {
    Navbar_global,
    NavBar_market,
    CreateListing,
    MyListing,
    MarketSuccess,
    },

  data() {
    return {
      isOpen:false,
      message: 'Item Created',
      showSuccess: false
    }
  },

  methods: {
      toggleSuccessClose() {
        this.showSuccess = !this.showSuccess
        this.$router.push({ name: 'MarketplaceViewItems'})
      },

      toggleSuccess() {
        this.isOpen = false
        this.showSuccess = !this.showSuccess
      },
    }
}
</script>
<style scoped>
.navbar-global {
  position: sticky;
  top: 0;
  left: 0;
  right: 0; 
  z-index:1000;
}

.navbar-market {
  position: fixed;
  top: 65px; 
  left: 0;
  width: 10px; 
  height: 100%;
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
  background-color: #007bff; 
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  color:white;
  border-radius: 5px;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  background-color: rgb(21, 175, 21);
}

.create-group-btn:hover {
  background-color: darkgreen;
}

.close-btn {
  background-color: rgb(192, 22, 22);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  font-weight: 350;
  color: white;
}

.close-btn:hover{
  background-color: rgb(135, 40, 40);
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  justify-content: center;
  align-items: center;
}

.modal {
  position: relative;
  max-width: 600px; 
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto; 
  max-height: 90%;
}

.modal-content {
  position: relative;
  overflow-y: auto;
}

.success {
  background-color: #dc3545;
}

</style>