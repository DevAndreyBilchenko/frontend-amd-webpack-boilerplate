define([], function () {
    class ScrollDown {
        constructor(e) {
            this.mainSelector = '.js-scroll-down';
            this.bindListeners();

            if (e) {
                setTimeout(() => this.onButtonClick(e), 18);
            }
        }

        bindListeners() {
            const buttons = this.getButtons();

            if (buttons && buttons.length) {
                for (let i = 0, len = buttons.length; i < len; i++) {
                    buttons[i].addEventListener('click', (e) => this.onButtonClick(e), false);
                }
            }
        }

        onButtonClick() {
            if (!window.app.scrollbar) return;

            window.app.scrollbar.scrollTo(0, window.innerHeight, 1000);
        }

        getButtons() {
            return document.querySelectorAll(this.mainSelector);
        }
    }

    return ScrollDown;
});
