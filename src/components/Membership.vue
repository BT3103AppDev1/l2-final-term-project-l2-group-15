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
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

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

    async mounted() {
      const displaySizeMembers = async () => {
        try {
          console.log("trying to get group size")
          const docs = await getDocs(collection(db, "group"));
          docs.forEach((doc) => {
            const documentData = doc.data();
            if (documentData.GroupName == this.group) {
              this.num_members = documentData.GroupMembers.length;
              this.members = documentData.GroupMembers
              console.log(documentData.GroupMembers.length)
              console.log("group size retrieve success!")
            }
          });
        } catch (error) {
          console.error("Error retrieving number of group members:", error);
        }
      }

      displaySizeMembers()

      const displayMembers = async () => {
        try {
          console.log("trying to match members")
          const users = await getDocs(collection(db, 'users'));
          users.forEach((u) => {
            const uData = u.data();
            if (this.members.includes(uData.uid)) {
              this.membersNames.push(uData.email);
            }
          })
          console.log("match members success!")
        } catch (error) {
          console.error("Error matching group members", error);
        }
      }

      displayMembers()
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
