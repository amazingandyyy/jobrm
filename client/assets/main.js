'use strict'

$(document).ready(init);

function init() {
    console.log('jquery loaded');
    // sticky();
    adjustWidth();
}

//
// function sticky() {
//     $(".sticky").sticky({
//         topSpacing: 60
//     })
// }
function adjustWidth() {
    $(window).on('resize', function() {
        console.log('window width: ', $(window).width());
        // var width = $(window).width()-280;
        console.log('width: ', width);
        // $('.map_section').width(width)
    });
}
