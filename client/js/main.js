'use strict'

$(document).ready(init);

function init() {
    sticky()
}


function sticky() {
    $(".sticky").sticky({
        topSpacing: 60
    })
}
