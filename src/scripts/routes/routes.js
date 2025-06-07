import RegisterPage from "../pages/auth/register/register-page.js";
import LoginPage from "../pages/auth/login/login-page.js";
import HomePage from "../pages/home/home-page.js";
import StoryDetailPage from "../pages/story-detail/story-detail-page.js";
import NewPage from "../pages/new/new-page.js";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth.js";
import BookmarkPage from "../pages/bookmark/bookmark-page.js";
import AboutPage from "../pages/about/about-page.js";
import NotFoundPage from "../pages/error/404-page.js";

export const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/stories": () => checkAuthenticatedRoute(new NewPage()),
  "/stories/:id": () => checkAuthenticatedRoute(new StoryDetailPage()),
  "/bookmark": () => checkAuthenticatedRoute(new BookmarkPage()),
  "/about": () => checkAuthenticatedRoute(new AboutPage()),
  "/404": () => checkAuthenticatedRoute(new NotFoundPage()),
};
