import {
  generateLoaderAbsoluteTemplate,
  generateStoryDetailTemplate,
  generateStoriesDetailErrorTemplate,
  generateBookmarkButtonTemplate,
  generateUnbookmarkButtonTemplate,
} from "../../templates.js";
import { createCarousel } from "../../utils/index.js";
import StoryDetailPresenter from "./story-detail-presenter.js";
import { parseActivePathname } from "../../routes/url-parser.js";
import * as MoDiAPI from "../../data/api.js";
import Map from "../../utils/map.js";
import Database from "../../data/database";
import {
  successBookmarkMessage,
  failureBookmarkMessage,
  successUnbookmarkMessage,
  failureUnbookmarkMessage,
} from "../../utils/notification-helper.js";

export default class StoryDetailPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
    <section>
      <div class="story-detail__container">
        <div id="story-detail" class="story-detail"></div>
        <div id="story-detail-loading-container"></div>
        <div id="map-loading-container"></div>
      </div>
    </section>
  `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      apiModel: MoDiAPI,
      dbModel: Database,
    });

    await this.#presenter.showStoryDetail();
  }

  async populateStoryDetailAndInitialMap(message, story) {
    document.getElementById("story-detail").innerHTML =
      generateStoryDetailTemplate({
        description: story.description,
        evidenceImages: story.photoUrl,
        latitudeLocation: story.lat,
        longitudeLocation: story.lon,
        createdBy: story.name,
        createdAt: story.createdAt,
      });

    // Carousel images
    createCarousel(document.getElementById("images"));

    // Map
    await this.#presenter.showStoryDetailMap();
    if (this.#map && story.lat !== null && story.lon !== null) {
      const storyCoordinate = [story.lat, story.lon];
      const markerOptions = { alt: story.name };
      const popupOptions = { content: story.name };
      this.#map.changeCamera(storyCoordinate);
      this.#map.addMarker(storyCoordinate, markerOptions, popupOptions);
    }

    // Update "Back" button behavior
    const backButton = document.querySelector(".story-item__back");
    if (backButton) {
      // Periksa apakah user berasal dari halaman Bookmark
      const previousPage = sessionStorage.getItem("previousPage");
      backButton.setAttribute(
        "href",
        previousPage === "#/bookmark" ? "#/bookmark" : "#/"
      );
    }

    // Button
    this.#presenter.showBookmarkButton();
  }

  populateStoryDetailError(message) {
    document.getElementById("story-detail").innerHTML =
      generateStoriesDetailErrorTemplate(message);
  }

  async initialMap() {
    // TODO: map initialization
    this.#map = await Map.build("#map", {
      zoom: 15,
    });
  }

  showStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML = "";
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  renderSubmitButton() {
    document.getElementById("new-form").addEventListener("click", async () => {
      await this.#presenter.saveStory();
    });
  }

  renderBookmarkButton() {
    const bookmarkButton = document.getElementById("bookmark-story-button");

    // this.emptyBookmarkSection();

    document.querySelector(".story-item__bookmark-container").innerHTML =
      generateBookmarkButtonTemplate();

    console.log(bookmarkButton);

    document
      .getElementById("bookmark-story-button")
      .addEventListener("click", async () => {
        await this.#presenter.saveStory();
        await this.#presenter.showBookmarkButton();
      });
  }

  saveToBookmarkSuccessfully() {
    successBookmarkMessage();
  }

  saveToBookmarkFailed(message) {
    failureBookmarkMessage();
    console.error(message);
  }

  emptyBookmarkSection() {
    document.querySelector(".story-item__back").nextSibling.innerHTML = "";
  }

  renderUnbookmarkButton() {
    const unbookmarkButton = document.getElementById("unbookmark-story-button");

    // this.emptyBookmarkSection();

    document.querySelector(".story-item__bookmark-container").innerHTML =
      generateUnbookmarkButtonTemplate();

    document
      .getElementById("unbookmark-story-button")
      .addEventListener("click", async () => {
        await this.#presenter.removeStory();
        await this.#presenter.showBookmarkButton();
      });
  }

  unbookmarkSuccessfully() {
    successUnbookmarkMessage();
  }

  unbookmarkFailed(message) {
    failureUnbookmarkMessage();
    console.error(message);
  }
}
