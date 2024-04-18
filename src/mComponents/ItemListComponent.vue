<template>
    <div class="group-list-item">
        <div class="group-image">
            <img :src='fileURL' alt="No Group Logo"/>
        </div>
        <div class="group-details">
            <h3>{{ item.Name }}</h3>
            <p>Postal Code: {{ item.Location }}</p>
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
            isMember: false
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
  
        async updateGroupDBJoin(documentId, newUserId) {
          const db = getFirestore(firebaseApp)
          try {
            const documentRef = doc(db, 'group', documentId)
            const documentSnapshot = await getDoc(documentRef)
  
        
            if (documentSnapshot.exists()) {
                await updateDoc(documentRef, {
                    GroupMembers: arrayUnion(newUserId),
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
  
        async checkMember(groupID) {
          let db = getFirestore(firebaseApp);
          let userID = this.user
          let userRef = doc(db, 'users', userID)
          let userDoc = await getDoc(userRef)
          let userData = userDoc.data()
          if (userData.groups.includes(groupID)) {
            this.isMember = true
          } else {
            this.isMember = false
          }
        }
      },
  
    created() {
      try {
        this.getImage(this.fileID)
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