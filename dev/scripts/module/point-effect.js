define([], function () {
    class PointEffect {
        constructor(e) {
            this.mainSelector = '.js-point-effect';
            this.mainCss = this.mainSelector.replace('.', '');
            this.utilityClass = 'u-point-effect';
            this.runClass = 'is-pe-effect-run';
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
                    buttons[i].classList.add(this.utilityClass);
                }
            }
        }

        onButtonClick(e) {
            let target = e.currentTarget ? e.currentTarget : e.target;

            if (!target.classList.contains(this.mainCss)) {
                target = e.path.find(node => node.classList ? node.classList.contains(this.mainCss) : false);
            }

            target.classList.add(this.runClass);

            setTimeout(() => {
                this.reset(target);
            }, 300);
        }

        reset(target) {
            target.classList.remove(this.runClass, this.utilityClass);

            setTimeout(() => target.classList.add(this.utilityClass), 18)
        }

        getButtons() {
            return document.querySelectorAll(this.mainSelector);
        }
    }

    return PointEffect;
});
