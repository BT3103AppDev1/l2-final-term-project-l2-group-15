<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import ItemList from '@/mComponents/ItemList.vue'
</script>

<template>
  <body>
    <!-- Global Navbar -->
    <div class="nav-global">
      <Navbar_global />
    </div>
    
    <!-- Market Navbar -->
    <div class="nav">
      <NavBar_market />
    </div>

    <!-- Container for main content -->
    <div class="container">
      <!-- List of items -->
      <div class="list">
        <ItemList/>
      </div>
    </div>
  </body>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { getDoc, doc, onSnapshot, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const db = getFirestore(firebaseApp)

export default {
  components: {
    Navbar_global,
    NavBar_market,
    ItemList,
  },
}
</script>

<style scoped>
/* Container for main content */
.container {
  padding: 0;
  margin-left: 100px;
  display: flex;
  justify-content: space-between; /* Distribute items evenly */
}

.vertnav {
        margin-top: 66px;
    }

/* List of items */
.list {
  width: 85%; /* Adjust the width as needed */
}

/* Market Navbar */
.nav {
  width: 15%; /* Adjust the width as needed */
  position: sticky;
  top: 100px;
  border-top: 66px;
  height: 10vh; /* Make it full height */
  overflow-y: auto; /* Allow scrolling if needed */
}

/* Global Navbar */
.nav-global {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000; /* Ensure it's above other content */
}
</style>
