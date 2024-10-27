import { getExercise, getNextProgressionSet } from "../db.js";
import { isCategory } from "../utils/type-guards.js";

customElements.define("rr-set", class RRSet extends HTMLElement {
    get category() {
      const category = this.getAttribute("category");
      if (category === null) throw new Error("category is required");
      if (!isCategory(category)) throw new Error("category is of wrong type");

      return category;
    }
    set category(category) {
      if (category === null) {
        this.removeAttribute("category");
        return;
      }
      if (!isCategory(category)) throw new Error("category is of wrong type");

      this.setAttribute("category", category);
    }

    static observedAttributes = ["category"];

    attributeChangedCallback() {
      this.update();
    }

    // TODO: show previous reps as initial

    update() {
      const progressionSet = getNextProgressionSet(this.category);
      const exercise = getExercise(progressionSet.exerciseId);
      const reps = Array(progressionSet.max + 1).fill(
        undefined,
      ).map((_, index) => index);
      const id = exercise.id + crypto.randomUUID().substring(0, 5);

      this.innerHTML = `
        <div>
          <span>&lt;&lt;</span>
          <div>
            <figure>
              <img src="./assets/placeholder.jpg" alt="${exercise.name}" />
              <figcaption>${exercise.name}</figcaption>
            </figure>
            <label for="${id}-input">Reps: <time>0</time></label>
            <input id="${id}-input" type="range" name="${id}" max="${progressionSet.max}" list="reps">
            <datalist id="reps">
              ${reps.map((rep) => `<option value="${rep}"></option>`).join("")}
            </datalist>
          </div>
          <span>&gt;&gt;</span>
        </div>
      `;

      const inputEl = this.querySelector("input");
      const timeEl = this.querySelector("time");
      if (inputEl === null || timeEl === null) {
        throw new Error("Could not query all elements");
      }

      // TODO: start animating right arrow on change

      inputEl.addEventListener("input", (event) => {
        timeEl.textContent =
          /** @type {HTMLInputElement} */ (event.target).value;
      });
    }
  },
);
