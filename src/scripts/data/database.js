import { openDB } from "idb";

const DATABASE_NAME = "mymodi";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "saved-stories";

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade: (database) => {
    database.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: "id",
    });
  },
});

const Database = {
  async getStory(storyId) {
    if (!storyId) {
      return;
    }

    return (await dbPromise).get(OBJECT_STORE_NAME, storyId);
  },

  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  async putStory(story) {
    if (!Object.hasOwn(story, "id")) {
      throw new Error("id is required to save");
    }

    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  async removeStory(storyId) {
    return (await dbPromise).delete(OBJECT_STORE_NAME, storyId);
  },

  async getStoryById(id) {
    if (!id) {
      throw new Error("`id is required.");
    }

    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
};

export default Database;
