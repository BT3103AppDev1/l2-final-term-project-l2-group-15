<template>
  <div class="discussionItem">
    <div class="discussionHeader">
      <h1>{{ discussion.DiscussionTitle }}</h1>
      <p>{{ discussion.DiscussionText }}</p>
      <div class="discussionInfo">
        <p><strong>Posted By:</strong> {{ this.createdByUsername }}</p>
        <p>
          <strong>Posted On:</strong> {{ formatDate(discussion.Timestamp) }}
        </p>
      </div>
    </div>
    <div class="discussionReplies">
      <div v-for="reply in replies" :key="reply.id" class="replyItem">
        <div class="reply-metadata">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
            alt="Profile Image"
          />
          <div class="reply-username">
            <strong>{{ reply.username }}</strong>
          </div>
        </div>
        <div class="replyContent">
          <div class="reply-text">{{ reply.replyText }}</div>
          <div class="reply-dt">{{ formatDate(reply.ts) }}</div>
        </div>
        <button
          v-if="isAdmin"
          class="delete-reply-button"
          @click="showWarning(reply.id)"
        >
          Delete Reply
        </button>
      </div>
    </div>
    <div id="replyForm">
      <textarea
        id="replyBox"
        v-model="newReply"
        placeholder="Write your reply..."
      ></textarea>
      <button class="post-reply-button" @click="submitReply">Post Reply</button>
    </div>
    <!--Warning Message for Delete Discussion Reply-->
    <WarningMessage
      v-if="showWarningMessage"
      :condition="condition"
      :replyid="selectedReplyId"
      @confirm="deleteReply"
      @cancel="hideWarning"
    />
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  onSnapshot,
  where,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import WarningMessage from "./WarningMessage.vue";

const db = getFirestore(firebaseApp);

export default {
  props: {
    discussionID: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
  },
  components: {
    WarningMessage,
  },
  data() {
    return {
      newReply: "",
      replies: [],
      discussion: {},
      createdByUsername: "", // username of user who created the discussion
      groupAdmin: "",
      isAdmin: false,
      showWarningMessage: false,
      condition: "",
      selectedReplyId: "",
    };
  },
  created() {
    this.fetchDiscussionData();
    this.getReplies();
    this.getGroupAdmin();
  },
  methods: {
    async fetchDiscussionData() {
      const docRef = await doc(db, "Discussions", this.discussionID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.discussion = docSnap.data();
        this.createdByUsername = await this.getUsername(
          this.discussion.CreatedBy
        );
      } else {
        console.log("Discussion cannot be found!");
      }
    },
    async submitReply() {
      if (!this.newReply) {
        alert("Please type a reply before submitting.");
        return;
      }
      try {
        async function generateReplyID() {
          const charset =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          let randomString = "";
          for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
          }
          return "REP" + randomString;
        }
        const replyID = await generateReplyID();
        const docRef = await setDoc(doc(db, "Replies", replyID), {
          ReplyID: replyID,
          GroupID: this.group, // group name
          DiscussionID: this.discussionID,
          CreatedBy: this.user, // user id
          ReplyText: this.newReply,
          Timestamp: serverTimestamp(),
        });
        console.log("New reply written");
        this.newReply = "";
      } catch (error) {
        console.error("Error posting reply: ", error);
        alert("There was an error in posting your reply. Please try again.");
      }
    },
    async getReplies() {
      const q = await query(
        collection(db, "Replies"),
        where("DiscussionID", "==", this.discussionID),
        orderBy("Timestamp", "asc")
      );
      onSnapshot(q, async (querySnapshot) => {
        const repliesPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const username = await this.getUsername(data.CreatedBy);
          return {
            id: data.ReplyID,
            userid: data.CreatedBy,
            ts: data.Timestamp,
            replyText: data.ReplyText,
            username: username,
          };
        });
        this.replies = await Promise.all(repliesPromises);
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
        const formattedDate = dt.toDate().toLocaleDateString("en-US");
        const formattedTime = dt
          .toDate()
          .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        return `${formattedDate} ${formattedTime}`;
      }
    },
    async getGroupAdmin() {
      try {
        const docs = await getDocs(collection(db, "group"));
        docs.forEach((doc) => {
          if (doc.data().GroupId == this.group) {
            this.groupAdmin = doc.data().GroupAdmin[0];
            console.log("Group admin retrieved successfully:", this.groupAdmin);
          }
        });
        if (this.groupAdmin == this.user) {
          this.isAdmin = true;
        }
      } catch (error) {
        console.error("Error retrieving group admin:", error);
      }
    },
    async deleteReply(replyID) {
      const replyDocRef = doc(db, "Replies", replyID);
      this.hideWarning();
      await deleteDoc(replyDocRef);
    },
    showWarning(replyID) {
      this.selectedReplyId = replyID;
      this.condition = "deleteReply";
      this.showWarningMessage = true;
    },
    hideWarning() {
      this.showWarningMessage = false;
    },
  },
};
</script>

<style scoped>
.discussion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; /* Space between discussion items */
}

.discussionHeader {
  border-bottom: 1px solid #eaeaea; /* Separator line */
  padding-bottom: 20px; /* Spacing below the header */
  margin-bottom: 20px; /* Spacing between header and replies */
  border-radius: 15px; /* Rounded corners */
  padding: 20px; /* Space inside the box */
  background-color: #f8f8f8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.discussionHeader h1 {
  margin: 0 0 10px 0; /* Spacing below the title */
}

.discussionInfo p {
  text-align: right; /* Aligns text inside paragraphs to the right */
  margin: 0; /* Reset margin for the paragraph */
  color: #0f1135; /* Darker text color for contrast */
}

.discussionReplies {
  margin-bottom: 20px; /* Spacing between replies and the reply form */
}

.replyItem {
  display: flex;
  align-items: center; /* Aligns items vertically */
  padding: 10px 0; /* Spacing above and below each reply */
  border-bottom: 1px solid #eaeaea; /* Separator line */
}

.replyItem:last-child {
  border-bottom: none; /* Removes border from the last item */
}

.replyContent {
  flex-grow: 1; /* Allows the reply content to fill the space */
  margin-left: 20px;
}

.reply-text {
  font-size: 17px;
  margin: 0 0 10px 0; /* Spacing below the reply text */
}

.reply-dt {
  align-self: flex-end; /* Align date to the right */
  font-size: 0.8em; /* Smaller font size for the date */
  color: #666; /* Dimmed color for the date */
  margin-top: auto; /* Push the date to the bottom */
}

.reply-metadata {
  text-align: center; /* Center the username below the image */
}

.reply-metadata img {
  width: 50px; /* Adjust size as needed */
  height: 50px;
  border-radius: 50%; /* Circular avatar */
  margin-bottom: 10px; /* Space between image and username */
}

#replyForm {
  display: flex;
  flex-direction: column; /* Stacks the textarea and button vertically */
}

#replyBox {
  resize: none; /* Disables resizing of the textarea */
  margin-bottom: 10px; /* Spacing between textarea and button */
  padding: 10px; /* Padding inside the textarea */
  border: 1px solid #eaeaea; /* Border color */
  border-radius: 4px; /* Slightly rounded corners for the textarea */
}

.post-reply-button {
  padding: 10px 20px;
  background-color: #007bff; /* Example button color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.post-reply-button:hover {
  background-color: #0056b3; /* Darker button color on hover */
}

.delete-reply-button:hover {
  background-color: red;
}
</style>
