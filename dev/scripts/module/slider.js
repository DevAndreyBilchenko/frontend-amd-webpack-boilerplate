define(['tiny-slider/src/tiny-slider.module.js'], function (module) {
    class SliderAbout {
        constructor() {
            this.tnsCollection = [];
            this.run();
            this.lastWidth = window.innerWidth;
            window.addEventListener('resize', () => {
                if (window.innerWidth !== this.lastWidth) {
                    this.rebuild();
                    this.lastWidth = window.innerWidth;
                }
            });
        }

        run() {
            this.tnsCollection = [];

            const sliders = document.querySelectorAll('.js-slider');
            const tns = module.tns;

            for (let i = 0, len = sliders.length; i < len; i++) {
                const slider = sliders[i];
                const child = slider.children[0];
                const style = child.currentStyle || window.getComputedStyle(child);
                const itemWidth = child.clientWidth;
                const gutter = parseFloat(style.marginRight);

                this.tnsCollection.push(tns({
                    container: slider,
                    items: 4,
                    fixedWidth: itemWidth,
                    loop: true,
                    gutter: gutter,
                    nav: false,
                    prevButton: slider.nextElementSibling.children[0],
                    nextButton: slider.nextElementSibling.children[1],
                    responsive: {
                        1279: {
                            items: 3,
                        },
                        767: {
                            items: 2,
                        },
                    },
                }));
            }
        }

        rebuild() {
            this.tnsCollection.forEach((t) => {
                t.destroy();
            });

            window.requestAnimationFrame(() => {
                this.run();
            });
        }
    }

    return SliderAbout;
});
