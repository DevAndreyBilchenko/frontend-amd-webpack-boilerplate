define([], function () {
    class ScrollAnimations {
        constructor(force) {
            this.mainSelector = '.js-scroll-animation';
            this.animationMap = [];
            this.animationRunEventName = 'animation-run';
            this.createMaps();
            this.bindListeners();

            this.animationRunEvent = document.createEvent('Event');
            this.animationRunEvent.initEvent(this.animationRunEventName, true, true);

            setTimeout(() => {
                window.requestAnimationFrame(() => {
                    if (window.app.scrollbar) {
                        this.check(0);
                    }

                    if (force) {
                        setTimeout(() => this.scrollListener(), 18);
                    }
                });
            }, 100);
        }

        createMaps() {
            this.animationMap = [];

            const nodes = document.querySelectorAll(this.mainSelector);

            if (!nodes.length) return;

            for (let i = 0, len = nodes.length; i < len; i++) {
                const node = nodes[i];
                const top = node.getBoundingClientRect().top + window.app.scrollTop();
                const animation = node.dataset.animation;
                const timeout = node.dataset.timeout ? parseInt(node.dataset.timeout) : 0;

                if (!animation) throw new Error('Undefined animation on ' + node.toString());

                this.animationMap.push({top, node, animation, timeout});
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
                this.createMaps();
            }, false);
            document.body.addEventListener('lazy-img-loaded-new', () => {
                this.createMaps();
            }, false);
        }

        unbindListeners() {
            window.removeEventListener('scroll', this.scrollListener.bind(this), false);
            document.body.removeEventListener(window.app.syntheticEvents.customScrollEnable.name, this.onCustomScrollEnable.bind(this));

            if (window.app.scrollbar && window.app.scrollbar.removeListener) {
                window.app.scrollbar.removeListener(this.customScrollbarListener.bind(this));
            }
        }

        onCustomScrollEnable() {
            window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
            this.check(0);
        }

        customScrollbarListener(status) {
            this.check(status.offset.y);
        }

        scrollListener() {
            this.check(window.scrollY);
        }

        check(scrollTop) {
            let disabledCounter = 0;

            this.animationMap.forEach((animateItem, index) => {
                if (animateItem.disabled) {
                    disabledCounter++;
                    return;
                }

                const bound = window.innerWidth > 1280 ? window.innerHeight * 0.85 : window.innerHeight - 100;

                if (scrollTop + bound > animateItem.top) {
                    const animations = animateItem.animation.split(' ');
                    animateItem.node.style.willChange = 'transform, opacity';

                    window.requestAnimationFrame(() => {
                        animations.forEach((a) => setTimeout(() => animateItem.node.classList.add(a), animateItem.timeout));
                    });

                    setTimeout(() => {
                        animateItem.node.style.willChange = '';
                    }, 2000);
                    animateItem.disabled = true;
                    animateItem.node.classList.remove(this.mainSelector.replace('.', ''));
                    animateItem.node.dispatchEvent(this.animationRunEvent);
                }
            });

            if (this.animationMap.length === disabledCounter) {
                this.unbindListeners();
            }
        }
    }

    return ScrollAnimations;
});
