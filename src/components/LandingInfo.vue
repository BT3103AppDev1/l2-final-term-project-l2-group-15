<template>
  <div class="container">
    <section class="hero">
      <h1>Welcome to ConnectHub</h1>
      <p>
        Your neighborhood's social nexus! ConnectHub is a vibrant online
        platform designed exclusively for local residents, fostering a sense of
        community and connection.
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
          Discover and support local businesses, services, and events, enhancing
          the neighborhood's economic ecosystem.
        </p>
      </div>
      
      <div class="feature">
        <h3>Community Groups & Events</h3>
        <img
          src="../assets/groups.png"
          alt="Placeholder Image"
          width="85%"
          height="85%"
        />
        <p>
          Explore and join various groups within your neighborhood, each
          offering a unique blend of interests and activities where like-minded
          people can connect.
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero {
  text-align: center;
  padding: 10px 0;
}

.features {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  
}

.feature {
  flex-basis: 48%;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.feature img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}
</style>
