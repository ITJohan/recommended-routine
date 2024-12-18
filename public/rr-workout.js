import { getExercise, getProgression, getWorkout } from "./db.js";
import "./rr-set.js";

function template(/** @type {IRRSet[]} */ rrSets) {
  return `
    <form>
      ${
    rrSets
      .map(
        (set) => `
        <rr-set
          name="${set.name}"
          url="${set.url}"
          reps="${set.reps}"
          id="${set.id}"
        ></rr-set>`,
      )
      .join("")
  }
    </form>
  `;
}

customElements.define(
  "rr-workout",
  class RRWorkout extends HTMLElement {
    connectedCallback() {
      const firstWorkout = getWorkout("d32b6d9c-8e2a-4b23-a261-19f17286e8f3");

      /** @type {IRRSet[]} */
      const rrSets = firstWorkout.progressions
        .map((id) => getProgression(id))
        .map((progression) => progression.sets[0])
        .map((set, index) => {
          const exercise = getExercise(set.exerciseId);
          return {
            name: exercise.name,
            url: exercise.url,
            reps: set.reps.map((rep) => String(rep)),
            id: `set-${index + 1}`,
          };
        });

      this.setHTMLUnsafe(template(rrSets));
    }
  },
);
