<template>
  <div class="group-list-item" :class="{ 'popup-open': showPopup }">
    <div class="group-image">
      <img :src="fileURL" alt="No Group Logo" />
    </div>
    <div class="group-details">
      <h3>{{ item.Name }}</h3>
      <p>Location: {{ item.Location }}</p>
      <div v-if="isSoldtoYou" class="busy-div">
        <h2>Approved</h2>
        <button @click="emitMsg">View Contact Status</button>
      </div>
      <div v-else-if="isSold" class="busy-div">
        <h2>Sold to another User</h2>
        <button @click="deleteDealRequest">Delete Request</button>
      </div>
      <div v-else class="free-div">
        <h2>Pending Approval</h2>
        <button @click="deleteDealRequest">Delete Request</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";  
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
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
      isSoldtoYou: false,
      isSold: false,
    }
  },
  methods: {
    async emitMsg() {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'Items', this.fileID)
      const itemSnapshot = await getDoc(docRef)
      const itemdata = itemSnapshot.data()
      const buyerID = itemdata.soldTo;
      this.$emit('openPopup', buyerID)
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
    async deleteFromItem(itemID) {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'Items', itemID);
      await updateDoc(docRef, {
        hasBuyRequest: false,
        buyerID: "",
      });
      const itemSnapshot = await getDoc(docRef);
      const itemdata = itemSnapshot.data();
      const sellerID = itemdata.sellerID;
      const sellerDocRef = doc(db, 'users', sellerID);
      const sellerDocSnap = await getDoc(sellerDocRef);
      const sellerData = sellerDocSnap.data();
      const updatedSentRequest = sellerData.receivedRequestforItem.filter(id => id !== itemID);
      await updateDoc(sellerDocRef, {
        receivedRequestforItem: updatedSentRequest,
      });
    },
    async deletefromUser(itemID, userID) {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'users', userID);
      await updateDoc(docRef, {
        sentRequestforItem: arrayRemove(itemID)
      });
    },
    async deleteDealRequest() {
      await this.deleteFromItem(this.fileID);
      await this.deletefromUser(this.fileID, this.user);
      this.$router.push({ name: 'MarketplaceViewItems' });
    },
    async checkSold() {
      const db = getFirestore(firebaseApp);
      const itemDocRef = doc(db, 'Items', this.fileID);
      const itemDocSnap = await getDoc(itemDocRef);
      const itemData = itemDocSnap.data();
      this.isSold = itemData.sold;
      if (itemData.soldTo === this.user) {
        this.isSoldtoYou = true;
      }
    }
  },
  mounted() {
    this.getImage(this.fileID);
    this.checkSold();
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

.busy-div, .free-div {
  margin-top: 10px;
}

.busy-div h2, .free-div h2 {
  margin-top: 0;
}

.busy-div button, .free-div button {
  margin-top: 5px;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
}

.busy-div button:hover, .free-div button:hover {
  background-color: #0056b3;
}

.popup-open {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.popup-open .group-image img {
  border-radius: 10px;
}

.popup-open .group-details {
  padding-left: 30px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .group-list-item {
    margin-left: 0;
    margin-right: 0;
    border-radius: 0;
  }

  .group-details {
    padding-left: 10px;
  }
}
</style>
