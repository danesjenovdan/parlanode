// function iframeResizePipe() {
//     // What's the page height?
//     var height = document.body.scrollHeight;
//     // Going to 'pipe' the data to the parent through the helpframe..
//     var pipe = document.getElementById('helpframe');
//     // Cachebuster a precaution here to stop browser caching interfering
//     pipe.src = 'http://localhost:9001/helper?height=' + height + '&cacheb=' + Math.random();
// }

// var progressbarTooltip = {
//     init: function (classname) {

//         var $majorparent = $('.' + classname);

//         $majorparent.append('<div class="progressbar-tooltip tooltip-' + classname + '"></div>');

//         $majorparent.find('.avgminimg')
//             .on('mouseover', function (e) {

//                 $('.tooltip-' + classname)
//                     .css('opacity', 0.9)
//                     .html($(this).data('name'))
//                     .css("left", (e.pageX - ($('.tooltip-' + classname).width() / 2) - $majorparent.offset().left))
//                     .css("top", (e.pageY - 30 - $majorparent.offset().top));

//             })
//             .on('mouseout', function (e) {
//                 $('.tooltip-' + classname)
//                     .css('opacity', 0);
//             });
//     }
// }