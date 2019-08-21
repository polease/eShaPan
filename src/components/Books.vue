<template>
  <v-flex class="books-container">
  
    <v-row class="ma-0 pa-0" no-gutters>
      <v-col md="3">
        <v-subheader class="grey--text text--darken-1" 
             align-left>BOOKS</v-subheader>
      </v-col>
      <v-col md="9" right-align>
        <v-select
          v-model="currentSelectedBookUuid"
          :items="currentUser.books"
          class="book-selection"
          @change="bookSelected()"
          item-text="name"
          item-value="uuid"
          prepend-icon="mdi-notebook"
          editable
          attach
          chips
          dense
          flat
          solo
          hide-no-data
          hide-details
        ></v-select>
      </v-col>
    </v-row>
    <v-list class="grow" v-model="currentSelectedListUuid">
      <v-list-item v-for="list in currentBook.lists" :key="list.uuid" @click="listClick(list)">
        <v-list-item-icon>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="list.name" class="list-title"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list>
      <v-list-item @click="newList()">
        <v-list-item-icon>
          <v-icon color="darken-1">mdi-table-column-plus-before</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="text--darken-1">New List</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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
    return {};
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
    },
    currentSelectedListUuid: {
      get() {
        if (this.currentList) return this.currentList.uuid;
        else return "";
      },
      set(v) {
        //this.$store.dispatch("selectList", v);
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

