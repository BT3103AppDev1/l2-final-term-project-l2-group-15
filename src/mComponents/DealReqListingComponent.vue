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
      const sellerID = itemdata.soldTo;
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
  width: 100%; 
  width: 260px; 
  height: 300px;
  margin: 0 auto; 
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f4f4;
  border: 2px solid rgba(211, 211, 211, 0.441);
  border-radius: 10px;
  margin-bottom: 20px; 
  padding: 10px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.group-list-item:not(.popup-open):hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.group-image {
  width: 150px; 
  height: 150px; 
  overflow: hidden;
  border-radius: 10px;
  /* border: 1px solid lightgray; */
}

.group-image img {
  width: 100%;
  object-fit: cover; 
}

.group-details {
  width: 100%; 
  padding: 20px 0; 
  text-align: center; 
}

.group-details h3 {
  margin-top: 0;
  font-size: 25px;
  margin-bottom: -10px;
  padding: 0px;
  /* border: 2px solid black; */
}

.done-deal button,
.buy-request button {
  margin-top: 10px; 
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  font-weight: 350;
  color: black;
}
.buy-request button,
.done-deal button{
  background-color: rgb(46, 192, 46);
  margin-top: 50px;
  margin-bottom: 0px;
}
.buy-request button:hover {
  background-color: rgb(29, 162, 29);
}
.done-deal button {
  background-color: rgb(190, 182, 182)
}

.done-deal button:hover{
  background-color: darkgrey;
}
</style>