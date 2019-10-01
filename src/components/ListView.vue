<template>
  <v-container class="list-page">
    <v-row v-for="(listItem,index) in currentList.items" :key="index" class="list-item">
      <span class="list-item-prefix">{{index+1}}</span>
      <v-text-field
        v-model="listItem.__name"
        single-line
        v-on:keyup.enter="enterListItem($event,listItem, index)"
        v-on:keydown.tab="tabListItem($event,listItem,index)"
        v-on:keydown.up="keyUpListItem($event,listItem,index)"
        v-on:keydown.down="keyDownListItem($event,listItem,index)"
        v-on:keyup.delete="keyDeleteListItem($event,listItem,index)"
        @change="updateListItem(listItem)"
        class="body-1 pa-0"
        ref="listItems"
        :style="{margin: generateMargin(listItem)}"
      ></v-text-field>
    </v-row>
     
 

    <v-btn class="ma-3" @click="newListItemToLast()">
      New Item
      <v-icon right dark>mdi-table-row-plus-after</v-icon>
    </v-btn>
  </v-container>
</template>

<style lang="scss">

.up-button{
  margin-bottom: 40px;
}

.list-page {
  width: 100%;
  .list-item {
    height: 32px;
    margin-right: 20px;
    .list-item-prefix {
      color: gray;
      padding-top: 10px;
      margin-right: 10px;
      width: 14px;
      font-size: 10px;
    }

    .v-text-field input {
      font-size: 0.8em;
    }

    .tree-level {
      width: 32px;
      height: 32px;
    }
  }
}
</style>

<script>
import { mapState } from "vuex";
import * as List from "../models/list.js";
  import * as easings from 'vuetify/es5/services/goto/easing-patterns';

export default {
  computed: mapState(["currentList"]),
  data() {
    return {
      fab: false
    };
  },
  methods: { 
   
    tabListItem(event, listItem) {
      let levelAdjustment = 1;

      if (event.shiftKey) List.adjustListItemLevel(listItem, -levelAdjustment);
      else List.adjustListItemLevel(listItem, levelAdjustment);

      listItem.__ob__.dep.notify();

      event.preventDefault();
    },
    async newListItemToLast() {
      let index = 0;
      if (this.currentList.items && this.currentList.items.length > 0)
        index = this.currentList.items.length - 1;
      await this.$store.dispatch("createListItem", index);
      this.$refs.listItems[index + 1].focus();
    },
    async newListItem(index) {
      await this.$store.dispatch("createListItem", index);
      this.$refs.listItems[index + 1].focus();
    },
    async enterListItem(event, listItem, index) {
      await this.newListItem(index);
    },
    keyUpListItem(event, listItem, index) {
      if (index > 0) this.$refs.listItems[index - 1].focus();
    },
    keyDownListItem(event, listItem, index) {
      if (index < this.$refs.listItems.length - 1)
        this.$refs.listItems[index + 1].focus();
    },
    keyDeleteListItem(event, listItem, index) {
      if (!listItem.__name || listItem.__name.length === 0) {
        this.$refs.listItems[index - 1].focus();
        this.$store.dispatch("deleteListItem", index);
      }
    },
    generateMargin(listItem) {
      return "0 0 0 " + listItem.__level * 20 + "px";
    },
    updateListItem(listItem) {
      this.$store.dispatch("saveCurrentList");
    }
  }
};
</script>

