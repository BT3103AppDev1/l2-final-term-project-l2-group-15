<template>
<ul class="vertnav">
    <li><router-link :to="{name : 'SpecificGroupHome', params:{group : group.GroupId, user : user}}"><img id = "football_group" src="@/assets/football_group.jpg" alt="football icon"></router-link></li>
    <li><router-link :to="{name : 'AllDiscussion', params:{group : group.GroupId, user : user}}"><img src="@/assets/discussion.png" alt="Discussions"></router-link></li>
    <li><router-link :to="{name : 'Events', params: {group : group.GroupName, user : user}}"><img src="@/assets/calendar.png" alt="Calender"></router-link></li>
    <li v-if="isAdmin"><router-link :to="{name : 'GroupSetting', params:{group : group.GroupId, user : user}}"><img src="@/assets/settings.png" alt="Setting"></router-link></li>
</ul>
</template>

<script>
import firebaseApp from "../firebase.js"
import { getFirestore } from "firebase/firestore"
import { collection, getDocs } from "firebase/firestore";

const db = getFirestore(firebaseApp);

export default {
    name: "Navbar_groups",
    props: {
        group: {
            type: String,
            required: true
        },
        user: {
            type: String,
            required: true
        }
    },
    created() {
        this.getGroupAdmin();
    },
    data() {
        return {
            groupAdmin: '',
            isAdmin: false
        }
    },
    methods: {
        async getGroupAdmin() {
            try {
                const docs = await getDocs(collection(db, "group"));
                docs.forEach((doc) => {
                if (doc.data().GroupId == this.group) {
                    this.groupAdmin = doc.data().GroupAdmin[0];
                    console.log("Group admin retrieved successfully:", this.groupAdmin);
                }
                })
                if (this.groupAdmin == this.user) {
                    this.isAdmin = true;
                }
            } catch (error) {
                console.error("Error retrieving group admin:", error);
            }
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

    #football_group {
        border-radius: 45px;
        height: 50px;
        width: 50px;
        margin: 0px;
        padding: 0px;
        border: 1px solid #555; /* Add border */
    }
</style>