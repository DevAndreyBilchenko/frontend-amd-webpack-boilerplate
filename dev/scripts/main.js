require('../style/main.scss');

document.addEventListener('DOMContentLoaded', run);

// Setup VH css variable
window.addEventListener('resize', () => {
    setupVhCssProperty();
});

window.app = {
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isTouch: isTouchDevice()
};


function run() {
    // Hack for mobile devices VH
    setupVhCssProperty();

    // ----------------------
    // TOGGLE BUTTON
    // ----------------------
    // activateOnEventAndSaveOnEvent('mousemove', '.js-toggle-button', 'click', '.js-toggle-button', function (e) {
    //     require(['./module/toggle-class.js'], function (toggleClass) {
    //         new toggleClass(e.save);
    //     });
    // });
    // ----------------------
    // POINT EFFECT
    // ----------------------
    // activateOnEventAndSaveOnEvent('mousemove', '.js-point-effect', 'click', '.js-point-effect', function (e) {
    //     require(['./module/point-effect.js'], function (pointEffect) {
    //         new pointEffect(e.save);
    //     });
    // });
}

// Вызывает коллбек при срабатывании первого события,
// если до загрузки модуля произошло второе событие
// то в объект переданный в функцию коллбек rq будет добавлено свойство event.
// Этот механизм - хак, основанный на механизме сохранения ссылок в объектах
// При редактировании нужно быть внимательным.
// Передача функции коллбека вместо массива или строки обусловлена тем что
// статический анализатор вебпака не сможет распознать модуль, и неправильно соберет бандл
function activateOnEventAndSaveOnEvent(event, selector, saveEvent, saveSelector, rq) {
    const nodes = document.querySelectorAll(selector);
    const saveNodes = document.querySelectorAll(saveSelector);
    const ev = {
        base: undefined,
        save: undefined,
    };

    if (!nodes.length) return;

    if (event === 'mousemove' && isTouchDevice()) {
        event = 'click';
    }

    bindEvent(event, nodes, onBaseEventFire);
    bindEvent(saveEvent, saveNodes, onSaveEventFire);

    function onSaveEventFire(e) {
        ev.save = e;
        unbindEvent(saveEvent, saveNodes, onSaveEventFire);
    }

    function onBaseEventFire(e) {
        ev.base = e;
        rq(ev);

        unbindEvent(event, nodes, onBaseEventFire);
    }
}

// Принцип работы механики saveEvent/saveSelector аналогична функции activateOnEventAndSaveOnEvent
function activateOnVisible(selector, saveEvent, saveSelector, rq) {
    const nodes = document.querySelectorAll(selector);

    if (!nodes.length) return;
    // const saveNodes = document.querySelectorAll(saveSelector);
    const ev = {
        base: undefined,
        save: undefined,
    };
    let customScrollRunBounds = [];

    document.body.addEventListener(window.app.syntheticEvents.customScrollEnable.name, onCustomScrollEnable, false);
    window.addEventListener('scroll', onScroll, false);

    if (window.innerWidth < 1280) {
        onScroll();
    }

    function onCustomScrollEnable() {
        window.app.scrollbar.addListener(customScrollbarListener);
        if (nodes) {
            for (let i = 0, len = nodes.length; i < len; i++) {
                const to = nodes[i].getBoundingClientRect().top;
                const from = to - window.innerHeight < 0 ? 0 : to - window.innerHeight;

                customScrollRunBounds.push({from, to});
            }
        }
    }

    function customScrollbarListener(status) {
        const offset = status.offset;

        for (let i = 0, len = customScrollRunBounds.length; i < len; i++) {
            if (offset.y > customScrollRunBounds[i].from && offset.y < customScrollRunBounds[i].to) {
                die();
                rq(ev);
                break;
            }
        }
    }

    function onScroll(e) {
        for (let i = 0, len = nodes.length; i < len; i++) {
            const el = nodes[i];

            let r, html;
            if (!el || 1 !== el.nodeType) {
                return false;
            }
            html = document.documentElement;
            r = el.getBoundingClientRect();

            const isVisible = (!!r
                && r.bottom >= 0
                && r.right >= 0
                && r.top <= html.clientHeight
                && r.left <= html.clientWidth
            );

            if (isVisible) {
                die();
                rq(ev);
                break;
            }
        }
    }

    function die() {
        window.removeEventListener('scroll', onScroll, false);
        document.body.removeEventListener(window.app.syntheticEvents.customScrollEnable.name, onCustomScrollEnable);
        if (window.app.scrollbar) window.app.scrollbar.removeListener(customScrollbarListener);
    }
}

function unbindEvent(evName, _nodes, callback) {
    for (let i = 0, len = _nodes.length; i < len; i++) {
        _nodes[i].removeEventListener(evName, callback, false);
    }
}

function bindEvent(evName, _nodes, callback) {
    if (_nodes) {
        for (let i = 0, len = _nodes.length; i < len; i++) {
            _nodes[i].addEventListener(evName, callback, false);
        }
    }
}

function setupVhCssProperty() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function removePreloadClass() {
    setTimeout(function () {
        document.getElementsByClassName('u-preload')[0].classList.remove('u-preload');
    }, 18);
}

function isTouchDevice() {

    const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');

    const mq = function (query) {
        return window.matchMedia(query).matches;
    };

    if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}

function normalizeHeight() {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.js-calc-height').forEach((node) => {
        node.style.height = '';
        window.requestAnimationFrame(() => {
            node.style.height = node.getBoundingClientRect().height + 'px';
        });
    });
}
