define(['tiny-slider/src/tiny-slider.module.js', 'tiny-slider/src/tiny-slider.scss'], function (module) {
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

            const sliders = document.querySelectorAll('.js-about-slider');
            const tns = module.tns;

            for (let i = 0, len = sliders.length; i < len; i++) {
                this.tnsCollection.push(tns({
                    container: sliders[i],
                    mode: 'gallery',
                    items: 1,
                    speed: 1200,
                    loop: true,
                    nav: false,
                    controls: false,
                    touch: false,
                    autoplay: true,
                    autoplayButtonOutput: false,
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
