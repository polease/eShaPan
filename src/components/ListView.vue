<template>
  <v-flex class="list-page">
    <v-layout v-for="(listItem,index) in list.items" :key="index" class="list-item" row>
      <span class="list-item-prefix">{{index+1}}</span>
      <v-text-field
        v-model="listItem.__name__"
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
export default {
  computed:{
    list(){
      return this.$store.state.currentList;
    }
  },
  data() {
    return { 
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
      this.list.items.splice(index + 1, 0, newItem);
      this.$refs.listItems[index + 1].focus();
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

