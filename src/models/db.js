export default class Db {
  constructor ({ ingredients = {}, effects = {} } = {}) {
    this.ingredients = ingredients
    this.effects = effects
  }

  searchIngredients (query) {
    return Object.keys(this.ingredients)
      .filter(name => {
        return name.toLowerCase().match(query.toLowerCase())
      })
      .map(name => this.ingredients[name])
      .sort((a, b) => a.name < b.name ? -1 : 1)
  }

  searchEffects (query) {
    return Object.keys(this.effects)
      .filter(name => {
        return name.toLowerCase().match(query.toLowerCase())
      })
      .map(name => this.effects[name])
      .sort((a, b) => a.name < b.name ? -1 : 1)
  }

  hasEqualEffects (i1, i2) {
    return i1.effects.find(e => {
      return i2.effects.indexOf(e) > -1
    })
  }

  hasEqualIngredients (e1, e2) {
    return e1.ingredients.find(i => {
      return e2.ingredients.indexOf(i) > -1
    })
  }

  createRecipes () {
    // create all recipes
  }
}
