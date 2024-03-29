<template>
    <div class="Members-container">
      <div class = "Membership_title">
        <h2>Membership</h2><h5>{{ num_members }} members</h5>
      </div>
      <hr>
  
      <div class = 'Members-content'>
        <ol class = "eachMember" v-for="member in membersNames">
          <li>{{ member }}</li>
        </ol>
      </div>
    </div>
  </template>
    
<script>
import firebaseApp from "../firebase.js"
import { getFirestore } from "firebase/firestore"
import { collection, onSnapshot } from "firebase/firestore";

const db = getFirestore(firebaseApp)

export default {
    name: "Membership",

    props: {
        group: {
            type: String,
            required: true
        },
    },

    data() {
      return {
        num_members : 0,
        members: [], // Array to hold member data
        membersNames: [] // 
      }
    },

    async created() {
      this.setupRealtimeListeners();
    },

    methods: {
      setupRealtimeListeners() {
        const groupRef = collection(db, "group");
        onSnapshot(groupRef, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.doc.data().GroupId === this.group) {
              this.num_members = change.doc.data().GroupMembers.length;
              this.members = change.doc.data().GroupMembers;
            }
          });
        });

        const usersRef = collection(db, "users");
        onSnapshot(usersRef, (snapshot) => {
          this.membersNames = [];
          snapshot.forEach((doc) => {
            const userData = doc.data();
            if (this.members.includes(userData.uid)) {
              this.membersNames.push(userData.username);
            }
          });
        });
      },
    }
  }
</script>
    
<style scoped>
  h2 {
    font-size: 24px;
    margin-top: 0px;
    margin-bottom: 5px;
    align-items: left;
  }

  h5 {
    color: grey;
    font-size: 12px;
    margin-top: 10px;
    margin-left: auto;
    align-items: right;
  }

  hr {
    margin-top: -7px;
    margin-bottom: 20px;
  }

  .Membership_title {
    display: flex;
  }

  ol {
    color: black;
    font-size: 25px;
    font-family: 'Times New Roman', Times, serif;
    margin-bottom: 10px;
    display: list-item;
    padding-left: 2%;
    margin-left: 25px;
  }
</style>
