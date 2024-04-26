<template>
  <div class="group-list-item">
    <div class="group-image">
      <img :src="fileURL" alt="No Group Logo" />
    </div>
    
    <div class="group-details">
      <h3>{{ item.Name }}</h3>
      
      <p>{{ sellerName }}</p>
      
      <p>Location: {{ item.Location }}</p>
      
      <p class="price">Price: {{ item.Price }}</p>
      
      <div class="button-container">
        <div v-if="isUserItem" class="deal-request-btn">
          <p>My Item</p>
        </div>
        <div v-else-if="userSentRequest" class="my-item-btn">
          <button @click="sendDealRequest">Send Deal Request</button>
        </div>
        <div v-else class="sent-request-btn">
           <p> Deal Request Sent! </p>
        </div>
      </div>
    </div>
  </div>
</template>


<script> 
import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";  
import { doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      user: getAuth().currentUser.uid,
      fileURL: null,
      fileID: this.item.id,
      isMember: false,
      userSentRequest: true,
      isUserItem: false,
      sellerName: "",
    }
  },
  methods: {

    async getSellerName() {
      const db = getFirestore(firebaseApp);
      const itemdocRef = doc(db, 'Items', this.fileID)
      const itemSnapshot = await getDoc(itemdocRef)
      const itemData = itemSnapshot.data()
      const sellerID = itemData.sellerID

      const docRef = doc(db, 'users', sellerID)
      const userSnapshot = await getDoc(docRef)
      const userData = userSnapshot.data()
      this.sellerName = userData.username
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
    async getItemStatus(fileID, user) {
      const db = getFirestore(firebaseApp);
      const userDocRef = doc(db, 'users', user);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      this.userSentRequest = !userData.sentRequestforItem.includes(fileID);
      return;
    },
    async isMyItem(fileID, user) {
      const db = getFirestore(firebaseApp);
      const userDocRef = doc(db, 'Items', fileID);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      this.isUserItem = (userData.sellerID == user);
      return;
    },
    async sendDealRequest() {
      const itemID = this.fileID;
      const userID = this.user;
      this.updateItemDB(itemID, userID)
      this.updateUserDB(itemID, userID)
      this.$emit('open')
    },

    async updateItemDB(itemID, userID) {
      const db = getFirestore(firebaseApp);
      const docRef = doc(db, 'Items', itemID);
      await updateDoc(docRef, {
        hasBuyRequest: true,
        buyerID: arrayUnion(userID),
      });
      const sellerID = (await getDoc(docRef)).data().sellerID;
      await updateDoc(doc(db, 'users', sellerID), {
        receivedRequestforItem: arrayUnion(itemID)
      });
    },
    async updateUserDB(itemID, userID) {
      const db = getFirestore(firebaseApp);
      await updateDoc(doc(db, 'users', userID), {
        sentRequestforItem: arrayUnion(itemID)
      });
    },
  },
  mounted() {
    try {
      this.getImage(this.fileID)
      this.getItemStatus(this.fileID, this.user)
      this.isMyItem(this.fileID, this.user)
      this.getSellerName()
    } catch (e) {
      this.fileURL = null;
      console.log(e);
    }
  }
};
</script>


<style scoped>
.group-list-item {
  display: flex;
  align-items: flex-start;
  background-color: #f5f4f4;
  border: 2px solid rgba(211, 211, 211, 0.441);
  margin-bottom: 1rem;
  border-radius: 10px;
  padding: 10px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  position: relative;
  margin-left:10px;
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
  width: 100%;
  height: 120px;
  width: 120px;
  object-fit: cover; 
  border-radius: 10px;
}

.group-details {
  flex: 3;
  padding-left: 20px;
}

.group-details h3 {
  margin-top: 0;
  font-size: 1.5rem;
}

.group-details p {
  margin: 5px 0;
}

.price {
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 10px;
}

.button-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.my-item-btn button {
  background-color: rgb(33, 165, 33);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-family: "Roboto", sans-serif;
  font-weight: 350;
  font-size: 14px;
}

.sent-request-btn,
.deal-request-btn {
  color: gray;
}


.deal-request-btn button:hover,
.my-item-btn button:hover{
  background-color: darkgreen
}

.price {
  font-size: 18px;
}
@media (max-width: 768px) {
  .group-list-item {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>