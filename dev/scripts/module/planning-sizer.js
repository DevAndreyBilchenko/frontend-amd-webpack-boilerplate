define([], function () {
    class PlanningSizer {
        constructor() {
            this.mainSelector = '.js-planning';
            this.imageSelector = '.js-planning-image';
            this.containerSelector = '.js-planning-container';
            this.vectorSelector = '.js-planning-vector';

            this.mainDom = document.querySelector(this.mainSelector);
            this.imageDom = this.mainDom.querySelector(this.imageSelector);
            this.containerDom = this.mainDom.querySelector(this.containerSelector);
            this.vectorDom = this.mainDom.querySelector(this.vectorSelector);

            this.setupSize();

            window.addEventListener('resize', () => {
                this.setupSize();
            }, false);
        }

        setupSize() {
            if (window.innerWidth > 1280) {
                if (!this.imageDom.complete) {
                    this.imageDom.addEventListener('load', this.setupSize.bind(this));
                    return;
                }

                const {width, height} = this.containerDom.getBoundingClientRect();
                const {width: imgWidth, height: imgHeight} = this.imageDom.getBoundingClientRect();
                const containerRatio = width / height;
                const imgRatio = imgWidth / imgHeight;

                if (imgRatio < containerRatio) {
                    this.imageDom.style.height = height + 'px';
                    this.imageDom.style.width = height * imgRatio + 'px';
                    this.vectorDom.style.height = height + 'px';
                    this.vectorDom.style.width = height * imgRatio + 'px';
                } else {
                    this.imageDom.style.height = width / imgRatio + 'px';
                    this.imageDom.style.width = width + 'px';
                    this.vectorDom.style.height = width / imgRatio + 'px';
                    this.vectorDom.style.width = width + 'px';
                }

                this.vectorDom.style.top = this.imageDom.parentElement.offsetTop;
                this.vectorDom.style.left = this.imageDom.parentElement.offsetLeft;
            }

            this.mainDom.classList.add(this.mainDom.dataset.animation);
        }
    }

    return PlanningSizer;
});
