<template>
    <div>
      <h2>Edit Profile</h2>
      <input v-model="profile.name" placeholder="Name">
      <input v-model="profile.bio" placeholder="Bio">
      <button @click="updateProfile">Update Profile</button>
    </div>
  </template>

<script>
import { db } from '@/firebase';
import firebase from 'firebase/app';

export default {
  data() {
    return {
      profile: {
        name: '',
        bio: '',
      },
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    fetchUserProfile() {
      const user = firebase.auth().currentUser;
      if (!user) return;
      db.collection('users').doc(user.uid).get().then(doc => {
        if (doc.exists) {
          this.profile = doc.data();
        } else {
          console.log("No such document!");
        }
      }).catch(error => {
        console.error("Error fetching user profile:", error);
      });
    },
    updateProfile() {
      const user = firebase.auth().currentUser;
      if (!user) return;
      db.collection('users').doc(user.uid).set(this.profile)
        .then(() => {
          console.log("Profile updated successfully!");
        })
        .catch(error => {
          console.error("Error updating profile:", error);
        });
    }
  }
}
</script>