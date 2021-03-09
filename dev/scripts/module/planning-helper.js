define([], function () {
    class PlanningHelper {
        getPointByPolygon(polygon) {
            const selfId = polygon.getAttribute('id');
            return  document.getElementById(selfId.replace('f', 't'));
        }

        getFloor(floorNumber) {
            return window.floors.find((f) => parseInt(f.number) === floorNumber);
        }

        getFloorNumbers() {
            const numbersArray = window.floors.map(f => f.number);

            return numbersArray.sort((a, b) => a-b);
        }

        hideTooltip() {
            document.querySelector('.js-planning-tooltip').style.display = 'none';
        }
    }

    return PlanningHelper;
});
