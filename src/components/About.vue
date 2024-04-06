<template>
  <div class="about-container">
    <div class="about-content">
      <h2>About</h2>
      <hr>
      <span id="group_description">{{ about_description }}</span>
    </div>
  </div>
</template>
  
<script>
import firebaseApp from "../firebase.js"
import { getFirestore } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseApp)

export default {
  name: "About",
  
  data() {
    return {
      about_description: ""
    }
  },

  props: {
        group: {
            type: String,
            required: true
        },
  },

  async mounted() {
    try {
      console.log("trying to get group description")
      const docs = await getDocs(collection(db, "group"));
      docs.forEach((doc) => {
        const documentData = doc.data();
        // search whole groups collection for right group
        if (documentData.GroupId == this.group) {
          this.about_description = documentData.GroupDescription;
          console.log("group description retrieve success!")
        }
      });
    } catch (error) {
      console.error("Error retrieving group description:", error);
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
</style>
