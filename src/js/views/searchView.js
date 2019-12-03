import {elements} from './base.js';

export const getInput = () => {
return elements.searchInput.value
};

export const clearInput = () => {
  elements.searchInput.value = ('');
};

export const clearResultList = () => {
  elements.searchResultList.innerHTML = '';
  elements.addingButton.innerHTML ='';
};

export const highlightSelector = id =>{
  document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];
  if (title.length > limit) {
    title.split(" ").reduce((totalLength, current) => {
      totalLength = totalLength + current.length;
      if (totalLength <= 17) {
        newTitle.push(current);
      }
      return totalLength;
    }, 0);
    return newTitle.join(' ') + ' ...';
  }
  return title;
};

const renderRecipe = recipe => {
  const shortTitle = limitRecipeTitle(recipe.title);
  const markup = `
  <li>
      <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
              <img src="${recipe.image_url}" alt="Test">
          </figure>
          <div class="results__data">
              <h4 class="results__name">${shortTitle}</h4>
              <p class="results__author">${recipe.publisher}</p>
          </div>
      </a>
  </li>
  `;
  elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => {
  const buttonAdding = `
  <button class="btn-inline results__btn--${type}"  data-goto=${type === 'next' ? (page + 1) : (page - 1)}>
      <svg class="search__icon">
          <use href="img/icons.svg#icon-triangle-${type === 'next' ? 'right' : 'left'}"></use>
      </svg>
      <span>Page ${type === 'next' ? (page + 1) : (page - 1) }</span>
  </button>
  `;
  return buttonAdding;
};

// Create a button to move pages
const renderPage = (pages, numbResults, resPerPages) => {
  // Total of Pages based on how many results and how many results in one page
  const totalPages = Math.ceil(numbResults / resPerPages);

  // using let if we reassign new value for button (if -else if)
  let button;

  // If there is more than 1 pages and this is first page.
  if (pages === 1 && totalPages > 1) {
    button = createButton(pages, 'next');
  }
  //if there are more than 1 page and this is the last page
  else if (pages === totalPages && totalPages > 1) {
    button = createButton(pages, 'prev');
  }
  // pages that betwween first and last page. so there are 2 button for page up and page down
  else if (pages < totalPages) {
    button = `
    ${createButton(pages, 'next')}
    ${createButton(pages, 'prev')}
    `;
  }

  // insert html (button)
  elements.addingButton.insertAdjacentHTML('afterbegin', button);
};

// from index.js file. initial first page and each page has 10 recipes
export const renderResult = (recipes, page = 1, recipesPerPage = 10) => {

  /* .sclice does take only 10 recipes from start to end
   ex: page=1 it takes recipes from 0 to 9; page 2: (2-1)*10 = 10 to 19
   end = 10 but 10 doesnt include */

  const start = (page - 1) * recipesPerPage;
  const end = page * recipesPerPage;
  recipes.slice(start, end).forEach(current => renderRecipe(current))

  // call renderPage to display results html
  renderPage(page, recipes.length, recipesPerPage);
};
