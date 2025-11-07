var SliderControls = class extends HTMLElement {
  async connectedCallback() {
    const items = this.querySelectorAll("[data-action='select']");
    items.forEach((button) => {
      button.addEventListener("click", (event) => {
        const index = event.target.dataset.mediaIndex;
        this.sliderComponent.goToSlide(index);
        this._onSlideChanged(index);
      });
    });
    this._onSlideChanged(1);
  }
  get sliderComponent() {
    return document.getElementById(this.getAttribute("controls"));
  }
  async _onSlideChanged(active, animate = true) {
    const items = this.querySelectorAll("[data-action='select']");
    const activeItem = items[active - 1];
    items.forEach((items, idx) => {
      items.setAttribute("aria-current", "false");
    });

    activeItem.setAttribute("aria-current", "true");

    requestAnimationFrame(() => {
      if (activeItem.offsetParent && activeItem.offsetParent !== this) {
        const windowHalfHeight = this.clientHeight / 2,
          windowHalfWidth = this.clientWidth / 2;
        this.scrollTo({
          behavior: animate ? "smooth" : "auto",
          top:
            activeItem.offsetTop -
            windowHalfHeight +
            activeItem.clientHeight / 2,
          left:
            activeItem.offsetLeft -
            windowHalfWidth +
            activeItem.clientWidth / 2,
        });
      }
    });
  }
};
window.customElements.define("slider-controls", SliderControls);
