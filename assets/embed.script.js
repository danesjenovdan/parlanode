console.log('embed');

if (!window.parlaCardInit) {

    window.parlaCardInit = true;

    function loadScript(url, callback) {

        // check for duplicates
        var list = document.getElementsByTagName('script');
        var i = list.length,
            flag = false;
        while (i--) {
            if (list[i].src == url) {
                flag = true;
            }
        }
        if (!flag) {
            console.log('loading: ' + url);
            var tag = document.createElement('script');
            tag.type = "text/javascript";

            if (tag.readyState) { //IE
                tag.onreadystatechange = function() {
                    if (tag.readyState == "loaded" || tag.readyState == "complete") {
                        tag.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                tag.onload = function() {
                    callback();
                };
            }

            tag.src = url;
            document.getElementsByTagName("head")[0].appendChild(tag);
        }

    }

    if (window.jQuery) {
        loadScript('https://cdn.parlameter.si/v1/parlassets/js/perfect-scrollbar.js', function() {
            loadScript('https://cdn.parlameter.si/v1/parlassets/js/perfect-scrollbar.jquery.js', function() {
                loadScript('https://d3js.org/d3.v3.min.js', function() {
                    loadScript('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js', function() {
                        loadScript('https://cdn.parlameter.si/v1/parlassets/js/script.js', function() {
                            init();
                        });
                    });
                });
            });
        });
    } else {
        loadScript("https://code.jquery.com/jquery-1.11.3.js", function() {
            loadScript('https://cdn.parlameter.si/v1/parlassets/js/perfect-scrollbar.js', function() {
                loadScript('https://cdn.parlameter.si/v1/parlassets/js/perfect-scrollbar.jquery.js', function() {
                    loadScript('https://d3js.org/d3.v3.min.js', function() {
                        loadScript('https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js', function() {
                            loadScript('https://cdn.parlameter.si/v1/parlassets/js/script.js', function() {
                                init();
                            });
                        });
                    });
                });
            });
        });
    }

    function init() {

        var $cards = $('.parlameter-card');

        for (var i = 0; i < $cards.length; i++) {

            var card = new Card($cards[i]);

        }


    }

    var Card = function(element) {

        this.mUrl = $(element).attr('data-src');
        this.mElement = $(element);

        this.fetchCard();

    };

    Card.prototype.fetchCard = function() {

        var self = this;

        $.get(this.mUrl)
            .success(function(response) {

                self.mElement.append(response);

            });

    };

}
