<template>
  <v-flex class="books-container">
    <v-layout row wrap>
      <v-flex xs3>
        <v-subheader class="grey--text text--darken-1" align-left>BOOKS</v-subheader>
      </v-flex>
      <v-flex xs9 right-align>
        <v-overflow-btn
          v-model="currentSelectedBookUuid"
          :items="currentUser.books"
          label="name"
          class="book-selection"
          @change="bookSelected()"
          editable
          item-text="name"
          item-value="uuid"
          prepend-icon="book"
          chips
          dense
          flat
          rounded
          solo
        ></v-overflow-btn>
      </v-flex>
    </v-layout>
    <v-list class="grow" v-model="currentSelectedListUuid">
      <v-list-tile v-for="list in currentBook.lists" :key="list.uuid" @click="listClick(list)">
        <v-list-icon>
          <v-icon>list</v-icon>
        </v-list-icon>
        <v-list-tile-title v-text="list.name" class="list-title"></v-list-tile-title>
      </v-list-tile>
    </v-list>
    <v-list>
      <v-list-tile @click="newList()">
        <v-list-tile-action>
          <v-icon color="darken-1">add_circle_outline</v-icon>
        </v-list-tile-action>
        <v-list-tile-title class="text--darken-1">New List</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-flex>
</template>

<style lang="scss">
.books-container {
  .book-selection {
    height: 20px;
  }
  .list-title {
    padding-left: 10px;
  }
}
</style>
<script>
import { mapState } from "vuex";

export default {
  data: function() {
    return { 
    };
  },
  computed: {
    ...mapState(["currentUser", "currentBook", "currentList"]),
    currentSelectedBookUuid: {
      get() {
        return this.currentBook.uuid;
      },
      set(v) {
        this.$store.dispatch("selectBook", v);
      }
    }
  },
  async mounted() {
    await this.$store.dispatch("getUserData");
    this.currentSelectedBookUuid = this.$store.state.currentBook.uuid;
  },
  methods: {
    bookSelected() {
      //this.$store.dispatch("selectBook", this.currentSelectedBookUuid);
    },
    listClick(listMeta) {
      this.$store.dispatch("getList", listMeta.uuid);
      this.$router.push({ path: `/list/${listMeta.uuid}` });
    },
    newList() {
      this.$store.dispatch("createList", 0);
    }
  }
};
</script>

