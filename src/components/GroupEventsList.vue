<script setup>
import GroupEventListComponent from '@/components/GroupsEventListComponent.vue';
import CreateEventForm from '@/components/CreateEventForm.vue';
</script>

<template>
    <div>
      <div class="event-header">
        <h1>Events</h1>
        <button v-if="isAdmin" class="create-event-btn" @click="isOpen = true">Create Event</button>
      </div>
      <br>
      <div v-if="isOpen" class="modal">
        <div class="modal-content">
          <button class="close-btn" @click="isOpen = false">Close</button>
          <CreateEventForm @added="closeModal"/>
        </div>
      </div>
      <!-- need to include event -->
      <div v-if="noEvents">
        <p>There is currently no event.</p>
      </div>
      <div v-for="event in events" class="group">
        <GroupEventListComponent :event="event" :group="groupId"/>
      </div>
    </div>

    <SuccessMessage v-if="showSuccess" :condition="message_passed" @close="closeSuccess"/>
  </template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { doc, getDocs, onSnapshot, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import SuccessMessage from './SuccessMessage.vue';


const db = getFirestore(firebaseApp);

export default {
    components: {
        GroupEventListComponent,
        CreateEventForm,
    },
    mounted() {
      this.fetchEvents();
    },
    data() {
        return {
            events: [],
            groupId: this.$route.params.group,
            user: getAuth().currentUser.uid,
            isOpen: false,
            isAdmin: false,
            groupAdmin: "",
            showSuccess: false,
            message_passed: "createEvent",
            noEvents: false
        };
    },
    methods: {
      fetchEvents() {
        const groupDocument = doc(db, "group", this.groupId);
        this.getGroupAdmin();
        const unsubscribe = onSnapshot(groupDocument, (documentSnapshot) => {
          if (documentSnapshot.exists()) {
            this.events = documentSnapshot.data()["GroupEvents"]; 
            console.log(this.events);
            if (this.events.length == 0) {
              this.noEvents = true;
            }
          } else {
            console.log("No such document!");
          }
        }, (error) => {
          console.error("Error fetching document:", error);
        });
      },
      async getGroupAdmin() {
        try {
          const docs = await getDocs(collection(db, "group"));
          docs.forEach((doc) => {
            if (doc.data().GroupId == this.groupId) {
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
      closeModal() {
        this.isOpen = false;
        this.showSuccess = true;
      },

      closeSuccess(){
        this.showSuccess = false;
      }
    }
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
  position: absolute; 
  right: 0; 
  top: 0;
  margin-top: 5px;
  margin-right: 5px;
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
  position: relative;
  background-color: #fff;
  margin: auto; 
  padding: 40px; 
  border-radius: 8px; 
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
  width: 50%; 
  max-width: 500px; 
  overflow-y: auto; 
}
</style>