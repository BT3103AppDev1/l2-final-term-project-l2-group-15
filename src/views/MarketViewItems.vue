<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import ItemList from '@/mComponents/ItemList.vue'
</script>

<template>
  <body>
      <Navbar_global />
      <div class="container">
        <div class="nav">
          <NavBar_market />
        </div>
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
  padding:0px;
  margin: 0px;
  display:flex;
}

.list {
  width: 100%;
}

.nav{
  margin-right: 0.5vh;
  width:8%;
}
</style>