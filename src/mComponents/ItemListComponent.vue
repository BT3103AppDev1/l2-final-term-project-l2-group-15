<template>
    <div class="group-list-item">
        <div class="group-image">
            <img :src='fileURL' alt="No Group Logo"/>
        </div>
        <div class="group-details">
            <h3>{{ item.Name }}</h3>
            <p>Postal Code: {{ item.Location }}</p>
            <div v-if="this.isUserItem" class="deal-request-btn">
              <button>My Item</button>
            </div>
            <div v-else-if="this.userSentRequest" class = 'my-item-btn'>
              <button @click="sendDealRequest()" >Send Deal Request</button>    
            </div>
            <div v-else class="sent-request-btn">
              <button>Deal Request Sent</button>
            </div>
        </div>
    </div> 
  </template>
  
  <script> 
  import { getAuth } from 'firebase/auth';
  import firebaseApp from '../firebase.js';
  import { getFirestore } from "firebase/firestore";  
  import { doc, updateDoc, getDoc, arrayUnion} from "firebase/firestore";
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
            showPopup: false,
            user: getAuth().currentUser.uid,
            showSuccess: false,
            fileURL: null,
            fileID: this.item.id,
            isMember: false,
            userSentRequest: true,
            isUserItem: false,
        }
    },
  
    methods: {
        toggle() {
          this.showPopup = !this.showPopup
        },
  
        toggleSuccess() {
          this.showSuccess = false
          this.$router.push({ name: 'SpecificGroupHome', params: { group: this.fileID, user: this.user } })
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
        
        // Check whether current user has sent a request to this Item
        async getItemStatus(fileID, user) {
          const db = getFirestore(firebaseApp)
          const userDocRef = doc(db, 'users', user)
          const userDocSnap = await getDoc(userDocRef)
          const userData = userDocSnap.data();
          this.userSentRequest = !userData.sentRequestforItem.includes(fileID)
          return
        },
        
        // Check whether this is the current user listing
        async isMyItem(fileID, user) {
          const db = getFirestore(firebaseApp)
          const userDocRef = doc(db, 'Items', fileID)
          const userDocSnap = await getDoc(userDocRef)
          const userData = userDocSnap.data();
          this.isUserItem = (userData.sellerID == user)
          return 
        },

        // update Item status and update seller status
        async updateItemDB(itemID, userID) {
          const db = getFirestore(firebaseApp)
          const docRef = doc(db, 'Items', itemID)
          await updateDoc(docRef, {
            hasBuyRequest: true,
            buyerID: arrayUnion(userID),
          })

          const itemDocSnap = await getDoc(docRef)
          const sellerID = itemDocSnap.data().sellerID

          const userDocRef = doc(db, 'users', sellerID)
          await updateDoc(userDocRef, {
            receivedRequestforItem: arrayUnion(itemID)
          })

        },

        // update that current user sent a request
        async updateUserDB(itemID, userID) {
          const db = getFirestore(firebaseApp)
          const docRef = doc(db, 'users', userID)
          await updateDoc(docRef, {
            sentRequestforItem: arrayUnion(itemID)
          })

        },

        async sendDealRequest() {
          const itemID = this.fileID
          const userID = this.user
          this.updateItemDB(itemID, userID)
          this.updateUserDB(itemID, userID)
          this.$router.push({ name: 'MarketplaceSentReq'})
        },
      },
  
    mounted() {
      try {
        this.getImage(this.fileID)
        this.getItemStatus(this.fileID, this.user)
        this.isMyItem(this.fileID, this.user)
      } catch (e) {
        this.fileURL = null
        console.log(e)
      }
    }
    }
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
  
  .group-list-item:hover {
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
  
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .modal-content {
      margin: 20% auto;
      width: 95%;
    }
  }
  </style>