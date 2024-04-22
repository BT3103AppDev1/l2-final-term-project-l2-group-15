<template>
    <div class="container-inner">
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
                    <label for="ItemName">Item Name:</label>
                    <textarea class="textHolder" id="ItemName" required placeholder="Enter Item Name"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="ItemLocation">Item Location:</label>
                    <textarea class="textHolder" id="ItemLocation" required placeholder="Enter Item Location"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="ItemDescription">Item Description:</label>
                    <textarea class="textHolder" id="ItemDescription" required placeholder="Enter Item Description"></textarea>
                </div>

                <div class="form-group">
                    <label for="ItemPrice">Item Price:</label>
                    <textarea class="textHolder" id="ItemPrice" required placeholder="Enter Item Price"></textarea>
                </div>
                
                <div class="save">
                    <button id="savebutton" type="button" @click="createItem">Create</button>
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

        generateItemID() {
              const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
              let randomString = '';
              for (let i = 0; i < 10; i++) {
                  const randomIndex = Math.floor(Math.random() * charset.length)
                  randomString += charset[randomIndex]
              }
              return "ITEM" + randomString
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

        async updateUserDBItem(documentId, newItemId) {
          const db = getFirestore(firebaseApp)
          try { // there no catch error
            const documentRef = doc(db, 'users', documentId)
            const documentSnapshot = await getDoc(documentRef)

            if (documentSnapshot.exists()) {
                await updateDoc(documentRef, {
                    listedItem: arrayUnion(newItemId)
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

        async createItem() {
            const db = getFirestore(firebaseApp)
            let ItemName = document.getElementById("ItemName").value
            let ItemLocation = document.getElementById("ItemLocation").value
            let ItemDescription = document.getElementById("ItemDescription").value
            let ItemPrice = document.getElementById("ItemPrice").value
            let ItemID = this.generateItemID()
            if (!this.imageFile || !ItemName || !ItemLocation || !ItemDescription) {
                alert('Please ensure all forms are filled');
                return;
            }
            // Need to add User ID to GroupAdmin and GroupMembers
            const ItemData = {
                sellerID: this.user,
                Description: ItemDescription,
                Location: ItemLocation,
                Name: ItemName,
                Price: ItemPrice,
                id: ItemID,
                sold: false,
                buyerID: [],
                hasBuyRequest: false,
                soldTo: "",
            }
        try {
            this.addPic(this.imageFile, ItemID)
            await setDoc(doc(db, "Items", ItemID), ItemData)
            this.updateUserDBItem(this.user, ItemID)
            document.getElementById('myform').reset()
            this.$emit("added")
            this.$router.push({ name: 'MarketplaceViewItems'})
        } catch(error) {
            console.log("Error when adding document: ", error)
        }
    }
}
}
</script>

<style scoped>
.container-inner {
    height: 100vh; /* Set height to full viewport height */
    padding: 2vh;
    padding-left: 0px;
    padding-right: 0px;
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