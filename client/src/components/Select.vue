<template>
  <div class="selectBox" tabindex="0" @blur="open = false">
    <div class="selected" :class="{ open: open }" @click="open = !open">
      {{ selected }}
      <font-awesome-icon
        :icon="['fa', 'chevron-down']"
        class="arrows"
      ></font-awesome-icon>
    </div>
    <div class="options" v-if="open">
      <div
        class="option"
        v-for="(option, index) of options"
        :key="index"
        @click="
          selected = option
          open = false
        "
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
      open: false
    }
  }
}
</script>

<style lang="scss" scoped>
.selectBox {
  position: relative;
  @include boxSize($width: 220px, $height: 2rem);
  @include alignment($textAlign: left);
  line-height: 2rem;
  @include fonts($color: $white);

  .selected {
    @include boxSize($height: 2rem);
    background-color: $graphite;
    border-radius: 6px;
    border: 1px solid #858586;
    padding-left: 0.5rem;
    cursor: pointer;
    user-select: none;

    &.open {
      border: 1px solid #ce9b2c;
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
    overflow: hidden;
    position: absolute;
    background-color: #080d0e;
    left: 0;
    right: 0;
    z-index: 2;

    .option {
      padding-left: 0.5rem;
      cursor: pointer;
      user-select: none;
    }

    .option:hover {
      background-color: #b68a28;
    }
  }
}

/* place before to display selectable */
/* .selected:empty:not(:focus):before{
    content:attr(data-text)
} */
</style>
