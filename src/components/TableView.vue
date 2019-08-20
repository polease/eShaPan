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
            :style="{padding: generatePadding(item,p)}"
          >
            <span
              v-if="p.type === 'index'"
              class="list-item-prefix"
            >{{currentList.items.indexOf(item)+1}}</span>

            <v-btn v-else-if="p.fieldType ==='html'" @click="editHtmlBody(item,p.value)" text icon>
              <v-icon>mdi-information-variant</v-icon>
            </v-btn>

            <v-text-field
              v-else
              v-model="item[p.value]"
              single-line
              class="pa-0 list-item-field"
              ref="'listItem_'+p.value"
              flat
              hide-no-data
              hide-details
              @change="updateListItem(item)"
            />
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-btn class="ma-3" @click="newListItem(0)">
      New Item
      <v-icon right dark>mdi-table-row-plus-after</v-icon>
    </v-btn>
    <list-definition-edit></list-definition-edit>
    <v-dialog v-model="htmlEditorDialog" width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit Body</span>
        </v-card-title>
        <v-card-text>
           <vue-editor v-model="htmlBody"></vue-editor>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="htmlEditorDialog = false">Cancel</v-btn>
          <v-btn color="green darken-1" text @click="saveBody()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<style lang="scss">
.table-view {
  .list-item-prefix {
    color: gray;
    padding-top: 10px;
    padding-left: 10px;
    text-align: center;
    width: 14px;
    font-size: 10px;
  }

  .list-item-field-container {
    padding: 0px;
  }

  .list-item-field {
    width: 100%;
  }

  .v-text-field input {
    font-size: 0.8em;
  }
}
</style>

<script>
import { mapState } from "vuex";
import ListDefinitionEdit from "./ListDefinitionEdit.vue";
import { VueEditor } from "vue2-editor";

//var jmespath = require("jmespath");

export default {
  components: {
    ListDefinitionEdit,
    VueEditor
  },
  data() {
    return {
      htmlEditorDialog: false,
      htmlBody:"",
      htmlItem:null,
      htmlPropName:null,
      editor: null,
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
    async newListItem(index) {
      await this.$store.dispatch("createListItem", index);
      this.$refs.listItems[index + 1].focus();
      await this.$store.dispatch("saveCurrentList");
    },
    generatePadding(listItem, field) {
      if (field.value === "__name")
        return "0 0 0 " + listItem.__level * 20 + "px";
      else return null;
    },
    setData() {
      if (this.$store.state.currentList != null)
        this.listItems = this.$store.state.currentList.items;
    },
    updateListItem(listItem) {
      this.$store.dispatch("saveCurrentList");
    },
    editHtmlBody(item, propName) {
      this.htmlBody = item[propName];
      this.htmlItem = item;
      this.htmlPropName = propName;
      this.htmlEditorDialog = true;
    },
    saveBody(){
      this.htmlItem[this.htmlPropName] = this.htmlBody;
      this.htmlEditorDialog = false;
    }
  }
};
</script>

