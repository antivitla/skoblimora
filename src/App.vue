<template lang="pug">
  .app
    .view

      //- .result
      //-   .node(v-if="active.ingredient")
      //-     .name {{ active.ingredient }}
      //-     .children(style="margin-left: 1em;")
      //-       .node(v-for="effect in Skyrim.ingredients[active.ingredient].effects")
      //-         .name {{ effect }}
      //-         .children(style="margin-left: 1em;")
      //-           .node(v-for="ingredient in Skyrim.effects[effect].ingredients")
      //-             .name {{ ingredient }}

      .source
        //- .filter
        //-   input(
        //-     type="text"
        //-     placeholder="Filter effects"
        //-     v-model="filter.effects")
        //-   a.clear(
        //-     v-if="filter.effects"
        //-     @click="clearFilter('effects')"
        //-   )
        //-     i.material-icons close

        .chips
          a.chip(
            v-for="effect in filteredEffects"
            :key="effect.name"
            :class="{ selected: isSelected('effect', effect.name), muted: !isConnectedEffect(effect) }"
            :title="labelContents(effect)"
          )
            .header
              label
                input(
                  type="checkbox"
                  :value="effect.name"
                  v-model="selected.effects")
                span.name {{ effect.name }}
              span.toggle-open(@click="toggleOpen(effect)")
                i.material-icons(v-if="isOpen(effect)") keyboard_arrow_up
                i.material-icons(v-else) keyboard_arrow_down
            .body(v-if="isOpen(effect)")
              label(
                v-for="ingredient in effect.ingredients"
                :key="ingredient"
              )
                input(
                  type="checkbox"
                  :value="ingredient"
                  v-model="selected.ingredients"
                )
                span.name {{ ingredient }}

      p &nbsp;
      hr
      p &nbsp;

      .source
        //- .filter
        //-   input(
        //-     type="text"
        //-     placeholder="Filter ingredients"
        //-     v-model="filter.ingredients")
        //-   a.clear(
        //-     v-if="filter.ingredients"
        //-     @click="clearFilter('ingredients')"
        //-   )
        //-     i.material-icons close

        .chips
          a.chip(
            v-for="ingredient in filteredIngredients"
            :key="ingredient.name"
            :class="{ selected: isSelected('ingredient', ingredient.name), muted: !isConnectedIngredient(ingredient) }"
            :title="labelContents(ingredient)"
          )
            .header
              label
                input(
                  type="checkbox"
                  :value="ingredient.name"
                  v-model="selected.ingredients")
                span.name {{ ingredient.name }}
              span.toggle-open(@click="toggleOpen(ingredient)")
                i.material-icons(v-if="isOpen(ingredient)") keyboard_arrow_up
                i.material-icons(v-else) keyboard_arrow_down

            .body(v-if="isOpen(ingredient)")
              label(
                v-for="effect in ingredient.effects"
                :key="effect"
              )
                input(
                  type="checkbox"
                  :value="effect"
                  v-model="selected.effects"
                )
                span.name {{ effect }}
</template>

<script>
  import Skyrim from '@/store/skyrim'

  export default {
    name: 'app',

    data () {
      return {
        filter: {
          ingredients: '',
          effects: ''
        },
        selected: {
          effects: [],
          ingredients: []
        },
        active: {
          effect: null,
          ingredient: null
        },
        additional: {
          effects: [],
          ingredients: []
        },
        open: [],
        Skyrim
      }
    },

    created () {
      //
    },

    computed: {
      filteredEffects () {
        const byQuery = Skyrim.searchEffects(this.filter.effects)
        const filteredIngredients = Skyrim
          .searchIngredients(this.filter.ingredients)
          .map(i => i.name)
        return byQuery.filter(e => {
          return e.ingredients.find(i => {
            return filteredIngredients.indexOf(i) > -1
          })
        }) // .filter(e => this.isConnectedEffect(e))
      },
      filteredIngredients () {
        const byQuery = Skyrim.searchIngredients(this.filter.ingredients)
        const filteredEffects = Skyrim
          .searchEffects(this.filter.effects)
          .map(e => e.name)
        return byQuery.filter(i => {
          return i.effects.find(e => {
            return filteredEffects.indexOf(e) > -1
          })
        }) // .filter(i => this.isConnectedIngredient(i))
      }
    },

    methods: {
      clearFilter (type) {
        this.filter[type] = ''
      },

      toggleOpen (item) {
        if (this.open.indexOf(item) > -1) {
          this.open.splice(this.open.indexOf(item), 1)
        } else {
          this.open.push(item)
        }
      },

      isOpen (item) {
        return this.open.indexOf(item) > -1
      },

      isSelected (type, item) {
        return this.selected[`${type}s`].indexOf(item) > -1
      },

      onSelect (type, item) {
        if (this.isSelected(type, item)) {
          console.log('selected')
        }
      },

      isActiveEffect (effect) {
        return this.active.effect === effect.name
      },

      isActiveIngredient (ingredient) {
        return this.active.ingredient === ingredient.name
      },

      toggleActive (type, item) {
        if (this.active[type] === item.name) {
          this.active[type] = null
        } else {
          this.active[type] = item.name
        }
        this.additional.effects = []
      },

      isConnectedIngredient (ingredient) {
        if (this.selected.ingredients.length > 0) {
          return this.selected.ingredients.find(name => {
            return Skyrim.hasEqualEffects(Skyrim.ingredients[name], ingredient)
          })
        }
        if (this.selected.effects.length > 0) {
          return this.selected.effects.find(name => {
            return ingredient.effects.indexOf(name) > -1
          })
        }
        return true
      },

      isConnectedEffect (effect) {
        if (this.selected.effects.length > 0) {
          return this.selected.effects.find(name => {
            return Skyrim.hasEqualIngredients(Skyrim.effects[name], effect)
          })
        }
        if (this.selected.ingredients.length > 0) {
          return this.selected.ingredients.find(name => {
            return effect.ingredients.indexOf(name) > -1
          })
        }
        return true
      },

      hasActiveEffect (ingredient) {
        if (this.active.effect) {
          return ingredient.effects.indexOf(this.active.effect) > -1
        }
        return false
      },

      hasActiveIngredient (effect) {
        if (this.active.ingredient) {
          return effect.ingredients.indexOf(this.active.ingredient) > -1
        }
        return false
      },

      isAdditionalIngredient (ingredient) {
        return Boolean(this.additional.effects.find(e => {
          return ingredient.effects.indexOf(e) > -1
        }))
      },

      isAdditionableIngredient (ingredient) {
        return this.isConnectedIngredient(ingredient) &&
          this.active.ingredient &&
          this.active.ingredient !== ingredient
      },

      isAdditionalEffect (effect) {
        return Boolean(this.additional.ingredients.find(i => {
          return effect.ingredients.indexOf(i) > -1
        }))
      },

      isAdditionableEffect (effect) {
        return this.isConnectedEffect(effect) &&
          this.active.effect &&
          this.active.effect !== effect
      },

      // isSelectedIngredient (ingredient) {
      //   return this.additional.ingredients
      //     .indexOf(ingredient.name) > -1
      // },

      // isSelectedEffect (effect) {
      //   return this.additional.effects
      //     .indexOf(effect.name) > -1
      // },

      labelContents (something) {
        return (something.effects || something.ingredients).join(', ')
      }
    }
  }

  window.skyrim = Skyrim
  // Skyrim.init()

  console.log(Skyrim)
</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css?family=Raleway:300,400,500,600,700|Zilla+Slab:300,400,500,600,700&subset=all');

  body
    font-family 'Zilla Slab'
    font-size 16px
    line-height 24px

  input
  textarea
  button
    font-family Raleway

  // .filter
  //   margin-bottom 1em
  //   display flex
  //   input
  //     border-radius 5px
  //     border solid gainsboro 1px
  //     height 24px
  //     box-sizing border-box
  //     padding 0 25px 0 5px
  //     outline none
  //     width 100%
  //   .clear
  //     margin-left -25px
  //     cursor pointer
  //     i
  //       display block

  .chips
    display flex
    flex-wrap wrap
    align-items flex-start
  .chip
    font-family 'Raleway'
    background-color whitesmoke
    text-decoration none
    cursor pointer
    border-radius 5px
    padding 2px 5px 2px 0px
    margin-bottom: 5px
    margin-right 5px
    font-weight 400
    font-size 14px
    line-height 20px
    color rgba(0,0,0,0.875)
    &.selected
      background-color alpha(skyblue, 62.5%)
    &.muted
      background-color white
      opacity 0.25
    .header
      display flex
      align-items center
      label
        padding-left 10px
        padding-right 10px
        & > *
          vertical-align middle
          cursor pointer
          margin 0px
        input
          opacity 0.5
      .name
        cursor pointer
        margin-left 5px
      .material-icons
        display block
        opacity 0.25
    .body
      & > *
        padding 1px 10px
        display block
        & > *
          vertical-align middle
      label
        cursor pointer
        input
          margin 0px
          cursor pointer
        .name
          margin-left 5px
          font-size 12px

    // &.reciped
    //   background-color alpha(skyblue, 62.5%)
    // &.muted
    //   opacity 0.25
    // &.additional
    //   background-color alpha(khaki, 62.5%)

    // &.additionable
    //   padding-right 24px
    //   position relative
    //   .additional
    //     position absolute
    //     right 0px
    //     top 1px
    //     cursor pointer
    //     input
    //       cursor pointer

    // .name
    //   display block
    // .contents
    //   input
    //     margin 0
    //     margin-right 5px
    //     height 15px
    //     cursor pointer
    //   label
    //     cursor pointer
    //     display block

</style>
