<template>
    <div class="modal-overlay" v-show="isVisible">
        <form id="newDiscussion" @submit.prevent="handleSubmit">
            <div class="modal-header">
                <h2>New Discussion</h2>
                <button class="closeButton" @click="closePopup">X</button>
            </div>
            <div class="newDiscussionForm">
                <label for="discussionTitle">Title: </label>
                <input type="text" id="discussionTitle" v-model="title" placeholder="Enter a title for your discussion."/>
                
                <label for="discussionDesc">Description: </label>
                <textarea id="discussionDesc" v-model="description" placeholder="Enter your description here. (Optional)"></textarea>
                
                <button @click="postNewDiscussion">Post Discussion</button>
            </div>
        </form>
    </div>
</template>

<script>
import firebaseApp from '../firebase.js'
import { getFirestore } from 'firebase/firestore'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

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
    data() {
        return {
            title: '',
            description: '',
            isVisible: true
        };
    },
    methods: {
        async postNewDiscussion() {
            if (!this.title) {
                alert("Please enter a title for the discussion.");
                return;
            } 
            try {
                async function generateDiscID() {
                    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        let randomString = '';
                        for (let i = 0; i < 10; i++) {
                            const randomIndex = Math.floor(Math.random() * charset.length);
                            randomString += charset[randomIndex];
                        }
                        return "DISC" + randomString;
                };
                const discussionID = await generateDiscID();
                const docRef = await setDoc(doc(db, "Discussions", discussionID), {
                    DiscussionID: discussionID, 
                    GroupID: this.group, // group id
                    CreatedBy: this.user, // user id
                    DiscussionTitle: this.title,
                    DiscussionText: this.description,
                    Timestamp: serverTimestamp()
                });
                console.log("New discussion written");
                document.getElementById('newDiscussion').reset(); // for testing purpose only
                this.closePopup();
            }
            catch(error ) {
                console.error("Error creating new discussion: ", error);
                alert("There was an error in creating the discussion. Please try again.");
            }
        },
        handleSubmit() {
            console.log("Discussion form submitted.")
        },
        closePopup() {
            this.isVisible = false;
            this.$emit("discussionAdded")
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1000;
}

#newDiscussion {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: 90%; 
    max-width: 800px; 
    height: auto; 
    max-height: 90%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000; 
    overflow-y: auto; 
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.newDiscussionForm {
    margin-bottom: 20px;
}

.newDiscussionForm label {
    display: block;
    margin-bottom: 8px;
}

input[type="text"], textarea {
    width: 100%;
    margin-bottom: 20px;
    font-size: 15px;
}

.newDiscussionForm button {
    background-color: #04AA6D; /* Green background */
    color: white; /* White text */
    padding: 14px 20px; /* Padding inside the button */
    border: none; /* No border */
    border-radius: 4px; /* Rounded corners */
    cursor: pointer; /* Pointer cursor on hover */
    width: 100%; /* Full width */
    box-sizing: border-box; /* Include padding and border in the width */
    font-size: 16px; /* Font size */
  }

.newDiscussionForm button:hover {
    background-color: #037f58; /* Darker green on hover */
  }
</style>