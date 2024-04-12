<template>
  <div class="topnav">
    <router-link to="/user_dashboard/:userId">Home</router-link>
    <router-link to="/marketplace">Marketplace</router-link>
    <div class="dropdown">
      <button class="dropbtn">Groups
        <i class="fa fa-caret-down"></i>
      </button>
      <div class="dropdown-content">
        <router-link to="/all_groups">All Groups</router-link>
        <router-link to="/my_groups">My Groups</router-link>
      </div>
    </div>
    <router-link :to="{ name : 'UpdateProfile' }">
        <div class="profile-container">Profile<img id="user_logo" src="@/assets/user.png" alt="user logo">
        </div></router-link>
    <div class="logout-text" @click="toggle">Log Out</div> <!-- Log Out text -->
  </div>

  <!-- code for pop up when sign out -->
    <div v-if="showPopup" class="modal">
        <div class="modal-content">
            <span class="close" @click="toggle">&times;</span>
            <div class="modal-header">
                <div class="modal-title">
                    <h3>Are you sure you want to log out?</h3>
                </div>
            </div>
            <button class="sign-out-button" @click="signOut">Log Out</button>
        </div>
    </div>
</template>

<script>

import { getAuth, signOut } from "firebase/auth";

export default {
  name: "Navbar_global",
  data() {
    return {
        showPopup: false,
        user: String,
    }
  },

  methods: {
    toggle() {
        this.showPopup = !this.showPopup
    },
    
    signOut() {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
            // Clear any user-related data or perform any other cleanup
            console.log("User signed out successfully");
            // Redirect the user to the login page or another appropriate page
            this.$router.push("/");
            })
            .catch((error) => {
            console.error("Error signing out:", error);
            });
    },
  }
}
</script>

<style>
body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
}

ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

li {
    display: inline;
}

.topnav {
    background-color: #000E90; /* Blue background color */
    display: flex; /* Arrange items horizontally */
    justify-content: flex-end; /* Align items to the right */
    align-items: center; /* Align items vertically in the center */
    padding: 10px 0px; /* Add some padding for spacing */
    height: 40px;
}

.topnav a {
    color: rgb(255, 255, 255); /* White text color */
    text-align: center; /* Center text within links (optional, can be removed) */
    width: 15%px;
    padding: 14px 30px; /* Padding for spacing */
    text-decoration: none; /* Remove underlines */
    font-size: 17px; /* Font size */
    cursor: pointer; /* Indicate clickable behavior */
}

.topnav a:hover, .dropdown:hover .dropbtn {  /* Combine selectors */
  background-color: #93CBFF; /* Optional hover background color, adjust as needed */
  color: black;
  padding-top: 20px;
  padding-bottom: 20.5px;
  height: auto;
}

/* Your existing styles */
.logout-text {
  cursor: pointer;
  color: white;
  padding: 14px 30px; /* Match padding of other links */
  text-decoration: none; /* Remove underlines */
}

.logout-text:hover {
    background-color: #93CBFF; /* Optional hover background color, adjust as needed */
    color: black;
    padding-top: 20px;
    padding-bottom: 21px;
}

#user_logo{
    height: 30px;
    width: 30px;
    padding-left: 5px;
}

.profile-container {
    display: flex; /* Make elements behave as flex items */
    align-items: center; /* Align items vertically */
    padding: 0px;
    margin: 0px;
    border: none;
}

.modal {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
}

/* Modal box styles */
.modal-content {
  background-color: #fff;
  margin: 10% auto;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

/* Close button styles */
.close {
  float: right;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
}

/* Header styles */
.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.modal-title {
  flex-grow: 1;
  margin-left: 16px;
}

.modal-title h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}
.sign-out-button{
    text-align: center;
}

.dropdown {
  float: left;
  overflow: hidden;
}

.dropdown .dropbtn {
  font-size: 16px;
  border: none;
  outline: none;
  color: white;
  padding: 14px 16px;
  background-color: inherit;
  font-family: inherit;
  margin: 0;
}

.dropdown:hover .dropbtn {
  background-color: #93CBFF; /* Match the color palette */
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #fff; /* Match the color palette */
  width: 120px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  float: none;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  text-align: left;
}

.dropdown-content a:hover {
  background-color: #ddd;
}

.dropdown:hover .dropdown-content {
  display: block;
}

</style>
