<template>
  <div class="event-list-item">
    <div class="event-card">
      <div class="event-content">
        <div class="event-image-container" v-if="eventobj.ImageUrl">
          <img :src="eventobj.ImageUrl" alt="Event Image" class="event-image" />
        </div>

        <div class="event-details">
          <h3>{{ eventobj.EventName }}</h3>
          <p class="event-date">
            Date:
            <span
              v-html="formatDate(eventobj.EventTime).replace(/\n/g, '<br>')"
            ></span>
          </p>
          <p class="event-location">Location: {{ eventobj.EventLocation }}</p>

          <div v-if="!isMember">
            <button v-if="isAdmin" class="view-btn-default" @click="viewEvent">
              View Participants
            </button>
            <button
              class="join-btn-default"
              @click="joinEvent(eventobj.EventId)"
            >
              Join Event
            </button>
            <button v-if="isAdmin" class="delete-event-btn" @click="showWarning">
              Delete Event
            </button>
          </div>
          <div v-else>
            <button v-if="isAdmin" class="view-btn-default" @click="viewEvent">
              View Participants
            </button>
            <button class="leave-event-btn" @click="leaveEvent">
              Leave Event
            </button>
            <button v-if="isAdmin" class="delete-event-btn" @click="showWarning">
              Delete Event
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="this.showParticipants">
    <EventParticipants
      :participants="this.participants"
      @close="closeEventParticipants"
    />
  </div>

  <SuccessMessage
    v-if="showSuccess"
    :condition="message_passed"
    @close="closeSuccessMessage"
  />
  <WarningMessage
    v-if="showWarningMessage"
    :condition="condition"
    @confirm="deleteEvent"
    @cancel="hideWarning"
  />
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import SuccessMessage from "@/components/SuccessMessage.vue";
import EventParticipants from "@/components/EventParticipants.vue";
import WarningMessage from "./WarningMessage.vue";

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      group_events: [],
      user: getAuth().currentUser.uid,
      groupId: this.$route.params.group,
      message_passed: "joinEvent",
      showSuccess: false,
      eventobj: {},
      isMember: false,
      showParticipants: false,
      participants: [],
      showWarningMessage: false,
      condition: "",
      groupAdmin: "",
      isAdmin: false
    };
  },

  components: {
    SuccessMessage,
    EventParticipants,
    WarningMessage,
  },

  props: {
    event: String,
    group: String
  },

  mounted() {
    this.unsubscribe = this.fetchEvent(this.event);
    this.checkMember(this.event);
    this.getGroupAdmin();
  },

  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },

  methods: {
    viewEvent() {
      console.log("show participants");
      this.showParticipants = true;
    },
    formatDate(dateString) {
      const optionsDate = { year: "numeric", month: "long", day: "numeric" };
      const optionsTime = { hour: "2-digit", minute: "2-digit", hour12: true };
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString(undefined, optionsDate);
      const formattedTime = date.toLocaleTimeString(undefined, optionsTime);
      return `${formattedDate}\nTime: ${formattedTime}`;
    },
    checkMember(eventID) {
      let db = getFirestore(firebaseApp);
      let userID = this.user;
      let userRef = doc(db, "users", userID);

      const unsubscribe = onSnapshot(
        userRef,
        (doc) => {
          if (doc.exists()) {
            let userData = doc.data();
            this.isMember =
              userData.events && userData.events.includes(eventID);
          }
        },
        (error) => {
          console.error("Error fetching user data:", error);
        }
      );
    },
    fetchEvent(event) {
      const eventRef = doc(db, "Events", event);

      // Listen to changes in real-time
      const unsubscribeEvent = onSnapshot(
        eventRef,
        async (docSnap) => {
          if (docSnap.exists()) {
            console.log("Event data:", docSnap.data());
            this.eventobj = docSnap.data();

            // Listen to changes in participant data in real-time
            const participantPromises = this.eventobj.EventParticipants.map(
              (userId) => {
                return new Promise((resolve) => {
                  const userRef = doc(db, "users", userId);
                  const unsubscribeUser = onSnapshot(
                    userRef,
                    (userSnap) => {
                      if (userSnap.exists()) {
                        resolve(userSnap.data().username); // Assume username is the field you need
                      } else {
                        console.log(`No user found for ID: ${userId}`);
                        resolve(null); // Resolve with null if no user found
                      }
                    },
                    (error) => {
                      console.error("Error fetching user data:", error);
                      resolve(null); // Resolve with null on error
                    }
                  );
                });
              }
            );

            // Resolve all promises and update the participants array with names
            this.participants = await Promise.all(participantPromises);
            console.log("Participants loaded:", this.participants);
          } else {
            console.log("No such event!");
          }
        },
        (error) => {
          console.error("Error fetching event:", error);
        }
      );

      // Return the unsubscribe function so you can stop listening to changes when necessary
      return unsubscribeEvent;
    },
    async getGroupAdmin() {
      const db = getFirestore(firebaseApp);
      try {
        const docs = await getDocs(collection(db, "group"));
        docs.forEach((doc) => {
          if (doc.data().GroupId == this.group) {
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

    joinEvent(event_id) {
      let user_id = this.user;
      this.updateUserDBJoin(user_id, event_id);
      this.updateEventDBJoin(event_id, user_id);
      this.showSuccess = true;
    },

    async updateUserDBJoin(documentId, newEventId) {
      const db = getFirestore(firebaseApp);
      try {
        // there no catch error
        const documentRef = doc(db, "users", documentId);
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
          await updateDoc(documentRef, {
            events: arrayUnion(newEventId),
          });
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    },

    async updateEventDBJoin(documentId, newUserId) {
      const db = getFirestore(firebaseApp);
      try {
        const documentRef = doc(db, "Events", documentId);
        const documentSnapshot = await getDoc(documentRef);

        if (documentSnapshot.exists()) {
          await updateDoc(documentRef, {
            EventParticipants: arrayUnion(newUserId),
          });
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    },

    closeSuccessMessage() {
      this.showSuccess = false;
    },

    closeEventParticipants() {
      this.showParticipants = false;
    },

    leaveEvent() {
      this.deleteEventFromUser(this.user, this.eventobj.EventId);
      this.deleteUserFromEvent(this.user, this.eventobj.EventId);
    },

    async deleteEventFromUser(user, event) {
      let userDocRef = doc(db, "users", user);
      let userDocSnap = await getDoc(userDocRef);
      console.log(event);
      if (userDocSnap.exists()) {
        let userData = userDocSnap.data();
        if (userData.events) {
          let updatedEvents = userData.events.filter((e) => e !== event);
          await updateDoc(userDocRef, {
            events: updatedEvents,
          });
        } else {
          console.log("No events to update for this user.");
        }
      }
    },

    async deleteUserFromEvent(user, event) {
      let eventDocRef = doc(db, "Events", event);
      let eventDocSnap = await getDoc(eventDocRef);
      if (eventDocSnap.exists()) {
        let eventData = eventDocSnap.data();
        let updatedUsers = eventData.EventParticipants.filter(
          (userId) => userId !== user
        );
        await updateDoc(eventDocRef, {
          EventParticipants: updatedUsers,
        });
      }
    },

    async deleteEvent() {
      // deleting an event means 3 aspects
      // delete event from all the users
      // delete event from the group
      // wipe events from firebase

      //delete event from all users
      //users of the event
      let eventusers = this.eventobj.EventParticipants;
      for (let user of eventusers) {
        await this.deleteEventFromUser(user, this.eventobj.EventId);
      }

      // delete event from the groupa
      let groupDocRef = doc(db, "group", this.groupId);
      let groupDocSnap = await getDoc(groupDocRef);
      if (groupDocSnap.exists()) {
        let groupData = groupDocSnap.data();
        let updatedEvents = groupData.GroupEvents.filter(
          (event) => this.eventobj.EventId !== event
        );
        await updateDoc(groupDocRef, {
          GroupEvents: updatedEvents,
        });
      }

      //wipe event from firebase
      let eventDocRef = doc(db, "Events", this.eventobj.EventId);
      await deleteDoc(eventDocRef);
    },
    showWarning() {
      this.condition = "deleteEvent";
      this.showWarningMessage = true;
    },
    hideWarning() {
      this.showWarningMessage = false;
    },
  },
};
</script>

<style scoped>
.leave-event-btn,
.delete-event-btn {
  margin-right: 5px;
  padding: 5px 10px;
  background-color: #ff0000; 
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.join-btn-default,
.view-btn-default {
  margin-right: 5px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.event-image {
  width: 100%; 
  height: auto;
  border-radius: 12px; 
  margin-bottom: 15px;
}

.events-container {
  width: auto; 
}

h2 {
  margin-top: 30px;
  color: #334155;
  text-align: center;
  font-size: 2rem;
}

hr {
  border: 0;
  height: 2px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 87, 146, 0.75),
    rgba(0, 0, 0, 0)
  );
  margin-bottom: 40px;
}

.event-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 25px;
  transition: all 0.3s ease;
  height: 100%;
}

.event-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

h3,
.event-date,
.event-location {
  color: #475569;
  margin: 10px 0; 
  display: block; 
}

h3 {
  font-size: 1.5rem; 
}

.event-content {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.event-image-container {
  flex: 0.27;
  padding-right: 10px; 
}

.event-details {
  flex: 2;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .event-content {
    flex-direction: column;
  }

  .event-image-container {
    padding-right: 0; 
  }

  .event-card,
  h2 {
    padding: 15px; 
    font-size: 1.75rem;
  }
}
</style>
