<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" fixed clipped app>
      <v-list dense>
        <books></books>

        <v-subheader class="grey--text text--darken-1 mt-3" align-left>Settings</v-subheader>

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
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar class="sys-toolbar" dense fixed clipped-left app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <font-awesome-icon icon="brain"></font-awesome-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title class="mr-12 align-center">
        <span class="title app-title">沙盘</span>
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
    <v-content>
      <v-container fluid fill-height>
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
  overflow-y: auto;
}

.sys-toolbar {
  background-color: #c0c0c0 !important;

  .app-title {
    font-family: Didot, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    font-size: 16px;
    color: black;
    font-weight: bold;
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
    drawer: null,
    items: [
      { icon: "trending_up", text: "Most Popular" },
      { icon: "subscriptions", text: "Subscriptions" },
      { icon: "history", text: "History" },
      { icon: "featured_play_list", text: "Playlists" },
      { icon: "watch_later", text: "Watch Later" }
    ],
    items2: [
      { picture: 28, text: "Joseph" },
      { picture: 38, text: "Apple" },
      { picture: 48, text: "Xbox Ahoy" },
      { picture: 58, text: "Nokia" },
      { picture: 78, text: "MKBHD" }
    ]
  }),
  props: {
    source: String
  }
};
</script>