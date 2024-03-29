<script setup>
import GroupEventListComponent from '@/components/GroupsEventListComponent.vue';
import CreateEventForm from '@/components/CreateEventForm.vue';
</script>

<template>
    <div>
      <div class="event-header">
        <h1>Events</h1>
        <button class="create-event-btn" @click="isOpen = true">Create Event</button>
      </div>
      <br>
      <div v-if="isOpen" class="modal">
        <div class="modal-content">
          <button class="close-btn" @click="isOpen = false">Close</button>
          <CreateEventForm/>
        </div>
      </div>
            <GroupEventListComponent :group="group" />
    </div>
  </template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { getDocs, onSnapshot, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default {
    components: {
        GroupEventListComponent,
        CreateEventForm,
    },
    data() {
        return {
            groups: [],
            user: getAuth().currentUser.uid,
            isOpen: false,
        };
    },

  };
</script>

<style scoped>
h1 {
  background-color: white;
  margin-left: 30px;
}

.event-header {
  display: flex; /* Use Flexbox layout */
  justify-content: space-between; /* Align items at either end of the container */
  align-items: center; /* Vertically center items */
  margin-left: 30px; /* Adjust margin as needed */
  margin-right: 30px; /* Adjust margin as needed */
}

.create-event-btn, .close-btn {
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}

.create-event-btn {
  background-color: #007bff; /* Bootstrap primary */
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