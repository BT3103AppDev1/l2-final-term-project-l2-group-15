<template>
    <div class="container">
        <form id="myform" class="form-layout">

            <!-- Image Upload or Preview Section -->
            <div class="image-section">
                <!-- If no Image -->
                <div class="upload-box" @click="openFileInput" v-if="!imageUrl">
                    <input type="file" accept="image/*" ref="fileInput" @change="handleImageChange" class="file-input"></input>
                    <span>Upload Image</span>
                </div>

                <!-- Else -->
                <div class="image-preview" v-else>
                    <img :src="imageUrl" alt="Uploaded Image" />
                    <button class="delete-button" @click="deleteImage">Delete Image</button>
                </div>
            </div>

            <div class="right-section">
                <div class="form-event">
                    <label for="eventName">Event Name:</label>
                    <input class="textHolder" type="text" id="eventName" required placeholder="Enter Event Name">
                </div>
                
                <div class="form-event">
                    <label for="eventTime">Event Time:</label>
                    <input class="textHolder" type="datetime-local" id="eventTime" required placeholder="Enter Event Time">
                </div>

                <div class="form-event">
                    <label for="eventLocation">Event Location:</label>
                    <input class="textHolder" type="text" id="eventLocation" required placeholder="Enter Event Location">
                </div>
                
                <div class="form-event">
                    <label for="eventDescription">Event Description:</label>
                    <input class="textHolder" type="text" id="eventDescription" required placeholder="Enter Event Description">
                </div>
                
                <div class="save">
                    <button id="savebutton" type="button" @click="createEvent"> Create Event </button>
                </div>
            </div>
        </form>
    </div>
</template>


<script>

import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { setDoc, doc, addDoc, collection, updateDoc, arrayUnion} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { firestore} from "@/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";

export default {
    data() {
        return {
        //   imageUrl: '',
            formData: {}, 
        //   imageFile: null,
            user: getAuth().currentUser.uid,

            //may need to switch up the passing of groupid
            groupId: this.$route.params.group,

            showSuccess: false,
            message_passed: "createEvent",
            imageUrl: '',
            imageFile: null,

        };
    },
    
    methods: {
        async uploadImage(file) {
            console.log("Uploading Image...")
            const storage = getStorage();
            const storageRef = ref(storage, 'eventImages/' + file.name);
            try {
                await uploadBytes(storageRef, file);
                console.log('Uploaded a blob or file!');
                return await getDownloadURL(storageRef);
            } catch (error) {
                console.error('Upload failed:', error);
                return null;
            }
        },
        openFileInput() {
            this.$refs.fileInput.click(); 
        },

        handleImageChange(event) {
            let file = event.target.files[0];
            if (file) {
                this.formData.image = file;
                this.imageFile = file;
                this.imageUrl = URL.createObjectURL(file); // For preview
            }
        },

        deleteImage() {
            if (this.imageUrl) {
                console.log("deleting image...")
                this.imageUrl = '';
                this.imageFile = null;
            }
        },

        async createEvent() {
            console.log("Creating event...");
            const db = getFirestore(firebaseApp);
            let eventID = await this.generateEventID();
            let eventName = document.getElementById("eventName").value;
            let eventTime = document.getElementById("eventTime").value;
            let eventLocation = document.getElementById("eventLocation").value;
            let eventDescription = document.getElementById("eventDescription").value;
            let imageUrl = '';

            if (this.imageFile) {
                imageUrl = await this.uploadImage(this.imageFile);
            }

            const eventData = {
                EventId: eventID,
                EventName: eventName,
                EventLocation: eventLocation,
                EventDescription: eventDescription,
                EventTime: eventTime,
                EventGroup: this.groupId,
                CreatedBy: this.user,
                EventParticipants: [this.user],
                ImageUrl: imageUrl, // Storing the image URL from Firebase Storage
            };

            try {
                const EventDocRef = doc(firestore, "Events", eventID);
                await setDoc(EventDocRef, eventData);
                document.getElementById('myform').reset();
                this.$emit("added")
            } catch (error) {
                console.log("Error when adding Event: ", error);
            }

            // Need to add event in user that created it as well
            let ref = doc(db, "users", this.user)

            try {
                console.log(eventID)
                await updateDoc(ref, {
                    events: arrayUnion(eventID)
                })
            } catch (error) {
                console.error("Error adding value to array: ", error)
            }

            //Need to add to groups >> like their collated total events
            //Need to obtain the groupids to reflect the events joined
            // Adding eventID to the group's event list
            let groupRef = doc(db, "group", this.groupId);

            try {
                await updateDoc(groupRef, {
                    GroupEvents: arrayUnion(eventID) 
                });
                console.log("Event added to group successfully");
                this.showSuccess = true;  
            } catch (error) {
                console.error("Error adding event to group: ", error);
            }

            this.$emit("eventCreated");
        },

        async generateEventID() {
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomString = '';
            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                randomString += charset[randomIndex];
            }
            return "EV" + randomString;
        },

        closeSuccessMessage() {
            this.showSuccess = false;
        },
    }
}
</script>

<style scoped>

.container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 20px;
}

.form-layout {
    display: flex;
    flex-wrap: wrap;
}

.left-section, .right-section {
    display: flex;
    flex-direction: column;
}

.left-section {
    margin-right: 20px;
}

.upload-box, .image-preview img {
    width: 300px;
    height: 300px;
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
}

.upload-box span, .image-preview button {
    position: absolute;
    bottom: 10px;
}

.image-preview {
    width: 300px;
    height: 300px;
    position: relative; /* Add this line */
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* This ensures the image covers the area nicely */
}

.delete-button {
    position: absolute;
    bottom: 10px; /* Adjust this value as needed */
    left: 50%;
    transform: translateX(-50%); /* Centers the button horizontally */
    padding: 5px 10px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.delete-button:hover {
    background-color: darkred;
}


.form-event {
    margin-bottom: 20px;
}

.textHolder {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

input:hover {
    box-shadow: 0 0 8px #719ECE;
}

.save {
    text-align: center;
}

.save button {
    padding: 10px 20px;
    background-color: lightgreen;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.save button:hover {
    background-color: green;
    color: white;
}

</style>
