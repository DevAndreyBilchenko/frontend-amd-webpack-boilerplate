let UpdateStack = function (name) {

    return {
        name,
        time: Date.now()
    }
};

let update_stack = [];

update_stack.__proto__.getCountByName = function (name) {
    let counter = 0;

    this.forEach(function (stack_item) {
        if (stack_item.name === name) {
            counter++;
        }
    });

    return counter;
};

update_stack.__proto__.watch = function (clear_time) {
    let self = this;

    setInterval(function () {
        let now = Date.now();

        self.forEach(function (stack_item, count) {
            if (now - stack_item.time > clear_time) {
                self.splice(count, 1);
            }
        });
    }, clear_time / 2);
};

module.exports = {
    UpdateStack: UpdateStack,
    update_stack_arr: update_stack
};