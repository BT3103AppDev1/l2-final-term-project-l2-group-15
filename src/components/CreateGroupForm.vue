<template>
    <div class="container">
        <form id="myform" class="form-layout">

            <div class="left-section">
                <!-- If no Image -->
                <div class="upload-box" @click="openFileInput" v-if="!imageUrl">
                    <input type="file" accept="image/*" ref="fileInput" @change="handleImageChange"></input>
                    <span>Upload Image</span>
                </div>

                <!-- Else -->
                <div class="image-preview" v-else>
                    <img :src="imageUrl" alt="Uploaded Image" />
                    <button class="delete-button" @click="deleteImage">Delete Image</button>
                </div>
            </div>

            <div class="right-section">
                <div class="form-group">
                    <label for="groupName">Group Name:</label>
                    <input class="textHolder" type="text" id="groupName" required placeholder="Enter Group Name">
                </div>
                
                <div class="form-group">
                    <label for="groupLocation">Group Location:</label>
                    <input class="textHolder" type="text" id="groupLocation" required placeholder="Enter Group Location">
                </div>
                
                <div class="form-group">
                    <label for="groupDescription">Group Description:</label>
                    <input class="textHolder" type="text" id="groupDescription" required placeholder="Enter Group Description">
                </div>
                
                <div class="save">
                    <button id="savebutton" type="button" @click="createGroup"> Create Group </button>
                </div>
            </div>
        </form>
    </div>
</template>


<script>

import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { addDoc, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default {

    data() {
    return {
      imageUrl: '',
      formData: {}, 
      imageFile: null,
      user: getAuth().currentUser.uid,
        };
    },

    props: {
        user: {
            type: String,
            required: true
        }
    },



    methods: {
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

        async createGroup() {
            console.log("called")
            const db = getFirestore(firebaseApp)
            let groupName = document.getElementById("groupName").value
            let groupLocation = document.getElementById("groupLocation").value
            let groupDescription = document.getElementById("groupDescription").value
            // Need to solve Firebase Cloud Storage Issue
            // let groupImage = this.imageFile
            let groupImage = "Random First"

            // Need to add User ID to GroupAdmin and GroupMembers
            const groupData = {
                GroupName: groupName,
                GroupLocation: groupLocation,
                GroupDescription: groupDescription,
                GroupImage: groupImage,
                GroupMembers: [],
                GroupAdmin: [], 
                GroupEvents: [],
                GroupDiscussion: [],
            }
        
        try {
            const newGroupRef = await addDoc(collection(db, "group"), groupData);
            console.log("Document written with ID:", newGroupRef.id);
            document.getElementById('myform').reset()
            this.$emit("added")
        } catch(error) {
            console.log("Error when adding document: ", error)
        }
    }
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


.form-group {
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
