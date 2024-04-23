<template>
  <div class="group-list-item" :class="{ 'popup-open': showPopup }">
    <!-- Image on top -->
    <div class="group-image">
      <img :src="fileURL" alt="No Group Logo" />
    </div>
    
    <!-- Details -->
    <div class="group-details">
      <!-- Item Name -->
      <h3>{{ item.Name }}</h3>
      
      <!-- Button -->
      <div v-if="isDealDone" class="done-deal">
        <button @click="emitMsg">View Contact Details</button>
      </div>
      <div v-else class="buy-request">
        <button @click="goDealReq">View Buy Request</button>
      </div>
    </div>
  </div>
</template>

<script> 
import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";  
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    showPopup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      user: getAuth().currentUser.uid,
      fileURL: null,
      fileID: this.item.id,
      isDealDone: false,
    }
  },
  methods: {
    async emitMsg() {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'Items', this.fileID);
      const itemSnapshot = await getDoc(docRef);
      const itemdata = itemSnapshot.data();
      const sellerID = itemdata.sellerID;
      this.$emit('openPopup', sellerID);
    },
    async goDealReq() {
      this.$router.push({ name: 'MarketApprove', params: { itemID: this.fileID } });
    },
    async getImage(fileID) {
      try {
        let storage = getStorage();
        let filePath = `gs://connecthub-88e58.appspot.com/${fileID}`;
        let fileRef = ref(storage, filePath);
        let fileURL = await getDownloadURL(fileRef);
        this.fileURL = fileURL;
      } catch (error) {
        console.log("No Image Found");
      }
    },
    async checkIsDealDone() {
      const db = getFirestore(firebaseApp);
      const userDocRef = doc(db, 'users', this.user);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      this.isDealDone = userData.dealFinishItem.includes(this.fileID);
    }
  },
  mounted() {
    try {
      this.getImage(this.fileID);
      this.checkIsDealDone();
    } catch (e) {
      this.fileURL = null;
    }
  }
};
</script>

<style scoped>
.group-list-item {
  width: 100%; /* Set width to occupy about 40% of the page */
  max-width: 260px; /* Set maximum width */
  max-height: 300px;
  margin: 0 auto; /* Center align the items horizontally */
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f4f4;
  border-radius: 10px;
  margin-bottom: 20px; /* Add margin between items */
  padding: 10px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.group-list-item:not(.popup-open):hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.group-image {
  width: 100%; /* Take up entire width */
  max-height: 200px; /* Limit height */
  overflow: hidden; /* Hide overflow */
  border-radius: 10px;
}

.group-image img {
  width: 100%;
  object-fit: cover; /* Cover the entire space */
}

.group-details {
  width: 100%; /* Take up entire width */
  padding: 20px 0; /* Add padding */
  text-align: center; /* Center text */
}

.group-details h3 {
  margin-top: 0;
}

.done-deal button,
.buy-request button {
  margin-top: 10px; /* Add margin to separate from item name */
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.done-deal button:hover,
.buy-request button:hover {
  background-color: #0056b3;
}
</style>