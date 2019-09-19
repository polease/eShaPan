<template>
  <div class="drop-zone">
    <draggable
      v-model="value"
      :group="{ name: 'people',   put: true }"
      @change="changed"
      @start="drag=true"
      @end="drag=false"
      class="drop-zone"
    >
      <v-chip
        v-for="(prop, i) in value"
        :key="i"
        class="ma-1"
        close
        outlined
        @click:close="removed"
      >
        <v-icon v-if="prop.type === 'static'" left>mdi-numeric</v-icon>
        <v-icon v-else-if="prop.type === 'accumulate'" left>mdi-sigma</v-icon>
        <v-icon v-else left>mdi-auto-fix</v-icon>
        <v-text-field v-if="prop.type === 'static'" v-model="prop.value" class="ma-0 pa-0" />
        <span v-else>{{prop.text}}</span>
      </v-chip>
    </draggable>
  </div>
</template>

<style lang="scss">
.drop-zone {
  width: 160px;
  height: 40px;
  background-color: yellow;
  border: dotted;
  border-width:  1px;
  border-radius: 5px;
}
</style>

<script>
import { mapState } from "vuex";
import cloneDeep from "clone-deep";
import draggable from "vuedraggable";

//var jmespath = require("jmespath");

export default {
    components: {
    draggable
  },
  data() {
    return { 
    };
  },
  props: ["value"],
   computed: { 
   },
  mounted() {},
  methods: {
    changed(event) {
      if (event.added) {
        let fields = [event.added.element]; 
        this.$emit("input", fields);
      }
    },
    removed() {
      let fields = []; 
        this.$emit("input", fields);
    }
  }
};
</script>

