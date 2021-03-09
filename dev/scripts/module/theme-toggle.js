define([], function () {
    class ThemeToggle {
        constructor(e) {
            this.mainSelector = '.js-theme-toggle';
            this.mainCss = this.mainSelector.replace('.', '');
            this.changeEventName = 'theme-toggle-switch';
            this.bindListeners();

            this.changeEvent = document.createEvent('Event');
            this.changeEvent.initEvent(this.changeEventName, true, true);

            if (e) {
                this.toggle(e);
            }
        }

        bindListeners() {
            const inputs = this.getInputs();

            for (let i = 0, len = inputs.length; i < len; i++) {
                inputs[i].addEventListener('click', (e) => this.toggle(e), false);
            }
        }

        toggle(e) {
            let target = e.currentTarget ? e.currentTarget : e.target;

            if (!target.classList.contains(this.mainCss)) {
                target = e.path.find(node => node.classList ? node.classList.contains(this.mainCss) : false);
            }

            if (!target) return;

            this.updateStorage(target.checked);

            if (target.checked) {
                document.body.classList.add('theme-dark');
            } else {
                document.body.classList.remove('theme-dark');
            }

            const inputs = this.getInputs();

            console.log(this.changeEvent);
            document.body.dispatchEvent(this.changeEvent);

            for (let i = 0, len = inputs.length; i < len; i++) {
                inputs[i].checked = target.checked;
            }
        }

        getInputs() {
            return document.querySelectorAll(this.mainSelector);
        }

        updateStorage(value) {
            if (window.localStorage) {
               window.localStorage.setItem('theme-dark', value);
            }
        }
    }

    return ThemeToggle;
});
