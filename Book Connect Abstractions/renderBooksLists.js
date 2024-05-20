import { books, authors, BOOKS_PER_PAGE } from "./data.js";
import { elementsFromDOM } from "./elements.js";


class BookPreview extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });
        const author = this.getAttribute('author');
        const id = this.getAttribute('id');
        const image = this.getAttribute('image');
        const title = this.getAttribute('title');
        
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                .preview {
                    border-width: 0;
                    width: 100%;
                    font-family: Roboto, sans-serif;
                    padding: 0.5rem 1rem;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    text-align: left;
                    border-radius: 8px;
                    border: 1px solid rgba(var(--color-dark), 0.15);
                    background: rgba(var(--color-light), 1);
                }

                @media (min-width: 60rem) {
                    .preview {
                        padding: 1rem;
                    }
                }

                .preview_hidden {
                    display: none;
                }

                .preview:hover {
                    background: rgba(var(--color-blue), 0.05);
                }

                .preview__image {
                    width: 48px;
                    height: 70px;
                    object-fit: cover;
                    background: grey;
                    border-radius: 2px;
                    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
                                0px 1px 1px 0px rgba(0, 0, 0, 0.1), 
                                0px 1px 3px 0px rgba(0, 0, 0, 0.1);
                }

                .preview__info {
                    padding: 1rem;
                }

                .preview__title {
                    margin: 0 0 0.5rem;
                    font-weight: bold;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;  
                    overflow: hidden;
                    color: rgba(var(--color-dark), 0.8);
                }

                .preview__author {
                    color: rgba(var(--color-dark), 0.4);
                }
            </style>
            <button class="preview" data-preview="${id}">
                <img class="preview__image" src="${image}" alt="${title}" />
                <div class="preview__info">
                    <h3 class="preview__title">${title}</h3>
                    <div class="preview__author">${authors[author]}</div>
                </div>
            </button>
        `;
        
        shadow.append(template.content.cloneNode(true))
    }

    connectedCallback() {
        const shadow = this.shadowRoot;
        shadow.querySelector('.preview__image').src = this.getAttribute('image');
        shadow.querySelector('.preview__title').innerText = this.getAttribute('title');
        shadow.querySelector('.preview__author').innerText = this.getAttribute('author');
        shadow.querySelector('.preview').setAttribute('data-preview', this.getAttribute('id'));
    }
}

customElements.define('book-preview', BookPreview)

/** Creates a preview button element for a book.
 *
 * @param {Object} books - The books object containing the author, id, image, and title properties.
 * @param {string} books.author - Author of the book.
 * @param {string} books.id - Unique iID for the author.
 * @param {string} books.image -The URL of the image to the book.
 * @param {string} books.title - The title of the book.
 * @returns {HTMLButtonElement} returns the button element
*/
export function createPreviewButton({ author, id, image, title }) {
    const element = document.createElement('book-preview');
    element.setAttribute('image',image);
    element.setAttribute('title', title);
    element.setAttribute('author',authors[author]);
    element.setAttribute('id', id);
    return element;
}

/** Render books on the page with book image, title and author name.
 *
 * @returns {void} This function does not return a value.
*/
export function renderBooks() {
    const starting = document.createDocumentFragment();
  
    for (const { id, image, title, author } of books.slice(0, BOOKS_PER_PAGE)) {
      const element = createPreviewButton({ id, image, title, author });
      starting.appendChild(element);
    }
  
    elementsFromDOM.dataListItems.appendChild(starting);
}

/**
 * Returns the active book object based on the event target.
 *
 * @param {Event} event - The event object.
 * @returns {Object|null} The active book object or null if no active book is found.
*/
export function getActiveBook(event) {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
        if (active) break;

        if (node?.dataset?.preview) {
            let result = null;

            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook;
            } 

            active = result;
        }
    }

    return active;
}

/** Updates the data list with the details of the active book.
 *
 * @param {object} active - The active book object.
 * @returns {void} This function does not return a value.
*/
export function updateDataList(active) {
    elementsFromDOM.dataListActive.open = true;
    elementsFromDOM.dataListBlur.src = active.image;
    elementsFromDOM.dataListImage.src = active.image;
    elementsFromDOM.dataListTitle.innerText = active.title;
    elementsFromDOM.dataListSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
    elementsFromDOM.dataListDescricption.innerText = active.description;
}