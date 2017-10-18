import Db from '@/models/db'
import Ingredient from '@/models/ingredient'
import Effect from '@/models/effect'
import { ingredientsData } from './ingredients-data'
// import async from 'async'

const ingredients = {}
ingredientsData.sort((a, b) => a.name < b.name ? -1 : 1).forEach(ingredient => {
  ingredients[ingredient.name] = new Ingredient(ingredient)
})

const effects = {}
ingredientsData.forEach(ingredient => {
  ingredient.effects.forEach(effect => {
    if (!effects[effect]) {
      effects[effect] = new Effect({ name: effect })
    }
    effects[effect].ingredients.push(ingredient.name)
  })
})

function checkDuplicateInRecipe (c) {
  return c[0] !== c[1] && c[1] !== c[2] && c[0] !== c[2]
}

function checkDuplicateInOrder (c, a) {
  let check = true
  check = check && a.indexOf([c[0], c[1], c[2]].join(',')) < 0
  check = check && a.indexOf([c[0], c[2], c[1]].join(',')) < 0
  check = check && a.indexOf([c[1], c[0], c[2]].join(',')) < 0
  check = check && a.indexOf([c[1], c[2], c[0]].join(',')) < 0
  check = check && a.indexOf([c[2], c[0], c[1]].join(',')) < 0
  check = check && a.indexOf([c[2], c[1], c[0]].join(',')) < 0
  return true
}

const recipes = []
const combinations = []
Object.keys(ingredients).forEach(i1 => {
  Object.keys(ingredients).forEach(i2 => {
    Object.keys(ingredients).forEach(i3 => {
      const c = [i1, i2, i3]
      let check = true
      check = check && checkDuplicateInRecipe(c)
      check = check && checkDuplicateInOrder(c, combinations)
      if (check) {
        combinations.push(c.join(','))
        // const div = document.createElement('div')
        // div.innerHTML = c.join(',')
        // document.body.append(div)
        // console.log(c.join(','))
      }
    })
  })
})
console.log(combinations, combinations.length, Object.keys(ingredients).length)

// Create db
const Skyrim = new Db({
  ingredients,
  effects,
  recipes
})

export default Skyrim
