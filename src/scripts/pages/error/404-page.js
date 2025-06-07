export default class NotFoundPage {
  async render() {
    return `
      <div class="container d-flex flex-column align-items-center justify-content-center" style="max-width: 25rem;">
        <img width="300" height="300" src="./images/404-error-page-found.png" alt="404 Page"></img>
        <h1 class="text-center">Oops! Halaman tidak ditemukan.</h1>
        <p class="text-center">Kami tidak dapat menemukan halaman yang Anda cari. Halaman mungkin telah dipindahkan atau tidak tersedia lagi.</p>
        <a class="btn w-100 btn-with-arrow" type="button" href="/">
          Kembali ke Home
          <span class="material-symbols-rounded">
            arrow_forward
          </span>
        </a>
      </div>
    `;
  }

  async afterRender() {
    document.querySelector(".header-content").hidden = true;
    document.querySelector("footer").hidden = true;
    return;
  }
}
