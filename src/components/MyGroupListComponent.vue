<template>
  <div class="group-list-item">
    <div class="group-image" @click = "navigateToGroup">
      <img :src="fileURL" alt="No Group Logo" />
    </div>
    <div class="group-details">
        <h3 id="groupName" @click = "navigateToGroup">{{ group.GroupName }}</h3>
      <!-- <p id="groupLocation">{{ group.GroupLocation }}</p> -->
      <p id="groupDescription" @click = "navigateToGroup">{{ group.GroupDescription }}</p>
      <button v-if="!isAdmin" class="leave-group-btn" @click="leaveGroup">Leave Group</button>
      <button v-if="isAdmin" class="delete-group-btn" @click="showWarning">
        Delete Group
      </button>
    </div>
  </div>

  <SuccessMessage v-if="showSuccess" :condition="message_passed" />

  <WarningMessage
    v-if="showWarningMessage"
    :condition="condition"
    @confirm="deleteGroup"
    @cancel="hideWarning"
  />

  <!-- old success message-->
  <!-- <div v-if="showSuccess" class="modal"><div>
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
import firebaseApp from "../firebase.js";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import SuccessMessage from "@/components/SuccessMessage.vue";
import WarningMessage from "./WarningMessage.vue";

export default {
  components: {
    SuccessMessage,
    WarningMessage,
  },

  props: {
    group: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      user: getAuth().currentUser.uid,
      showSuccess: false,
      fileURL: null,
      fileID: this.group.GroupId,
      message_passed: "leaveGroup",
      groupAdmin: "",
      isAdmin: false,
      showWarningMessage: false,
      condition: "",
    };
  },

  methods: {
    async getImage(fileID) {
      console.log(fileID);
      let storage = getStorage();
      let filePath = "gs://connecthub-88e58.appspot.com/" + fileID;
      let fileRef = ref(storage, filePath);
      let fileURL = await getDownloadURL(fileRef);
      this.fileURL = fileURL;
      console.log("url is here", fileURL);
    },

    navigateToGroup() {
      this.$router.push({
        name: 'SpecificGroupHome',
        params: { group: this.group.GroupId, user: this.user },
      });
    },

    async deleteGroupFromUser(userID, groupID) {
      // search user via userID, delete GroupID from array
      const db = getFirestore(firebaseApp);
      let userDocRef = doc(db, "users", userID);
      let userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        let userData = userDocSnap.data();
        let updatedGroups = userData.groups.filter(
          (groupId) => groupId !== groupID
        );
        await updateDoc(userDocRef, {
          groups: updatedGroups,
        });
      }
    },

    async deleteUserFromGroup(userID, groupID) {
      // search group via groupID, delete UserID from array
      const db = getFirestore(firebaseApp);
      let groupDocRef = doc(db, "group", groupID);
      let groupDocSnap = await getDoc(groupDocRef);
      if (groupDocSnap.exists()) {
        let groupData = groupDocSnap.data();
        let updatedUsers = groupData.GroupMembers.filter(
          (userId) => userId !== userID
        );
        await updateDoc(groupDocRef, {
          GroupMembers: updatedUsers,
        });
      }
    },

    async deleteGroupFromFirestore(groupID) {
      const db = getFirestore(firebaseApp);
      const groupDocRef = doc(db, "group", groupID);
      await deleteDoc(groupDocRef);
    },

    async deleteMembersfromGroup(groupID) {
      const db = getFirestore(firebaseApp);

      // get GroupMembers array from Group
      const groupDocRef = doc(db, "group", groupID);
      const groupDocSnapshot = await getDoc(groupDocRef);
      const groupData = groupDocSnapshot.data();
      const groupMembers = groupData.GroupMembers || [];

      // find each member and delete the group
      for (const groupMemberID of groupMembers) {
        await this.deleteGroupFromUser(groupMemberID, groupID);
        //console.log("deleted", groupID, "from", groupMemberID)
      }
    },

    leaveGroup() {
      // user group array must no longer contain current group + group user array must no longer contain user
      let userID = this.user;
      let groupID = this.group.GroupId;
      this.deleteGroupFromUser(userID, groupID);
      this.deleteUserFromGroup(userID, groupID);
      this.showSuccess = true;
    },

    deleteGroup() {
      // all users group array must no longer contain current group
      let groupID = this.group.GroupId;
      this.deleteMembersfromGroup(groupID);
      this.deleteGroupFromFirestore(groupID);
      this.hideWarning();
      this.showSuccess = true;
    },

    async getGroupAdmin() {
      const db = getFirestore(firebaseApp);
      try {
        const docs = await getDocs(collection(db, "group"));
        docs.forEach((doc) => {
          if (doc.data().GroupId == this.group.GroupId) {
            this.groupAdmin = doc.data().GroupAdmin[0];
            console.log("Group admin retrieved successfully:", this.groupAdmin);
          }
        });
        if (this.groupAdmin == this.user) {
          this.isAdmin = true;
        }
      } catch (error) {
        console.error("Error retrieving group admin:", error);
      }
    },
    showWarning() {
      this.condition = "deleteGroup";
      this.showWarningMessage = true;
    },
    hideWarning() {
      this.showWarningMessage = false;
    },
  },

  mounted() {
    try {
      this.getImage(this.group.GroupId);
    } catch {
      this.fileURL = null;
    }
    this.getGroupAdmin();
  },
};
</script>

<style scoped>
.group-list-item {
  display: block;
  width: 25%;
  background-color: #f5f5f5;
  height: 400px;
  width: 350px;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 50px;
  margin-left: 50px;
  border: solid rgb(216, 216, 216);
  border-radius: 10px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.group-list-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.group-image {
  align-content: center;
  width: 350px; 
  height: 200px; 
  text-align: center;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 25px;
}

.group-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid lightgrey;
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
  -webkit-line-clamp: 1;
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
  padding: 8px 10px;
  background-color: #ff0000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 40px;
  font-family: "Roboto", sans-serif;
  font-weight: 400;
}

.leave-group-btn:hover,
.delete-group-btn:hover {
  background-color: rgb(189, 19, 19);
}

.success-msg {
  font-size: 5vh;
  color: rgb(24, 232, 24);
}
</style>
