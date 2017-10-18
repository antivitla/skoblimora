export default class Ingredient {
  constructor ({ name = '', image = '', effects = [] } = {}) {
    this.name = name
    this.image = image
    this.effects = effects
  }
}
