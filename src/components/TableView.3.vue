<template>
  <v-flex class="list-page">
    
    <hot-table ref="wrapper" :settings="hotSettings" :data="data" licenseKey="non-commercial-and-evaluation"></hot-table>
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

import { mapState } from "vuex";
  import { HotTable } from '@handsontable/vue';
  import Handsontable from 'handsontable';

//var jmespath = require("jmespath");

export default {
  data() {
    return {
      data: [
          ['', 'Tesla', 'Mercedes', 'Toyota', 'Volvo'],
          ['2019', 10, 11, 12, 13],
          ['2020', 20, 11, 14, 13],
          ['2021', 30, 15, 12, 13]
        ],
      hotSettings: {  
          colHeaders: true, 
          readOnly: false,
          afterChange: () => {
            if (this.hotRef) {
              //this.$store.commit('updateData', this.hotRef.getSourceData());
            }
          }
        },
        hotRef: null
    };
  },
  computed: mapState(["currentList"]),
components: {
      HotTable
    },
  beforeMount() {
     
  },
  mounted() {}, 
  methods: {
    tabListItem(event, listItem) {
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
    },
    setData() {
      if (this.$store.state.currentList != null)
        this.listItems = this.$store.state.currentList.items;
    }
  }
};
</script>

