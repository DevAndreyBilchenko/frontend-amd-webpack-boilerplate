define([], function () {
    class Sticky {
        constructor() {
            this.needRedraw = false;
            this.mainSelector = '.js-sticky';
            this.stickyMap = [];
            this.createMaps();
            this.bindListeners();
            window.requestAnimationFrame(this.animationCycle.bind(this));
        }

        createMaps() {
            this.stickyMap = [];

            const nodes = document.querySelectorAll(this.mainSelector);

            if (!nodes.length) return;

            for (let i = 0, len = nodes.length; i < len; i++) {
                const node = nodes[i];
                const parent = node.parentElement;
                const top = (parent.getBoundingClientRect().y + window.app.scrollTop()) - window.innerHeight * 0.13;
                const bottom = top + parent.clientHeight - node.clientHeight;
                const maxY = parent.clientHeight - node.clientHeight;

                this.stickyMap.push({top, bottom, node, maxY, moveY: 0});
            }
        }

        bindListeners() {
            if (!window.app.scrollbar) {
                document.body.addEventListener(window.app.syntheticEvents.customScrollEnable.name, () => {
                    window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
                }, false);
            } else {
                window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
            }

            document.body.addEventListener('lazy-img-loaded-new', () => {
                this.createMaps();
                this.customScrollbarListener(window.app.scrollbar);
            }, false);
        }

        customScrollbarListener(status) {
            const offset = status.offset;

            for (let i = 0, len = this.stickyMap.length; i < len; i++) {
                const mapItem = this.stickyMap[i];
                let newMoveY = 0;

                if (offset.y > mapItem.top && offset.y < mapItem.bottom) {
                    newMoveY = offset.y - mapItem.top
                } else if (offset.y <= mapItem.top && offset.y < mapItem.bottom) {
                    newMoveY = 0;
                } else if (offset.y > mapItem.top && offset.y >= mapItem.bottom) {
                    newMoveY = mapItem.maxY;
                }

                if (mapItem.moveY !== newMoveY) {
                    this.needRedraw = true;
                    mapItem.moveY = newMoveY;
                }
            }
        }

        animationCycle() {
            if (this.needRedraw) this.redraw();
            window.requestAnimationFrame(this.animationCycle.bind(this));
        }

        redraw() {
            for (let i = 0, len = this.stickyMap.length; i < len; i++) {
                const mapItem = this.stickyMap[i];
                mapItem.node.style.transform = `translateY(${mapItem.moveY}px)`;
            }
            this.needRedraw = false;
        }
    }

    return Sticky;
});
