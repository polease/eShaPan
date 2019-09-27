<template>
  <v-flex class="table-view">
    <v-toolbar collapse dense>
      <v-btn icon @click="adjustListItemLevel(1)">
        <v-icon>mdi-format-indent-increase</v-icon>
      </v-btn>

      <v-btn icon @click="adjustListItemLevel(-1)">
        <v-icon>mdi-format-indent-decrease</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table
      :headers="this.headers"
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
            :width="p.width"
            :style="{padding: generatePadding(item,p)}"
          >
            <span
              v-if="p.type === 'index'"
              class="list-item-prefix"
            >{{currentList.items.indexOf(item)+1}}</span>

            <v-tooltip bottom v-else-if="p.dataType ==='html'" color="#D7D7D7">
              <template v-slot:activator="{ on }">
                <v-btn @click="editHtmlBody(item,p.value)" text icon v-on="on">
                  <v-icon :color="item[p.value]?'primary':'gray'">mdi-information-variant</v-icon>
                </v-btn>
              </template>
              <span class="body-tooltip" v-html="item[p.value]"></span>
            </v-tooltip>

            <v-select
              v-else-if="p.dataType === 'tag'"
              class="pa-0 list-item-field"
              v-model="item[p.value]"
              :items="p.tags"
              item-text="name"
              item-value="value"
              :background-color="getTagColor(item, p)"
              flat
              dense
              solo
              hide-no-data
              hide-details
              @change="updateListItem(item)"
            />

            <v-text-field
              v-else
              v-model="item[p.value]"
              single-line
              class="pa-0 list-item-field"
              ref="'listItem_'+p.value"
              flat
              solo
              hide-no-data
              hide-details
              @focus="currentItem=item"
              @change="updateListItem(item)"
            />
          </td>
          <td>
            <v-icon small class="mr-2" @click="deleteItem(item)">mdi-trash-can-outline</v-icon>
            <v-icon small class="mr-2" @click="addItem(item)">mdi-table-row-plus-after</v-icon>
          </td>
        </tr>
      </template>
      <template v-slot:item.action="{ item }"></template>
    </v-data-table>

    <!-- Action for List Item -->
    <v-btn class="ma-3" @click="newListItemToLast()">
      New Item
      <v-icon right dark>mdi-table-row-plus-after</v-icon>
    </v-btn>
    <list-definition-edit></list-definition-edit>
    <pan-create class="ma-1"></pan-create>

    <!-- -->
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

  .body-tooltip {
  }
}
</style>

<script>
import { mapState } from "vuex";
import ListDefinitionEdit from "./ListDefinitionEdit.vue";
import { VueEditor } from "vue2-editor";
import * as List from "../models/list.js";
import { saveAs } from "file-saver";
import PanCreate from "./PanCreate.vue";
//var jmespath = require("jmespath");

export default {
  components: {
    ListDefinitionEdit,
    VueEditor,
    PanCreate
  },
  data() {
    return {
      htmlEditorDialog: false,
      htmlBody: "",
      htmlItem: null,
      currentItem: null,
      htmlPropName: null,
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
  computed: {
    ...mapState(["currentList"]),
    headers: {
      get() {
        let columns = this.currentList.definition.filter(
          i => i.type != "system"
        );
        let action = { text: "Action", value: "action" };
        columns.splice(columns.length, 0, action);
        return columns;
      },
      set(v) {}
    }
  },
  mounted() {},
  methods: {
     async newListItemToLast() {
      let index = 0;
      if(this.currentList.items && this.currentList.items.length > 0)
        index = this.currentList.items.length-1;
      await this.$store.dispatch("createListItem", index);
      this.$refs.listItems[index + 1].focus(); 
    },
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
    saveBody() {
      this.htmlItem[this.htmlPropName] = this.htmlBody;
      this.htmlEditorDialog = false;

      this.updateListItem(this.htmlItem);
    },
    adjustListItemLevel(levelAdjustment) {
      List.adjustListItemLevel(this.currentItem, levelAdjustment);

      this.currentItem.__ob__.dep.notify();
    },
    async addItem(item) {
      let index = this.currentList.items.indexOf(item);
      await this.$store.dispatch("createListItem", index);
    },
    async deleteItem(item) {
      let index = this.currentList.items.indexOf(item);
      await this.$store.dispatch("deleteListItem", index);
    },
    getTagColor(item, fieldDefinition) {
      if (!item || !fieldDefinition || !fieldDefinition.tags) return null;

      let fieldValue = item[fieldDefinition.value];
      let tagDefinition = fieldDefinition.tags.find(t => t.name === fieldValue);
      if (tagDefinition) return tagDefinition.color;
    }
  }
};
</script>

