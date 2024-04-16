<template>
<ul class="vertnav">
    <li><router-link :to="{name : 'SpecificGroupHome', params:{group : group.GroupId, user : user}}"><img id = "group_pfp" :src="fileURL" alt="No Group Logo"></router-link></li>
    <li><router-link :to="{name : 'AllDiscussion', params:{group : group.GroupId, user : user}}"><img src="@/assets/discussion.png" alt="Discussions"></router-link></li>
    <li><router-link :to="{name : 'Events', params: {group : group.GroupName, user : user}}"><img src="@/assets/calendar.png" alt="Calender"></router-link></li>
    <li><router-link :to="{name : 'GroupSetting', params:{group : group.GroupId, user : user}}"><img src="@/assets/settings.png" alt="Setting"></router-link></li>
</ul>
</template>

<script>
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default {
  name: "Navbar_groups",

  data() {
    return {
      user: getAuth().currentUser.uid,
      fileURL: null,
      fileID: this.group.GroupId,
    }
  },
  
  props: {
        group: {
            type: String,
            required: true
        },
  },

  methods: {
    async getImage(fileID) {
        console.log(fileID.GroupId)
        console.log(fileID)
        let storage = getStorage()
        let filePath ="gs://connecthub-88e58.appspot.com/" + fileID
        let fileRef = ref(storage, filePath)
        let fileURL = await getDownloadURL(fileRef)
        this.fileURL = fileURL
    }
  },

  created() {
    try {
        let groupID = String(this.$route.params.group); // string
        this.getImage(groupID)
    } catch {
        this.fileURL = null
    }
  }
}
</script>

<style scoped>
    body {
        margin: 0;
    }

    ul {
        list-style-type: none;
        margin: 0px;
        padding: 0px;
        width: 80px;
        background-color: #f1f1f1;
        position: fixed;
        height: 100%;
        overflow: auto;
    }

    li a {
        display: block;
        color: #000;
        padding: 20px 16px;
        text-decoration: none;
        text-align: center;
    }

    /* li a.active {
        background-color: #04AA6D;
        color: white;
    } */

    li a:hover {
        background-color: #c4c4c4;
        color: white;
    }

    img {
        height: 40px;
        width: 40px;
    }

    #group_pfp{
        border-radius: 45px;
        height: 50px;
        width: 50px;
        margin: 0px;
        padding: 0px;
        border: 1px solid #555; /* Add border */
    }
</style>