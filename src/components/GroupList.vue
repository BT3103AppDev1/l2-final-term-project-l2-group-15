<script setup>
import GroupListComponent from '@/components/GroupListComponent.vue';
import CreateGroupForm from '@/components/CreateGroupForm.vue';
</script>

<template>
  <div>
    <h1>All Groups Near Me</h1>
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
        <div v-for="group in groups" :key="group.id" class="group">
            <GroupListComponent :group="group" />
        </div>
  </div>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { getDocs, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default {
    components: {
        GroupListComponent,
    },
    data() {
        return {
            groups: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
        };
    },

    methods: {
    async fetchGroups() {
        const db = getFirestore(firebaseApp)
        const querySnapshot = await getDocs(collection(db, "group"));
        this.groups = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
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
  margin-left: 30px;
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