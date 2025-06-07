import { showFormattedDate } from "./utils";

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="story-list-button" class="story-list-button" href="#/">Daftar Laporan</a></li>
    <li><a id="bookmark-button" class="bookmark-button" href="#/bookmark">Bookmark</a></li>
    <li><a id="about-button" class="bookmark-button" href="#/about">Tentang Kami</a></li>
  `;
}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateSubscribeButtonTemplate() {
  return `
    <li><a id="subscribe-button" class="btn" href="#/">Subscribe<i class="fas fa-bell"></i></a></li>
  `;
}
export function generateUnsubscribeButtonTemplate() {
  return `
    <li><a id="unsubscribe-button" class="btn" href="#/">Unsubscribe<i class="fas fa-bell-slash"></i></a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="new-story-button" class="btn new-story-button" href="#/stories">Membagikan Cerita Baru<i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateStoriesListEmptyTemplate(title, text) {
  return `
    <div class="stories-list__empty d-flex flex-column align-items-center gap-3" id="stories-list-empty">
      <img width="100" height="100" src="https://img.icons8.com/parakeet/100/nothing-found.png" alt="nothing-found"/>
      <div>
        <h2 class="text-center lh-base">${title}</h2>
        <p class="text-center">Saat ini, belum ada daftar ${text} yang dapat ditampilkan.</p>
      </div>
    </div>
  `;
}

export function generateStoriesListErrorTemplate(message, text) {
  console.error(message);
  return `
    <div class="stories-list__error d-flex flex-column align-items-center gap-3" id="stories-list-error">
      <img width="100" height="100" src="https://img.icons8.com/color/100/error--v1.png" alt="error--v1"/>
      <div>
        <h2 class="text-center lh-base">Terjadi kesalahan pengambilan daftar ${text}.</h2>
        <p class="text-center">Mohon refresh kembali halaman, atau laporkan error ini.</p>
      </div>
    </div>
  `;
}

export function generateStoriesDetailErrorTemplate(message) {
  console.error(message);
  return `
    <div class="container mt-5 stories-detail__error d-flex flex-column align-items-center gap-3" id="stories-detail-error">
      <img width="100" height="100" src="https://img.icons8.com/color/100/error--v1.png" alt="error--v1"/>
      <div>
        <h2 class="text-center lh-base">Terjadi kesalahan pengambilan detail inputan.</h2>
        <p class="text-center">Gunakan jaringan lain, atau laporkan error ini.</p>
      </div>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
}) {
  const location = lat && lon ? { lat, lon } : null;

  return `
    <div tabindex="0" class="story-item col-sm-12 col-md-6 col-lg-4" data-storyid="${id}">
      <div class="card rounded-3 overflow-hidden h-100 cards card-animation position-relative">
        <div class="story-item__image-container overflow-hidden d-flex align-items-center justify-content-center border-bottom border-1">
          <img class="story-item__image" src="${photoUrl}" alt="">
        </div>
        <div class="story-item__body card-body d-flex flex-column gap-3 justify-content-between">
          <div class="story-item__main">
            <div class="story-item__more-info">
              <div class="story-item__createdat">
                <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt, "id-ID")}
              </div>
              <div class="story-item__location">
                <i class="fas fa-map"></i> ${location ? `Lat: ${location.lat}, Lon: ${location.lon}` : "Tidak tersedia"}
              </div>
            </div>
          </div>
          <div id="story-description" class="story-item__description">
            ${description}
          </div>
          <div class="story-item__more-info">
            <div class="story-item__author">
              Dibagikan oleh: ${name}
            </div>
          </div>
          <a class="btn story-item__read-more btn-with-arrow" href="#/stories/${id}">
            Selengkapnya
            <span class="material-symbols-rounded">
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </div>
  `;
}

export function generateBookmarkButtonTemplate() {
  return `
    <a class="story-detail__button btn btn-outline ps-3" type="button" id="bookmark-story-button">
      <span class="material-symbols-rounded text-primary filled icon">
        bookmark
      </span>
      Simpan Cerita
    </a>
  `;
}

export function generateUnbookmarkButtonTemplate() {
  return `
    <a class="story-detail__button btn btn-outline" type="button" id="unbookmark-story-button">
      <span class="material-symbols-rounded filled">
        delete
      </span>
      Hapus Cerita dari Bookmark
    </a>
  `;
}

export function generateStoryDetailImageTemplate(imageUrl = null, alt = "") {
  if (!imageUrl) {
    return `
      <img class="story-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="story-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}

export function generateStoryDetailTemplate({
  id,
  createdBy,
  description,
  evidenceImages,
  latitudeLocation,
  longitudeLocation,
  createdAt,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, "id-ID");
  return `
    <div class="story-detail__header container mt-4" style="max-width: 1080px">
      <div class="story-detail__more-info">
        <div class="story-detail_more-info_inline">
          <div id="createdat" class="story-detail__createdat"><i class="fas fa-calendar-alt"></i> ${createdAtFormatted || "-"}</div>
        </div>
        <div class="story-detail_more-info_inline">
          <div id="location-latitude" class="story-detail_location_latitude"><i class="fas fa-map"></i> Lat: ${latitudeLocation ?? "-"}, Lon: ${longitudeLocation ?? "-"}</div>
        </div>
        <div id="author" class="story-detail__author">Dibagikan oleh: ${createdBy || "-"}</div>
      </div>
    </div>

    <div class="container mt-4" style="max-width: 1080px">
      <div class="story-detail_images_container">
        <div id="images" class="story-detail__images">
          <img class="report-detail__image" src="${evidenceImages}">
        </div>
      </div>
    </div>

    <div class="container" style="max-width: 1080px">
      <div class="story-detail__body">
        <div class="story-detail_bodydescription_container d-flex flex-column gap-2 mt-4">
          <h2 class="story-detail_description_title">Informasi Lengkap</h2>
          <div id="description" class="story-detail_description_body">
            ${description}
          </div>
        </div>
        <div class="story-detail_bodymap_container mt-5">
          <h2 class="story-detail_map_title">Lokasi Anda:</h2>
          <div class="story-detail_map_container mt-4">
            <div id="map" class="story-detail__map"></div>
            <div id="story-loading-container"></div>
          </div>
        </div>

        <div class="story-item__button-container mt-5 d-flex gap-3">
          <a class="btn story-item__back" href="">
            Kembali
          </a>
          <div class="story-item__bookmark-container">
          </div>
        </div>
        
      </div>
    </div>
  `;
}
