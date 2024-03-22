<template>
    
    <div id = "Dashboard">
        <h2>Dashboard</h2><hr>
        <div id = "Marketplace" @click="goMarketPlace">
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
            <h3>Marketplace</h3>
        </div>

        <div id = "Groups" @click="goGroups">
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
</style>