<script setup>
  import Navbar_global from '@/components/Navbar_global.vue'
  import NavBar_market from '@/mComponents/Navbar_market.vue'
  import Approval from '@/mComponents/Approval.vue'
</script>

<template>
  <body>
      <Navbar_global />
      <div class="container">
        <div class="nav">
          <NavBar_market />
        </div>
        <div class="list">
            <div class="group-image">
                <img :src='fileURL' alt="No Image Logo"/>
            </div>
          <div class="list-header">
            <div class="create-btn-container">
              <h1>{{ itemName }}</h1>
            </div>
          </div>
          <div>
            <div v-for="users in buyerList" :key="users.id" class="user_list">
                <Approval :user="users" />
            </div>
          </div>
        </div>
      </div>
  </body>
</template>



<script>

import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";  
import { doc, updateDoc, getDoc, arrayUnion} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
  
export default {

  data() {
    return {
      isOpen:false,
      itemID: null,
      itemName: "",
      user: getAuth().currentUser.uid,
      fileURL: null,
      buyerList: [],
    }
  },

  methods: {

    async getImage(fileID) {
        try {
            let storage = getStorage()
            let filePath ="gs://connecthub-88e58.appspot.com/" + fileID
            let fileRef = ref(storage, filePath)
            let fileURL = await getDownloadURL(fileRef)
            this.fileURL = fileURL
        } catch (error) {
            console.log("No Image Found")
        }
    },

    async getItemDetails(fileID) {
        const db = getFirestore(firebaseApp)
        const itemDocRef = doc(db, 'Items', fileID)
        const itemDocSnap = await getDoc(itemDocRef)
        const itemData = itemDocSnap.data()
        this.itemName = itemData.Name
        const buyerIDList = itemData.buyerID

        for (const id of buyerIDList) {
            const buyerDocRef = doc(db, 'users', id)
            const buyerDocSnap = await getDoc(buyerDocRef)
            const buyerData = buyerDocSnap.data()
            this.buyerList.push(buyerData)
        }
    },

  },

  mounted() {
    this.itemID = this.$route.params.itemID
    this.getImage(this.itemID)
    this.getItemDetails(this.itemID)
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