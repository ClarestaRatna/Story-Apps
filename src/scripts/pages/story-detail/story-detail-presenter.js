import { storyMapper } from "../../data/api-mapper.js";

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #apiModel;
  #dbModel;
  #authModel;

  constructor(storyId, { view, apiModel, dbModel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
    this.#authModel;
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showStoryDetailMap: error:", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#apiModel.getStoryById(this.#storyId);

      if (!response.ok) {
        console.error("showStoryDetail: response:", response);
        this.#view.populateStoryDetailError(response.message);
        return;
      }
      const story = await storyMapper(response.story);
      console.log(story); // for debugging purpose, remove afterchecking it
      this.#view.populateStoryDetailAndInitialMap(response.message, story);
    } catch (error) {
      console.error("showStoryDetailAndMap: error:", error);
      this.#view.populateStoryDetailError(error.message);
    } finally {
      this.#view.hideStoryDetailLoading();
    }
  }

  async saveStory() {
    try {
      const story = await this.#apiModel.getStoryById(this.#storyId);
      await this.#dbModel.putStory(story.story);

      this.#view.saveToBookmarkSuccessfully();
    } catch (error) {
      console.error("saveStory: error:", error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeStory() {
    try {
      await this.#dbModel.removeStory(this.#storyId);
      this.#view.unbookmarkSuccessfully();
    } catch (error) {
      console.error("removeReport: error:", error);
      this.#view.unbookmarkFailed(error.message);
    }
  }

  async showBookmarkButton() {
    if (await this.#isStoryBookmarked()) {
      this.#view.renderUnbookmarkButton();
      return;
    }

    this.#view.renderBookmarkButton();
  }

  async #isStoryBookmarked() {
    return !!(await this.#dbModel.getStoryById(this.#storyId));
  }
}
