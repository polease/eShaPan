<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" fixed clipped app>
      <books></books>
      <v-list dense>
        <!-- <v-subheader class="grey--text text--darken-1 mt-3" align-left>Settings</v-subheader>

        <v-list-item class="mt-3">
          <v-list-item-icon>
            <v-icon color="grey darken-1">mdi-settings-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="grey--text text--darken-1">Browse Channels</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="grey darken-1">mdi-settings-outline</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="grey--text text--darken-1">Manage Subscriptions</v-list-item-title>
          </v-list-item-content>
        </v-list-item>-->
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="sys-toolbar" dense fixed clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <font-awesome-icon icon="brain"></font-awesome-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="mr-12 align-center">
        <span class="title app-title">eShaPan</span>
        <span class="app-version">alpha</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-row row align-center style="max-width: 650px">
        <v-text-field
          :append-icon-cb="() => {}"
          class="search"
          color="#FFFFFF"
          placeholder="Search your lists..."
          single-line
          append-icon="mdi-search"
          hide-details
          filled
          rounded
        ></v-text-field>
      </v-row>
    </v-app-bar>
    <v-content id="main">
      <v-container align="start" justify="start">
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>
<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;

}

// Debug outline elements
// * {
//    outline: 1px solid red;
//   }

.sys-toolbar {
  background-color: #c0c0c0 !important;

  .app-title {
    font-family: Didot, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    color: black;
    font-weight: bold;
  }

  .app-version{
    font-size : 12px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin-left: 10px;
    color: gray;
  }

  .search {
    font-size: 12px !important;
  }
}
</style>

<script>
import Books from "./components/Books.vue";

export default {
  name: "App",
  components: {
    Books
  },
  data: () => ({
    drawer: null
  }),
  async mounted() {
    await this.$store.dispatch("initializeNewPan");
    
  },
  props: {
    source: String
  }
};
</script>