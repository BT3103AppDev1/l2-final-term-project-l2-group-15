<template>
    <div class="Events-container">
        <h2>Recent Events</h2>
        <hr>
        <div id = 'Events-content'>
          <div v-for="event in group_events" :key="event.EventId" class="event-card">
            <h3>{{ event.EventName }}</h3>
            <span class="event-date">
              Date: {{ event.EventTime }}</span><br>
            <span class="event-location">Location: {{ event.EventLocation }}</span>
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
      margin-top: 0px;
      margin-bottom: 5px;
    }
  
    h3 {
      margin-bottom: 10px;
      margin-top: 0px;
    }
    hr {
      margin-bottom: 20px;
    }

    .event-card {
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .event-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  </style>
  