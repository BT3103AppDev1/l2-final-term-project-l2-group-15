<template>
  <div class="group-list-item">
    <div class="group-image">
      <img :src="fileURL" alt="No Group Logo" />
    </div>
    
    <div class="group-details">
      <h3>{{ item.Name }}</h3>
      
      <p>{{ this.sellerName }}</p>
      
      <p>Location: {{ item.Location }}</p>
      
      <p class="price">Price: {{ item.Price }}</p>
      
      <div class="button-container">
        <button class='contact-button' v-if="isSoldtoYou" @click="emitMsg">View Contact Details</button>
        <button class='delete-button' v-else-if="isSold" @click="deleteDealRequest">Delete Request</button>
        <button class='delete-button' v-else @click="deleteDealRequest">Delete Request</button>
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
      sellerName: '',
    }
  },
  methods: {
    async getSellerName() {
      const db = getFirestore(firebaseApp)
      const docRef = doc(db, 'users', this.item.sellerID)
      const userSnapshot = await getDoc(docRef)
      const userdata = userSnapshot.data()
      this.sellerName = userdata.username
    },

    async emitMsg() {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'Items', this.fileID)
      const itemSnapshot = await getDoc(docRef)
      const itemdata = itemSnapshot.data()
      const buyerID = itemdata.sellerID
      this.$emit('openPopup', buyerID)
    },
    async getImage(fileID) {
      try {
        let storage = getStorage();
        let filePath = `gs://connecthub-88e58.appspot.com/${fileID}`
        let fileRef = ref(storage, filePath)
        let fileURL = await getDownloadURL(fileRef)
        this.fileURL = fileURL
      } catch (error) {
        console.log("No Image Found")
      }
    },
    async deleteFromItem(itemID) {
      const db = getFirestore(firebaseApp)
      const docRef = doc(db, 'Items', itemID)
      await updateDoc(docRef, {
        hasBuyRequest: false,
        buyerID: "",
      })
      const itemSnapshot = await getDoc(docRef)
      const itemdata = itemSnapshot.data()
      const sellerID = itemdata.sellerID
      const sellerDocRef = doc(db, 'users', sellerID)
      const sellerDocSnap = await getDoc(sellerDocRef)
      const sellerData = sellerDocSnap.data()
      const updatedSentRequest = sellerData.receivedRequestforItem.filter(id => id !== itemID)
      await updateDoc(sellerDocRef, {
        receivedRequestforItem: updatedSentRequest,
      });
    },
    async deletefromUser(itemID, userID) {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'users', userID)
      await updateDoc(docRef, {
        sentRequestforItem: arrayRemove(itemID)
      });
    },
    async deleteDealRequest() {
      await this.deleteFromItem(this.fileID);
      await this.deletefromUser(this.fileID, this.user)
      this.$emit('open')
    },
    async checkSold() {
      const db = getFirestore(firebaseApp);
      const itemDocRef = doc(db, 'Items', this.fileID)
      const itemDocSnap = await getDoc(itemDocRef)
      const itemData = itemDocSnap.data()
      this.isSold = itemData.sold
      if (itemData.soldTo === this.user) {
        this.isSoldtoYou = true
      }
    }
  },
  mounted() {
    this.getImage(this.fileID)
    this.checkSold()
    this.getSellerName()
  }
};
</script>


<style scoped>
.group-list-item {
  display: flex;
  align-items: flex-start;
  background-color: #f5f4f4;
  border: 1px solid lightgrey;
  margin-bottom: 1rem;
  border-radius: 10px;
  padding: 10px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  position: relative;
}

.group-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}

.group-image {
  flex: 1;
  max-width: 30%;
  width: 100px; 
}

.group-image img {
  width: 200px;
  height: 200px; 
  margin-left: -125px;
  object-fit: cover; 
  border-radius: 10px;
  /* border: 1px solid gray; */
  margin-right: 20px;
}

.group-details {
  margin-left: -110px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.group-details h3 {
  margin-top: 0;
  font-size: 1.5rem;
  font-size: 30px;

}

.group-details p {
  margin: 5px 0;
  font-size: 20px;
}

.price {
  font-weight: bold;
  font-size: 30px;
  position: absolute;
  top: 10px;
  right: 25px;
}

.button-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.delete-button,
.contact-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 350;
}

.delete-button {
  background-color: red;  
}

.contact-button {
  background-color: rgb(21, 175, 21);
}

.contact-button:hover {
  background-color: darkgreen;
}

.delete-button:hover {
  background-color: darkred;
}

@media (max-width: 768px) {
  .group-list-item {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>