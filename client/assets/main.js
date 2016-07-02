
'use strict'

$(document).ready(init);

function init() {
    console.log('jquery loaded');
    $('.startBtn').click(function(){
        $('html, body').animate({
            scrollTop: $( $(this).attr('href') ).offset().top
        }, 500);
        return false;
    });
}
