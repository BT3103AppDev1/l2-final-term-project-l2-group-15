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

            <!-- Input Fields Section -->
            <div class="fields-section">
                <div class="form-group">
                    <label for="groupName">Group Name:</label>
                    <textarea class="textHolder" id="groupName" required placeholder="Enter Group Name"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="groupLocation">Group Location:</label>
                    <textarea class="textHolder" id="groupLocation" required placeholder="Enter Group Location"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="groupDescription">Group Description:</label>
                    <textarea class="textHolder" id="groupDescription" required placeholder="Enter Group Description"></textarea>
                </div>
                
                <!-- Create Group Button -->
                <div class="save">
                    <button id="savebutton" type="button" @click="createGroup">Create Group</button>
                </div>
            </div>
        </form>
    </div>
</template>



<script>

import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { doc, getDoc, updateDoc, setDoc, arrayUnion} from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default {

    data() {
    return {
      imageUrl: '',
      formData: {}, 
      imageFile: null,
      user: getAuth().currentUser.uid,
        };
    },
    
    methods: {

        generateGroupID() {
              const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
              let randomString = '';
              for (let i = 0; i < 10; i++) {
                  const randomIndex = Math.floor(Math.random() * charset.length)
                  randomString += charset[randomIndex]
              }
              return "GRP" + randomString
        },

        openFileInput() {
            this.$refs.fileInput.click()
        },

        handleImageChange(event) {
            let file = event.target.files[0]
            if (file) {
                this.formData.image = file
                this.imageFile = file
                this.imageUrl = URL.createObjectURL(file) // For preview
            }
        },

        deleteImage() {
            if (this.imageUrl) {
                console.log("deleting image...")
                this.imageUrl = ''
                this.imageFile = null
            }
        },

        async updateUserDBJoin(documentId, newGroupId) {
          const db = getFirestore(firebaseApp)
          try { // there no catch error
            const documentRef = doc(db, 'users', documentId)
            const documentSnapshot = await getDoc(documentRef)

            if (documentSnapshot.exists()) {
                await updateDoc(documentRef, {
                    groups: arrayUnion(newGroupId)
                  });
              } else {
                console.log('Document does not exist.')
                }
            } catch (error) {
                console.error('Error updating document: ', error)
            }
        },

        async addPic(file, picID) {
            let storage = getStorage()
            let storageRef = ref(storage, picID);
            await uploadBytes(storageRef, file);
        },

        async createGroup() {
            console.log("called")
            const db = getFirestore(firebaseApp)
            let groupName = document.getElementById("groupName").value
            let groupLocation = document.getElementById("groupLocation").value
            let groupDescription = document.getElementById("groupDescription").value
            // Need to solve Firebase Cloud Storage Issue
            // let groupImage = this.imageFile
            let groupImage = "Check firebase storage"
            let groupID = this.generateGroupID()
            if (!this.imageFile || !groupName || !groupLocation || !groupDescription) {
                alert('Please ensure all forms are filled');
                return;
            }
            // Need to add User ID to GroupAdmin and GroupMembers
            const groupData = {
                GroupName: groupName,
                GroupLocation: groupLocation,
                GroupDescription: groupDescription,
                GroupImage: groupImage,
                GroupMembers: [this.user],
                GroupAdmin: [this.user], 
                GroupEvents: [],
                GroupDiscussion: [],
                GroupId: groupID
            }
            console.log(groupID)
        try {
            this.addPic(this.imageFile, groupID)
            await setDoc(doc(db, "group", groupID), groupData)
            console.log("Document written with ID:", groupID)
            this.updateUserDBJoin(this.user, groupID)
            document.getElementById('myform').reset()
            this.$emit("added")
            this.$router.push({ name: 'SpecificGroupHome', params: { group: groupName, user: this.user } })
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
    align-items: center;
    padding: 2vh;
}

.form-layout {
    display: flex;
    flex-direction: column;
    width: 90vw; 
    max-width: 500px; 
}

.file-input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.image-section, .fields-section {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.upload-box, .image-preview {
    width: 90%; 
    max-width: 450px;
    height: 200px; 
    background-color: #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 2vh;
}

.image-preview {
    width: 90%; 
    max-width: 450px;
    height: 200px; 
    position: relative; /* This makes it the positioning context for the delete button */
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2vh;
}

.image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.delete-button {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.5rem;
    background-color: orange; /* Light gray background */
    color: #333; /* Dark text for contrast */
    border: none;
    cursor: pointer;
    border-radius: 0 0 0 5px; /* Rounded corner on the bottom left */
}

.delete-button:hover {
    background-color: #bbb; /* Slightly darker on hover */
}

.form-group {
    width: 90%; 
    margin-bottom: 2vh;
}

.textHolder {
    width: 100%; 
    height: 100px; 
    padding: 1vh;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical; 
    font-size: 1rem;
}

.textHolder:hover {
    box-shadow: 0 0 1vh #719ECE;
}

.save {
    width: 90%;
    text-align: center;
    margin-top: 2vh;
}

.save button {
    padding: 2vh 4vw;
    width: 100%; 
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

