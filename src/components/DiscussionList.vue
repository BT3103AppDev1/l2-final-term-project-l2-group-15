<template>
    <div class="discussions-container">
        <div class="discussionList">
            <div id="addDiscussionPopup">
                <AddDiscussionButton @show-add-discussion="togglePopup"/>
            </div>
            <AddDiscussion :group="group" :user="user" v-if="isPopupVisible" @discussionAdded="togglePopup" />
            <div v-if="noDiscussion">
                <p> There is currently no discussion. </p>
            </div>
            <div v-for="discussion in discussions" :key="discussion.id" class="discussion-item">
                <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" alt="Profile Image">
                <div class="discussion-content">
                    <div class="discussion-title"> {{ discussion.title }} </div>
                    <div class="discussion-info">
                        <div>Posted By: {{ discussion.username }}</div>
                        <div>{{ formatDate(discussion.ts) }}</div>
                    </div>
                </div>
                <button @click="navigate(discussion.id, this.user, this.group)">View Discussion</button>
            </div>
        </div>
    </div>
</template>

<script>
import firebaseApp from '../firebase.js'
import { getFirestore } from 'firebase/firestore'
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore'
import AddDiscussionButton from './AddDiscussionButton.vue'
import AddDiscussion from './AddDiscussion.vue'

const db = getFirestore(firebaseApp);

export default {
    props: {
        group: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        }
    },
    components: {
        AddDiscussion,
        AddDiscussionButton
    },
    data() {
        return {
            discussions: [],
            isPopupVisible: false,
            noDiscussion: false
        };
    },
    created() {
        this.getDiscussions();
    },
    methods: {
        async getDiscussions(){
            const q = await query(collection(db, "Discussions"), where("GroupID", "==", this.group), orderBy("Timestamp", "desc"));
            onSnapshot(q, (querySnapshot) => {
                this.discussions = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: data.DiscussionID,
                        username: data.CreatedBy,
                        ts: data.Timestamp,
                        title: data.DiscussionTitle  
                    };          
                });
                if (this.discussions.length == 0) {
                    this.noDiscussion = true;
                }
            });
        },
        formatDate(dt) {
            if (dt) {
                const formattedDate = dt.toDate().toLocaleDateString('en-US'); // e.g., "MM/DD/YYYY"
                const formattedTime = dt.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                return `${formattedDate} ${formattedTime}`;
            };
        },
        togglePopup() {
            this.isPopupVisible = !this.isPopupVisible;
        },
        navigate(id, user, group) {
            console.log(id);
            if (id) {
                this.$router.push({name:'ViewDiscussion', params:{discussionID: id, user: user, group: group}})
            } else {
                console.error("Missing DiscussionID")
            }
        }
    }
};
</script>

<style scoped>
.discussions-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Aligns children to the right */
}

.discussionList {
  width: 100%;
  max-width: 1300px; /* Adjust the max-width as needed */
  margin: 0 auto;
}

#addDiscussionPopup {
  margin-bottom: 20px;
}

.discussion-item {
  background-color: #f8f8f8; /* Light grey background */
  border-radius: 8px; /* Rounded corners */
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px; /* Space between panels */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.discussion-item img {
  width: 60px; 
  height: 60px;
  border-radius: 50%; /* Circular avatar */
  margin-right: 10px;
}

.discussion-content {
  flex-grow: 1;
}

.discussion-title {
  font-weight: bold;
  margin-bottom: 5px; 
}

.discussion-info {
  font-size: 0.9em;
  color: #555;
}

.discussion-info > div {
  margin-bottom: 3px; 
}

</style>