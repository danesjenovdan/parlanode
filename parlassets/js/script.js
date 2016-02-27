$(function () {
    $(".session_transcript .status").click(function () {
        $(this).parent().toggleClass("collapsed");
        return false;
    });
});

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

$(function () {
    votingCardHorizontal.init();
});


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
        $(".scroller").perfectScrollbar(defaultOptions);
    }
}

$(function () {
    //votingCardTpl.init();
    ParlaScroll.init();
});

$(function () {
    //lastActivity.init();
});
