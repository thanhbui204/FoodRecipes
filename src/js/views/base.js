export const elements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchResultList: document.querySelector('.results__list'),
  addingSpinner: document.querySelector('.results'),
  addingButton: document.querySelector('.results__pages'),
  recipe: document.querySelector('.recipe'),
  shopping: document.querySelector('.shopping__list'),
  likesMenu: document.querySelector('.likes__field'),
  likesList: document.querySelector('.likes__list')
};

//Render Spinner when loading recipesPerPage
export const loadingSpinner = parent => {
  const adding = `
    <div class="loader">
      <svg >
        <use href ="img/icons.svg#icon-cw"></use>
      </svg>
    </div>
  `;
  parent.insertAdjacentHTML('afterbegin', adding);
};


//clearing spinner when loading is done
export const clearSpinner = () => {
  document.querySelector('.loader').remove();
};
