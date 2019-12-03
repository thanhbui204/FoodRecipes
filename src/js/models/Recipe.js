import {key} from '../config.js';
import axios from 'axios';

export default class Recipes {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
      console.log(res);
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(error);
      alert('Something went wrong !! :(')
    }
  }

  calcTime() {
    //Assuming that we need 15 mins for each 3 recipe__ingredients
    const numIng = this.ingredients.length;
    // console.log(numIng);
    const periods = Math.ceil(numIng / 3);
    this.time = `${periods * 15} mins`;
  }

  calcServings() {
    this.serving = 4;
  }

  ingredientChange() {
    const oldString = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const newString = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup','pound'];
    const unitArr = [...newString, 'g', 'kg'];
    //going to each ingredients of array ingredients
    const newIngredients = this.ingredients.map(curr => {
      // change to to all lowercase
      let ingredients = curr.toLowerCase();
      //change oldString to newString in each ingredient
      oldString.forEach((el, i) => {
        ingredients = ingredients.replace(el, unitArr[i]);
      });
      // remove string in parenthesis ex: (thanh) will be removed
      ingredients = ingredients.replace(/ *\([^)]*\) */g, " ");

      // create an array for ingredients, each ingredient is an element
      const arrayIng = ingredients.split(' ');
      const index = arrayIng.findIndex(element => unitArr.includes(element));
      // console.log(index);

      let ingObj;
      if (index > -1){
        //there is an unit
        // Check if where is index of number ex: 2 cup ... or 2 1/2 cup...
        const numPosition = arrayIng.slice(0, index);

        let count;
        // if there is only 1 number . ex: 2 cup...
          if(numPosition.length === 1 && numPosition[0] ===''){
            count = 1;
          }
          else if (numPosition.length === 1) {
            count = eval(arrayIng[0].replace('-','+'));
          }
          else {
            count =  eval(arrayIng.slice(0,index).join('+'));
          }
          ingObj ={
            count: count ,
            unit:arrayIng[index],
            ingredients: arrayIng.slice(index +1).join(' ')
          };
      }
      else if (parseInt(arrayIng[0],10)) {
        // no unit but there is number
         ingObj ={
           count : parseInt(arrayIng[0], 10),
           unit : ' ',
           ingredients : arrayIng.slice(1).join(' ')
         }
      }
      else if (index === -1) {
        //there is no unit.
        ingObj = {
          count : 1,
          unit: ' ',
          ingredients : arrayIng.slice(0).join(' ')
        }
      }
      //return new ingredient after many chnanges
      return ingObj;
    });
    // redefine ingredient: because this is class and ingredient is one property in class.
    this.ingredients = newIngredients;
  }

  updateServing(type){
    const newServing = type === 'dec' ? this.serving -1 : this.serving +1 ;

    this.ingredients.forEach(ing => {
      ing.count =  ing.count * (newServing / this.serving);
    });

    this.serving = newServing;
  }
};
