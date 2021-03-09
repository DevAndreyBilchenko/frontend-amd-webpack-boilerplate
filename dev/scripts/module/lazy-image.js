define([], function () {
    class LazyImage {
        constructor() {
            this.mainSelector = '.js-lazy-image';
            this.forceSelector = '.js-force-preload';
            this.loadedNewEventName = 'lazy-img-loaded-new';

            this.secureBound = window.innerHeight < 400 ? 400 : window.innerHeight;
            this.targetMap = [];
            this.createMaps();
            this.bindListeners();

            this.loadedNewEvent = document.createEvent('Event');
            this.loadedNewEvent.initEvent(this.loadedNewEventName, true, true);
        }

        createMaps() {
            this.targetMap = [];

            const targets = document.querySelectorAll(this.mainSelector);

            targets.forEach(target => {
                switch (target.nodeName) {
                    case 'PICTURE': {
                        this.processPicture(target);
                        break;
                    }
                    case 'IMG': {
                        this.processImage(target);
                        break;
                    }
                }
            });

            if (window.app.scrollbar) {
                this.processImages(window.app.scrollbar.offset.y);
            } else {
                this.processImages(window.scrollY);
            }

        }

        bindListeners() {
            if (!window.app.scrollbar) {
                document.body.addEventListener(window.app.syntheticEvents.customScrollEnable.name, this.onCustomScrollEnable.bind(this), false);
            } else {
                window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
            }

            window.addEventListener('scroll', this.scrollListener.bind(this), false);

            document.body.addEventListener('theme-toggle-switch', () => this.createMaps(), false);
            document.body.addEventListener('theme-toggle-force-preload', () => this.loadForcedItems(), false);
        }

        onCustomScrollEnable() {
            window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
            this.createMaps();
        }

        customScrollbarListener(status) {
            this.processImages(status.offset.y);
        }

        scrollListener() {
            this.processImages(window.scrollY);
        }

        processImages(scrollTop) {
            this.targetMap.forEach(item => {
                if (item.disabled) return;

                if (scrollTop > item.yMin && scrollTop < item.yMax) {
                    if (item.sources) item.sources.forEach(s => s.srcset = s.dataset.srcset);
                    item.img.addEventListener('load', () => document.body.dispatchEvent(this.loadedNewEvent), false);

                    item.img.srcset = item.img.dataset.srcset;
                    item.img.src = item.img.dataset.src;
                    item.disabled = true;
                }
            });
        }

        processPicture(picture) {
            const mapItem = {
                yMin: 0,
                yMax: 0,
                rect: picture.getBoundingClientRect(),
                picture: picture,
                img: picture.querySelector('img'),
                sources: picture.querySelectorAll('source'),
            };

            mapItem.yMin = mapItem.rect.y - this.secureBound;
            mapItem.yMax = mapItem.rect.y + window.innerHeight + this.secureBound;

            if (this.isNeedAddPictureToProcess(mapItem)) {
                this.targetMap.push(mapItem);
            }
        }

        processImage(picture) {
            const mapItem = {
                yMin: 0,
                yMax: 0,
                rect: picture.getBoundingClientRect(),
                img: picture,
            };

            const rectYFix = window.app.scrollbar ? mapItem.rect.y + window.app.scrollbar.offset.y : mapItem.rect.y;

            mapItem.yMin = rectYFix - this.secureBound;
            mapItem.yMax = rectYFix + window.innerHeight + this.secureBound;

            if (this.isNeedAddPictureToProcess(mapItem)) {
                this.targetMap.push(mapItem);
            }
        }

        // Проверяем:
        // display:none
        // наличие src и srcset
        isNeedAddPictureToProcess(mapItem) {
            if (!!mapItem.img.src || !!mapItem.img.srcset) return false;

            if (mapItem.picture) {
                let r = true;
                mapItem.sources.forEach(source => {
                    if (!!source.srcset) r = false;
                });

                if (!r) return false;
            }

            return !this.isHasDisplayNone(mapItem.img);
        }

        isHasDisplayNone(node, deep = 3) {

            if (window.getComputedStyle(node).display === 'none') {
                return true;
            } else {
                if (deep !== 0) {
                    return this.isHasDisplayNone(node.parentElement, deep - 1);
                } else {
                    return false;
                }
            }
        }

        loadForcedItems() {
            const items = document.querySelectorAll(this.forceSelector);

            items.forEach((node) => {
                let sources;
                let img;

                if (node.nodeName === 'PICTURE') {
                    sources = node.querySelectorAll('source');
                    img = node.querySelector('img');
                } else if (node.nodeName === 'IMG') {
                    img = node;
                }

                if (sources) {
                    sources.forEach(n => {if (!n.srcset) n.srcset = n.dataset.srcset});
                }

                if (!img.src || !img.srcset) {
                    img.srcset = img.dataset.srcset;
                    img.src = img.dataset.srcset;
                }
            });
        }
    }

    return LazyImage;
});
