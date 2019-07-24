<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer v-model="drawer" fixed clipped app>
      <v-list dense>
        <books></books>

        <v-subheader class="grey--text text--darken-1 mt-3" align-left>Settings</v-subheader>

        <v-list-tile class="mt-3" @click>
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Browse Channels</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click>
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Manage Subscriptions</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="sys-toolbar" dense fixed clipped-left app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer">
        <font-awesome-icon icon="brain"></font-awesome-icon>
      </v-toolbar-side-icon>
      <font-awesome-icon icon="coffee"></font-awesome-icon>
      <v-icon class="mx-3">fa fa-brain</v-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">Hard Brain</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout row align-center style="max-width: 650px">
        <v-text-field
          :append-icon-cb="() => {}"
          class="search"
          placeholder="Search your lists..."
          single-line
          append-icon="search"
          color="white"
          hide-details
          filled
          rounded
        ></v-text-field>
      </v-layout>
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <router-view></router-view> 
      </v-container>
    </v-content>
  </v-app>
</template>
<style lang="scss">
.sys-toolbar {
  background-color: $primary !important;


  .search{
    font-size: 12px !important;
  }
}
</style>

<script>
import Books from "./components/Books.vue";

export default {
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