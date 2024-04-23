<template>
    <div class="contact-popup">
      <div class="popup-content">
        <h2>Contact Information</h2>
        <p><strong>User ID:</strong> {{ name }}</p>
        <p><strong>Telegram Handle:</strong> {{ telegram }}</p>
        <p><strong>Location:</strong> {{ address }}</p>
        <!-- Add other contact information or functionality here -->
        <button @click="$emit('closePopup')">Close</button>
      </div>
    </div>
  </template>
  
  <script>
  import firebaseApp from '../firebase.js';
  import { getFirestore } from "firebase/firestore";  
  import { doc, getDoc } from "firebase/firestore";
  
  export default {
    props: {
      userId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        name: "",
        telegram: "",
        address: "",
      };
    },
    methods: {
      async getUser() {
        const db = getFirestore(firebaseApp)
        const docRef = doc(db, 'users', this.userId)
        const itemSnapshot = await getDoc(docRef)
        const itemdata = itemSnapshot.data()
        this.name = itemdata.username
        this.telegram = itemdata.telegramHandle
        this.address = itemdata.address
      }
    },
  
    mounted() {
      this.getUser()
    }
  };
  </script>
  
  <style scoped>
  .contact-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1200;
  }
  
  .popup-content {
    background-color: #ffffff;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    max-width: 400px; 
  }
  
  h2 {
    margin-bottom: 20px;
    color: #333333;
    font-size: 24px;
  }
  
  p {
    margin-bottom: 10px;
    color: #666666;
    font-size: 16px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  