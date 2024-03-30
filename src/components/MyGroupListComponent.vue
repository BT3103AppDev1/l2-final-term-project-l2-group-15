<template>
  <div class="group-list-item">
    <div class="group-image">
      <img :src='fileURL' alt="No Group Logo"/>
    </div>
    <div class="group-details">
      <router-link :to="{name : 'SpecificGroupHome', params:{group : group.GroupId, user : user}}">
        <h3 id="groupName">{{ group.GroupName }}</h3>
      </router-link>
      <!-- <p id="groupLocation">{{ group.GroupLocation }}</p> -->
      <p id="groupDescription">{{ group.GroupDescription }}</p>
      <button class="leave-group-btn" @click="leaveGroup">Leave Group</button>
      <button class="delete-group-btn" @click="deleteGroup">Delete Group</button>
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
</template>
  
<script> 
import firebaseApp from '../firebase.js'; 
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, updateDoc, deleteDoc} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default {
  props: {
      group: {
          type: String,
          required: true
      },
  },

  data() {
      return {
          user: getAuth().currentUser.uid,
          showSuccess: false,
          fileURL: null,
          fileID: this.group.GroupId
      }
  },

  methods: {

    async getImage(fileID) {
          console.log(fileID)
          let storage = getStorage()
          let filePath ="gs://connecthub-88e58.appspot.com/" + fileID
          let fileRef = ref(storage, filePath)
          let fileURL = await getDownloadURL(fileRef)
          this.fileURL = fileURL
          console.log("url is here", fileURL)
    },

    toggleSuccess() {
          this.showSuccess = false
          this.$router.push("/all_groups")
    },

    async deleteGroupFromUser(userID, groupID) { // search user via userID, delete GroupID from array
      const db = getFirestore(firebaseApp)
      let userDocRef = doc(db, 'users', userID)
      let userDocSnap = await getDoc(userDocRef)
      if (userDocSnap.exists()) {
          let userData = userDocSnap.data()
          let updatedGroups = userData.groups.filter(groupId => groupId !== groupID)
          await updateDoc(userDocRef, {
              groups: updatedGroups
          });
        }
    },

    async deleteUserFromGroup(userID, groupID) { // search group via groupID, delete UserID from array
      const db = getFirestore(firebaseApp)
      let groupDocRef = doc(db, 'group', groupID)
      let groupDocSnap = await getDoc(groupDocRef)
      if (groupDocSnap.exists()) {
          let groupData = groupDocSnap.data();
          let updatedUsers = groupData.GroupMembers.filter(userId => userId !== userID);
          await updateDoc(groupDocRef, {
              GroupMembers: updatedUsers
          });
        }
    },

    async deleteGroupFromFirestore(groupID) {
      const db = getFirestore(firebaseApp)
      const groupDocRef = doc(db, 'group', groupID)
      await deleteDoc(groupDocRef)
    },

    async deleteMembersfromGroup(groupID) {
      const db = getFirestore(firebaseApp)

      // get GroupMembers array from Group
      const groupDocRef = doc(db, 'group', groupID)
      const groupDocSnapshot = await getDoc(groupDocRef)
      const groupData = groupDocSnapshot.data()
      const groupMembers = groupData.GroupMembers || []

      // find each member and delete the group
      for (const groupMemberID of groupMembers) {
        await this.deleteGroupFromUser(groupMemberID, groupID)
        //console.log("deleted", groupID, "from", groupMemberID)
      }
    },

    leaveGroup() { // user group array must no longer contain current group + group user array must no longer contain user
      let userID = this.user
      let groupID = this.group.GroupId
      this.deleteGroupFromUser(userID, groupID)
      this.deleteUserFromGroup(userID, groupID)
      this.showSuccess = true;  
    },

    deleteGroup() { // all users group array must no longer contain current group 
      let groupID = this.group.GroupId
      this.deleteMembersfromGroup(groupID)
      this.deleteGroupFromFirestore(groupID)
      this.showSuccess = true
    }
  },

  mounted() {
    try {
        this.getImage(this.group.GroupId)
    } catch {
        this.fileURL = null
    }
  }
}
</script>
  
<style scoped>
.group-list-item {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  width: 25%;
  background-color: #f5f5f5;
  height: 400px;
  width: 300px;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 50px;
  margin-left: 50px;
  border: solid rgb(216, 216, 216);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.group-list-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.group-image {
  width: 600px; /* Adjust as needed */
  height: 200px; /* Adjust as needed */
  text-align: center;
  overflow: hidden;
  border-radius: 5px;
}

.group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensures the image covers the entire space */
}

.group-details {
  font-size: 20px;
}

#groupDescription {
  text-align: center;
  font-size: 15px;
  color: grey;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1; /* Limit to 3 lines in WebKit browsers */
  -webkit-box-orient: vertical;
  display: -webkit-box;
}

#groupLocation {
  font-size: auto;
  color: grey;
}

.group-buttons {
  margin-top: 10px;
}

.leave-group-btn,
.delete-group-btn {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #ff0000; /* Example background color */
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.success-msg {
  font-size: 5vh;
  color: rgb(24, 232, 24);
}

</style>