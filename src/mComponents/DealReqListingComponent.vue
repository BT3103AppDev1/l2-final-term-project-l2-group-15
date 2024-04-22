<template>
  <div class="group-list-item" :class="{ 'popup-open': showPopup }">
    <div class="group-image">
      <img :src="fileURL" alt="No Group Logo" />
    </div>
    <div class="group-details">
      <h3>{{ item.Name }}</h3>
      <p>Postal Code: {{ item.Location }}</p>
      <div v-if="isDealDone" class="done-deal">
        <h3>Deal Done</h3>
        <button @click="emitMsg">View Contact Details</button>
      </div>
      <div v-else class="buy-request">
        <h3>Deal Pending</h3>
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
  display: flex;
  align-items: center;
  background-color: #f5f4f4;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 10px;
  margin-bottom: 1rem;
  padding: 10px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.group-list-item:not(.popup-open):hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.group-image {
  flex: 1;
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  max-width: 20%;
}

.group-image {
  width: 150px; /* Adjust as needed */
  height: 150px; /* Adjust as needed */
  overflow: hidden;
  margin: 20px;
  border-radius: 10px;
}

.group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the entire space */
}

.group-details {
  flex: 4;
  padding-left: 20px;
}

.group-details h3 {
  margin-top: 0;
}

.done-deal, .buy-request {
  margin-top: 10px;
}

.done-deal h3, .buy-request h3 {
  margin-top: 0;
}

.done-deal button, .buy-request button {
  margin-top: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.done-deal button:hover, .buy-request button:hover {
  background-color: #0056b3;
}
</style>
