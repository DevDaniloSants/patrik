/**
 * Product Card Manual Slider
 * Enables manual navigation through product images with arrows and drag/swipe
 */

class ProductCardSlider {
    constructor(gridItem) {
        this.gridItem = gridItem;
        this.imagesContainer = gridItem.querySelector("[data-grid-images]");
        this.images = Array.from(
            gridItem.querySelectorAll("[data-grid-image]"),
        );
        this.currentIndex = 0;
        this.totalImages = this.images.length;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;

        if (this.totalImages <= 1) return; // No need for slider with single image

        this.init();
    }

    init() {
        this.createArrows();
        this.initDragEvents();
        this.initKeyboard();
        this.goToSlide(0);
    }

    createArrows() {
        // Create arrows container
        const arrowsHTML = `
      <div class="product-card-slider-arrows" data-slider-arrows>
        <button 
          class="product-card-slider-arrow product-card-slider-arrow--prev"
          data-slider-arrow="prev"
          aria-label="Previous image"
          type="button"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <button 
          class="product-card-slider-arrow product-card-slider-arrow--next"
          data-slider-arrow="next"
          aria-label="Next image"
          type="button"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    `;

        this.imagesContainer.insertAdjacentHTML("afterend", arrowsHTML);

        // Add event listeners
        this.prevArrow = this.gridItem.querySelector(
            '[data-slider-arrow="prev"]',
        );
        this.nextArrow = this.gridItem.querySelector(
            '[data-slider-arrow="next"]',
        );

        this.prevArrow.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.prev();
        });

        this.nextArrow.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.next();
        });
    }

    initDragEvents() {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        let hasMoved = false;

        const onStart = (e) => {
            const touch = e.touches ? e.touches[0] : e;
            startX = touch.clientX;
            startY = touch.clientY;
            isDragging = true;
            hasMoved = false;
            this.imagesContainer.style.cursor = "grabbing";
        };

        const onMove = (e) => {
            if (!isDragging) return;

            const touch = e.touches ? e.touches[0] : e;
            const diffX = Math.abs(touch.clientX - startX);
            const diffY = Math.abs(touch.clientY - startY);

            // Only prevent default if horizontal movement is greater
            if (diffX > diffY && diffX > 5) {
                e.preventDefault();
                hasMoved = true;
            }
        };

        const onEnd = (e) => {
            if (!isDragging) return;

            const touch = e.changedTouches ? e.changedTouches[0] : e;
            const diffX = touch.clientX - startX;

            if (hasMoved && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.prev();
                } else {
                    this.next();
                }

                // Prevent click on link
                setTimeout(() => {
                    const link = this.gridItem.querySelector(
                        "[data-grid-link]",
                    );
                    if (link) {
                        link.style.pointerEvents = "none";
                        setTimeout(() => {
                            link.style.pointerEvents = "";
                        }, 100);
                    }
                }, 0);
            }

            isDragging = false;
            hasMoved = false;
            this.imagesContainer.style.cursor = "";
        };

        // Touch events
        this.imagesContainer.addEventListener("touchstart", onStart, {
            passive: true,
        });
        this.imagesContainer.addEventListener("touchmove", onMove, {
            passive: false,
        });
        this.imagesContainer.addEventListener("touchend", onEnd);

        // Mouse events
        this.imagesContainer.addEventListener("mousedown", onStart);
        this.imagesContainer.addEventListener("mousemove", onMove);
        this.imagesContainer.addEventListener("mouseup", onEnd);
        this.imagesContainer.addEventListener("mouseleave", onEnd);

        this.imagesContainer.style.cursor = "grab";
    }

    initKeyboard() {
        this.gridItem.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                this.prev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                this.next();
            }
        });
    }

    prev() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }

    next() {
        if (this.currentIndex < this.totalImages - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }

    goToSlide(index) {
        if (index < 0 || index >= this.totalImages) return;

        // Hide current image
        const currentImage = this.images[this.currentIndex];
        if (currentImage) {
            currentImage.classList.remove("is-active");
            currentImage.removeAttribute("data-grid-current-image");
        }

        // Update index
        this.currentIndex = index;

        // Show new image
        const newImage = this.images[this.currentIndex];
        if (newImage) {
            newImage.classList.add("is-active");
            newImage.setAttribute("data-grid-current-image", "");

            // Load image if it's in a template
            const template = newImage.querySelector("template");
            if (template) {
                const content = template.content.cloneNode(true);
                template.replaceWith(content);
            }
        }

        // Update arrows state
        this.updateArrows();
    }

    updateArrows() {
        if (this.prevArrow) {
            this.prevArrow.disabled = this.currentIndex === 0;
        }
        if (this.nextArrow) {
            this.nextArrow.disabled =
                this.currentIndex === this.totalImages - 1;
        }
    }
}

// Initialize sliders when DOM is ready
function initProductCardSliders() {
    if (
        !window.theme || !window.theme.settings ||
        !window.theme.settings.product_card_manual_slider_enable
    ) {
        return; // Feature is disabled
    }

    const gridItems = document.querySelectorAll(
        "[data-grid-item][data-slideshow-style]:not([data-slider-initialized])",
    );

    gridItems.forEach((gridItem) => {
        new ProductCardSlider(gridItem);
        gridItem.setAttribute("data-slider-initialized", "true");
    });
}

// Auto-initialize
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProductCardSliders);
} else {
    initProductCardSliders();
}

// Expose for manual re-initialization (for infinite scroll, etc.)
window.initProductCardSliders = initProductCardSliders;
