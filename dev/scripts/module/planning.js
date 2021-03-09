define(['./planning-helper.js'], function (PlanningHelper) {
    const planningHelper = new PlanningHelper;

    class Planning {
        constructor(e) {
            this.mainSelector = '.js-planning';
            this.vectorSelector = '.js-planning-vector';
            this.navButtonSelector = '.js-planning-nav-button';
            this.navButtonPrevSelector = '.js-planning-nav-prev';
            this.navButtonNextSelector = '.js-planning-nav-next';
            this.backSelector = '.js-planning-back';

            this.floorSidebarTitleSelector = '.js-floor-sidebar-title';
            this.floorSidebarInfoSelector = '.js-floor-sidebar-info';
            this.floorSidebarTagsSelector = '.js-floor-sidebar-tags';
            this.floorSourceSelector = '.js-floor-source';
            this.floorImgSelector = '.js-floor-img';
            this.floorPreloadSourceSelector = '.js-floor-preload-source';
            this.floorPreloadImgSelector = '.js-floor-preload-img';
            this.floorOuterSelector = '.js-floor-outer';

            this.displayOnPlanningSelector = '.js-display-on-planning';
            this.displayOnFloorSelector = '.js-display-on-floor';
            this.displayOnToggleFloorSelector = '.js-toggle-floor';

            this.switchDuration = 600;
            this.currentState = 'planning'; // planning | floor
            this.switching = false;
            this.currentFloor = null;

            this.mainDom = document.querySelector(this.mainSelector);
            this.vectorDom = this.mainDom.querySelector(this.vectorSelector);
            this.backDom = document.querySelector(this.backSelector);
            this.floorImgDom = document.querySelector(this.floorImgSelector);
            this.floorSourceDom = document.querySelector(this.floorSourceSelector);
            this.floorPreloadImgDom = document.querySelector(this.floorPreloadImgSelector);
            this.floorPreloadSourceDom = document.querySelector(this.floorPreloadSourceSelector);
            this.navButtonPrevDom = document.querySelectorAll(this.navButtonPrevSelector);
            this.navButtonNextDom = document.querySelectorAll(this.navButtonNextSelector);
            this.floorOuterDom = document.querySelector(this.floorOuterSelector);

            this.bindListeners();

            if (e) {
                if (e.target.classList.contains(this.navButtonSelector.replace('.', ''))) {
                    this.onNavButtonClick(e);
                } else {
                    this.onPolygonClick(e);
                }
            }
        }

        bindListeners() {
            this.getPolygons().forEach(polygon => {
                polygon.addEventListener('click', (e) => this.onPolygonClick(e), false);
            });

            this.getNavButtons().forEach(button => {
                button.addEventListener('click', (e) => this.onNavButtonClick(e), false);
            });

            this.navButtonPrevDom.forEach(b => {
                b.addEventListener('click', () => this.onPrevButtonClick(), false);
            });

            this.navButtonNextDom.forEach(b => {
                b.addEventListener('click', () => this.onNextButtonClick(), false);
            });

            this.backDom.addEventListener('click', () => this.showPlanning(), false);
        }

        onPolygonClick(e) {
            if (window.app.isTouch) return;
            const point = planningHelper.getPointByPolygon(e.target);
            this.showFloor(parseInt(point.dataset.floor));
            planningHelper.hideTooltip();
        }

        onNavButtonClick(e) {
            this.showFloor(parseInt(e.target.dataset.floor));
        }

        onNextButtonClick() {
            const floorNumbers = planningHelper.getFloorNumbers();
            let index = 0;
            floorNumbers.find((n, i) => parseInt(n) === parseInt(this.currentFloor) ? index = i : false);
            const nextFloor = planningHelper.getFloor(floorNumbers[index + 1]);

            if (!nextFloor) {
                return;
            }

            this.showFloor(nextFloor.number);
        }

        onPrevButtonClick() {
            const floorNumbers = planningHelper.getFloorNumbers();

            let index = 0;
            floorNumbers.find((n, i) => parseInt(n) === parseInt(this.currentFloor) ? index = i : false);
            const nextFloor = planningHelper.getFloor(floorNumbers[index - 1]);

            if (!nextFloor) {
                return;
            }

            this.showFloor(nextFloor.number);
        }

        getPolygons() {
            return this.vectorDom.querySelectorAll('polygon');
        }

        getNavButtons() {
            return document.querySelectorAll(this.navButtonSelector);
        }

        getFloorElements() {
            return document.querySelectorAll(this.displayOnFloorSelector);
        }

        getPlanningElements() {
            return document.querySelectorAll(this.displayOnPlanningSelector);
        }

        getToggleFloorElements() {
            return document.querySelectorAll(this.displayOnToggleFloorSelector);
        }

        showPlanning() {
            if (this.switching) return;
            else {
                this.switching = true;
            }

            this.currentFloor = null;

            const floorElements = this.getFloorElements();
            const planningElements = this.getPlanningElements();

            this.dropAnimateClass(floorElements);
            this.dropAnimateClass(planningElements);

            this.hideElements(floorElements, () => {
                this.updateNav(null);
                this.showElements(planningElements, () => {
                    this.switching = false;
                    this.currentState = 'planning';
                });
            });
        }

        showFloor(number) {
            if (this.switching || this.currentFloor === number) return;
            else {
                this.switching = true;
                this.currentFloor = number;
            }

            const floor = planningHelper.getFloor(number);

            if (!floor) return;

            if (this.currentState === 'floor') {
                const floorOnlyElements = this.getToggleFloorElements();
                this.dropAnimateClass(floorOnlyElements);
                this.preloadImgOnFloor(number);
                this.addCursorOnButtons('progress');

                this.hideElements(floorOnlyElements, () => {
                    const next = () => {
                        this.updateFloorData(number);
                        this.updateNav(number);
                        this.floorPreloadImgDom.removeEventListener('load', next);
                        this.floorOuterDom.children[0].scrollLeft = 0;
                        this.showElements(floorOnlyElements, () => {
                            this.switching = false;
                            this.currentState = 'floor';
                            this.addCursorOnButtons('pointer');
                        });
                    };

                    if (this.floorPreloadImgDom.complete || this.floorPreloadImgDom.getAttribute('src') === '') {
                        next();
                    } else {
                        this.floorPreloadImgDom.addEventListener('load', next, false);
                    }
                }, true);
            } else {
                const floorElements = this.getFloorElements();
                const planningElements = this.getPlanningElements();

                this.dropAnimateClass(floorElements);
                this.dropAnimateClass(planningElements);

                this.preloadImgOnFloor(number);

                this.hideElements(planningElements, (hideFunc) => {
                    const next = () => {
                        hideFunc();

                        this.floorPreloadImgDom.removeEventListener('load', next);
                        this.showElements(floorElements, () => {
                            this.switching = false;
                            this.currentState = 'floor';
                        }, () => {
                            this.floorOuterDom.children[0].scrollLeft = 0;
                            this.floorOuterDom.style.height = this.floorOuterDom.getBoundingClientRect().height + 'px';
                            this.updateFloorData(number);
                            this.updateNav(number);
                        });
                    };

                    if (this.floorPreloadImgDom.complete || this.floorPreloadImgDom.getAttribute('src') === '') {
                        next();
                    } else {
                        this.floorPreloadImgDom.addEventListener('load', next, false);
                    }
                }, true);
            }
        }

        dropAnimateClass(elements) {
            for (let i = 0, len = elements.length; i < len; i++) {
                const el = elements[i];
                el.classList.remove('u-fade-in-fast');
                el.classList.remove('u-fade-out-fast');
            }
        }

        hideElements(elements, callback, soft) {
            for (let i = 0, len = elements.length; i < len; i++) {
                const el = elements[i];
                el.classList.add('u-fade-out-fast');
            }

            const hide = function () {
                for (let i = 0, len = elements.length; i < len; i++) {
                    const el = elements[i];
                    el.style.display = 'none';
                }
            };


            setTimeout(() => {
                if (!soft) {
                    hide();
                }

                if (callback) window.requestAnimationFrame(() => callback(hide));
            }, this.switchDuration);
        }

        showElements(elements, callback, displayCallback) {
            for (let i = 0, len = elements.length; i < len; i++) {
                const el = elements[i];
                el.style.display = el.dataset.displayType ? el.dataset.displayType : 'flex';
            }

            if (displayCallback) displayCallback();

            for (let i = 0, len = elements.length; i < len; i++) {
                const el = elements[i];
                el.style.display = el.dataset.displayType ? el.dataset.displayType : 'flex';
                el.classList.add('u-fade-in-fast');
            }

            setTimeout(() => {
                if (callback) window.requestAnimationFrame(() => callback());
            }, this.switchDuration);
        }

        updateFloorData(floorNumber) {
            const floor = planningHelper.getFloor(floorNumber);

            document.querySelector(this.floorSidebarTitleSelector).innerHTML = floor.title;
            document.querySelector(this.floorSidebarInfoSelector).innerHTML = floor.description;

            const status = document.createElement('SPAN');

            if (floor.status) {
                status.innerHTML = window.statuses.leased;
            } else {
                status.innerHTML = window.statuses.free;
            }

            const tenants = [];

            if (floor.tenants) {
                floor.tenants.forEach(t => {
                    const span = document.createElement('SPAN');
                    span.innerHTML = t.title;
                    tenants.push(span);
                });
            }

            const tags = document.querySelector(this.floorSidebarTagsSelector);

            tags.innerHTML = '';
            tags.appendChild(status);
            tenants.forEach(t => {
                tags.appendChild(t);
            });

            const map = window.floorMap.find(f => f.origin === floor.image);
            this.updateImageByMap(this.floorImgDom, this.floorSourceDom, map);
        }

        updateNav(floorNumber) {
            const navButtons = this.getNavButtons();

            for (let i = 0, len = navButtons.length; i < len; i++) {
                navButtons[i].classList.remove('is-active');

                if (parseInt(navButtons[i].dataset.floor) === floorNumber) {
                    navButtons[i].classList.add('is-active');
                }
            }
        }

        preloadImgOnFloor(floorNumber) {
            const floor = planningHelper.getFloor(floorNumber);
            const map = window.floorMap.find(f => f.origin === floor.image);
            this.updateImageByMap(this.floorPreloadImgDom, this.floorPreloadSourceDom, map);
        }

        updateImageByMap(img, source, map) {
            if (map.origin) {
                source.srcset = map.webpSrcset;
                img.srcset = map.srcset;
                img.src = map.src;
            } else {
                source.srcset = '';
                img.srcset = '';
                img.src = '';
            }
        }

        addCursorOnButtons(cursor) {
            this.navButtonNextDom.forEach(b => b.style.cursor = cursor);
            this.navButtonPrevDom.forEach(b => b.style.cursor = cursor);
            this.getNavButtons().forEach(b => b.style.cursor = cursor);
        }
    }

    return Planning;
});


