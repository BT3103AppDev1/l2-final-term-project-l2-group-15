import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from 'firebase/auth';
import Login from "@/views/Login.vue";
import Landing from "@/views/Landing.vue";
import Register from "@/views/Register.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import AllGroup from "@/views/AllGroup.vue";
import UpdateProfile from "@/views/UpdateProfile.vue";
import Marketplace from "@/views/Marketplace.vue";
import MyGroups from "@/views/MyGroups.vue";
import SpecificGroupHome from "@/views/SpecificGroupHome.vue";
import AllDiscussion from "@/views/AllDiscussion.vue";
import ViewDiscussion from "@/views/ViewDiscussion.vue";
import GroupSetting from "@/views/GroupSetting.vue";
import Test from '@/views/Test.vue';
import Events from '@/views/Events.vue';
import MarketplaceLanding from '@/views/MarketplaceLanding.vue'
import MarketplaceDealReq from '@/views/MarketDealReq.vue'
import MarketplaceMyList from '@/views/MarketMyList.vue'
import MarketplaceSentReq from '@/views/MarketSentReq.vue'
import MarketplaceViewItems from '@/views/MarketViewItems.vue'
import MarketApprove from "@/views/MarketApprove.vue";


const routes = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/user_dashboard/:user_id",
    name: "UserDashboard",
    component: UserDashboard,
    meta: {requiresAuth: true},
  },

  {
    path: "/all_groups/",
    name: "All Groups",
    component: AllGroup,
    meta: {requiresAuth: true},
  },

  {
    path: "/marketplace/",
    name: "Marketplace",
    component: Marketplace,
    meta: {requiresAuth: true},
  },

  {
    path: "/my_groups/",
    name: "MyGroups",
    component: MyGroups,
    meta: {requiresAuth: true},
  },
  
  {
    path: "/update_profile/",
    name: "UpdateProfile",
    component: UpdateProfile,
    meta: {requiresAuth: true},
  },

  {
    path: '/specific_group_home/:group/:user',
    name: 'SpecificGroupHome',
    component: SpecificGroupHome,
    meta: {requiresAuth: true},
  },

  {
    path: '/marketplaceLanding',
    name: 'MarketplaceLanding',
    component: MarketplaceLanding,
    meta: {requiresAuth: true},
  },

  {
    path: '/marketdealreq',
    name: 'MarketplaceDealReq',
    component: MarketplaceDealReq,
    meta: {requiresAuth: true},
  },


  {
    path: '/marketmylist',
    name: 'MarketplaceMyList',
    component: MarketplaceMyList,
    meta: {requiresAuth: true},
  },


  {
    path: '/marketsentreq',
    name: 'MarketplaceSentReq',
    component: MarketplaceSentReq,
    meta: {requiresAuth: true},
  },


  {
    path: '/marketviewitems',
    name: 'MarketplaceViewItems',
    component: MarketplaceViewItems,
    meta: {requiresAuth: true},
  },



  {
    path: '/group_setting/:group/:user',
    name: 'GroupSetting',
    component: GroupSetting,
    meta: {requiresAuth: true},
  },

  {
    path: '/all_discussion/:group/:user',
    name: 'AllDiscussion',
    component: AllDiscussion,
    meta: {requiresAuth: true},
  },

  {
    path: '/marketapprove/:itemID',
    name: 'MarketApprove',
    component: MarketApprove,
    meta: {requiresAuth: true},
  },

  {
    path: '/view_discussion/:group/:user/:discussionID',
    name: 'ViewDiscussion',
    component: ViewDiscussion,
    meta: {requiresAuth: true},
  },

  {
    path: '/Test',
    name: 'Test',
    component: Test
  },

  {
    path: '/events/:group/:user',
    name: 'Events',
    component: Events,
    meta: {requiresAuth: true},
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// This is to route all the individuals to their corresponding locations
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  // console.log("LOL")
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the user is not logged in, or their email is not verified, redirect to login page
    if (!user) {
      next({ name: 'Login' }); // Redirect to the Login page
    } else {
      next(); // Proceed to the route
    }
  } else {
    next(); // Proceed if the route does not require authentication
  }
});


export default router;
