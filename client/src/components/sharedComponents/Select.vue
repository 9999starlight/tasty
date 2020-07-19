<template>
  <div
    class="selectBox"
    tabindex="0"
    @blur="closeMenu"
    @keydown.esc.exact.prevent="closeMenu"
    @keydown.up.prevent="previousItem"
    @keydown.down.prevent="nextItem"
    v-on="open ? { keydown: selectOnEnter } : { keydown: openMenu }"
  >
    <div
      class="selected"
      :class="{ open: open }"
      v-on="{ click: open ? closeMenu : openMenu }"
    >
      {{ selected }}
      <font-awesome-icon
        :icon="['fa', 'chevron-down']"
        class="arrows"
      ></font-awesome-icon>
    </div>
    <ul class="options" v-show="open" ref="options">
      <li
        ref="singleOption"
        class="option"
        v-for="(option, index) of options"
        :key="index"
        @click="selectItem(option)"
        :class="[currentItem === index ? 'active-option' : '']"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      required: true
    },
    preloaded: {
      type: Number
    }
  },
  data() {
    return {
      selected: this.options[this.preloaded] || this.options[0],
      open: false,
      currentItem: 0
    }
  },

  computed: {
    ...mapGetters(['getEditState']),

    // calculate item height to scroll current item into view
    scrollItemHeight() {
      return this.$refs.singleOption[this.currentItem].clientHeight
    }
  },

  methods: {
    // open menu on click or pressing enter or space key
    openMenu(event) {
      if (
        event.type === 'click' ||
        event.keyCode === 13 ||
        event.keyCode === 32
      ) {
        event.preventDefault()
        this.open = true
      }
    },

    closeMenu() {
      this.open = false
      this.currentItem = 0
    },

    selectItem(option) {
      this.selected = option
      this.closeMenu()
    },
    // press on enter key for select the option
    selectOnEnter(event) {
      if (event.keyCode === 13) {
        this.selected = this.$refs.options.children[this.currentItem].innerText
        // this.selected = this.options[this.currentItem]
        this.closeMenu()
      }
    },

    nextItem() {
      if (this.currentItem < this.$refs.options.children.length - 1) {
        this.$refs.options.scrollTop = this.scrollItemHeight * this.currentItem
        this.currentItem++
      }
    },

    previousItem() {
      if (this.currentItem === 0) {
        this.$refs.options.scrollTop = this.currentItem
      } else {
        this.$refs.options.scrollTop =
          this.scrollItemHeight * (this.currentItem - 1)
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
  @include fonts($color: $light);

  .selected {
    @include boxSize($height: 2rem);
    background: $darkSteel;
    border-radius: 6px;
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
    background: $darkSteel;
    left: 0;
    right: 0;
    z-index: 2;

    .option {
      padding-left: 0.5rem;
      cursor: pointer;
      user-select: none;
    }
    .active-option {
      background-color: lighten($graphite, 40%);
    }
    .option:hover {
      color: lighten($golden, 20%);
    }
  }
}
</style>
