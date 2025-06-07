import { storyMapper } from "../../data/api-mapper";

export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showStoriesList() {
    const storiesListSection = document.getElementById("stories-list__section");

    this.#view.showStoriesListLoading();
    try {
      const response = await this.#model.getAllStories();

      if (response.error) {
        console.error("getStories: response:", response);
        return;
      }

      const stories = await Promise.all(
        response.map((story) =>
          story.lat != null || story.lon != null
            ? storyMapper(story)
            : Promise.resolve(story)
        )
      );

      this.#view.populateBookmarkedStories(stories, storiesListSection);
    } catch (error) {
      console.error("showStoriesListError: error:", error);
      this.#view.populateBookmarkedStoriesError(
        error.message,
        storiesListSection
      );
    } finally {
      this.#view.hideStoriesListLoading();
    }
  }
}
