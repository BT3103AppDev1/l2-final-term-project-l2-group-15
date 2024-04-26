<template>
  <div class="container">
    <section class="hero">
      <h1>Welcome to <span class="connecthub">ConnectHub</span></h1>
      <p>
        Your neighborhood's social nexus! ConnectHub is a vibrant online
        platform designed exclusively for local residents.
      </p>
    </section>
    <div class="features">
      <div class="feature">
        <h3>Marketplace</h3>
        <img
          src="../assets/marketplace.png"
          alt="Placeholder Image"
          width="82%"
          height="82%"
        />
        <p>
          Discover and support local businesses in your neighbourhood!
        </p>
      </div>
      
      <div class="feature">
        <h3>Community Groups & Events</h3>
        <img
          src="../assets/groups.png"
          alt="Placeholder Image"
          width="86%"
          height="86%"
        />
        <p>
          Explore and join various groups within your neighborhood!
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero h1 {
  font-family: "Rubik", sans-serif;
  font-size: 70px;
  margin-bottom: 20px;
  margin-top: 0;
}

.connecthub {
  color: #fc6a03;
}

.hero p {
  font-family: "Inconsolata", monospace;
  font-weight: 400;
  font-size: 17px;  
  margin-top: 0;
  text-align: center; 
  overflow: hidden; 
  white-space: nowrap; 
  border-right: .15em solid orange;
  animation: typewriter 3s steps(40); 
}

@keyframes typewriter {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.hero {
  text-align: center;
  padding: 10px 0;
}

.features {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  margin-top: 0;
}
.feature {
  flex-basis: 48%;
  text-align: center;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease-in-out;
  margin-right: 10px;
}

.feature h3 {
  font-family: "Poppins", sans-serif;
  font-weight: 800;
  font-style: normal;
  font-size: 25px;
}

.feature p {
  font-family: "Poppins", sans-serif;
  font-weight: 370;
  font-style: italic;
  font-size: 16px;
}

.feature:hover {
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.feature img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}
</style>