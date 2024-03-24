<template>
  <ul class="topnav">
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/marketplace">MarketPlace</router-link></li>
    <li><router-link to="/all_groups">Groups</router-link></li>
    <li><router-link to="/my_groups">My Groups</router-link></li>
    <router-link :to="{ name : 'UpdateProfile' }"><div class="profile-container">Profile<img id="user_logo" src="@/assets/user.png" alt="user logo"></div></router-link>
    <li><router-link to="/marketplace">Log Out</router-link></li>
  </ul>
</template>

<script>
export default {
  name: "Navbar_global",
  data() {
    return {
        user: String,
    }
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
        padding: 14px 30px; /* Padding for spacing */
        text-decoration: none; /* Remove underlines */
        font-size: 17px; /* Font size */
        cursor: pointer; /* Indicate clickable behavior */
    }

    .topnav a:hover {
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
    }
</style>
