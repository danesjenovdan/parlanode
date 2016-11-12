function iframeResizePipe()
{
    // What's the page height?
    var height = document.body.scrollHeight;
    // Going to 'pipe' the data to the parent through the helpframe..
    var pipe = document.getElementById('helpframe');
    // Cachebuster a precaution here to stop browser caching interfering
    pipe.src = 'http://localhost:9001/helper?height='+height+'&cacheb='+Math.random();
}

var votingCardHorizontal = {
    sliderLeftClass: '.navigate-left',
    slideRightClass: '.navigate-right',
    cardId: '#votingCardHorizontal',
    slideHolder: '.slider',
    slideContent: '.slider-content',
    numOfSlides: 0,
    slideWidth: 0,
    slideWidthBig: 810,
    slideWidthSmall: 316,
    currentSlide: 1,
    isLastSlide: false,
    slidePerPage: 6,
    isScrollable: false,

    init: function () {
        if($(this.cardId).length < 1){
            return false;
        }
        this.initSlider();
    },

    initSlider: function () {
        var currentWidth = $(this.slideHolder).innerWidth();
        this.setCard($(window).width());
        this.initEvents();
    },

    setCard: function (width) {
        var numOfItems = $(this.slideContent).find("div.member").length;
        var scrollContainer = document.getElementById("scrollbar-voting-card-horizontal");

        // For mobile cards im checking if the arrows are visible
        if (width < 501) {
            var numOfItems = $(this.slideContent).find("div.member").length;
            $(this.slideContent).width(numOfItems * 158);
            this.isScrollable = true;

            this.initalizeScrollbar();
        } else {
            if (this.isScrollable) {
                this.isScrollable = false;

                scrollContainer.scrollLeft = 0;

                Ps.update(scrollContainer);

                Ps.destroy(scrollContainer);
            }
        }

        // For ful size card
        if (width > 991) {
            this.slideWidth = this.slideWidthBig;
            this.slidePerPage = 6;
            this.currentSlide = 1;
            $(this.slideContent).width(numOfItems * 164);

            this.numOfSlides = Math.ceil(numOfItems / this.slidePerPage);
        }

        // For half size card
        if (width < 991 && width > 500) {
            this.slideWidth = this.slideWidthSmall;
            this.slidePerPage = 2;
            this.currentSlide = 1;

            this.numOfSlides = Math.ceil(numOfItems / this.slidePerPage);
        }

        this.currentSlide = 1;
        $(this.slideContent).css({
            left: 0
        });
    },

    initEvents: function () {
        var _this = this;

        $(this.cardId + ' .navigate-left').on('click', function () {
            _this.changeSlide("prev");
        });
        $(this.cardId + ' .navigate-right').on('click', function () {
            _this.changeSlide("next");
        });

        $(window).resize(function () {
            var ww = $(window).width();

            _this.setCard(ww);
        });
    },

    changeSlide: function (toPosition) {
        var _this = this;
        var _animateTo = (toPosition == 'prev') ? '+' : '-'

        if (toPosition == 'prev' && this.currentSlide - 1 == 0) return false;
        if (toPosition == 'next' && this.currentSlide + 1 > this.numOfSlides) return false;

        $(this.slideContent).animate({
            left: _animateTo + "=" + _this.slideWidth,
        }, {
            duration: 400,
            complete: function () {
                _this.currentSlide = (toPosition == 'next') ? _this.currentSlide + 1 : _this.currentSlide - 1;
            }
        });
    },

    initalizeScrollbar: function (id, options) {
        var id = (typeof (id) != 'undefined') ? id : 'scrollbar-voting-card-horizontal';

        var defaultOptions = {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 100,
            maxScrollbarLength: 100
        };

        var options = (typeof (options) != 'undefined') ? options : defaultOptions;

        var container = document.getElementById(id);
        Ps.initialize(container, options);

        //$(".scroller").perfectScrollbar(options);

    }


}



var votingCardTpl = {

    init: function () {
        // TODO: If more than 6 results than fix span class margin-right  - because of the scroller
        this.initalizeScrollbar();
    },

    initalizeScrollbar: function (id, options) {
        var id = (typeof (id) != 'undefined') ? id : 'scrollbar-votingCard';

        var defaultOptions = {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 100,
            maxScrollbarLength: 100
        };

        var options = (typeof (options) != 'undefined') ? options : defaultOptions;

        //var container = document.getElementById(id);
        //Ps.initialize(container, options);

        $(".scroller").perfectScrollbar(options);

    }
}


var lastActivity = {

    init: function () {

        this.initalizeScrollbar();

    },



    initalizeScrollbar: function (id, options) {
        var id = (typeof (id) != 'undefined') ? id : 'scrollbar-recent-activity';

        var defaultOptions = {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 100,
            maxScrollbarLength: 100
        };

        var options = (typeof (options) != 'undefined') ? options : defaultOptions;

        //var container = document.getElementById(id);
        //Ps.initialize(container, options);

        $(".scroller").perfectScrollbar(options);

    }


}


var ParlaScroll = {
    init: function () {
        this.initalizeScrollbar();
    },
    initalizeScrollbar: function () {
        var defaultOptions = {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 100,
            maxScrollbarLength: 100
        };
        $(".scroller").each(function () {
            $("#"+$(this).attr('id')).perfectScrollbar(defaultOptions);
        });
        //$(".scroller").perfectScrollbar(defaultOptions);
    }
}

var cardInfo =  {

    card: "",
    cardContent: "",
    parent: "",
    overlay: "",
    helpertype: "",
    openclose: 0,
    button: 0,

    init: function () {
        this.getCardInfo();

        //this.overlay = $("#cardInfoBox");

    },
    getCardInfo: function(){

        var _this = this;

        $(".card-circle-button").click(function () {

            _this.button = $(this);

            if(_this.openclose){
                _this.closeOverlysBox();
                return false;
            }


            var base = $(this);

            if(base.hasClass("card-share")){
                _this.helpertype = "share";
                _this.overlay = $("#cardShareBox").clone();
            }

            if(base.hasClass("card-embed")){
                _this.helpertype = "embed";
                _this.overlay = $("#cardEmbedBox").clone();
            }

            if(base.hasClass("card-info")){
                _this.helpertype = "info";
                _this.overlay = $("#cardInfoBox").clone();
            }

            _this.card = base.parents(".card-container");

            _this.displayOverlysBox();

        });

    },
    displayOverlysBox: function(){



        this.cardContent = this.card.find(".card-content");

        console.log(this.card);

        this.cardContent.hide();

        this.overlay.height(this.cardContent.height());
        this.overlay.show();


        this.overlay.insertAfter(this.cardContent);

        console.log(this.overlay);


        this.openclose = 1;
        _this.button.addClass("card-circle-closed");

    },
    closeOverlysBox: function(){


        this.cardContent.show();
        this.overlay.hide();
        this.overlay.remove();

        this.openclose = 0;
        _this.button.removeClass("card-circle-closed");
    }
}

$(function () {
    ParlaScroll.init();
    // cardInfo.init();

    votingCardHorizontal.init();

    if($(".session_transcript .status").length > 0) {
        $(".session_transcript .status").click(function () {
            $(this).parent().toggleClass("collapsed");
            return false;
        });
    }

    //votingCardTpl.init();
    //lastActivity.init();
});


function DNDrepeatEmbedCall() {
    ParlaScroll.init();
    votingCardHorizontal.init();

    if($(".session_transcript .status").length > 0) {
        $(".session_transcript .status").click(function () {
            $(this).parent().toggleClass("collapsed");
            return false;
        });
    }
}

var progressbarTooltip = {
    init: function() {

        var majorparent = $('.avgminimg').parents('.card-container')[0];

        $(majorparent).append('<div class="progressbar-tooltip"></div>');

        $('.avgminimg')
            .on('mouseover', function(e) {

                $('.progressbar-tooltip')
                    .css('opacity', 0.9)
                    .html($(this).data('name'))
                    .css("left", (e.pageX - ($('.progressbar-tooltip').width() / 2) - $(majorparent).offset().left))
                    .css("top", (e.pageY - 30 - $(majorparent).offset().top));

            })
            .on('mouseout', function(e) {
                $('.progressbar-tooltip')
                    .css('opacity', 0);
            });
    }
}


// card flipping
function makeEmbedSwitch() {
    // $('.embed-switch-box').on('click', function() {
    //     $(this).toggleClass('off');
    // });

    $('.embed-switch-big-box').on('click', function() {

        var thechild = $(this).parent().next().next().children('textarea');
        var todaysdate = new Date;
        var today = '' + todaysdate.getDay() + '.' + todaysdate.getMonth() + '.' + todaysdate.getFullYear();

        if ($(this).children('.embed-switch-box').hasClass('off')) {
            console.log(thechild.data('url')  + thechild.data('id'));
            // thechild.val('<div class="parlameter-card" data-src="' + thechild.data('url')  + thechild.data('id') + '/"></div>\n<script defer src="https://cdn.parlameter.si/v1/lib/js/embed.script.js"></script>');
            thechild.val('<iframe frameborder="0" width="620" height="400" src="' + thechild.data('url') + thechild.data('id') + '/?embed=true&width=600">')
        } else {
            // thechild.val('<div class="parlameter-card" data-src="' + thechild.data('url')  + thechild.data('id') + '/' + today + '/"></div>\n<script defer src="https://cdn.parlameter.si/v1/lib/js/embed.script.js"></script>');
            thechild.val('<iframe frameborder="0" width="620" height="400" src="' + thechild.data('url') + thechild.data('id') + '/' + today + '/?embed=true&width=600">')
            console.log(thechild.data('url')  + thechild.data('id') + today);
        }

        $(this).children('.embed-switch-box').toggleClass('off');
    });
}

function addCardFlip() {

    $('.back .card-content').height($('.front .card-content').height());
    $('.back').css({
        'width': $('.front').width(),
        // 'top': -$('.front').height()
    });

    $('.front .card-circle-button').on('click', function() {
        $('.back-info, .back-share, .back-embed').not('.back-' + $(this).data('back')).addClass('hidden');
        $('.back-' + $(this).data('back')).removeClass('hidden');
        $(this).parents('.card-container').toggleClass('flipped');
    });

    $('.back .card-circle-button').on('click', function() {
        $(this).parents('.card-container')
            .toggleClass('flipped');

        var _this = this;
        window.setTimeout(function() {
            $('.back-info, .back-share, .back-embed').not('.back-' + $(_this).data('back')).addClass('hidden');
            $('.back-' + $(_this).data('back')).removeClass('hidden');
            if (!$(_this).hasClass('card-exit')) {
                $(_this).parents('.card-container').toggleClass('flipped');
            }
        }, 600);
    });

    $('.share-content').css({
        'padding-top': ($('.share-content').parent().height() - $('.share-content').height()) / 2
    });
}

function copyToClipboard(elem) {
    // create hidden text element, if it doesn't already exist
    var targetId = "_hiddenCopyText_";
    var isInput = elem.tagName === "INPUT" || elem.tagName === "TEXTAREA";
    var origSelectionStart, origSelectionEnd;
    if (isInput) {
        // can just use the original source element for the selection and copy
        target = elem;
        origSelectionStart = elem.selectionStart;
        origSelectionEnd = elem.selectionEnd;
    } else {
        // must use a temporary form element for the selection and copy
        target = document.getElementById(targetId);
        if (!target) {
            var target = document.createElement("textarea");
            target.style.position = "absolute";
            target.style.left = "-9999px";
            target.style.top = "0";
            target.id = targetId;
            document.body.appendChild(target);
        }
        target.textContent = elem.textContent;
    }
    // select the content
    var currentFocus = document.activeElement;
    target.focus();
    target.setSelectionRange(0, target.value.length);

    // copy the selection
    var succeed;
    try {
        succeed = document.execCommand("copy");
    } catch(e) {
        succeed = false;
    }
    // restore original focus
    if (currentFocus && typeof currentFocus.focus === "function") {
        currentFocus.focus();
    }

    if (isInput) {
        // restore prior selection
        elem.setSelectionRange(origSelectionStart, origSelectionEnd);
    } else {
        // clear temporary content
        target.textContent = "";
    }
    return succeed;
}

function activateCopyButton() {
    $('.btn-copy-embed').on('click', function() {
        copyToClipboard($(this).prev()[0]);
    });
}

activateCopyButton();