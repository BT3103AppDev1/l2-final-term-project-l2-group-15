<template>
    <div class="events-container">
        <h2>My Events</h2>
        <hr>
        <div v-for="event in group_events" :key="event.EventId" class="event-card">
            <h3>{{ event.EventName }}</h3>
            <p class="event-date">Date: {{ event.EventTime }}</p>
            <p class="event-location">{{ event.EventLocation }}</p>
            <button class="join-btn-default" @click="joinEvent(event.EventId)">Join Event</button>
        </div>
    </div>
</template>


<script>
    import firebaseApp from '../firebase.js';
    import { getFirestore } from "firebase/firestore"
    import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore"
    import { getAuth } from 'firebase/auth';

    const db = getFirestore(firebaseApp)

    export default {
        data() {
            return {
                group_events: [],
                user: getAuth().currentUser.uid,
                groupId: this.$route.params.group,
            };
        },

        props: {
            user: String,
        },

        created() {
            this.fetchGroupEvents();
        },

        methods: {
            async fetchGroupEvents() {
                // Correct collection name if necessary
                const ref = doc(db, "group", this.groupId);
                try {
                    const snapshot = await getDoc(ref);
                    if (snapshot.exists()) {
                        const eventsArr = snapshot.data().GroupEvents; 
                        const eventsPromises = eventsArr.map(eventId => {
                            const eventRef = doc(db, "Events", eventId);
                            return getDoc(eventRef); 
                        });
                        const eventsSnapshots = await Promise.all(eventsPromises); 
                        this.group_events = eventsSnapshots
                            .filter(doc => doc.exists())
                            .map(doc => doc.data()); 
                    } else {
                        console.log("Document does not exist");
                    }

                } catch (error) {
                    console.error("Error accessing Firestore: ", error);
                }
            }, 

            joinEvent(event_id) {
                let user_id = this.user
                this.updateUserDBJoin(user_id, event_id)
                this.updateEventDBJoin(event_id, user_id)
                alert("Successfully Joined Event")
            },

            async updateUserDBJoin(documentId, newEventId) {
                const db = getFirestore(firebaseApp)
                try { // there no catch error
                const documentRef = doc(db, 'users', documentId)
                const documentSnapshot = await getDoc(documentRef)

                if (documentSnapshot.exists()) {
                    await updateDoc(documentRef, {
                        events: arrayUnion(newEventId)
                        });
                    } else {
                    console.log('Document does not exist.')
                    }
                } catch (error) {
                    console.error('Error updating document: ', error)
                }
            },

            async updateEventDBJoin(documentId, newUserId) {
                const db = getFirestore(firebaseApp)
                try {
                const documentRef = doc(db, 'Events', documentId)
                const documentSnapshot = await getDoc(documentRef)
            
                if (documentSnapshot.exists()) {
                    await updateDoc(documentRef, {
                        EventParticipants: arrayUnion(newUserId),
                        });
                    } else {
                    console.log('Document does not exist.')
                    }
                } catch (error) {
                    console.error('Error updating document: ', error)
                }
            },
        }
    }

</script>

<style>
.events-container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
}

h2 {
    color: #334155; /* Dark slate color for better contrast */
    text-align: center;
    margin-bottom: 40px; /* Increased spacing for a cleaner look */
    font-size: 2rem; /* Larger for emphasis */
}

hr {
    border: 0;
    height: 2px; /* Thicker for a more pronounced separation */
    background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 87, 146, 0.75), rgba(0, 0, 0, 0));
    margin-bottom: 40px; /* Consistent with h2 margin for symmetry */
}

.event-card {
    background-color: #ffffff; /* Pure white for cleanliness */
    border: 1px solid #e2e8f0; /* Subtle border for definition */
    border-radius: 12px; /* Rounded corners for a modern feel */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); /* Soft shadow for depth */
    padding: 25px; /* Increased padding for better content breathing room */
    margin-bottom: 30px; /* Increased spacing between cards */
    transition: all 0.3s ease; /* Smooth transition for hover effects */
}

.event-card:hover {
    transform: translateY(-10px); /* More pronounced hover effect */
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04); /* Deeper shadow on hover for a lifting effect */
}

h3 {
    color: #005792; /* Keeping the brand color */
    margin: 0 0 15px 0; /* Increased bottom margin for better separation */
    font-size: 1.5rem; /* Larger size for emphasis */
}

.event-date, .event-location {
    color: #475569; /* Slightly darker for better readability */
    font-size: 1rem; /* Slightly larger font size */
    margin: 10px 0; /* Increased margin for better separation */
    display: block; /* Ensure these are block level for consistent spacing */
}

@media (max-width: 768px) {
    .events-container {
        padding: 20px;
    }

    .event-card {
        padding: 20px;
    }

    h2 {
        margin-bottom: 30px; /* Adjusted for mobile spacing */
        font-size: 1.75rem; /* Adjusted size for mobile */
    }
}
</style>