<template>
  <v-flex class="mx-2 my-2" fill-height align-start>
    <v-layout>
      <v-flex md4 lg4>
        <v-text-field class="title ma-0 pa-0" v-model="list.name" single-line></v-text-field>
      </v-flex>
<v-spacer></v-spacer>
      <v-flex md4 lg3>
        <v-select
            class=" ma-0 pa-0"
            v-model="value"
            :items="listTypes"
            item-text="name"
            item-value="id"
            prepend-icon="category"
            attach
            chips
            hint="List Type"
            persistent-hint="true"
            multiple
            rounded
          ></v-select> 
      </v-flex>
    </v-layout>
    <div class="list-meta mb-3">{{list.createdTime}}</div>
    <v-tabs class="views">
      <v-tab>List</v-tab>
      <v-tab>Table</v-tab>
      <v-tab>Timeline</v-tab>
      <v-tab>Image</v-tab>
      <v-tab>Heatmap</v-tab>
      <v-tab-item class="my-3">
        <list-view></list-view>
      </v-tab-item>
       <v-tab-item class="my-3">
        <table-view></table-view>
      </v-tab-item>
       <v-tab-item class="my-3">
        <list-view></list-view>
      </v-tab-item>
    </v-tabs>
  </v-flex>
</template>
<style lang="scss" >
.list-meta {
  margin-top: -24px;
  font-size: 10px;
  color: gray;
}
.views{
  height: 20px;
}
</style>

<script>
import ListView from "./ListView.vue";
import TableView from "./TableView.vue";

export default {
  components: {
    ListView,
    TableView
  },
  data() {
    return {
      list: { name: "List A", id: "1", createdTime: "2019-07-07 13:45" },
      listTypes : [{name:'Task',id:'1'},{name:'Resource', id:'2'}]
    };
  },
  methods: {
    listClick(listMeta) {
      alert(listMeta);
    }
  }
};
</script>

