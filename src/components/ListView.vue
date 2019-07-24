<template>
  <v-flex class="list-page">
    <div
      v-for="listItem in list"
      :key="listItem"
      @click="listClick(listItem.id)"
      class="list-item"
    >  
      <v-text-field v-model="listItem.name" single-line v-on:keyup.tab="tabListItem(listItem)" class="body-1" :style="{margin: generateMargin(listItem)}" ></v-text-field>
 
    </div>
  </v-flex>
</template>

<style lang="scss">
 


.list-page {
  width: 100%;
  .list-item {
    height: 30px; 

    .tree-level {
      width: 30px;
      height: 30px;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      list: [
        { name: "List A", id: "1", level: 1 },
        { name: "List B", id: "2", level: 4 }
      ]
    };
  },
  methods: {
    listClick(listItem) {
      //alert(listMeta);
    },
    tabListItem(listItem) {
      listItem.level = listItem.level + 1;
    },
    generateMargin(listItem){
        return '0 0 0 '+ (listItem.level * 10)+ 'px';
    }
  }
};
</script>

