/*
Kita akan menambahkan satu properti baru yang akan menampung nama lokasi. Agar kode menjadi mudah dibaca dan dipelajari, bagaimana jika kita buatkan satu function baru untuk melakukan mapping data
*/
import Map from "../utils/map.js";

export async function storyMapper(story) {
  if (!story || story.lat == null || story.lon == null) {
    return {
      ...story,
      placeName: "-",
    };
  }
  return {
    ...story,
    placeName: await Map.getPlaceNameByCoordinate(story.lat, story.lon),
  };
}
