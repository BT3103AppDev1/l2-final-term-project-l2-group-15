    <template>
        <div class="event-list-item">
        <div class="event-card">
            <h3>{{ eventobj.EventName }}</h3>
            <p class="event-date">Date: {{ eventobj.EventTime }}</p>
            <p class="event-location">{{ eventobj.EventLocation }}</p>
            <div v-if="!isMember">
                <button class="join-btn-default" @click="joinEvent(eventobj.EventId)">Join Event</button>
            </div>
            <div v-else>
                <button class="view-btn-default" disabled> Joined</button>
                <button class="leave-event-btn" @click="leaveEvent">Leave Event</button>
            </div>
            <button class="delete-event-btn" @click="deleteEvent">Delete Event</button>
        </div>
        </div>

            <!-- <div v-for="event in group_events" :key="event.EventId" class="event-card">
                <h3>{{ event.EventName }}</h3>
                <p class="event-date">Date: {{ event.EventTime }}</p>
                <p class="event-location">{{ event.EventLocation }}</p>
                <button class="join-btn-default" @click="joinEvent(event.EventId)">Join Event</button>
            </div> -->
        <SuccessMessage v-if="showSuccess" :condition="message_passed" @close="closeSuccessMessage"/>
    </template>


    <script>
        import firebaseApp from '../firebase.js';
        import { getFirestore } from "firebase/firestore"
        import { collection, getDocs, doc, deleteDoc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"
        import { getAuth } from 'firebase/auth';
        import SuccessMessage from "@/components/SuccessMessage.vue"; 

        const db = getFirestore(firebaseApp)

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
                };
            },

            components: {
                SuccessMessage
            },

            props: {
                event: String,
            },

            mounted() {
                this.fetchEvent(this.event);
                this.checkMember(this.event);
            },

            methods: {
                checkMember(eventID) {
                    let db = getFirestore(firebaseApp);
                    let userID = this.user;
                    let userRef = doc(db, 'users', userID);

                    const unsubscribe = onSnapshot(userRef, (doc) => {
                        if (doc.exists()) {
                            let userData = doc.data();
                            this.isMember = userData.events && userData.events.includes(eventID);
                        }
                    }, (error) => {
                        console.error("Error fetching user data:", error);
                    });
                },
                async fetchEvent(event) {
                    const eventRef = doc(db, "Events", event);
                    try {
                        const docSnap = await getDoc(eventRef);
                        if (docSnap.exists()) {
                            console.log("Event data:", docSnap.data());
                            this.eventobj = docSnap.data();
                            console.log(this.eventobj)
                        } else {
                            console.log("No such event!");
                        }
                    } catch (error) {
                        console.error("Error fetching event:", error);
                    }
                },

                joinEvent(event_id) {
                    let user_id = this.user
                    this.updateUserDBJoin(user_id, event_id)
                    this.updateEventDBJoin(event_id, user_id)
                    this.showSuccess = true
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

                closeSuccessMessage() {
                this.showSuccess = false;
                },
                
                leaveEvent() {
                    this.deleteEventFromUser(this.user, this.eventobj.EventId)
                    this.deleteUserFromEvent(this.user, this.eventobj.EventId)
                },

                async deleteEventFromUser(user, event) {
                    let userDocRef = doc(db, 'users', user);
                    let userDocSnap = await getDoc(userDocRef);
                    console.log(event);
                    if (userDocSnap.exists()) {
                        let userData = userDocSnap.data();
                        if (userData.events) { 
                            let updatedEvents = userData.events.filter(e => e !== event);
                            await updateDoc(userDocRef, {
                                events: updatedEvents
                            });
                        } else {
                            console.log('No events to update for this user.');
                        }
                    }
                },


                async deleteUserFromEvent(user, event) {
                    let eventDocRef = doc(db, "Events", event)
                    let eventDocSnap = await getDoc(eventDocRef)
                    if (eventDocSnap.exists()) {
                        let eventData = eventDocSnap.data();
                        let updatedUsers = eventData.EventParticipants.filter(userId => userId !== user)
                        await updateDoc(eventDocRef, {
                            EventParticipants: updatedUsers
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
                    let eventusers = this.eventobj.EventParticipants
                    for (let user of eventusers) {
                        await this.deleteEventFromUser(user, this.eventobj.EventId)
                    }

                    // delete event from the groupa
                    let groupDocRef = doc(db, "group", this.groupId)
                    let groupDocSnap = await getDoc(groupDocRef)
                    if (groupDocSnap.exists()) {
                        let groupData = groupDocSnap.data()
                        let updatedEvents = groupData.GroupEvents.filter(event => this.eventobj.EventId !== event)
                        await updateDoc(groupDocRef, {
                            GroupEvents: updatedEvents
                        });
                    }

                    //wipe event from firebase
                    let eventDocRef = doc(db, "Events", this.eventobj.EventId)
                    await deleteDoc(eventDocRef)

                }
            }
        }

    </script>

<style scoped>
.leave-event-btn,
.delete-event-btn {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #ff0000; /* Example background color */
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.events-container {
    width: auto;
}

h2 {
    margin-top: 30px;
    color: #334155; /* Dark slate color for better contrast */
    text-align: center;
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
    margin-bottom: 25px; /* Increased spacing between cards */
    transition: all 0.3s ease; /* Smooth transition for hover effects */
    height: 110px;
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