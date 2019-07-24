<template>
  <v-flex class="books-container">

      <v-layout row wrap>
        <v-flex xs3>
          <v-subheader class="grey--text text--darken-1" align-left>BOOKS</v-subheader>
        </v-flex>
        <v-flex xs9 right-align>
          <v-overflow-btn
            v-model="currentSelectedBook"
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
      <v-list-tile v-for="list in lists" :key="list" @click="" :to="list.link">
          <v-list-icon><v-icon>list</v-icon></v-list-icon>
        <v-list-tile-title v-text="list.name" class="list-title"> 
        </v-list-tile-title>
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
      padding-left:10px;
  }
}
</style>
<script>
export default {
  data() {
    return {
      currentSelectedBook: { id: 1, name: "personal" },
      books: [
        { id: 1, name: "personal" },
        { id: 2, name: "work" },
        { id: 3, name: "work2" }
      ],

      lists: [{ name: "List A", id: "1", link:'/list/1' }, { name: "List B", id: "2", link:'/list/2' }]
    };
  },
  methods: {
    listClick(listMeta) {
      alert(listMeta);
    }
  }
};
</script>

