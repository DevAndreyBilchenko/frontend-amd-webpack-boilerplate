define([], function () {
    class ImageParallax {
        constructor() {
            this.mainSelector = '.js-image-parallax';
            this.parallaxMap = [];
            this.createMaps();
            this.bindListeners();

            window.requestAnimationFrame(this.animationCycle.bind(this));
        }

        createMaps() {
            this.parallaxMap = [];

            const images = document.querySelectorAll(this.mainSelector);

            for (let i = 0, len = images.length; i < len; i++) {
                const img = images[i];
                const wrapper = img.parentElement;
                const wrapperRect = wrapper.getBoundingClientRect();
                const wrapperTop = wrapperRect.y + window.app.scrollTop();
                const wrapperBottom = wrapperTop + wrapperRect.height;
                const gap = img.dataset.gap ? img.dataset.gap : 40;

                this.parallaxMap.push({
                    node: img,
                    top: wrapperTop,
                    bottom: wrapperBottom,
                    height: wrapperRect.height,
                    progressStart: wrapperTop - window.innerHeight,
                    progressEnd: wrapperBottom,
                    costOfPixel: gap / (wrapperBottom - (wrapperTop - window.innerHeight)),
                    gap: gap
                });
            }
        }

        bindListeners() {
            if (!window.app.scrollbar) {
                document.body.addEventListener(window.app.syntheticEvents.customScrollEnable.name, this.onCustomScrollEnable.bind(this), false);
            } else {
                window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
            }

            window.addEventListener('scroll', this.scrollListener.bind(this), false);
            window.addEventListener('resize', () => {
                this.createMaps(window.app.scrollTop());
                this.needRedraw = true;
            }, false);
            document.body.addEventListener('lazy-img-loaded-new', () => {
                this.createMaps(window.app.scrollTop());
                this.needRedraw = true;
            }, false);
        }

        onCustomScrollEnable() {
            window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
        }

        customScrollbarListener(status) {
            this.processImages(status.offset.y);
        }

        scrollListener() {
            this.processImages(window.scrollY);
        }

        processImages(scrollTop) {
            for (let i = 0, len = this.parallaxMap.length; i < len; i++) {
                const mapItem = this.parallaxMap[i];
                const nextOffset = this.getNextImageOffset(mapItem, scrollTop);

                if (mapItem.offset !== nextOffset) {
                    mapItem.offset = nextOffset;
                    this.needRedraw = true;
                }
            }
        }

        getNextImageOffset(image, scrollTop) {
            const windowBottom = scrollTop + window.innerHeight;

            if (windowBottom > image.top && image.bottom > scrollTop) {
                return -(image.costOfPixel * (image.progressEnd - scrollTop));
            } else if (scrollTop < image.top && windowBottom < image.top) {
                return -image.gap
            } else if (scrollTop > image.top && windowBottom > image.top) {
                return 0;
            }
        }

        animationCycle() {
            if (this.needRedraw) this.redraw();
            window.requestAnimationFrame(this.animationCycle.bind(this));
        }

        redraw() {
            for (let i = 0, len = this.parallaxMap.length; i < len; i++) {
                const mapItem = this.parallaxMap[i];
                mapItem.node.style.transform = `translate3d(0, ${mapItem.offset}px, 0)`;
            }
            this.needRedraw = false;
        }
    }

    return ImageParallax;
});
