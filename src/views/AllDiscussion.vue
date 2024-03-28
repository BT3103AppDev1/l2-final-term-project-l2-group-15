<template>
    <body>
        <div class="header">
            <Navbar_global />
            <h1>{{ this.group }} Discussion</h1>
            <Navbar_groups :group="group" :user="user" />
        </div>
        <Navbar_groups :group="group" :user="user" />
        <div class="flexbox">
            <DiscussionList :user="user" :group="group"/>
        </div>
    </body>
</template>
  
<script>
import DiscussionList from '@/components/DiscussionList.vue';
import Navbar_global from '@/components/Navbar_global.vue';
import Navbar_groups from '@/components/Navbar_groups.vue';
  
export default {
    name: 'App',
    components: {
    DiscussionList,
    Navbar_global,
    Navbar_groups
},
    data() {
        return {
            user: '',
            group: '',
        }
    },
    created() {
        try {
            this.user = this.$route.params.user // user id
            this.group = this.$route.params.group; // group name
            console.log(this.group)
            console.log("group name retrieved")
        } catch (error) {
            console.error('Error:', error);
        }       
    }
}
</script>
  
<style scoped>
h1 {
    padding: 0px;
    margin-top: 7px;
    margin-bottom: 7px;
    margin-left: 10pt;
    font-family: 'Open Sans', Arial, sans-serif;
}

.header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100; /* Ensures navbars stay on top of other content */
}

.flexbox {
    flex-wrap: wrap;
    align-items: left;
    margin-left: 85px;
    margin-top: 110px/* Height of the header + any additional space */;
    margin-right: 5px;
    max-height: calc(100vh - 120px/* Height of the header + any additional space */);
    width: 100%;
    max-width: 1350px;
    overflow-y: auto; /* Enables vertical scrolling */
    box-sizing: border-box; /* Includes padding and border in the element's total width and height */
    position: relative; /* If needed for positioning context */
    z-index: 1; /* Lower z-index than fixed elements */
}
</style>