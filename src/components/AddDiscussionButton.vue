<template>
    <button @click="$emit('show-add-discussion')">+ Discussion</button>
</template>

<script>
export default {
  name: 'AddDiscussionButton'
};
</script>

<style scoped>
  button {
    font-family: "Roboto", sans-serif;
    margin-left: 20px; 
    background-color: #d7d2d2;
    color: black;
    border: 0.5px gray solid;
    border-radius: 5px;
    font-size: 18px;
    float: right;
    height: 30px;
  }

  button:hover{
    background-color: darkgrey;
  }
</style>