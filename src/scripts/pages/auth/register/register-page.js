import RegisterPresenter from "./register-presenter.js";
import * as MoDiAPI from "../../../data/api";

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="register-container mt-5">
        <div class="register-form-container border bg-light rounded-2 shadow-sm">
          <h1 class="register__title  mb-3 fw-bold text-uppercase text-center">Register</h1>
          <h6 class="register__subtitle text-center pb-4 border-bottom border-2">Daftar akun Anda</h6>

          <form id="register-form" class="register-form border-0">
            <div class="form-control bg-transparent">
              <label for="name-input" class="register-form__name-title">Nama lengkap</label>

              <div class="register-form__title-container">
                <input id="name-input" type="text" name="name" placeholder="Masukkan nama lengkap Anda">
              </div>
            </div>
            <div class="form-control bg-transparent">
              <label for="email-input" class="register-form__email-title">Email</label>

              <div class="register-form__title-container">
                <input id="email-input" type="email" name="email" placeholder="Contoh: admin@email.com">
              </div>
            </div>
            <div class="form-control bg-transparent">
              <label for="password-input" class="register-form__password-title">Password</label>

              <div class="register-form__title-container">
                <input id="password-input" type="password" name="password" placeholder="Masukkan password baru">
              </div>
            </div>
            <div class="form-buttons register-form__form-buttons d-flex flex-column gap-3 justify-content-between">
              <div id="submit-button-container" class="w-100">
                <button class="btn w-100 btn-with-arrow" type="submit">
                  Daftar akun
                  <span class="material-symbols-rounded">
                    arrow_forward
                  </span>
                </button>
              </div>
              <p class="register-form__already-have-account">Anda sudah punya akun? <a href="#/login">Masuk</a></p>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: MoDiAPI,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("register-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          name: document.getElementById("name-input").value,
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.getRegistered(data);
      });
  }

  registeredSuccessfully(message) {
    const name = document.getElementById("name-input").value;

    // Simpan ke localStorage
    localStorage.setItem("user_name", name);

    // Redirect
    location.hash = "/login";
  }

  registeredFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn w-100 btn-with-arrow" type="submit">
        <i class="fas fa-spinner loader-button"></i> Daftar akun
        <span class="material-symbols-rounded">
          arrow_forward
        </span>
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn w-100 btn-with-arrow" type="submit">
        <span class="material-symbols-rounded">
          arrow_forward
        </span>
      </button>
    `;
  }
}
