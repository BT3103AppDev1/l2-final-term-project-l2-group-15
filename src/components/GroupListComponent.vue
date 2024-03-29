<template>
    <div class="group-list-item">
        <div class="group-image">
            <span>{{ group.GroupImage }}</span>
        </div>
        <div class="group-details">
            <h3>{{ group.GroupName }}</h3>
            <p>Postal Code: {{ group.GroupLocation }}</p>
            <p>{{ group.GrouoDescription }}</p>
            <button class="join-btn-default" @click="joinGroup">Join Group</button>
            <button class="info-btn" @click="toggle">More Info</button>
        </div>

        <div v-if="showPopup" class="modal">
            <div class="modal-content">
                <span class="close" @click="toggle">&times;</span>
                    <div class="modal-header">
                        <div class="modal-image">
                            <img :src="group.imageSrc" alt="Group Logo" />
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
                        <p><strong>Admin:</strong> {{ group.GroupAdmin }}</p>
                    </div>
                <button class="join-btn" @click="joinGroup">Join</button>
                </div>
            </div>
        </div>

        <div v-if="showSuccess" class="modal">
            <div class="modal-content">
                <span class="close" @click="toggleSuccess">&times;</span>
                    <div class="modal-header">
                </div>
                <div class="success-msg">
                  <h1>Success</h1>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script> 
  import { getAuth } from 'firebase/auth';
  import firebaseApp from '../firebase.js';
  import { getFirestore } from "firebase/firestore";  
  import { doc, updateDoc, getDoc, arrayUnion} from "firebase/firestore";
  import { useRouter } from 'vue-router';

  export default {
    props: {
        group: {
            type: String,
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
        }
    },

    methods: {
        toggle() {
          this.showPopup = !this.showPopup
        },

        toggleSuccess() {
          this.showSuccess = false
        },

        joinGroup() {
          let group_id = this.group.id
          let user_id = this.user
          this.updateUserDBJoin(user_id, group_id)
          this.updateGroupDBJoin(group_id, user_id)
          this.showSuccess= true
        },

        async updateUserDBJoin(documentId, newGroupId) {
          const db = getFirestore(firebaseApp)
          try { // there no catch error
            const documentRef = doc(db, 'users', documentId);
            const documentSnapshot = await getDoc(documentRef);

            if (documentSnapshot.exists()) {
                await updateDoc(documentRef, {
                    groups: arrayUnion(newGroupId)
                  });
              } else {
                console.log('Document does not exist.');
                }
            } catch (error) {
                console.error('Error updating document: ', error);
            }
        },

        async updateGroupDBJoin(documentId, newUserId) {
          const db = getFirestore(firebaseApp)
          try {
            const documentRef = doc(db, 'group', documentId);
            const documentSnapshot = await getDoc(documentRef);

        
            if (documentSnapshot.exists()) {
                await updateDoc(documentRef, {
                    GroupMembers: arrayUnion(newUserId),
                  });
              } else {
                console.log('Document does not exist.');
                }
            } catch (error) {
                console.error('Error updating document: ', error);
            }
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
}

.join-btn-default, .info-btn {
  margin-top: 10px;
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
}

.join-btn-default {
  background-color: #4CAF50; 
  color: white;
}

.info-btn {
  background-color: #008CBA;
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

.join-btn {
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .modal-content {
    margin: 20% auto;
    width: 95%;
  }
}
  </style>