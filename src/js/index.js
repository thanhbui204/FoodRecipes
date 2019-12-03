import Search from './models/Search.js'; // import class
import Recipes from './models/Recipe.js'; // import class
import List from './models/List.js'; // import class
import Likes from './models/Likes.js'; // import class

import {elements, loadingSpinner, clearSpinner} from './views/base';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';


const state = {};
window.state = state;

const controlSearch = async () => {
  // 1) get query from view
  const query = searchView.getInput();

  if (query) {
    // 2) new search object and add to state
    state.search = new Search(query);
    // console.log(state);

    // 3) prepare UI for results__btn

    searchView.clearInput();
    searchView.clearResultList();
    loadingSpinner(elements.addingSpinner);
    // 4) Search for Recipes
    try {
      await state.search.getResults();

      clearSpinner();
      if (state.search.recipes.length == 0) {
        alert(`Can't find a recipes with " ${query} ". Please try again! `);
      };
      // 5) Render the result on UI
      //console.log(state.search.recipes);
      searchView.renderResult(state.search.recipes);
    } catch (error) {
      alert('Something went wrong!!');
    }
  }
};

elements.searchForm.addEventListener('submit', event => {
  event.preventDefault();
  controlSearch();
});

// eventListener for next and prev button pages
elements.addingButton.addEventListener('click', event => {
  // click anywhere in page button will target class .btn.inline
  const pageNumb = event.target.closest('.btn-inline');
  // HTML dataset API : get data of data-goto for page number
  const page = parseInt(pageNumb.dataset.goto,10);
  //console.log(typeof(page));
  // change page based on page number
  searchView.clearResultList();

  searchView.renderResult(state.search.recipes, page);
  // searchView.clearResultList();
});


/*********************************************************
 *** RECIPE CONTROLLER
 **********************************************************/
const recipeController = async () => {
  // location.hash does return value of url after ' # '
  // .replace does replace '#' with black. meaning: delete #
  const id = location.hash.replace("#", "");
  //console.log(id);
  if (id) {

    // add a property which is recipe to State object;
    state.recipe = new Recipes(id);
    //console.log(state.recipe);

    if(state.search){

    // create a array of all results_link, for each, we remove class (result__link--active)
    const arrayOfclasses = Array.from(document.querySelectorAll('.results__link'));
    arrayOfclasses.forEach(el => {el.classList.remove('results__link--active')}) ;
    // call a function in searchView to add class to highlight id when we click
    searchView.highlightSelector(id);
    }

    recipeView.clearRecipe(elements.recipe);
    loadingSpinner(elements.recipe);

    try {
      // call getRecipe and await this function: need to wait for this function finished
      await state.recipe.getRecipe();

      clearSpinner();

      state.recipe.calcTime();
      state.recipe.calcServings();
      state.recipe.ingredientChange();
      //console.log(state.recipe);

      recipeView.renderRecipe(state.recipe);

    } catch (error) {
      alert('error processing recipe!!');
    }
  }
};

/*********************************************************
 *** LIST CONTROLLER
 **********************************************************/
const controlList = () => {
  //Create a new list if there is none yet
  if (!state.list) state.list = new List();

  // add each ingredient to the List and UI
  state.recipe.ingredients.forEach(el => {
      const item = state.list.addItem(el.count, el.unit, el.ingredients);
      listView.renderItem(item);
  });
}

// Handling delete and update list item event
elements.shopping.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle delete button
  // e.target.matches (return true oor false)
  if (e.target.matches('.shopping__delete, .shopping__delete *')){
    // delete from State
    state.list.deleteItem(id);
    // delete from UI
    listView.deleteItem(id);

  // Handle the count update in state.list
  } else if (e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    state.list.updateCount(id, val);
  }
});

/*********************************************************
 *** LIKE CONTROLLER
 **********************************************************/
const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)){
    // Add like to the State
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    // Toggle the like button
    likeView.toggleLikeBtn(true);
    // Add like to UI list
    likeView.renderLike(newLike);
    //console.log(state.likes);

  } else {
    // remove like to the State
    state.likes.deleteLike(currentID);
    // Toggle the like button
    likeView.toggleLikeBtn(true);
    // remove like to UI list
    likeView.deleteLike(currentID);
    //console.log(state.likes);
  }

  likeView.toggleLikeMenu(state.likes.getNumLikes());
  // User has liked current recipe


};
/********************************************************/
// restore liked recipes on page loader
window.addEventListener('load', () => {
  state.likes = new Likes();

  // restore likes
  state.likes.loadLocalStorage();

  // Toggle like menu button
  likeView.toggleLikeMenu(state.likes.getNumLikes());

  //Render existing likes
  state.likes.likes.forEach(like => likeView.renderLike(like))
});


// window.addEventListener('hashchange', recipeController);
// Load eventListener is used when we want reload the page but still run the function
// window.addEventListener('load',recipeController);

['hashchange', 'load'].forEach(current => {
  window.addEventListener(current, recipeController)
});

// handling recipe button click
elements.recipe.addEventListener('click', event => {
  if(event.target.matches('.btn-decrease, .btn-decrease *')){
    state.recipe.updateServing('dec');
    recipeView.updateServingIngredient(state.recipe);
  }
  else if(event.target.matches('.btn-increase, .btn-increase *')){
    state.recipe.updateServing('inc');
    recipeView.updateServingIngredient(state.recipe);
  }
  else if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    controlList();
  }
  else if(event.target.matches('.recipe__love, .recipe__love *')){
    controlLike();
  }
  //console.log(state.recipe);
});
