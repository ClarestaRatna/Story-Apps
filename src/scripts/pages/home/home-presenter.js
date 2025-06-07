import { cardAnim } from "../packages/gsap-import.js";
import { routes } from "../../routes/routes.js";
export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showStoryListMap: error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      const response = await this.#model.getAllStories();

      if (!response.ok || !Array.isArray(response.listStory)) {
        console.error("Invalid response:", response);
        this.#view.populateCatalogsListError(
          "Data harian tidak valid atau kosong."
        );
        return;
      }
      this.#view.populateStoriesList(response.message, response.listStory);
    } catch (error) {
      console.error("initialGalleryAndMap: error:", error);
      this.#view.populateStoriesListError(error.message);
    } finally {
      cardAnim();
    }
  }
}
