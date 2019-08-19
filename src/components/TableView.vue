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
            class="list-item-field-container"
            v-for="(p, propIndex) in currentList.definition.filter(i =>i.type !='system')"
            :key="propIndex"
          >
            <span
              v-if="p.type === 'index'"
              class="list-item-prefix"
            >{{currentList.items.indexOf(item)+1}}</span>
            <v-text-field
              v-if="p.type != 'index'"
              v-model="item[p.value]"
              single-line
              class="pa-0 list-item-field"
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
    <v-btn
      :loading="loading3"
      :disabled="loading3"
      class="ma-3"
      @click="newListItem(0)"
    >
      New Item
      <v-icon right dark>mdi-table-row-plus-after</v-icon>
    </v-btn>
 
    <list-definition-edit></list-definition-edit>
  </v-flex>
</template>

<style lang="scss">
.table-view {
  .list-item-prefix {
    color: gray;
    padding-top: 10px;
    padding-left:10px;
    text-align: center;
    width: 14px;
    font-size: 10px;

  }

  .list-item-field-container{
    padding: 0px;
  }

  .list-item-field{
    width:100%;
  }

  .v-text-field input {
    font-size: 0.8em;
  }
}
</style>

<script>
import { mapState } from "vuex";
import ListDefinitionEdit from "./ListDefinitionEdit.vue";

//var jmespath = require("jmespath");

export default {
  components: {
    ListDefinitionEdit
  },
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
    async newListItem(index){
       await this.$store.dispatch("createListItem", index);
      this.$refs.listItems[index + 1].focus();
      await this.$store.dispatch("saveCurrentList");
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

