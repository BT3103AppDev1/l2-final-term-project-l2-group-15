<template>
  <body>
    <!-- Global Navbar -->
    <div class="global-nav">
      <Navbar_global />
    </div>

    <div class="nav">
        <NavBar_market />
    </div>

    <div v-if="showSuccess">
      <MarketSuccess :message="message" @close="toggleSuccessClose"/>
    </div>
    <div class="container">
      <!-- List of Approval Items -->
      <div class="info-header">
        <div class="group-image">
                <img :src='fileURL' alt="No Image Logo"/>
        </div>
        <div class="item-deets">
          <h1> Name: {{ itemName }} </h1> 
          <h2> Description: {{ itemdescription }}</h2> 
          <h2> Price: {{ price }} </h2>
        </div>
      </div>
      <div class="list">
        <hr>

        <div class="list-header"> 
        </div>
        <div class="approval-items">
          <div v-for="user in buyerList" :key="user.id" class="user-item">
            <Approval :user="user" :itemID="itemID" @open="toggleSuccess" @rejected="toggleSuccessReject"/>
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
import Navbar_global from '@/components/Navbar_global.vue'
import NavBar_market from '@/mComponents/Navbar_market.vue'
import Approval from '@/mComponents/Approval.vue'
import MarketSuccess from '@/mComponents/MarketSuccess.vue'

export default {
  components: {
    Navbar_global,
    NavBar_market,
    Approval,
    MarketSuccess
  },
  data() {
    return {
      isOpen:false,
      itemID: null,
      itemName: "",
      user: getAuth().currentUser.uid,
      fileURL: null,
      buyerList: [],
      message: 'Approved Successfully',
      showSuccess: false,
      itemdescription: '',
      price: null,
    }
  },

  methods: {

    toggleSuccessClose() {
      this.showSuccess = !this.showSuccess
      this.$router.push({ name: 'MarketplaceDealReq'})
    },

    toggleSuccessReject() {
      this.message = 'Rejected Successfully'
      this.showSuccess = !this.showSuccess
    },

    toggleSuccess() {
      this.showSuccess = !this.showSuccess
    },

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
      this.itemdescription = itemData.Description
      this.price = itemData.Price
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
  padding: 0;
  margin-left: 100px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* List of items */
.list {
  width: 85%; 
}

img {
  width: 300px;
  height: 300px;
  margin-top: 20px;
}
/* Market Navbar */
.nav {
  width: 15%; 
  position: fixed;
  border-top: 66px;
  overflow-y: auto; 
}

/* Global Navbar */
.nav-global {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}

.info-header {
  display: flex;
}

.info-header h1 {
  margin-left: 35px; /* Adjust this as needed */
  font-size: 40px;
  margin-bottom: 10px; /* Add some space between each element */
}

.info-header h2 {
  margin-left: 35px; /* Adjust this as needed */
  font-size: 25px;
  margin-bottom: 10px; /* Add some space between each element */
}

hr {  
  border: 1px solid rgb(148, 148, 148);
  width: 100%
}

</style>
