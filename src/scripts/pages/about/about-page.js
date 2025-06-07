import { textAnim, lineAnim } from "../packages/gsap-import";

export default class AboutPage {
  async render() {
    return `
      <section class="container mt-5">
        <div class="section-title overflow-hidden">
          <h1 class="text-uppercase fw-bold pt-5 mb-5 text-center position-relative text-break">About Us</h1>
        </div>

        <div class="line line-animation bg-secondary-subtle mb-5"></div>
        
        <p class="h4 lh-base text-center" id="about-desc">
          <strong>My MoDi (MOments + DIary)</strong> merupakan aplikasi website yang berfokus pada aspek komunikasi. Anda dapat mengekspresikan diri melalui tulisan. Kami menyediakan akses. kepada Anda untuk membaca tulisan sesama pengguna. Aplikasi website ini. memudahkan Anda mengabadikan inspirasi dan perasaan dengan fleksibel.
        </p>
      </section>
    `;
  }

  async afterRender() {
    lineAnim(".line-animation", ".line-animation");
    textAnim(".section-title > h1");
    return;
  }
}
