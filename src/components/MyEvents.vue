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
        <div v-for="event in user_events" :key="event.event_id" class="event-card">
            <h3>{{ event.event_name }}</h3>
            <p class="event-date">Date: {{ event.time }}</p>
            <p class="event-location">{{ event.location }}</p>
        </div>
    </div>
</template>


<script>
    import firebaseApp from '../firebase.js';
    import { getFirestore } from "firebase/firestore"
    import { collection, getDocs, doc, deleteDoc, getDoc } from "firebase/firestore"

    const db = getFirestore(firebaseApp)

    export default {
        data() {
            return {
                user_events: [],
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
                try {
                    //obtain 
                    const users = await getDocs(collection(db, "users"));
                    users.forEach((u) => {
                        // console.log(u.uid);

                        let u_ = u.data()
                        
                        if (u_.uid === this.user) {
                            const user_events = u_.events;
                            const fetchPromises = user_events.map(obj => this.fetchSingleDocument(db, "Events", obj));

                            Promise.all(fetchPromises).then(events => {
                                events.forEach(e => {
                                    let user_event = {
                                        event_id: e.EventID,  
                                        event_name: e.EventName,
                                        group_id: e.GroupID,
                                        location: e.Location,
                                        time: e.Time.toDate().toLocaleString('en-us')
                                    };

                                    // Assuming this.user_events is an array meant to store fetched event details
                                    this.user_events.push(user_event);
                                });
                            }).catch(error => {
                                console.error("Error fetching user events:", error);
                            });
                        }
                    })
                    console.log(this.user_events)                        
                } catch (error) {
                    console.error("Error fetching documents: ", error)
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