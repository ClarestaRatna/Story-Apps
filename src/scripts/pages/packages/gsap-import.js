import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function cardAnim() {
  gsap.utils.toArray(".card-animation").forEach((card) => {
    gsap.fromTo(
      card,
      { y: 200, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 2,
        stagger: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: `top bottom`,
          toggleActions: "play pause resume pause",
        },
      }
    );
  });
}

export function lineAnim(elementName) {
  gsap.fromTo(
    elementName,
    { width: "0%" },
    {
      width: "100%",
      duration: 3,
      stagger: 1,
      ease: "easeIn",
      scrollTrigger: {
        trigger: elementName,
        start: `top bottom`,
        toggleActions: "restart pause restart reset",
      },
    }
  );
}

export function textAnim(elementName) {
  const element = document.querySelector(elementName);
  const text = element.textContent;
  element.innerHTML = [...text]
    .map((char) => {
      const safeChar = char === " " ? "&nbsp;" : char;
      return `<span class="char position-relative">${safeChar}</span>`;
    })
    .join("");

  let yPosition = 150;

  gsap.utils.toArray(".char").forEach((char) => {
    gsap.fromTo(
      char,
      {
        bottom: -yPosition,
        opacity: 1,
      },
      {
        bottom: 0,
        duration: 1,
        ease: "easeIn",
        scrollTrigger: {
          trigger: char,
          start: `top bottom`,
          toggleActions: "restart pause restart pause",
        },
      }
    );
    yPosition = yPosition + 10;
  });
}
