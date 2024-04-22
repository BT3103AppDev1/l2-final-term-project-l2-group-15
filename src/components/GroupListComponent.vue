<template>
  <div class="group-list-item">
      <div class="group-image">
          <img :src='fileURL' alt="No Group Logo"/>
      </div>
      <div class="group-details">
          <h3>{{ group.GroupName }}</h3>
          <p>Postal Code: {{ group.GroupLocation }}</p>
          <div v-if="!isMember">
            <button class="join-btn-default" @click="joinGroup">Join Group</button>
            <button class="info-btn" @click="toggle">More Info</button>
          </div>
          <div v-else>
            <button class="view-btn-default" @click="viewGroup">View Group</button>
            <button class="info-btn" @click="toggle">More Info</button>
          </div>
      </div>
    </div>

      <div v-if="showPopup" class="modal">
          <div class="modal-content">
              <span class="close" @click="toggle">&times;</span>
                  <div class="modal-header">
                      <div class="modal-image">
                          <img :src="fileURL" alt="Group Logo" />
                      </div>
                  <div class="modal-title">
                      <h3>{{ group.GroupName }}</h3>
                      <p class="distance">{{ distance }} km away from you</p> <!-- Add distance here -->
                  </div>
              </div>
              <div class="modal-body">
                  <p class="description">Group Description: {{ group.GroupDescription }}</p>
                  <div class="group-stats">
                      <p><strong>Total members:</strong> {{ group.GroupMembers.length }} </p>  <!-- change to update-->
                      <p><strong>Last event:</strong> 12/5/2023</p>
                      <p><strong>Admin:</strong> {{ groupAdminName }}</p>
                  </div>
                  
                <div class="join" v-if="! isMember">
              <button class="join-btn" @click="joinGroup">Join</button>
                </div>
                <div class="view" v-else>
              <button class="view-btn" @click="viewGroup">View Group</button>
                </div>
              </div>
          </div>
      </div>

      <SuccessMessage v-if="showSuccess" :condition="message_passed" :group="this.fileID" :user="this.user"/>
      
      <!-- old success message-->
      <!-- <div v-if="showSuccess" class="modal">
            <div class="modal-content">
                <span class="close" @click="toggleSuccess">&times;</span>
                    <div class="modal-header">
                </div>
                <div class="success-msg">
                  <h1>Success</h1>
                </div>
            </div>
        </div> -->
</template>

<script> 
import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";  
import { doc, updateDoc, getDoc, getDocs, arrayUnion, collection } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import SuccessMessage from "@/components/SuccessMessage.vue"; 


export default {
  components: {
    SuccessMessage
  },

  props: {
      group: {
        type: Object,
        required: true
      },

      distance: {
        type: String, 
        required: true
      }
  },

  data() {
      return {
          showPopup: false,
          user: getAuth().currentUser.uid,
          showSuccess: false,
          fileURL: null,
          fileID: this.group.GroupId,
          isMember: false,
          message_passed: "joinGroup",
          groupAdminName: ''
      }
  },

  methods: {
      viewGroup() {
        this.$router.push({ name: 'SpecificGroupHome', params: { group: this.fileID, user: this.user } })
      },

      toggle() {
        this.showPopup = !this.showPopup
      },

      // toggleSuccess() {
      //   this.showSuccess = false
      //   this.$router.push({ name: 'SpecificGroupHome', params: { group: this.fileID, user: this.user } })
      // },

      joinGroup() {
        let group_id = this.group.id
        let user_id = this.user
        this.updateUserDBJoin(user_id, group_id)
        this.updateGroupDBJoin(group_id, user_id)
        this.showSuccess = true;
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
      },

      async getAdminName(userid) {
          const db = getFirestore(firebaseApp)
          try {
            const docs = await getDocs(collection(db, "users"));
            for (const doc of docs.docs) {
              if (doc.data().uid == userid) {
                const username = doc.data().username;
                console.log("Username retrieved successfully:", username);
                this.groupAdminName = username; 
              }
            }
          } catch (error) {
            console.error("Error retrieving username:", error);
          }
        }
    },

  mounted() {
    try {
      this.getImage(this.group.GroupId)
      this.checkMember(this.group.GroupId)
    } catch (e) {
      this.fileURL = null
    }

    this.getAdminName(this.group.GroupAdmin[0]);
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.group-list-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

.success-msg {
  font-size: 5vh;
  color: rgb(24, 232, 24);
  text-align: center;
}

.join-btn-default, .info-btn, .view-btn-default {
  margin-top: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
}

.join-btn-default {
  background-color: #4CAF50; 
}

.info-btn {
  background-color: #008CBA;
}

.view-btn-default {
  background-color: rgb(109, 181, 253);
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal box styles */
.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

/* Close button styles */
.close {
  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

/* Header styles */
.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

/* Image styles */
.modal-image {
  flex-shrink: 0;
  background-color: #ccc; 
  width: 150px; 
  height: 120px; 
  border-radius: 0%; 
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.modal-image img {
  width: 100%;
  height: auto;
}

.modal-title {
  flex-grow: 1;
  margin-left: 16px;
}

.modal-title h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.distance {
  color: #666;
  font-size: 0.875rem;
}

/* Body styles */
.modal-body {
  font-size: 0.875rem;
}

.description {
  color: #333;
  margin-bottom: 16px;
}

.group-stats p {
  margin: 4px 0;
}

.join-btn, .view-btn {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color:  #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
}

.view-btn {
  background-color: rgb(109, 181, 253);
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    margin: 20% auto;
    width: 95%;
  }
}
</style>