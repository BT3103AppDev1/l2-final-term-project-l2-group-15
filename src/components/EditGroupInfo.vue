<template>
    <div class="edit-group">
      <h2>Edit Group</h2>
      <form @submit.prevent="updateGroup" class="group-form">
        <div class="form-group">
          <label for="groupName">Group Name:</label>
          <input type="text" id="groupName" v-model="groupName" placeholder="Enter a new group name."/>
        </div>
        <div class="form-group">
          <label for="groupDescription">Description:</label>
          <textarea id="groupDescription" v-model="groupDescription" placeholder="Enter a new group description."></textarea>
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
          <li v-for="member in groupMemberNames" :key="member.id" class="member-item">
            {{ member.name }}
            <button @click="removeMemberFromGroup(member.id)" class="kick-btn">Kick Out</button>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import firebaseApp from '../firebase.js'
import { getFirestore, updateDoc } from 'firebase/firestore'
import { doc, getDoc, getDocs, arrayRemove, collection, onSnapshot } from 'firebase/firestore'

const db = getFirestore(firebaseApp);

export default {
    props: {
        group: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            groupDoc: {},
            groupMemberNames: [],
            groupName: '',
            groupDescription: '',
            showMessage: false,
            message: ''
        }
    },
    methods: {
        fetchGroupData() {
            const docRef = doc(db, 'group', this.group);
            onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
              this.groupDoc = docSnap.data();
              this.groupName = this.groupDoc.GroupName;
              this.groupDescription = this.groupDoc.GroupDescription;

              // Clear the previous group members
              this.groupMemberNames = [];

              // get username, userid of each member except admin
              for (const userid of this.groupDoc.GroupMembers) {
                if (!this.groupDoc.GroupAdmin.includes(userid)) {
                  // Since we are inside an async callback, we need to handle promises properly
                  this.getUsername(userid).then(username => {
                    this.groupMemberNames.push({ name: username, id: userid });
                  });
                }
              }
            } else {
              console.log("Group cannot be found!");
            }
          }, (error) => {
            console.error("Error fetching group data:", error);
          });
        },
        async updateGroup() {
            try {
                const docRef = doc(db, 'group', this.group);
                await updateDoc(docRef, {
                  GroupName: this.groupName,
                  GroupDescription: this.groupDescription
                });
                console.log("Group info updated:", this.group);
                this.message = "Group updated successfully!";
                this.showMessage = true;
            } catch (error) {
                console.log("Error updating group", error);
                this.message = "Error updating group!"
                this.showMessage = true;
            };
        },
        async removeMemberFromGroup(memberID) {
            try {
                // Remove member from group in Firestore
                const docRef = doc(db, 'group', this.group);
                await updateDoc(docRef, {
                    GroupMembers: arrayRemove(memberID)
                });
                console.log("User has been kicked out:", memberID);

                // remove the group from user doc as well
                await this.removeGroupFromUser(memberID);
            } catch (error) {
                console.log("Error in kicking member out", error);
            };
        },
        async removeGroupFromUser(memberID) {
            try {
                // Remove group from member in Firestore
                const docRef = doc(db, 'users', memberID);
                await updateDoc(docRef, {
                    groups: arrayRemove(this.group)
                });
                console.log("Group has been removed from user:", this.groupID);
            } catch (error) {
                console.log("Error in removing group from user", error);
            };
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
          this.$router.push({name:'SpecificGroupHome', params: {user: this.user, group: this.group}});
        }
    },
    created() {
        this.fetchGroupData();
    }
}
</script>

<style scoped>
.edit-group {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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