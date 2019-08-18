<template>
  <v-flex class="list-page">
    <v-layout v-for="(listItem,index) in list.items" :key="index" mb-5 wrap>
      <v-flex class="fluid lg6 md6 sm12">
        <div class="list-item-prefix">
          <v-chip class="mr-2 primary" v-clipboard:copy="listItem.r__uri"> 
              {{index+1}}
            </v-chip> 
        </div>
        <div class="list-item-meta">
          <v-flex class="lg12 md12">
            <span class="title">{{listItem.__name}}</span>
          </v-flex>
          <v-flex class="lg12 md12">
            <v-chip class="mr-2" v-clipboard:copy="listItem.r__uri">
              <v-icon left>mdi-link</v-icon>
              {{listItem.r__uri}}
            </v-chip>
          </v-flex>
          <v-flex class="lg12 md12">
            <span class="body">{{listItem.r__content}}</span>
          </v-flex>
          <v-flex class="lg12 md12 pr-2">
            <v-combobox
              v-model="chips"
              :items="items"
              chips
              class="tag ma-0"
              label="Tags"
              multiple
              prepend-icon="tag"
              solo
              flat
            ></v-combobox>
          </v-flex>
        </div>
      </v-flex>
      <v-flex class="lg6 md6 sm12">
        <v-img :src="'https://api.pagepeeker.com/v2/thumbs.php?size=x&url='+listItem.r__uri"></v-img>
      </v-flex>
    </v-layout>
  </v-flex>
</template>

<style lang="scss">
.list-item-prefix {
  float: left;
  width: 60px;
  max-width: 30px;
}

.list-item-meta{
  margin-left: 60px;
}

.tag {
  font-size: 10px !important;
  height: 20px;
}
</style>

<script>
export default {
  computed: {
    list() {
      return this.$store.state.currentList;
    }
  },
  data() {
    return {
      chips: [
        "Programming",
        "Playing video games",
        "Watching movies",
        "Sleeping"
      ],
      items: ["Streaming", "Eating"]
    };
  },
  methods: {
    tabListItem(event, listItem) {
      if (event.shiftKey && listItem.level > 0)
        listItem.level = listItem.level - 1;
      else if (!event.shiftKey) listItem.level = listItem.level + 1;
      event.preventDefault();
    },
    enterListItem(event, listItem, index) {
      var newItem = this.createListItem();
      this.list.items.splice(index + 1, 0, newItem);
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
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1);
      this.chips = [...this.chips];
    }
  }
};
</script>

