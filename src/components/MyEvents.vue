<template>
    <h2>My Events</h2><hr>
    <div v-for = "events in this.user_events" :key="this.user_events.event_id">
        <h3>{{ events.event_name }}</h3>
        <p>Date: {{ events.time }}</p>
        <p>{{ events.location }}</p>
        <br>
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
                    //pbtain 
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

