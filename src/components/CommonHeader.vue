<template>
  <nav class="common-header">
    <h1>ConnectHub</h1>
    <div>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/register">Register</router-link>
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
  background-color: #a9de86;
  margin: 0;
}

.common-header a {
  text-decoration: none;
  margin-left: 20px;
  color: #333;
}

.common-header a.router-link-exact-active {
  font-weight: bold;
}
</style>
