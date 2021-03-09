define(['./planning-helper.js'], function (PlanningHelper) {
    const planningHelper = new PlanningHelper;

    class PlanningTooltip {
        constructor(e) {
            this.mainSelector = '.js-planning';
            this.imageSelector = '.js-planning-image';
            this.vectorSelector = '.js-planning-vector';
            this.tooltipSelector = '.js-planning-tooltip';
            this.tooltipFloorSelector = '.js-planning-tooltip-floor';
            this.tooltipInfoSelector = '.js-planning-tooltip-info';

            this.mainDom = document.querySelector(this.mainSelector);
            this.imageDom = this.mainDom.querySelector(this.imageSelector);
            this.vectorDom = this.mainDom.querySelector(this.vectorSelector);
            this.tooltipDom = this.mainDom.querySelector(this.tooltipSelector);
            this.tooltipFloorDom = this.tooltipDom.querySelector(this.tooltipFloorSelector);
            this.tooltipInfoDom = this.tooltipDom.querySelector(this.tooltipInfoSelector);

            this.bindListeners();

            if (e) {
                this.onPolygonHover(e);
            }
        }

        bindListeners() {
            this.getPolygons().forEach(polygon => {
                polygon.addEventListener('mouseover', (e) => this.onPolygonHover(e), false);
            });

            this.vectorDom.addEventListener('mouseover', (e) => {
                if (e.target.nodeName !== 'polygon') {
                    this.tooltipDom.style.display = 'none';
                }
            });
        }

        onPolygonHover(e) {
            const point = planningHelper.getPointByPolygon(e.target);

            this.updateTooltipPosition(point);
            this.updateTooltipContent(point);
        }

        getPolygons() {
            return this.vectorDom.querySelectorAll('polygon');
        }

        updateTooltipPosition(point) {
            const {x: pointX, y: pointY} = this.convertToReal(point.getBBox());

            this.tooltipDom.style.top = (pointY) + 'px';
            this.tooltipDom.style.left = (pointX) + 'px';
            this.tooltipDom.style.display = 'block';
        }

        updateTooltipContent(point) {
            const floorNumber = parseInt(point.dataset.floor);
            const floor = planningHelper.getFloor(floorNumber);

            window.requestAnimationFrame(() => {
                if (floor) {
                    this.tooltipFloorDom.innerHTML = floor.title;
                } else {
                    this.tooltipFloorDom.innerHTML = 'no data';
                }

                if (floorNumber > 7) {
                    this.tooltipInfoDom.style.display = 'flex';
                } else {
                    this.tooltipInfoDom.style.display = 'none';
                }
            });
        }

        convertToReal(bBox) {
            const realWidth = this.vectorDom.getAttribute('viewBox').split(' ')[2];
            const realHeight = this.vectorDom.getAttribute('viewBox').split(' ')[3];

            return {
                x: (bBox.x / (realWidth / parseFloat(this.vectorDom.style.width))) + this.imageDom.parentElement.offsetLeft,
                y: bBox.y / (realHeight / parseFloat(this.vectorDom.style.height)) + this.imageDom.parentElement.offsetTop,
            };
        }
    }

    return PlanningTooltip;
});
