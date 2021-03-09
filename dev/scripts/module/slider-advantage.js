define(['tiny-slider/src/tiny-slider.module.js'], function (module) {
    class SliderAdvantage {
        constructor() {
            this.tns = module.tns;
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

            const sliders = document.querySelectorAll('.js-advantage-slider');
            for (let i = 0, len = sliders.length; i < len; i++) {
                const slider = sliders[i];
                const child = slider.children[0];
                const style = child.currentStyle || window.getComputedStyle(child);
                const itemWidth = child.clientWidth;
                const gutter = parseFloat(style.marginRight);

                this.tnsCollection.push(this.tns({
                    container: slider,
                    items: 1,
                    fixedWidth: itemWidth,
                    loop: false,
                    gutter: gutter,
                    controls: false,
                    navContainer: sliders[i].nextElementSibling.children[0],
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

    return SliderAdvantage;
});
