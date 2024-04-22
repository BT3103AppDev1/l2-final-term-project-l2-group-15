<template>
    <ul class="vertnav">
        <li><router-link :to="{name: 'MarketplaceViewItems'}"><img src="@/assets/buy_icon.png" alt="football icon"></router-link></li>
        <li><router-link :to="{name: 'MarketplaceSentReq'}"><img src="@/assets/shopping_cart.png" alt="Discussions"></router-link></li>
        <li><router-link :to="{name: 'MarketplaceMyList'}"><img src="@/assets/sell_icon.png" alt="Calender"></router-link></li>
        <li><router-link :to="{name: 'MarketplaceDealReq'}"><img src="@/assets/approve.png" alt="Setting"></router-link></li>
    </ul>
</template>
    
<script>
import firebaseApp from '../firebase.js';
import { getFirestore } from "firebase/firestore";
import { getDoc, doc, onSnapshot, collection} from "firebase/firestore";
import { getAuth } from 'firebase/auth';

export default {
    name: "Navbar_groups",

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
    
    .vertnav {
        margin-top: 66px;
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
        padding: 20px 16px;
        text-decoration: none;
        text-align: center;
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
        height: 40px;
        width: 40px;
    }
</style>