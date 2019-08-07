<template>
  <v-flex class="list-page">
    <v-layout v-for="(listItem,index) in currentList.items" :key="index" class="list-item" row>
      <span class="list-item-prefix">{{index+1}}</span>
      <v-text-field
        v-model="listItem.__name"
        single-line
        
        v-on:keyup.enter="enterListItem($event,listItem, index)"
        v-on:keydown.tab="tabListItem($event,listItem,index)"
        v-on:keydown.up="keyUpListItem($event,listItem,index)"
        v-on:keydown.down="keyDownListItem($event,listItem,index)"
        class="body-1 pa-0"
        ref="listItems"
        :style="{margin: generateMargin(listItem)}"
      ></v-text-field>
    </v-layout>
  </v-flex>
</template>

<style lang="scss">
.list-page {
  width: 100%;
  .list-item {
    height: 32px;

    .list-item-prefix{
      color: gray;
      padding-top:10px;
      width:14px;
      font-size:10px;
    }

    .tree-level {
      width: 32px;
      height: 32px;
    }
  }
}
</style>

<script>

import {mapState} from 'vuex'

export default {
    computed: mapState([ "currentList"]),
  data() {
    return { 
    };
  },
  methods: { 
    tabListItem(event, listItem) {
      if(!listItem.level)
        listItem.level =0;

      if (event.shiftKey && listItem.level > 0)
        listItem.level = listItem.level - 1;
      else if (!event.shiftKey) listItem.level = listItem.level + 1;
      event.preventDefault();
    },
    async enterListItem(event, listItem, index) {
      
      await this.$store.dispatch("createListItem",index);
      this.$refs.listItems[index + 1].focus();
      await this.$store.dispatch("saveCurrentList");
    },
    keyUpListItem(event, listItem, index) {
      if(index > 0)
        this.$refs.listItems[index - 1].focus();
    },
    keyDownListItem(event, listItem, index) {
      if(index < this.$refs.listItems.length-1)
        this.$refs.listItems[index + 1].focus();
    },
    generateMargin(listItem) {
      return "0 0 0 " + listItem.level * 20 + "px";
    }
  }
};
</script>

