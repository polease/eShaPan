<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer" class="pb-0 menu" floating hide-overlay stateless>
      <v-layout fill-height>
        <v-navigation-drawer dark mini-variant stateless value="true">
          <v-toolbar flat class="transparent">
            <v-list class="pa-0">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img src="https://randomuser.me/api/portraits/men/85.jpg">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>John Leider</v-list-tile-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon @click.native.stop="mini = !mini">
                    <v-icon>chevron_left</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-toolbar>

          <v-list class="pt-0" dense>
            <v-divider></v-divider>
            <v-list-tile v-for="item in items" :key="item.title" @click="menuClick(item.title)">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-navigation-drawer>
      </v-layout>
    </v-navigation-drawer>

    <v-flex xs2>
      <!-- Book and lists -->
      <books></books>
    </v-flex>

    <v-flex xs9>
      <!-- List Page -->

      <list-page></list-page>
    </v-flex>
  </v-layout>
</template>

<style lang="sass">
.menu {
    width:30px;
}

</style>


<script>
import ListPage from "./ListPage.vue";
import Books from "./Books.vue";

export default {
  components: {
    ListPage,
    Books
  },
  data() {
    return {
      drawer: true,
      items: [
        { title: "Book", icon: "book" },
        { title: "Search", icon: "search" },
        { title: "About", icon: "info" }
      ],
      mini: true,
      right: null
    };
  },
  methods: {
    menuClick(menuKey) {
      switch (menuKey) {
        case "Book":
          alert("hello");
          break;
      }
    }
  }
};
</script>