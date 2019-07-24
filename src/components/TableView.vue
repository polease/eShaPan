<template>
  <v-flex class="list-page">
    <v-data-table :headers="headers" :items="listItems" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-right" v-for="(p, index) in headers" :key="index">
          <v-text-field v-model="props.item[p.value]" single-line class="body-1 pa-0" ref="'listItem_'+p.value"/>
        </td> 
      </template>
    </v-data-table>
  </v-flex>
</template>

<style lang="scss">
.list-page {
  width: 100%;
  .list-item {
    height: 32px;
  }
}
</style>

<script>

import ListType from '../data/list-type.json'

export default {
  data() {
    return {
      headers:  ListType[0].definition,
      listItems: [
        { name: "List A", id: "1", level: 0 },
        { name: "List B", id: "2", level: 4 }
      ]
    };
  },
  methods: {
    createListItem() {
      return { name: "", id: "1", level: 0 };
    },
    tabListItem(event, listItem, index) {
      if (event.shiftKey && listItem.level > 0)
        listItem.level = listItem.level - 1;
      else if (!event.shiftKey) listItem.level = listItem.level + 1;
      event.preventDefault();
    },
    enterListItem(event, listItem, index) {
      var newItem = this.createListItem();
      this.list.splice(index + 1, 0, newItem);
      this.$refs.listItems[index + 1].focus();
    },
    keyUpListItem(event, listItem, index) {
      if (index > 0) this.$refs.listItems[index - 1].focus();
    },
    keyDownListItem(event, listItem, index) {
      if (index < this.$refs.listItems.length - 1)
        this.$refs.listItems[index + 1].focus();
    },
    generateMargin(listItem) {
      return "0 0 0 " + listItem.level * 20 + "px";
    }
  }
};
</script>

