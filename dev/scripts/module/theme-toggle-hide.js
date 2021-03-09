define([], function () {
    class ThemeToggleHide {
        constructor() {
            this.mainSelector = '.js-theme-toggle-hoverzone';
            this.duplicateModifier = 'is-duplicate';
            this.fixedModifier = 'is-fixed';
            this.map = {
                fixed: {
                    node: null,
                    top: null,
                },
                duplicate: {
                    node: null,
                    top: null,
                },
            };
            this.createMap();
            this.bindListeners();
            this.direction = 'down';
            this.lastY = 0;

            this.customScrollbarListener({offset: {y: 0}});
        }

        createMap() {
            const buttons = document.querySelectorAll(this.mainSelector);

            for (let i = 0, len = buttons.length; i < len; i++) {
                const button = buttons[i];

                if (button.classList.contains(this.duplicateModifier)) {
                    const rect = button.getBoundingClientRect();
                    this.map.duplicate.node = button;
                    this.map.duplicate.top = rect.top;
                } else if (button.classList.contains(this.fixedModifier)) {
                    const rect = button.getBoundingClientRect();
                    this.map.fixed.node = button;
                    this.map.fixed.top = rect.top;
                }
            }
        }

        bindListeners() {
            if (!window.app.scrollbar) {
                document.body.addEventListener(window.app.syntheticEvents.customScrollEnable.name, this.onCustomScrollEnable.bind(this), false);
            } else {
                window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
            }
        }

        onCustomScrollEnable() {
            window.app.scrollbar.addListener(this.customScrollbarListener.bind(this));
        }

        customScrollbarListener(status) {
            this.setDirection(status.offset.y);
            this.processToggle(status.offset.y);
        }

        setDirection(y) {
            if (y > this.lastY) {
                this.direction = 'down';
            } else {
                this.direction = 'top';
            }

            this.lastY = y;
        }

        processToggle(y) {
            if (this.map.fixed.top > this.map.duplicate.top - y) {
                this.map.fixed.node.style.visibility = 'hidden';
                this.map.duplicate.node.style.visibility = 'visible';
            } else {
                this.map.fixed.node.style.visibility = 'visible';
                this.map.duplicate.node.style.visibility = 'hidden';
            }

            if (this.direction === 'top') {
                this.map.fixed.node.classList.remove('is-hidden')
            } else {
                this.map.fixed.node.classList.add('is-hidden')
            }
        }
    }

    return ThemeToggleHide;
});
