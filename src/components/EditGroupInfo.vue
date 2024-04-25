<template>
  <div class="edit-group">
    <div class="header">
      <h2>Edit Group</h2>
      <div class="delete-group">
        <button class="deleteGroupButton" @click="showWarning">
          Delete Group
        </button>
      </div>
    </div>
    <form @submit.prevent="updateGroup" class="group-form">
      <div class="change-image">
        <span><strong>Group Image:</strong></span>
        <!-- Display the current image -->
        <div class="image-container">
          <img @click="openFileInput" :src="imageUrl" alt="Current Image" />
        </div>
        <input
          type="file"
          accept="image/*"
          ref="fileInput"
          @change="handleImageChange"
          class="file-input"
        />
      </div>
      <div class="form-group">
        <label for="groupName">Group Name:</label>
        <input
          type="text"
          id="groupName"
          v-model="groupName"
          placeholder="Enter a new group name."
        />
      </div>
      <div class="form-group">
        <label for="groupDescription">Description:</label>
        <textarea
          id="groupDescription"
          v-model="groupDescription"
          placeholder="Enter a new group description."
        ></textarea>
      </div>
      <button type="submit" class="update-btn">Update Group</button>
    </form>

    <!-- Modal Overlay -->
    <div v-if="showMessage" class="modal-overlay" @click.self="closeMessage">
      <div class="modal-content">
        <p>{{ message }}</p>
      </div>
    </div>

    <div class="members-section">
      <h2>Members</h2>
      <ul class="members-list">
        <li
          v-for="member in groupMemberNames"
          :key="member.id"
          class="member-item"
        >
          {{ member.name }}
          <button @click="showWarningKick(member.id)" class="kick-btn">
            Kick Out
          </button>
        </li>
      </ul>
    </div>

    <!--Warning Message for Delete Member-->
    <WarningMessage
      v-if="showWarningMessageKick"
      :condition="condition"
      :memberid="selectedMemberId"
      @confirm="removeMemberFromGroup"
      @cancel="hideWarningKick"
    />

    <!--Warning Message for Delete Group-->
    <WarningMessage
      v-if="showWarningMessage"
      :condition="condition"
      @confirm="deleteGroup"
      @cancel="hideWarning"
    />
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import WarningMessage from "@/components/WarningMessage.vue";
import { getFirestore, updateDoc } from "firebase/firestore";
import {
  doc,
  getDoc,
  getDocs,
  arrayRemove,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const db = getFirestore(firebaseApp);
const storage = getStorage();

export default {
  components: {
    WarningMessage,
  },
  props: {
    group: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      groupDoc: {},
      groupMemberNames: [],
      groupName: "",
      groupDescription: "",
      showMessage: false,
      message: "",
      imageUrl: "",
      selectedFile: null,
      showWarningMessage: false,
      showWarningMessageKick: false,
      selectedMemberId: "",
      condition: "",
    };
  },
  methods: {
    fetchGroupData() {
      const docRef = doc(db, "group", this.group);
      onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            this.groupDoc = docSnap.data();
            this.groupName = this.groupDoc.GroupName;
            this.groupDescription = this.groupDoc.GroupDescription;
            // get imageURL
            this.getImage(this.group).then((url) => {
              this.imageUrl = url;
            });

            // Clear the previous group members
            this.groupMemberNames = [];

            // get username, userid of each member except admin
            for (const userid of this.groupDoc.GroupMembers) {
              if (!this.groupDoc.GroupAdmin.includes(userid)) {
                // Since we are inside an async callback, we need to handle promises properly
                this.getUsername(userid).then((username) => {
                  this.groupMemberNames.push({ name: username, id: userid });
                });
              }
            }
          } else {
            console.log("Group cannot be found!");
          }
        },
        (error) => {
          console.error("Error fetching group data:", error);
        }
      );
    },
    async updateGroup() {
      try {
        const docRef = doc(db, "group", this.group);
        await updateDoc(docRef, {
          GroupName: this.groupName,
          GroupDescription: this.groupDescription,
        });
        await this.updateImage();
        console.log("Group info updated:", this.group);
        this.message = "Group updated successfully!";
        this.showMessage = true;
      } catch (error) {
        console.log("Error updating group", error);
        this.message = "Error updating group!";
        this.showMessage = true;
      }
    },
    async removeMemberFromGroup(memberID) {
      try {
        // Remove member from group in Firestore
        const docRef = doc(db, "group", this.group);
        await updateDoc(docRef, {
          GroupMembers: arrayRemove(memberID),
        });
        console.log("User has been kicked out:", memberID);

        // remove the group from user doc as well
        await this.removeGroupFromUser(memberID);
        this.showWarningMessageKick = false;
        this.selectedMemberId = "";
      } catch (error) {
        console.log("Error in kicking member out", error);
      }
    },
    async removeGroupFromUser(memberID) {
      try {
        // Remove group from member in Firestore
        const docRef = doc(db, "users", memberID);
        await updateDoc(docRef, {
          groups: arrayRemove(this.group),
        });
        console.log("Group has been removed from user:", this.group);
      } catch (error) {
        console.log("Error in removing group from user", error);
      }
    },
    async getUsername(userid) {
      try {
        const docs = await getDocs(collection(db, "users"));
        for (const doc of docs.docs) {
          if (doc.data().uid == userid) {
            const username = doc.data().username;
            console.log("Username retrieved successfully:", username);
            return username;
          }
        }
      } catch (error) {
        console.error("Error retrieving username:", error);
      }
    },
    closeMessage() {
      this.showMessage = false;
      //navigate user to the group dashboard page upon closing message
      this.$router.push({
        name: "SpecificGroupHome",
        params: { user: this.user, group: this.group },
      });
    },
    async getImage(fileID) {
      console.log(fileID);
      let filePath = "gs://connecthub-88e58.appspot.com/" + fileID;
      let fileRef = ref(storage, filePath);
      let fileURL = await getDownloadURL(fileRef);
      console.log("url is here", fileURL);
      return fileURL;
    },
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleImageChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.imageUrl = URL.createObjectURL(this.selectedFile);
        console.log("Selected file", this.selectedFile);
      }
    },
    async updateImage() {
      if (!this.selectedFile) {
        alert("Please select a file first.");
        return;
      }

      const imageName = this.group; // The name of the image to replace

      try {
        // Delete the existing image
        const existingImageRef = ref(
          storage,
          `gs://connecthub-88e58.appspot.com/${imageName}`
        );
        if (existingImageRef) {
          await deleteObject(existingImageRef);
        }

        // Upload the new image
        const newImageRef = ref(storage, imageName);
        const uploadResult = await uploadBytes(newImageRef, this.selectedFile);
        const newImageUrl = await getDownloadURL(uploadResult.ref);

        // Update the current image URL in the component's state
        this.imageUrl = newImageUrl;

        console.log("Image updated successfully:", newImageUrl);
      } catch (error) {
        console.error("Failed to update image:", error);
      }
    },
    async deleteGroupFromFirestore(groupID) {
      const groupDocRef = doc(db, "group", groupID);
      await deleteDoc(groupDocRef);
    },
    async deleteMembersfromGroup(groupID) {
      // get GroupMembers array from Group
      const groupDocRef = doc(db, "group", groupID);
      const groupDocSnapshot = await getDoc(groupDocRef);
      const groupData = groupDocSnapshot.data();
      const groupMembers = groupData.GroupMembers || [];

      // find each member and delete the group
      for (const groupMemberID of groupMembers) {
        await this.removeGroupFromUser(groupMemberID);
      }
    },
    async deleteGroup() {
      // all users group array must no longer contain current group
      await this.deleteMembersfromGroup(this.group);
      await this.deleteGroupFromFirestore(this.group);
      this.$router.push({ name: "MyGroups" });
    },

    showWarning() {
      this.condition = "deleteGroup";
      this.showWarningMessage = true;
    },

    hideWarning() {
      this.showWarningMessage = false;
    },

    showWarningKick(memberId) {
        this.selectedMemberId = memberId;
        this.condition = "deleteMemberFromGroup";
      this.showWarningMessageKick = true;
    },
    hideWarningKick() {
      this.showWarningMessageKick = false;
    },
  },
  created() {
    this.fetchGroupData();
  },
};
</script>

<style scoped>
.edit-group {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.deleteGroupButton {
  padding: 10px 20px;
  font-size: 1.2rem;
  background-color: #ff4136; /* Red color for striking appearance */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.deleteGroupButton:hover {
  background-color: #e82c20; /* Darker shade of red for hover effect */
}

.change-image {
  margin-bottom: 20px;
}
.image-container {
  position: relative;
  display: inline-block; /* Makes the container as wide as its content */
  margin-top: 10px;
}

.image-container img {
  width: 40%; /* Adjust based on your needs */
  height: auto; /* Maintain aspect ratio */
}

.group-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 10px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.update-btn {
  padding: 10px 20px;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.update-btn:hover {
  background-color: #006ae1;
}

/* Members list styling */
.members-section {
  background-color: #f9f9f9;
  padding: 20px;
  margin-top: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.members-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.member-item:last-child {
  border-bottom: none;
}

.kick-btn {
  background-color: #ff4d4d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.kick-btn:hover {
  background-color: #ff3333;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: auto;
  max-width: 500px;
}

.modal-content p {
  margin: 0 0 20px 0;
}
</style>
