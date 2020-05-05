<template>
  <div
    class="selectBox"
    tabindex="0"
    @blur="open = false"
    @keydown.esc.exact.prevent="open = false"
    @keydown.enter.exact.prevent="open = true"
            @keydown.up.prevent="previousItem"
     @keydown.down.prevent="nextItem"
  >
    <div class="selected" :class="{ open: open }" @click="toggleOpen">
      {{ selected }}
      <font-awesome-icon
        :icon="['fa', 'chevron-down']"
        class="arrows"
      ></font-awesome-icon>
    </div>
    <div class="options" v-show="open" ref="options">
      <div
        class="option"
        v-for="(option, index) of options"
        :key="index"
        @click="
          selected = option
          open = false
        "

        @keydown.enter.prevent="selected = option; open = false"
        :class="{ 'active-option': currentItem === index }"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selected: this.options.length > 0 ? this.options[0] : null,
      open: false,
      currentItem: 0
    }
  },

  methods: {
    toggleOpen() {
      this.open = !this.open
    },

    nextItem() {
      if (this.currentItem < this.$refs.options.children.length - 1) {
        // event.preventDefault();
        this.currentItem++
      }
      /* if (event.keyCode === 38 && this.currentItem > 0) {
        event.preventDefault();
        this.currentItem--
      } else if (event.keyCode === 40 && this.currentItem < this.$refs.options.children.length - 1) {
        event.preventDefault();
        this.currentItem++
      } */
    },
    previousItem() {
      if (this.currentItem > 0) {
        // event.preventDefault();
        this.currentItem--
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.selectBox {
  position: relative;
  @include boxSize($minWidth: 260px, $maxWidth: 300px, $height: 2rem);
  @include alignment($textAlign: left);
  line-height: 2rem;
  @include fonts($color: $white);

  .selected {
    @include boxSize($height: 2rem);
    background-color: $gray;
    border-radius: 6px;
    border: 1px solid #423f37ef;
    padding-left: 0.5rem;
    cursor: pointer;
    user-select: none;

    &.open {
      border: 1px solid #856a32;
      border-radius: 6px 6px 0px 0px;
    }

    .arrows {
      position: absolute;
      top: 10px;
      right: 10px;
      @include fonts($size: 0.7rem);
    }
  }

  .options {
    border-radius: 0px 0px 6px 6px;
    max-height: 120px;
    overflow-y: auto;
    position: absolute;
    background-color: $gray;
    left: 0;
    right: 0;
    z-index: 2;

    .option {
      padding-left: 0.5rem;
      cursor: pointer;
      user-select: none;
    }
    .active-option {
      background-color: rgba(230, 165, 46, 0.959);
    }
    .option:hover {
      background-color:rgba(214, 170, 87, 0.959);
    }
  }
}
</style>
