<template>
  <v-container>
       <v-toolbar collapse dense>
<pan-create :pan="pan"></pan-create> 
<v-btn   icon color="blue-grey" class="white--text" @click="renderPan">
        <v-icon right dark>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>
    <div :id="id"></div>
  </v-container>
</template>

<style lang="scss">
rect{ 
}
text{
    font-size:12px;
    font-family: 'Courier New', Courier, monospace;
}
</style>

<script>
import { mapState } from "vuex";
import cloneDeep from "clone-deep";
import * as d3 from "d3";
import PanCreate from "./PanCreate.vue"

export default {
    components: {PanCreate},

  data() {
    return {
       id: 'd3-' + Math.round(Math.random() * 1000000),
      dialog: false,
      colorDialog: false,
      ddd: {},
      headers: [
        { text: "Name", value: "name" },
        { text: "Color", value: "color" },
        { text: "", value: "action", sortable: false }
      ],
      swatches: [
        ["#FF0000", "#AA0000", "#550000"],
        ["#FFFF00", "#AAAA00", "#555500"],
        ["#00FF00", "#00AA00", "#005500"],
        ["#00FFFF", "#00AAAA", "#005555"],
        ["#0000FF", "#0000AA", "#000055"]
      ],
      items: this.tags
    };
  },
  computed: {
    ...mapState(["listTypes", "currentList"])
  },
  props: ["pan"],
  mounted() {
      this.renderPan();
  },
  methods: {
    renderPan() {
        d3.select("svg").remove();
      d3.select(`#${this.id}`)
        .append("svg")
        .attr("width", 1000)
        .attr("height", 800);
      // .style('background', this.chart.background);
      this.ddd.svg = d3.select(`#${this.id} svg`);

      // draw the shape
      this.ddd.item = this.ddd.svg
        .append("g")
        .attr("transform", `translate( 1, 0)`)
        .selectAll("rect")
        .data(this.currentList.items)
        .enter()
        .append("rect");
      this.ddd.item
        .attr("fill", (data, i, array) =>
          this.getColorValue(
            this.pan.definition.color[0],
            this.currentList.definition,
            data,
            i,
            array
          )
        )
        .attr("x", (data, i, array) => this.getValue(this.pan.definition.x[0], data, i, array))
        .attr("y",  (data, i, array)  => this.getValue(this.pan.definition.w[0], data, i, array))
        .attr("width", (data, i, array) =>
          this.getValue(this.pan.definition.w[0], data, i, array)
        )
        .attr("height",  (data, i, array)  => this.getValue(this.pan.definition.h[0], data, i, array));
    
    //draw the text 
      this.ddd.text = this.ddd.svg
        .append("g")
        .attr("transform", `translate( 1, 0)`)
        .selectAll("text")
        .data(this.currentList.items)
        .enter()
        .append("text");
      this.ddd.text 
        .attr("x", (data, i, array) => this.getValue(this.pan.definition.x[0], data, i, array))
        .attr("y",  (data, i, array)  => this.getValue(this.pan.definition.w[0], data, i, array))
        .attr("width", (data, i, array) =>
          this.getValue(this.pan.definition.w[0], data, i, array)
        )
         .text((data, i, array) => this.getValue(this.pan.definition.text[0], data, i, array))
       
        
    
    },
    getValue(dim, item, index, items) {
        if(!dim)
            return null;
      if (dim.type === "static") return dim.value;

      //if(dim.type === 'accumulate')
      //

      return item[dim.value];
    },
    getColorValue(dim, listDefinition, item, index, items) {

        const DEFAULT_COLOR = "lightseagreen";
        if(!dim)
            return DEFAULT_COLOR;
      if (dim.type === "static") return dim.value;

      //if(dim.type === 'accumulate')
      //

      let tagName = item[dim.value];
      let tagDef = listDefinition.find(t => t.value === dim.value);
      if (!tagDef) return DEFAULT_COLOR;

      let tag = tagDef.tags.find(t => t.name === tagName);
      if (!tag) return DEFAULT_COLOR;
      return tag.color;
    },
    save() {
      this.$emit("save", this.items);
      this.dialog = false;
    }
  }
};
</script>

