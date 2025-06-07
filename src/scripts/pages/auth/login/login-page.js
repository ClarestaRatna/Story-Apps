import LoginPresenter from "./login-presenter.js";
import * as MoDiAPI from "../../../data/api.js";
import * as AuthModel from "../../../utils/auth.js";

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
      <section class="login-container mt-5">
        <article class="login-form-container border bg-light rounded-2 shadow-sm">
          <h1 class="login__title mb-3 fw-bold text-uppercase text-center">Login</h1>
          <h6 class="login__subtitle text-center pb-4 border-bottom border-2">Masukkan akun Anda</h6>
          <form id="login-form" class="login-form border-0">
            <div class="form-control bg-transparent">
              <label for="email-input" class="login-form__email-title">Masukkan Email Anda</label>

              <div class="login-form__title-container">
                <input id="email-input" type="email" name="email" placeholder="Contoh: admin@gmail.com">
              </div>
            </div>
            <div class="form-control bg-transparent">
              <label for="password-input" class="login-form__password-title">Password</label>

              <div class="login-form__title-container">
                <input id="password-input" type="password" name="password" placeholder="Masukkan password Anda">
              </div>
            </div>
            <div class="form-buttons login-form__form-buttons d-flex flex-column gap-3 justify-content-between">
              <div id="submit-button-container" class="w-100">
                <button class="btn w-100 btn-with-arrow" type="submit">
                  Masuk
                  <span class="material-symbols-rounded">
                    arrow_forward
                  </span>
                </button>
              </div>
              <p class="login-form__do-not-have-account my-auto">Belum punya akun? <a href="#/register">Daftar</a></p>
            </div>
          </form>
        </article>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: MoDiAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
  }

  #setupForm() {
    document
      .getElementById("login-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const data = {
          email: document.getElementById("email-input").value,
          password: document.getElementById("password-input").value,
        };
        await this.#presenter.getLogin(data);
      });
  }

  loginSuccessfully(message) {
    console.log(message);

    // Redirect
    location.hash = "/";
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
     <button class="btn w-100 btn-with-arrow" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i>
        Masuk
        <span class="material-symbols-rounded">
          arrow_forward
        </span>
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
      <button class="btn w-100 btn-with-arrow" type="submit">
        Masuk
        <span class="material-symbols-rounded">
          arrow_forward
        </span>
      </button>
    `;
  }
}
