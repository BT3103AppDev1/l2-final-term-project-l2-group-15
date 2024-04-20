<template>
    <div class="group-list-item">
        <div class="group-image">
            <img :src='fileURL' alt="No Group Logo"/>
        </div>
        <div class="group-details">
            <h3>{{ item.Name }}</h3>
            <p>Postal Code: {{ item.Location }}</p>
            <div v-if="isDealDone" class="done-deal">
              <h3>Deal Done</h3>
              <button>View Deal Details</button>
            </div>
            <div v-else class="buy-request">
              <button @click="goDealReq()">View Buy Request</button>      
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
            isDealDone: false,
        }
    },
  
    methods: {

        async goDealReq() {
            this.$router.push({ name: 'MarketApprove', params: { itemID: this.fileID } })
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

        // check if Item has been approved by Seller
        async checkItemStatus(itemID){
          const db = getFirestore(firebaseApp)
          const userDocRef = doc(db, 'Items', itemID)
          const userDocSnap = await getDoc(userDocRef)
          const userData = userDocSnap.data();
          this.isPending = !userData.sold
        },

        async checkIsDealDone() {
          const db = getFirestore(firebaseApp)
          const userDocRef = doc(db, 'users', this.user)
          const userDocSnap = await getDoc(userDocRef)
          const userData = userDocSnap.data();
          this.isDealDone = userData.dealFinishItem.includes(this.fileID)
        }
      },
  
    mounted() {
      try {
        this.getImage(this.fileID)
        this.checkItemStatus(this.fileID)
        this.checkIsDealDone()
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