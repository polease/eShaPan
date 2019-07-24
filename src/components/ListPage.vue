<template>
  <v-flex class="mx-3 my-3" fill-height align-start>
    <v-layout>
    <v-flex md4 lg4>
    <v-text-field class="title ma-0 pa-0" v-model="list.name" single-line ></v-text-field>
    </v-flex>
      
    <v-flex md4 lg4>
    </v-flex>
    </v-layout>
    <div class=" list-meta mb-3" >{{list.createdTime}}</div>

    <list-view></list-view>
  </v-flex>
</template>
<style lang="scss" >
.list-meta{
  margin-top:-14px;
  font-size:10px;
  color:gray;
} 


</style>

<script>
import ListView from "./ListView.vue";

export default {
  components: {
    ListView
  },
  data() {
    return {
      list:{name: "List A", id:"1" , createdTime:"2019-07-07 13:45"}
    };
  },
  methods: {
    listClick(listMeta) {
      alert(listMeta);
    }
  }
};
</script>

