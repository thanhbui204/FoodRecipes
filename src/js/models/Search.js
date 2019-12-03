import axios from 'axios';
import {key} from '../config.js';

// c2ce83bde8740114ab0d7c9d433efe43
// https://www.food2fork.com/api/search
// https://cors-anywhere.herokuapp.com/

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    // const proxy = "https://cors-anywhere.herokuapp.com/";
    // const key = 'c2ce83bde8740114ab0d7c9d433efe43';
    try {
      const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.recipes = res.data.recipes;
      // this.recipes = res.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
};
