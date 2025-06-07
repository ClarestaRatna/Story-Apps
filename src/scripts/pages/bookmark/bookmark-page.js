import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from "../../templates";
import BookmarkPresenter from "./bookmark-presenter";
import Database from "../../data/database";
import { lineAnim, textAnim } from "../packages/gsap-import.js";

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section class="container mt-5" id="bookmark-section">
        <div class="section-title overflow-hidden">
          <h1 class="text-uppercase fw-bold pt-5 mb-5 text-center position-relative text-break">Daftar Bookmark</h1>
        </div>

        <div class="line line-animation bg-secondary-subtle mb-5"></div>

        <div class="stories-list__container">
          <div id="stories-list__section"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });

    await this.#presenter.showStoriesList();

    // Simpan halaman sebelumnya
    sessionStorage.setItem("previousPage", "#/bookmark");

    lineAnim(".line-animation", ".line-animation");
    textAnim(".section-title > h1");
  }

  populateBookmarkedStories(stories, container) {
    if (stories.length <= 0) {
      this.populateBookmarkedStoriesListEmpty(container);
      return;
    }

    const html = stories.map(generateStoryItemTemplate).join("");

    document.getElementById("stories-list__section").innerHTML = `
      <div class="stories-list">${html}</div>
    `;
  }

  populateBookmarkedStoriesListEmpty(container) {
    container.innerHTML = generateStoriesListEmptyTemplate(
      "Ayo, tambah cerita favorit ke bookmark",
      "bookmark"
    );
  }

  populateBookmarkedStoriesError(message, container) {
    console.error(message);
    container.innerHTML = generateStoriesListErrorTemplate(message, "bookmark");
  }

  showStoriesListLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoriesListLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}
