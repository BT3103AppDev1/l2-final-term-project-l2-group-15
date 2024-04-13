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
      <GroupEventListComponent />
      <div v-if="isOpen" class="modal">
        <div class="modal-content">
          <button class="close-btn" @click="isOpen = false">Close</button>
          <CreateEventForm/>
        </div>
      </div>
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
.event-header {
  width: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  background-color: #F8F9FA; /* Light grey background for slight contrast */
  box-shadow: 0 2px 4px 0 rgba(0,0,0,0.1); /* Soft shadow for depth */
}

h1 {
  color: #343A40; /* Dark grey for improved readability */
  font-size: 2rem; /* Increase size for importance */
  margin: 0; /* Reset margin for cleaner alignment */
}

.create-event-btn, .close-btn {
  cursor: pointer;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  text-transform: uppercase; /* Stylistic choice for buttons */
  font-size: 0.9rem; /* Slightly smaller text, uppercase compensates for readability */
  transition: background-color 0.2s; /* Smooth transition for hover effects */
}

.create-event-btn {
  background-color: #007bff; /* Primary blue */
}

.create-event-btn:hover {
  background-color: #0056b3; /* Darker blue on hover for interactive feedback */
}

.close-btn {
  background-color: #dc3545; /* Danger red */
}

.close-btn:hover {
  background-color: #c82333; /* Darker red on hover */
}

.modal {
  position: fixed;
  z-index: 1000; /* Ensure modal is above everything */
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Darker backdrop for better focus on modal */
}

.modal-content {
  background-color: #fff;
  margin: auto; /* Centered in viewport */
  padding: 40px; /* Increased padding for more space around content */
  border-radius: 8px; /* Rounded corners for modern appearance */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* Soft shadow for depth */
  width: 50%; /* Adjusted width for better use of space */
  max-width: 500px; /* Maximum width to ensure content is readable */
  overflow-y: auto; /* Allow scrolling within the modal if content is long */
}
</style>