customElements.define(
  "rr-rest",
  class RRRest extends HTMLElement {
    /** @type {HTMLTimeElement | null} */ timeElement = null;
    /** @type {number | undefined} */ intervalId = undefined;

    get time() {
      return this.getAttribute("time");
    }
    set time(time) {
      time === null
        ? this.removeAttribute("time")
        : this.setAttribute("time", time);
    }

    get active() {
      return this.getAttribute("active") === "" ? true : false;
    }
    set active(active) {
      active === true
        ? this.setAttribute("active", "")
        : this.removeAttribute("active");
    }

    connectedCallback() {
      this.innerHTML = `
      <h2>Rest</h2>
      <div>
        <span>&lt;&lt;</span>
        <rr-card>
          <p>Ad</p>
          <time></time>
        </rr-card>
        <span>&gt;&gt;</span>
      </div>
    `;
      this.timeElement = this.querySelector("time");
      this.update();
    }

    disconnectedCallback() {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    // TODO: time attribute should only be the initial value

    static observedAttributes = ["time", "active"];

    attributeChangedCallback() {
      if (this.active && !this.intervalId) {
        const initialTime = this.time;

        this.intervalId = setInterval(() => {
          const timeAttribute = this.time;
          const time = Number(timeAttribute);

          if (time > 0) {
            this.time = String(time - 1);
            this.update();
          } else {
            this.active = false;
            this.time = initialTime;

            clearInterval(this.intervalId);
            this.intervalId = undefined;
          }
        }, 1000);
      }

      this.update();
    }

    update() {
      if (this.timeElement) {
        this.timeElement.textContent = this.time;
      }
    }
  },
);
