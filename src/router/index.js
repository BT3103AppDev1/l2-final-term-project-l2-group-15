import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Landing from "@/views/Landing.vue";
import Register from "@/views/Register.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import AllGroup from "@/views/AllGroup.vue";

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

  {
    path: "/all_groups/",
    name: "All Groups",
    component: AllGroup,
    meta: {requiresAuth: true},
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
