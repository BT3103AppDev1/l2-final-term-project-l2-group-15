<template>
  <div class="common-header-container">
    <h1 class="header">ConnectHub</h1>
    <div class="common-header">
      <ul>
        <li @click="goHome"><span>Home</span></li>
        <li @click="goLogin"><span>Login</span></li>
        <li @click="goRegister"><span>Sign Up</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "CommonHeader",

  methods: {
    goHome() {
      this.$router.push("/")
    },

    goLogin() {
      this.$router.push("/login")
    },

    goRegister() {
      this.$router.push("/register")
    }
  }
}
</script>

<style scoped>
.common-header-container {
  background-color: #1E0342;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-between;
}

.header {
  color: white;
  margin: 0px;
  margin-left: 30px;
  justify-self: center;
  padding-top: 11px;
  padding-bottom: 11px;
}

.common-header {
  background-color: #1E0342;
  display: flex;
  justify-content: flex-end;
}

.common-header ul {
  display: inline-flex;
  list-style: none;
  color: white;
  text-align: center;
  font-size: 17px;
  display: flex;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
  padding: 0px;
  margin-top: 0px;
  margin-bottom: 0px;
}

.common-header ul li {
  padding-left: 15px;
  padding-right: 15px;
  width: 100px;
  height: auto;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease; 
  display: flex; 
  align-items: center;
  justify-content: center;
}

.common-header ul li:hover {
  color: white;
  background-color: #0066ff;
}
</style>
