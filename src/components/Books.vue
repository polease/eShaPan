<template>
  <v-flex class="books-container">
    <v-layout row wrap>
      <v-flex xs3>
        <v-subheader class="grey--text text--darken-1" align-left>BOOKS</v-subheader>
      </v-flex>
      <v-flex xs9 right-align>
        <v-overflow-btn
          v-model="currentBook"
          :items="books"
          label="name"
          class="book-selection"
          editable
          item-text="name"
          item-value="id"
          prepend-icon="book"
          chips
          dense
          flat
          rounded
          solo
        ></v-overflow-btn>
      </v-flex>
    </v-layout>
    <v-list class="grow">
      <v-list-tile v-for="(list,i) in currentBook.lists" :key="i" @click="listClick(list)">
        <v-list-icon>
          <v-icon>list</v-icon>
        </v-list-icon>
        <v-list-tile-title v-text="list.name" class="list-title"></v-list-tile-title>
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

  import { mapState } from 'vuex';

export default {
  computed: mapState(["books", "currentBook"]),
  mounted() {
    this.$store.dispatch("getBooks", 1);
  },
  methods: {
    listClick(listMeta) {
      this.$store.dispatch("getList", listMeta.id);
      this.$router.push({ path: `/list/${listMeta.id}` });
    }
  }
};
</script>

