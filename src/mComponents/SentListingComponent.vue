<template>
    <div class="group-list-item">
        <div class="group-image">
            <img :src='fileURL' alt="No Group Logo"/>
        </div>
        <div class="group-details">
            <h3>{{ item.Name }}</h3>
            <p>Postal Code: {{ item.Location }}</p>
            <div v-if="isPending" class="busy-div">
                <h2>Pending</h2>
              <button @click="deleteDealRequest()">Delete Request</button>
            </div>
            <div v-else class="free-div">
                <h2>Approved</h2>
                <button>View Buyer Status</button>
            </div>
        </div>
    </div> 
  </template>
  
  <script> 
  import { getAuth } from 'firebase/auth';
  import firebaseApp from '../firebase.js';
  import { getFirestore } from "firebase/firestore";  
  import { doc, getDoc,updateDoc, arrayRemove} from "firebase/firestore";
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
            isPending: true,
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
        // update Item status and delete from sellers db
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
            console.log(updatedSentRequest)
            await updateDoc(sellerDocRef, {
              receivedRequestforItem: updatedSentRequest,
            })
            console.log("new", updatedSentRequest)

        },

        async deletefromUser(itemID, userID) {
            const db = getFirestore(firebaseApp)
            const docRef = doc(db, 'users', userID)
            await updateDoc(docRef, {
                sentRequestforItem: arrayRemove(itemID)
            })
        },

        // Delete Request 
        // Update Item Status, Update Current User SentRequestforItem
        async deleteDealRequest(){
            this.deleteFromItem(this.fileID)
            this.deletefromUser(this.fileID, this.user)
            this.$router.push({ name: 'MarketplaceViewItems'})
        }
      },
  
    created() {
      try {
        this.getImage(this.fileID)
        this.checkItemStatus(this.fileID)
      } catch (e) {
        this.fileURL = null
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