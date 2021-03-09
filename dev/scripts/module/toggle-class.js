define([], function () {
    class ToggleClass {
        constructor(e) {
            this.toggleSelector = '.js-toggle-target';
            this.buttonSelector = '.js-toggle-button';
            this.buttonCss = this.buttonSelector.replace('.', '');
            this.toggleCss = this.toggleSelector.replace('.', '');

            this.bindListeners();

            if (e) {
                this.onButtonClick(e);
            }
        }

        bindListeners() {
            const buttons = this.getButtons();

            if (buttons && buttons.length) {
                for (let i = 0, len = buttons.length; i < len; i++) {
                    buttons[i].addEventListener('click', (e) => this.onButtonClick(e), false);
                }
            }

            const targets = this.getTargets();

            if (targets && targets.length) {
                for (let i = 0, len = targets.length; i < len; i++) {
                    targets[i].addEventListener('click', (e) => this.onTargetClick(e), false);
                }
            }

            document.getElementsByTagName('body')[0].addEventListener('click', (e) => this.onBodyClick(e), false);
            window.addEventListener('scroll', (e) => this.onScroll(e));
        }

        onButtonClick(e) {
            let target = e.currentTarget ? e.currentTarget : e.target;

            if (!target.classList.contains(this.buttonCss)) {
                target = e.path.find(node => node.classList ? node.classList.contains(this.buttonCss) : false);
            }

            const toggleTargetId = target.dataset.toggleTarget;

            if (!toggleTargetId) {
                console.warn({
                    'choosed': target,
                    'current': e.currentTarget,
                    'target': e.target,
                    'related': e.relatedTarget,
                    'event': e,
                    'path': e.path,
                    'composedPath': e.composedPath(),
                });
                throw new Error('undefined data-toggle-target');
            }

            const targets = this.getTargetsById(toggleTargetId);
            for (let target of targets) {
                const toggleClass = target.dataset.toggleClass;

                if (!toggleClass) throw new Error('undefined data-toggle-class');

                target.classList.toggle(toggleClass);
            }
        }

        onTargetClick(e) {
        }

        onBodyClick(e) {
            const path = e.path;

            if (!path) return;

            let stop = false;

            for (let node of path) {
                if (node.classList) {
                    if (node.classList.contains(this.buttonCss) || node.classList.contains(this.toggleCss)) {
                        stop = true;
                        break;
                    }
                }
            }

            if (!stop) this.cleanAutoremove();
        }

        onScroll() {
            this.cleanAutoremove();
        }

        cleanAutoremove() {
            const targets = this.getTargets();

            if (targets && targets.length) {
                for (let i = 0, len = targets.length; i < len; i++) {
                    const target = targets[i];

                    if (target.dataset.hasOwnProperty('toggleAutoremove')) {
                        target.classList.remove(target.dataset.toggleClass);
                    }
                }
            }
        }

        getTargetsById(targetId) {
            const targets = this.getTargets();
            const targetsArray = Array.prototype.slice.call(targets);

            return targetsArray.filter(node => node.dataset.toggleTarget === targetId);
        }

        getButtons() {
            return document.querySelectorAll(this.buttonSelector);
        }

        getTargets() {
            return document.querySelectorAll(this.toggleSelector);
        }
    }

    return ToggleClass;
});
