<template>
  <nav class="common-header">
    <h1 class="header">ConnectHub</h1>
    <div>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Sign Up</router-link>
    </div>
  </nav>
</template>

<style>
.common-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #000e90;
  margin: 0;
}

.common-header a {
  text-decoration: none;
  margin-left: 20px;
  color: white;
}

.header {
  color: white;
}

.common-header a.router-link-exact-active {
  font-weight: bold;
}
</style>
