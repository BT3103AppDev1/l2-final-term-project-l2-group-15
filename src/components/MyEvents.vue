<!-- <template>
    <h2>My Events</h2><hr>
    <div v-for = "events in this.user_events" :key="this.user_events.event_id">
        <h3>{{ events.event_name }}</h3>
        <p>Date: {{ events.time }}</p>
        <p>{{ events.location }}</p>
        <br>
    </div>

</template> -->

<template>
    <div class="events-container">
        <h2>My Events</h2>
        <hr>
        <div v-for="event in user_events" :key="event.EventId" class="event-card">
            <h3>{{ event.EventName }}</h3>
            <p class="event-date">Date: {{ event.EventTime }}</p>
            <p class="event-location">{{ event.EventLocation }}</p>
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
        data() {
            return {
                user_events: [],
                user: getAuth().currentUser.uid,
            };
        },

        props: {
            user: String,
        },

        created() {
            this.fetchUserEvents();
        },

        methods: {
            async fetchUserEvents() {
                const ref = doc(db, "users", this.user);
                try {
                    const snapshot = await getDoc(ref);
                    if (snapshot.exists()) {
                        const eventsArr = snapshot.data().events; 

                        for (const eventId of eventsArr) {
                            const eventRef = doc(db, "Events", eventId);
                            const eventSnapshot = await getDoc(eventRef);
                            if (eventSnapshot.exists()) {
                                this.user_events.push(eventSnapshot.data());
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

<style>
.events-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h2 {
    color: #333;
    text-align: center;
    margin-bottom: 20px;
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

h3 {
    color: #005792;
    margin: 0 0 10px 0;
}

.event-date, .event-location {
    color: #666;
    font-size: 0.9rem;
    margin: 5px 0;
}

@media (max-width: 768px) {
    .events-container {
        padding: 10px;
    }

    .event-card {
        padding: 15px;
    }
}
</style>