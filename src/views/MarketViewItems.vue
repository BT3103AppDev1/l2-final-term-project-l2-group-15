<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import ItemList from '@/mComponents/ItemList.vue'
</script>

<template>
  <body>
    <div class="nav-global">
      <Navbar_global />
    </div>
    
    <div class="nav">
      <NavBar_market />
    </div>

    <div class="container">
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
.container {
  padding: 0;
  margin-left: 100px;
  display: flex;
  justify-content: space-between; 
}

.vertnav {
        margin-top: 66px;
    }

.list {
  width: 85%; 
}

.nav {
  width: 15%; 
  position: sticky;
  top: 100px;
  border-top: 66px;
  height: 10vh;
  overflow-y: auto; 
}

.nav-global {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>
