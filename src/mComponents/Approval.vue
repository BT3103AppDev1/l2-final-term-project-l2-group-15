<template>
    <div class="group-list-item">
        <div class="group-details">
            <h3>{{ user.username }}</h3>
            <p>Postal Code: {{ user.Location }}</p>
            <button @click="approveReq()"> Approve </button>
            <button @click="rejectReq()" > Reject </button>
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
        user: {
          type: Object,
          required: true
        },
    },
  
    data() {
        return {
            showPopup: false,
            currentUser: getAuth().currentUser.uid,
            showSuccess: false,
            fileURL: null,
            fileID: this.user,
            isPending: true,
        }
    },
  
    methods: {

        // update Item status, update Buyer and Seller status
        // update Item by setting sold status to true. Will not be on list anymore
        // update Buyer by adding to dealFinishItem
        // update Seller by remove from listedItem and adding to dealFinishItem
        // update Other Buyers deal is off (through seeing Item status)
        // add filter for the all items page so it wont show up
        updateBuyer() {
            const db = getFirestore(firebaseApp)
            const documentRef = doc(db, 'users', this.user)
            const documentSnapshot = getDoc(documentRef)
            updateDoc(documentRef, {
                dealFinishItem: arrayUnion(newGroupId)
            })          
        },

        updateSeller() {

        },

        updateItem() {

        },

        approveReq() {
            
        },

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


      },
  
    created() {

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