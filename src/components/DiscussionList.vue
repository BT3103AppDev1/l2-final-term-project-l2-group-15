<template>
  <div class="discussions-container">
    <div class="discussionList">
      <div id="addDiscussionPopup">
        <AddDiscussionButton @show-add-discussion="togglePopup" />
      </div>
      <AddDiscussion
        :group="group"
        :user="user"
        v-if="isPopupVisible"
        @discussionAdded="togglePopup"
      />
      <div v-if="noDiscussion">
        <p>There is currently no discussion.</p>
      </div>
      <div
        v-for="discussion in discussions"
        :key="discussion.id"
        class="discussion-item"
      >
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
          alt="Profile Image"
        />
        <div class="discussion-content">
          <div class="discussion-title">{{ discussion.title }}</div>
          <div class="discussion-info">
            <div>Posted By: {{ discussion.username }}</div>
            <div>{{ formatDate(discussion.ts) }}</div>
          </div>
        </div>
        <button
          class="view-discussion-button"
          @click="navigate(discussion.id, this.user, this.group)"
        >
          View Discussion
        </button>
        <button
          v-if="isAdmin"
          class="delete-discussion-button"
          @click="showWarning(discussion.id)"
        >
          Delete Discussion
        </button>
      </div>
    </div>

    <!--Warning Message for Delete Discussions-->
    <WarningMessage
      v-if="showWarningMessage"
      :condition="condition"
      :discussionid="selectedDiscussionId"
      @confirm="deleteDiscussion"
      @cancel="hideWarning"
    />
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { deleteDoc, getFirestore } from "firebase/firestore";
import {
  doc,
  collection,
  getDocs,
  query,
  onSnapshot,
  orderBy,
  where,
} from "firebase/firestore";
import AddDiscussionButton from "./AddDiscussionButton.vue";
import AddDiscussion from "./AddDiscussion.vue";
import WarningMessage from "@/components/WarningMessage.vue";

const db = getFirestore(firebaseApp);

export default {
  props: {
    group: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  components: {
    AddDiscussion,
    AddDiscussionButton,
    WarningMessage,
  },
  data() {
    return {
      discussions: [],
      isPopupVisible: false,
      noDiscussion: false,
      isAdmin: false,
      groupAdmin: "",
      showWarningMessage: false,
      condition: "",
      selectedDiscussionId: "",
    };
  },
  created() {
    this.getDiscussions();
    this.getUsername();
    this.getGroupAdmin();
  },
  methods: {
    async getDiscussions() {
      const q = await query(
        collection(db, "Discussions"),
        where("GroupID", "==", this.group),
        orderBy("Timestamp", "desc")
      );
      onSnapshot(q, async (querySnapshot) => {
        const discussionsPromises = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const username = await this.getUsername(data.CreatedBy);
          return {
            id: data.DiscussionID,
            userid: data.CreatedBy,
            ts: data.Timestamp,
            title: data.DiscussionTitle,
            username: username,
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
        const formattedDate = dt.toDate().toLocaleDateString("en-US"); // e.g., "MM/DD/YYYY"
        const formattedTime = dt
          .toDate()
          .toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        return `${formattedDate} ${formattedTime}`;
      }
    },
    togglePopup() {
      this.isPopupVisible = !this.isPopupVisible;
    },
    navigate(id, user, group) {
      console.log(id);
      if (id) {
        this.$router.push({
          name: "ViewDiscussion",
          params: { discussionID: id, user: user, group: group },
        });
      } else {
        console.error("Missing DiscussionID");
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
    async deleteRepliesInDiscussion(discussionID) {
      const docs = await getDocs(collection(db, "Replies"));
      for (const doc of docs.docs) {
        if (doc.data().DiscussionId === discussionID) {
          await deleteDoc(doc.ref);
          console.log("Reply deleted successfully");
        }
      }
    },
    async deleteDiscussion(discussionID) {
      const discussionDocRef = doc(db, "Discussions", discussionID);
      this.deleteRepliesInDiscussion(discussionID);
      await deleteDoc(discussionDocRef);
      this.hideWarning();
    },
    showWarning(discussionID) {
      this.selectedDiscussionId = discussionID;
      this.condition = "deleteDiscussion";
      this.showWarningMessage = true;
    },
    hideWarning() {
      this.showWarningMessage = false;
    },
  },
};
</script>

<style scoped>
.discussions-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.discussionList {
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
}

#addDiscussionPopup {
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

.view-discussion-button {
  font-family: "Roboto", sans-serif;
  font-weight: 400;
  margin-left: 20px; /* Adjust as needed */
  background-color: #d7d2d2;
  color: black;
  border: 0.5px gray solid;
}

.view-discussion-button:hover {
  background-color: #83e97c; /* Background color on hover */
}

.discussion-item .delete-discussion-button:hover {
  background-color: #f44336; /* Background color on hover for delete button */
}
</style>
