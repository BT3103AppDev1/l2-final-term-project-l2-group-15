<template>
  <div class="group-list-item">
    <!-- Image on the left -->
    <div class="group-image">
      <img :src="fileURL" alt="No Group Logo" />
    </div>
    
    <!-- Details on the right -->
    <div class="group-details">
      <!-- Item Name -->
      <h3>{{ item.Name }}</h3>
      
      <!-- Location -->
      <p>Location: {{ item.Location }}</p>
      
      <!-- Price (moved to top right) -->
      <div v-if="!hasBuyRequest">
        <button class="edit-button" @click="$emit('openPopup', this.fileID)">Edit Listing </button>
      </div>
      <!-- Button (moved to bottom right) -->
      <div class="button-container">
            <div v-if="hasBuyRequest">
              <p>Pending Buy Request</p>
            </div>
            <div v-else>
              <button class="remove-button" @click="removeListing">Delete Listing</button>
            </div>
      </div>
    </div>
  </div>
</template>
  
  <script> 
  import { getAuth } from 'firebase/auth';
  import firebaseApp from '../firebase.js';
  import { getFirestore } from "firebase/firestore";  
  import { doc, updateDoc, getDoc, arrayUnion, deleteDoc} from "firebase/firestore";
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
            hasBuyRequest: false,
            isOpen: false,
            refreshKey: 0,
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

        async removeListing() {
          const db = getFirestore(firebaseApp)
          const itemDocRef = doc(db, 'Items', this.fileID)
          const itemDocSnap = await getDoc(itemDocRef)
          const itemData = itemDocSnap.data()

          const sellerID = itemData.sellerID
          const userDocRef = doc(db, 'users', sellerID)
          const userDocSnap = await getDoc(userDocRef)
          const userData = userDocSnap.data()
          const updatedListedItems = userData.listedItem.filter(id => id !== this.fileID)
          await updateDoc(userDocRef, { listedItem: updatedListedItems })
          await deleteDoc(itemDocRef)
          this.$emit('open')
        },
  
        async updateUserDBJoin(documentId, newGroupId) {
          const db = getFirestore(firebaseApp)
          try { // there no catch error
            const documentRef = doc(db, 'users', documentId)
            const documentSnapshot = await getDoc(documentRef)
  
            if (documentSnapshot.exists()) {
                await updateDoc(documentRef, {
                    groups: arrayUnion(newGroupId)
                  });
              } else {
                console.log('Document does not exist.')
                }
            } catch (error) {
                console.error('Error updating document: ', error)
            }
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

        async checkBuyRequest(itemID){
          const db = getFirestore(firebaseApp)
          const userDocRef = doc(db, 'Items', itemID)
          const userDocSnap = await getDoc(userDocRef)
          const userData = userDocSnap.data();
          this.hasBuyRequest = userData.hasBuyRequest
        },

        async editListing() {
          const itemID = this.fileID

        },
      },
  
    created() {
      try {
        this.getImage(this.fileID)
        this.checkBuyRequest(this.fileID)
      } catch (e) {
        this.fileURL = null
      }
    }
    }
  </script>
 
<style scoped>
.group-list-item {
  display: flex;
  align-items: flex-start;
  background-color: #f5f4f4;
  border: 2px solid rgba(211, 211, 211, 0.441);
  margin-bottom: 1rem;
  border-radius: 15px;
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
  width: 100px; /* Fixed width for the image container */
}

.group-image img {
  width: 200px;
  margin-left: -200px;
  height: 200px; /* Fixed height for the image */
  object-fit: cover; /* Maintain aspect ratio */
  border-radius: 15px;
  /* border: 1px solid gray; */
}

.group-details {
  margin-left: -180px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.group-details h3 {
  margin-top: 0;
  font-size: 30px;
}

.group-details p {
  margin: 5px 0;
  font-size: 20px;
}

.edit-button {
  font-weight: bold;
  position: absolute;
  top: 3px;
  right: 10px;
}

.button-container {
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.remove-button,
.edit-button {
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.remove-button {
  background-color: lightcoral;
}

.edit-button {
  background-color: lightgray;
}

@media (max-width: 768px) {
  .group-list-item {
    margin-left: 10px;
    margin-right: 10px;
  }
}
</style>