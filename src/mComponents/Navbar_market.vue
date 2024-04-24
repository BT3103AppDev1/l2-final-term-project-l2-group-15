<template>
    <ul class="vertnav">
        <li><img @click="goTo('MarketplaceViewItems')" src="@/assets/buy_icon.png" alt="Buy"></li>
        <li><img @click="goTo('MarketplaceSentReq')" src="@/assets/shopping_cart.png" alt="Shopping Cart"></li>
        <li><img @click="goTo('MarketplaceMyList')" src="@/assets/sell_icon.png" alt="Sell"></li>
        <li><img @click="goTo('MarketplaceDealReq')"src="@/assets/approve.png" alt="Listings"></li>
    </ul>
</template>

<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { getDoc, doc, onSnapshot, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default {
    name: "Navbar_groups",

    methods: {
        goTo(routeName) {
            this.$router.push({ name: routeName });
        }
    },

    data() {
        return {
            user: getAuth().currentUser.uid,
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
    
    li {
        display: block;
        color: #000;
        text-decoration: none;
        margin-bottom: 12px;
        text-align: center;
        /* margin-top: 10px; */
    }
    
        /* li a.active {
            background-color: #04AA6D;
            color: white;
        } */
    
    li :hover {
        background-color: #c4c4c4;
        color: white;
    }
    
    img {
        height: 50px;
        width: 50px;
        /* border: 2px solid black; */
        padding: 15px;
        margin: 0px;
    }
</style>