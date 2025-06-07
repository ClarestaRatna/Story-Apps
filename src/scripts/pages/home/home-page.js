import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
} from "../../templates.js";
import HomePresenter from "./home-presenter.js";
import * as MoDiAPI from "../../data/api";
import Map from "../../utils/map";
import { lineAnim, textAnim } from "../packages/gsap-import.js";

import { getStoryById } from "../../data/api";
import { getActiveRoute } from "../../routes/url-parser.js";
import { getAccessToken } from "../../utils/auth.js";

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container mt-5">
        <div class="section-title overflow-hidden">
          <h1 class="text-uppercase fw-bold pt-5 mb-5 text-center position-relative text-break">Daftar Harian</h1>
        </div>

        <div class="line line-animation bg-secondary-subtle mb-5"></div>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: MoDiAPI,
    });

    // Simpan halaman sebelumnya
    sessionStorage.setItem("previousPage", "#/");

    lineAnim(".line-animation", ".line-animation");
    textAnim(".section-title > h1");

    await this.#presenter.initialGalleryAndMap();
  }

  async loadStoryPage(storyId) {
    try {
      // Ambil data cerita berdasarkan storyId
      const story = await MoDiAPI.getStoryById(storyId);

      // Pastikan data tersedia
      if (!story) {
        console.error("Cerita tidak ditemukan");
        return;
      }

      // Render template detail cerita
      document.getElementById("app").innerHTML = generateStoryDetailTemplate({
        createdBy: story.name,
        description: story.description,
        evidenceImages: story.photoUrl,
        latitudeLocation: story.lat,
        longitudeLocation: story.lon,
        createdAt: story.createdAt,
      });

      // Tambahkan inisialisasi peta (jika diperlukan)
      initializeMap({
        latitude: story.lat,
        longitude: story.lon,
      });
    } catch (error) {
      console.error("Gagal memuat halaman detail cerita:", error);
    }
  }

  navigateTo(url) {
    // Logika untuk merender halaman berdasarkan URL
    const isLogin = !!getAccessToken();
    const route = url.replace("#/", "");
    if (route.startsWith("stories")) {
      const storyId = route.split("/")[1];
      loadStoryPage(storyId); // Fungsi ini harus menampilkan halaman detail
    } else {
      // kalau mau handle halaman lain:
      if (route === "") {
        location.hash = "/";
      } else {
        location.hash = "/404";
      }
    }
  }

  populateStoriesList(message, stories) {
    if (stories.length <= 0) {
      this.populateStoriesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      const coordinate =
        story.lat != null && story.lon != null
          ? { lat: story.lat, lon: story.lon }
          : null;

      // untuk menampilkan ikon dan marker baru pada halaman daftar
      if (this.#map && story.lat != null && story.lon != null) {
        const coordinate = [story.lat, story.lon];
        const markerOptions = { alt: story.name };
        const popupOptions = { content: story.description };
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      return accumulator.concat(
        generateStoryItemTemplate({
          ...story,
          createdBy: story.name,
        })
      );
    }, "");

    const container = document.getElementById("stories-list");
    container.innerHTML = `
      <div class="stories-list row row-gap-4">${html}</div>
    `;

    // Tambahkan event listener untuk animasi transisi
    document.querySelectorAll(".story-item__read-more").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault(); // Mencegah navigasi langsung

        // Animasi keluar untuk daftar cerita
        container.animate(
          [
            { opacity: 1, transform: "translateY(0)" },
            { opacity: 0, transform: "translateY(-50px)" },
          ],
          { duration: 500, easing: "ease-in-out" }
        ).onfinish = () => {
          // Navigasi ke halaman detail setelah animasi selesai
          if (typeof navigateTo === "function") {
            navigateTo(button.getAttribute("href"));
          } else {
            // Fallback ke navigasi default
            window.location.href = button.href;
          }
        };
      });
    });
  }

  populateStoriesListEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate("Tidak ada data", "harian");
  }

  populateStoriesListError(message) {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListErrorTemplate(message, "harian");
  }

  // inisialisasi peta
  async initialMap() {
    // TODO: map initialization
    try {
      this.#map = await Map.build("#map", {
        zoom: 10,
        locate: true, // peta akan menampilkan titik lokasi dari user
      });
    } catch (error) {
      console.error("initialMap: error:", error);
      this.#map = await Map.build("#map", {
        zoom: 10,
        locate: false,
      });
    }
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}
