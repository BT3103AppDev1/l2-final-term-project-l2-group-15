<script setup>
import MyGroupListComponent from '@/components/MyGroupListComponent.vue';
import CreateGroupForm from '@/components/CreateGroupForm.vue';
</script>

<template>
  <div>
    <h1>List of My Groups</h1>
    <div class="btn-container">
        <button class="create-group-btn" @click="isOpen = true">Create Group</button>
    </div>
    <br>
    <div v-if="isOpen" class="modal">
        <div class="modal-content">
          <button class="close-btn" @click="isOpen = false">Close</button>
          <CreateGroupForm/>
        </div>
    </div>
        <div v-for="group in group_list" :key="group.id" class="group">
            <MyGroupListComponent :group="group" />
        </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import GroupList from './GroupList.vue';

export default {
    components: {
        MyGroupListComponent,
    },
    data() {
        return {
            groups: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
            group_list: [],
        };
    },

    methods: {
        async fetchGroups() {
            const db = getFirestore(firebaseApp)
            const userDocRef = doc(db, 'users', this.user); 
            const docSnap = await getDoc(userDocRef);
            let group_listid = docSnap.data().groups
            this.fetchGroupObject(group_listid)
            console.log(this.group_list)
            },

        async fetchGroupObject(group_listid) {
            for (const groupId of group_listid) {
                const db = getFirestore(firebaseApp)
                const groupDocRef = doc(db, 'group', groupId);
                const docSnap = await getDoc(groupDocRef);
            if (docSnap.exists()) {
                this.group_list.push(docSnap.data());
                }
            }
        }
    },

    mounted() {
        this.fetchGroups();
    },

  };
</script>

<style scoped>
h1 {
  background-color: white;
}

.btn-container {
  display: flex;
  justify-content: flex-end;
}

.create-group-btn, .close-btn {
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}

.create-group-btn {
  background-color: #007bff; /* Bootstrap primary */
  margin-right: 20px; /* Adjust as needed */
}

.close-btn {
  background-color: #dc3545; /* Bootstrap danger */
}

.modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

.modal-content {
  background-color: #fefefe;
  margin: 10% auto; /* 10% from the top and centered */
  padding: 20px;
  border: 1px solid #888;
  width: 75%; /* Could be more or less, depending on screen size */
  height: 75%; /* Adjust based on content */
}
</style>