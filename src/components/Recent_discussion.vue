<template>
    <div class="Discussions-container">
        <h2>Recent Discussions</h2>
        <hr>
        <!-- boon long code -->
        <div v-for="discussion in discussions" :key="discussion.id" class="discussion-item">
            <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" alt="Profile Image">
            <div class="discussion-content">
                <div class="discussion-title"> {{ discussion.title }} </div>
                <div class="discussion-info">
                    <div>Posted By: {{ discussion.username }}</div>
                    <div>{{ formatDate(discussion.ts) }}</div>
                </div>
            </div>
            <button @click="navigate(discussion.id, this.user, this.group)">View Discussion</button>
        </div>
        <!-- BL code ends -->
      </div>
  </template>
    
<script>
import firebaseApp from '../firebase.js'
import { getFirestore } from 'firebase/firestore'
import { collection, query, getDocs, onSnapshot, orderBy, where, limit} from 'firebase/firestore'

const db = getFirestore(firebaseApp);

export default {
  name: "Recent_discussions",

  data() {
      return {
          discussions: [],
          isPopupVisible: false,
          noDiscussion: false
      };
  },

  created() {
      try {
          this.user = this.$route.params.user // user id
          this.group = this.$route.params.group; // group id
          console.log(this.group)
          console.log("group name retrieved")
      } catch (error) {
          console.error('Error:', error);
      }
      this.getDiscussions();
  },

  methods: {
      async getDiscussions(){
        // add limit 5
            const q = await query(collection(db, "Discussions"), where("GroupID", "==", this.group), orderBy("Timestamp", "desc"), limit(5));
            onSnapshot(q, async (querySnapshot) => {
                const discussionsPromises = querySnapshot.docs.map(async doc => {
                    const data = doc.data();
                    const username = await this.getUsername(data.CreatedBy);
                    return {
                        id: data.DiscussionID,
                        userid: data.CreatedBy,
                        ts: data.Timestamp,
                        title: data.DiscussionTitle,
                        username: username
                    };          
                });
                this.discussions = await Promise.all(discussionsPromises);

                if (this.discussions.length == 0) {
                    this.noDiscussion = true;
                }
            });
        },
      async getUsername(userid) {
          try {
            const docs = await getDocs(collection(db, "users"));
            for (const doc of docs.docs) {
              if (doc.data().uid == userid) {
                const username = doc.data().username;
                console.log("Username retrieved successfully:", username);
                return username; 
              }
            }
          } catch (error) {
            console.error("Error retrieving username:", error);
          }
      },
      formatDate(dt) {
          if (dt) {
              const formattedDate = dt.toDate().toLocaleDateString('en-US'); // e.g., "MM/DD/YYYY"
              const formattedTime = dt.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
              return `${formattedDate} ${formattedTime}`;
          };
      },
      togglePopup() {
          this.isPopupVisible = !this.isPopupVisible;
      },
      navigate(id, user, group) {
          console.log(id);
          if (id) {
              this.$router.push({name:'ViewDiscussion', params:{discussionID: id, user: user, group: group}})
          } else {
              console.error("Missing DiscussionID")
          }
      }
  }
}
</script>
  
<style scoped>
h2 {
  font-size: 24px;
  margin-top: 0px;
  margin-bottom: 5px;
  text-align: left;
}

hr {
  margin-bottom: 20px;
}

.discussion-item {
  background-color: #f8f8f8;
  border-radius: 8px; 
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.discussion-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.discussion-item img {
  width: 60px; 
  height: 60px;
  border-radius: 50%; 
  margin-right: 10px;
}

.discussion-content {
  flex-grow: 1;
}

.discussion-title {
  font-weight: bold;
  margin-bottom: 5px; 
}

.discussion-info {
  font-size: 0.9em;
  color: #555;
}

.discussion-info > div {
  margin-bottom: 3px; 
}

button {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  margin-left: 20px; 
  background-color: #d7d2d2;
  color: black;
  border: 0.5px gray solid;
  cursor: pointer;
  border: 0.5px solid grey;
  border-radius: 5px;
  font-size: 12px;
  padding: 5px 10px;
}

button:hover {
  background-color: darkgrey;
}
</style>
