<template>
    <div class="group-list-item">
        <div class="group-details">
            <h3>{{ user.username }}</h3>
            <button @click="approveReq()" class="approve-btn"> Approve </button>
            <button @click="rejectReq()" class="reject-btn"> Reject </button>
        </div>
    </div> 
  </template>
  
  <script> 
  import { getAuth } from 'firebase/auth';
  import firebaseApp from '../firebase.js';
  import { getFirestore } from "firebase/firestore";  
  import { doc, getDoc,updateDoc, arrayUnion, arrayRemove} from "firebase/firestore";
  import { getStorage, ref, getDownloadURL } from 'firebase/storage';
  
  export default {
    props: {
        user: {
            type: Object,
            required: true
        },

        itemID: {
            type: String,
            required: true
        }
    },
  
    data() {
        return {
            showPopup: false,
            currentUser: getAuth().currentUser.uid,
            showSuccess: false,
            fileURL: null,
            fileID: this.user.uid,
            isPending: true,
        }
    },
  
    methods: {

        // update Item by setting sold status to true. Will not be on list anymore
        // update Buyer by adding to dealFinishItem
        // update Seller by remove from listedItem and adding to dealFinishItem
        // update Other Buyers deal is off (through seeing Item status)
        // add filter for the all items page so it wont show up
        async updateBuyer() {
            const db = getFirestore(firebaseApp)
            console.log(this.itemID)
            const documentRef = doc(db, 'users', this.user.uid)
            const documentSnapshot = await getDoc(documentRef)
            const userData = documentSnapshot.data()
            updateDoc(documentRef, {
                dealFinishItem: arrayUnion(this.itemID)
            })          
        },

        async updateSeller() {
            const db = getFirestore(firebaseApp)
            const documentRef = doc(db, 'users', this.currentUser)
            const documentSnapshot = await getDoc(documentRef)
            const userData = documentSnapshot.data()
            const newListedItems = userData.listedItem.filter(itemID => itemID !== this.itemID)
            const newReceivedRequestforItem = userData.receivedRequestforItem.filter(itemID => itemID !== this.itemID)           
            updateDoc(documentRef, {
                dealFinishItem: arrayUnion(this.itemID),
                listedItem: newListedItems,
            })     
        },

        async updateItem() {
            const db = getFirestore(firebaseApp)
            const documentRef = doc(db, 'Items', this.itemID)
            const documentSnapshot = await getDoc(documentRef)
            const itemData = documentSnapshot.data()
            updateDoc(documentRef, {
                soldTo: this.user.uid,
                sold: true
            })
            
        },

        approveReq() {
            this.updateBuyer()
            this.updateItem()
            this.updateSeller()
            this.$emit('open')
        },

        async rejectReq() {
            const db = getFirestore(firebaseApp)
            const currentUserDocRef = doc(db, 'users', this.currentUser)
            const currentUserDocSnap = await getDoc(currentUserDocRef)
            const currentUserData = currentUserDocSnap.data()
            const currentReceived = currentUserData.receivedRequestforItem
            const updatedReceived = currentReceived.filter(id => id !== this.itemID)  

            const itemDocRef = doc(db, 'Items', this.itemID)
            const itemDocSnap = await getDoc(itemDocRef)
            const itemData = itemDocSnap.data()
            const updatedListedItems = itemData.buyerID.filter(id => id !== this.fileID)

            const userDocRef = doc(db, 'users', this.fileID)
            const userDocSnap = await getDoc(userDocRef)
            const userData = userDocSnap.data()
            const updatedUserSentReq = userData.sentRequestforItem.filter(id => id !== this.itemID)
            await updateDoc(userDocRef, {sentRequestforItem: updatedUserSentReq})
            if (updatedListedItems.length === 0) {
                await updateDoc(currentUserDocRef, {receivedRequestforItem: updatedReceived}) 
                await updateDoc(itemDocRef, { buyerID: [], hasBuyReq: false })
            } else {
                await updateDoc(itemDocRef, { buyerID: updatedListedItems })
            }
            this.$emit('rejected')
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
  width: 150px;
  height: 150px; 
  overflow: hidden;
  margin: 20px;
  border-radius: 10px;
}

.group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.group-details {
  flex: 4;
  padding-left: 20px;
  display: flex; 
  align-items: center; 
}

.group-details h3 {
  margin-top: 0;
  flex-grow: 1; 
}

.approve-btn {
  margin-left: 10px; 
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 8px;
}

.reject-btn {
  margin-left: 10px; 
  background-color: red; /* Green */
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition-duration: 0.4s;
  cursor: pointer;
  border-radius: 8px;
}

.approve-btn:hover {
  background-color: #3e8e41; /* Darker Green */
}

.reject-btn:hover {
  background-color: rgb(159, 7, 7); /* Darker Red */
}

@media (max-width: 768px) {
  .modal-content {
    margin: 20% auto;
    width: 95%;
  }
}
</style>
