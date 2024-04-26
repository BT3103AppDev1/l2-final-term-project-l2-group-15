<template>
  <div class="events-container">
    <h2>Recent Events</h2>
    <hr>
    <div class="events-content">
      <div v-for="event in group_events" :key="event.EventId" class="event-card">
        <div class="event-image-container" v-if="event.ImageUrl">
          <img :src="event.ImageUrl" alt="Event Image" class="event-image">
        </div>
        <div class="event-details">
          <h3>{{ event.EventName }}</h3>
          <p class="event-date">
            Date: <span v-html="formatDate(event.EventTime).replace(/\n/g, '<br>')"></span>
          </p>
          <p class="event-location">Location: {{ event.EventLocation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

  <script>
    import firebaseApp from '../firebase.js';
    import { getFirestore } from "firebase/firestore"
    import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore"
    import { getAuth } from 'firebase/auth';
  
    const db = getFirestore(firebaseApp)

  export default {
      name: "Recent_events",

      data() {
        return {
          group_events: [],
          user: getAuth().currentUser.uid,
          groupId: this.$route.params.group
        }
      },

      mounted() {
        this.fetchGroupEvents();
      },

      methods: {
        formatDate(dateString) {
            const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
            const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: true };
            const date = new Date(dateString);
            const formattedDate = date.toLocaleDateString(undefined, optionsDate);
            const formattedTime = date.toLocaleTimeString(undefined, optionsTime);
            return `${formattedDate}\nTime: ${formattedTime}`;
        },
        async fetchGroupEvents() {
          const ref = doc(db, "group", this.groupId);
          try {
            const snapshot = await getDoc(ref);
            if (snapshot.exists()) {
              const eventsArr = snapshot.data().GroupEvents; 

              for (const eventId of eventsArr) {
                  const eventRef = doc(db, "Events", eventId);
                  const eventSnapshot = await getDoc(eventRef);
                  if (eventSnapshot.exists()) {
                      this.group_events.push(eventSnapshot.data());
                  } else {
                      console.log(`Event with ID ${eventId} does not exist`);
                  }
              }
            } else {
              console.log("Document does not exist");
            }

          } catch (error) {
              console.error("Error accessing field: ", error);
          }
        }, 
                

        async fetchSingleDocument(db, collection, document) {
          try {
            const db = getFirestore();
            const docRef = doc(db, collection, document);
            const docSnap = await getDoc(docRef);
            return docSnap.data()
          } catch (error) {
              console.error("Error Fetching Documents: ", error)
          }
        }   
      }
  }
  </script>
    
<style scoped>
h2 {
  font-size: 24px;
  margin-top: 8px;
  margin-left: 10px;
  margin-bottom: -10px;
}

h3 {
  margin-bottom: 10px;
  margin-top: 0px;
}

hr {
  margin-top: 0px;
  margin-bottom: 20px;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}


.events-content {
  display: flex;
  flex-direction: column;
}

.event-card {
  display: flex;
  align-items: center; 
  margin-bottom: 20px; 
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden; 
}

.event-image-container {
  flex: 0 0 150px; 
  height: 100px; 
  overflow: hidden;
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  margin-left: 10px;
  margin-right: 10px;
}


.event-details {
  padding: 10px;
  flex: 1; 
}

.event-date, .event-location {
  margin-top: 5px;
}

hr {
  margin-top: 20px;
  border: 0;
  height: 1px;
  background-color: #ccc;
}
</style>

  