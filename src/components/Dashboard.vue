
<template>
  <div id="Dashboard">
    <h2>Dashboard</h2>
    <div class="features">
      <div id="Marketplace" @click="goMarketPlace" class="feature">
        <img src="../assets/marketplace.png" alt="Marketplace" />
        <p>Discover and support local businesses, services, and events, enhancing the neighborhood's economic ecosystem.</p>
        <h3>Marketplace</h3>
      </div>

      <div id="Groups" @click="goGroups" class="feature">
        <img src="../assets/groups.png" alt="Groups" />
        <p>Explore and join various groups within your neighborhood, each offering a unique blend of interests and activities where like-minded people can connect.</p>
        <h3>Groups and Events</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // Your data properties
    };
  },
  methods: {
    goMarketPlace() {
      console.log("goMarketplace");
    },
    goGroups() {
      console.log("goGroups");
    },
  },
};
</script>

<style>
body {
  font-family: 'Open Sans', Arial, sans-serif;
  color: #333;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#Dashboard {
  text-align: center;
  padding: 20px;
}

.features {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.feature {
  flex-basis: 45%;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s ease-in-out;
}

.feature img {
  width: 80%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 20px;
}

.feature:hover {
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

h2 {
  margin-bottom: 20px;
  color: #005792;
}

h3 {
  color: #00b2ca;
}

p {
  color: #4a4a4a;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .features {
    flex-direction: column;
  }

  .feature {
    flex-basis: auto;
    width: 90%;
    margin: 0 auto; /* Center align the feature blocks */
    margin-bottom: 20px; /* Space between the features */
  }
}
</style>
<!-- 

<template>
    
    <div id = "Dashboard">
        <h2>Dashboard</h2><hr>
        <div id = "Marketplace" @click="goMarketPlace">
            <img
            src="../assets/marketplace.png"
            alt="Placeholder Image"
            width="40%"
            height="40%"
            />
            <p>
            Discover and support local businesses, services, and events, enhancing
            the neighborhood's economic ecosystem.
            </p>
            <h3>Marketplace</h3>
        </div>

        <div id = "Groups" @click="goGroups">
            <img
            src="../assets/groups.png"
            alt="Placeholder Image"
            width="40%"
            height="40%"
            />
            <p>
            Explore and join various groups within your neighborhood, each
            offering a unique blend of interests and activities where like-minded
            people can connect.
            </p>
            <h3>Groups and Events</h3>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {

            }
        },

        methods: {
            goMarketPlace() {
                console.log("goMarketplace")
            },

            goGroups() {
                console.log("goGroups")
            }
        }

    }
</script>


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
}

.feature img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}
</style> -->