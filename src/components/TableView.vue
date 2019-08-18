<template>
  <v-flex class="table-view">
    <v-data-table
      :headers="currentList.definition.filter(i =>i.type !='system')"
      :items="currentList.items"
      dense
      class="elevation-1"
      :disable-sort="disableSort"
      :disable-pagination="disablePagination"
      :disable-filtering="disableFiltering"
      :hide-default-header="hideDefaultHeader"
      :hide-default-footer="hideDefaultFooter"
      :multi-sort="multiSort"
      :must-sort="mustSort"
      :show-expand="showExpand"
      :show-group-by="showGroupBy"
      :show-select="showSelect"
    >
      <template v-slot:item="{item}">
        <tr>
          <td
            class="text-xs-right"
            v-for="(p, propIndex) in currentList.definition.filter(i =>i.type !='system')"
            :key="propIndex"
          >
            <span
              v-if="p.type === 'index'"
              class="list-item-prefix"
            >{{currentList.items.indexOf(item)}}</span>
            <v-text-field
              v-if="p.type != 'index'"
              v-model="item[p.value]"
              single-line
              class="body-1 pa-0"
              ref="'listItem_'+p.value"
              flat
              hide-no-data
              hide-details
            />
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Add list item</v-btn>
      </template>
    </v-data-table>
  </v-flex>
</template>

<style lang="scss">
.table-view {
  .list-item-prefix {
    color: gray;
    padding-top: 10px;
    width: 14px;
    font-size: 10px;
  }

  .v-text-field input {
    font-size: 0.8em;
  }
}
</style>

<script>
import { mapState } from "vuex";

//var jmespath = require("jmespath");

export default {
  data() {
    return {
      dense: false,
      height: 300,
      loading: false,
      disableSort: false,
      disablePagination: true,
      disableFiltering: false,
      hideDefaultHeader: false,
      hideDefaultFooter: true,
      multiSort: true,
      mustSort: false,
      showExpand: false,
      showGroupBy: false,
      showSelect: false,
      sortBy: [],
      groupBy: []
    };
  },
  computed: mapState(["currentList"]),
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

