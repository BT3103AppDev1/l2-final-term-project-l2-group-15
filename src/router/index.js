import { createRouter, createWebHistory } from "vue-router";
import { getAuth } from 'firebase/auth';
import Login from "@/views/Login.vue";
import Landing from "@/views/Landing.vue";
import Register from "@/views/Register.vue";
import UserDashboard from "@/views/UserDashboard.vue";

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
    path: "/user_dashboard/:userId",
    name: "UserDashboard",
    component: UserDashboard,
    meta: {requiresAuth: true},
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// This is to route all the individuals to their corresponding locations
router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  // Check if the route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // If the user is not logged in, or their email is not verified, redirect to login page
    if (!user || !user.emailVerified) {
      next({ name: 'Login' }); // Redirect to the Login page
    } else {
      next(); // Proceed to the route
    }
  } else {
    next(); // Proceed if the route does not require authentication
  }
});


export default router;
