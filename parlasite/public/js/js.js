function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function equalHeight($elementByClass) {

    var h = 0;
    $($elementByClass).each(function () {
        if ($(this).height() > h) {
            h = $(this).height();
        }
    });
    $($elementByClass).height(h);

}

function toggleHeaderSearch(focus) {
    $(".searchiconbuttton").toggle();

    if (focus) {

        if ($(window).width() < 992) {
            $("#topheadersearch").css({"width": "100%"});
            $("header.header .twitter-typeahead").css({"width": "90%"});
        }

        $(".header-searchhide").show();
        $(".search-input-header").focus();
    } else {
        $(".header-searchhide").toggle();
        if ($(window).width() < 992) {
            $("#topheadersearch").css({"width": "auto"});
            $("header.header .twitter-typeahead").css({"width": "auto"});
        }
    }

    if ($(window).width() < 992) {
        $(".header.header .logo").toggle();
    }
}

$(function () {
    $(".searchiconbuttton").click(function () {
        toggleHeaderSearch(true);
        return false;
    });

    $(".search-input-header-append.xclose").click(function () {
        toggleHeaderSearch(false);
        return false;
    });

    $(".search-input-header").blur(function () {
        // toggleHeaderSearch(false);
        return false;
    });

    var mps_search_token = new Bloodhound({
        'datumTokenizer': Bloodhound.tokenizers.obj.whitespace('name'),
        'queryTokenizer': Bloodhound.tokenizers.whitespace,
        'local': mps_data
        // remote: {
        //     url: "/search/autocomplete/",
        //     replace: function(url, query) {
        //         return url + "?q=" + query;
        //     },
        //     filter: function(stocks) {
        //         return $.map(stocks, function(data) {
        //             return {
        //                 tokens: data.tokens,
        //                 symbol: data.symbol,
        //                 name: data.name
        //             }
        //         });
        //     }
        // }
    });

    var search_ops_data = ops_data;

    var i = 0;
    search_ops_data.forEach(function(e) {
        if (e.acronym.indexOf('NeP') != -1) {
            search_ops_data.splice(i, 1);
        }
        i = i + 1;
    });

    var ops_search_token = new Bloodhound({
        'datumTokenizer': Bloodhound.tokenizers.obj.whitespace('acronym', 'name'),
        'queryTokenizer': Bloodhound.tokenizers.whitespace,
        'local': search_ops_data
    });

    var sessionsearch_token = new Bloodhound({
        'datumTokenizer': Bloodhound.tokenizers.obj.whitespace('acronym', 'name'),
        'queryTokenizer': Bloodhound.tokenizers.whitespace,
        'local': sps_data
    });

    function updateHeaderSearch() {
        poeplesearchtypeahead = $('.search-input-header').typeahead({
            'hint': false,
            'highlight': true
        }, {
            // 'limit': 3,
            'name': 'poslanci',
            'display': 'name',
            'source': mps_search_token,
            'templates': {
                'empty': '<div class="searchheader results">POSLANKE IN POSLANCI</div><div class="searchperson-container">Med poslanci ni zadetkov</div>',
                'suggestion': function (datum) {
                    return '<div class="searchperson-container"><div class="avgminimg img-circle" style="width: 40px; height: 40px; background-image: url(\'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + datum.gov_id + '.png\'); background-size: cover; float: left; left: -5px;"></div>' + datum.name + '</div>'
                },
                'header': '<div class="searchheader">POSLANKE IN POSLANCI</div>'
            }
        }, {
            // 'limit': 3,
            'name': 'skupine',
            'display': 'acronym',
            'source': ops_search_token,
            'templates': {
                'empty': '<div class="searchheader results">POSLANKE IN POSLANCI</div><div class="searchperson-container">Med PS ni zadetkov</div>',
                'suggestion': function (datum) {
                    return '<div class="searchperson-container"><div class="avgminimg avgminimg-party img-circle ' + datum.acronym.replace(/ /g, '_').toLowerCase() + '-background" style="width: 40px; height: 40px; float: left; left: -5px;"></div>' + datum.acronym + '</div>'
                },
                'header': '<div class="searchheader results">POSLANSKE SKUPINE</div>'
            }
        }, {
            // 'limit': 3,
            'name': 'seje',
            'display': 'acronym',
            'source': sessionsearch_token,
            'templates': {
                'empty': function (val) {
                    return '<div class="session-ac-search" data-query="' + val.query + '"><font><span class="glyphicon glyphicon-search"></span> Išči po sejah: ' + val.query + '</font></div>';
                },

                'suggestion': function (val) {
                    return '<div class="session-ac-search" data-query="' + val.query + '"><font><span class="glyphicon glyphicon-search"></span> Išči po sejah: ' + val.query + '</font></div>';
                },
                'header': ''
            }
        });

        $('.search-input-header').bind('typeahead:select', function (e, value) {

            if (typeof value.acronym !== 'undefined') {
                measure("search","header","ps",value.name);
                window.location.href = value.url;
            } else {
                measure("search","header","p",value.name);
                window.location.href = value.url;
            }
            $('.search-input-header').typeahead('close').typeahead('val', '');
            // $(".header-searchhide").css({
            //     "width": "100%",
            //     "height": "30px"
            // }).show().html('<div class="nalagalnik"></div>');
        });

        $(".tt-dataset.tt-dataset-seje").on("click", "div", function () {
            measure("search","header","s",$(this).data('query'));
            window.location.href = "/seje/isci?q=" + $(this).data('query');
            return false;
        });
    }

    updateHeaderSearch();


    function session_search_results() {

        if ($("#session_search_results").length < 1) {
            return false;
        }

        function getQueryParameters(str) {
            return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
                return n = n.split("="), this[n[0]] = n[1], this
            }.bind({}))[0];
        }

        function encodeQueryData(data) {
            var ret = [];
            for (var d in data)
                //ret.push(encodeURIComponent(d) + '/' + encodeURIComponent(data[d]));
                ret.push((d) + '/' + encodeURIComponent(data[d]));
            return ret.join('&');
        }

        //var queries = ["raba-skozi-cas", "raba-po-strankah", "najveckrat-so-pojem-uporabili", "nastopi-v-katerih-je-bil-iskalni-niz-izrecen"]

        var queryParams = getQueryParameters();
        var querystring = encodeQueryData(queryParams);
        var querystringVoting = encodeQueryData(queryParams).split('q/')[1];

        $("#session_search_results .getmedata").each(function (e, urlid) {
            var urlid = $(this).attr('id');
            var url = ("https://glej.parlameter.si/s/" + urlid + "/?customUrl=" + encodeURIComponent("https://isci.parlameter.si/" + (querystring)));
            $("#" + urlid).html('<div class="card-container card-halfling"><div class="card-header"><div class="card-header-border"></div><h1>Nalagamo kartico ...</h1></div><div class="card-content half"><div class="card-content-front"><div class="nalagalnik"></div></div></div><div class="card-footer"><div class="card-logo hidden"><a href="https://skoraj.parlameter.si/"><img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo"></a></div><div class="card-circle-button card-share" data-back="share"></div><div class="card-circle-button card-embed" data-back="embed"></div><div class="card-circle-button card-info" data-back="info">i</div></div></div>');

            var jqxhr = $.ajax(url)
                .done(function (data) {

                    $("#" + urlid).html(data);
                    DNDrepeatEmbedCall();
                })
                .fail(function () {
                    $("#" + urlid).html(urlid + " error");
                })
                .always(function () {
                });
        });

        $("#session_search_results .getmedata-voting").each(function (e, urlid) {
            var urlid = $(this).attr('id');
            console.log("https://isci.parlameter.si/v/" + (querystringVoting));
            var url = ("https://glej.parlameter.si/s/" + urlid + "/?customUrl=" + encodeURIComponent("https://isci.parlameter.si/v/" + (querystringVoting)));
            $("#" + urlid).html('<div class="card-container card-halfling"><div class="card-header"><div class="card-header-border"></div><h1>Nalagamo kartico ...</h1></div><div class="card-content half"><div class="card-content-front"><div class="nalagalnik"></div></div></div><div class="card-footer"><div class="card-logo hidden"><a href="https://skoraj.parlameter.si/"><img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo"></a></div><div class="card-circle-button card-share" data-back="share"></div><div class="card-circle-button card-embed" data-back="embed"></div><div class="card-circle-button card-info" data-back="info">i</div></div></div>');

            var jqxhr = $.ajax(url)
                .done(function (data) {

                    $("#" + urlid).html(data);
                    DNDrepeatEmbedCall();
                })
                .fail(function () {
                    $("#" + urlid).html(urlid + " error");
                })
                .always(function () {
                });
        });
    }

    session_search_results();

    function session_search_results_with_filters() {

        console.log('ping');

        if ($("#session_search_results_filter").length < 1) {
            return false;
        }

        function getQueryParameters(str) {
            return (str || document.location.search).replace(/(^\?)/, '').split("&").map(function (n) {
                return n = n.split("="), this[n[0]] = n[1], this
            }.bind({}))[0];
        }

        function encodeQueryData(data) {
            var ret = [];
            for (var d in data)
                //ret.push(encodeURIComponent(d) + '/' + encodeURIComponent(data[d]));
                ret.push((d) + '/' + encodeURIComponent(data[d]));
            return ret.join('&');
        }

        //var queries = ["raba-skozi-cas", "raba-po-strankah", "najveckrat-so-pojem-uporabili", "nastopi-v-katerih-je-bil-iskalni-niz-izrecen"]

        var queryParams = getQueryParameters();
        console.log(queryParams);
        var querystring = encodeQueryData(queryParams);
        console.log(querystring);
        var querystringVoting = encodeQueryData(queryParams).split('q/')[1];
        console.log(querystringVoting);

        $("#session_search_results_filter .getmedata").each(function (e, urlid) {
            var urlid = $(this).attr('id');
            var searchurl = "https://isci.parlameter.si/filter/" + (querystringVoting.split('&')[0]) + '?';
            if (queryParams.people) {
                searchurl = searchurl + 'people=' + queryParams.people
            }
            if (queryParams.parties) {
                if (!searchurl.endsWith('?')) {
                    searchurl = searchurl + '&parties=' + queryParams.parties
                } else {
                    searchurl = searchurl + 'parties=' + queryParams.parties
                }
            }
            if (queryParams.time_filter) {
                if (!searchurl.endsWith('?')) {
                    searchurl = searchurl + '&time_filter=' + queryParams.time_filter
                } else {
                    searchurl = searchurl + 'time_filter=' + queryParams.time_filter
                }
            }
            if (queryParams.wb) {
                if (!searchurl.endsWith('?')) {
                    searchurl = searchurl + '&wb=' + queryParams.wb
                } else {
                    searchurl = searchurl + 'wb=' + queryParams.wb
                }
            }
            if (queryParams.dz) {
                if (!searchurl.endsWith('?')) {
                    searchurl = searchurl + '&dz=' + queryParams.dz
                } else {
                    searchurl = searchurl + 'dz=' + queryParams.dz
                }
            }
            if (queryParams.council) {
                if (!searchurl.endsWith('?')) {
                    searchurl = searchurl + '&council=' + queryParams.council
                } else {
                    searchurl = searchurl + 'council=' + queryParams.council
                }
            }
            var url = ("https://glej.parlameter.si/s/" + urlid + "/?customUrl=" + encodeURIComponent(searchurl));
            console.log(searchurl);
            $("#" + urlid).html('<div class="card-container card-halfling"><div class="card-header"><div class="card-header-border"></div><h1>Nalagamo kartico ...</h1></div><div class="card-content half"><div class="card-content-front"><div class="nalagalnik"></div></div></div><div class="card-footer"><div class="card-logo hidden"><a href="https://skoraj.parlameter.si/"><img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo"></a></div><div class="card-circle-button card-share" data-back="share"></div><div class="card-circle-button card-embed" data-back="embed"></div><div class="card-circle-button card-info" data-back="info">i</div></div></div>');

            var jqxhr = $.ajax(url)
                .done(function (data) {

                    $("#" + urlid).html(data);
                    DNDrepeatEmbedCall();
                })
                .fail(function () {
                    $("#" + urlid).html(urlid + " error");
                })
                .always(function () {
                });
        });

        $("#session_search_results_filter .getmedata-voting").each(function (e, urlid) {
            var urlid = $(this).attr('id');
            console.log("https://isci.parlameter.si/v/" + (querystringVoting.split('&')[0]));
            var url = ("https://glej.parlameter.si/s/" + urlid + "/?customUrl=" + encodeURIComponent("https://isci.parlameter.si/v/" + (querystringVoting)));
            $("#" + urlid).html('<div class="card-container card-halfling"><div class="card-header"><div class="card-header-border"></div><h1>Nalagamo kartico ...</h1></div><div class="card-content half"><div class="card-content-front"><div class="nalagalnik"></div></div></div><div class="card-footer"><div class="card-logo hidden"><a href="https://skoraj.parlameter.si/"><img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo"></a></div><div class="card-circle-button card-share" data-back="share"></div><div class="card-circle-button card-embed" data-back="embed"></div><div class="card-circle-button card-info" data-back="info">i</div></div></div>');

            var jqxhr = $.ajax(url)
                .done(function (data) {

                    $("#" + urlid).html(data);
                    DNDrepeatEmbedCall();
                })
                .fail(function () {
                    $("#" + urlid).html(urlid + " error");
                })
                .always(function () {
                });
        });
    }

    session_search_results_with_filters();


    $(".newslettersubscribeButton").click(function () {
        $(".newslettersubscribe").removeClass('error');
        if (validateEmail($(".newslettersubscribe").val())) {


        var url = 'https://prispevaj.parlameter.si/parlamail/email/';
        var jqxhr = $.ajax({
            method: "POST",
            url: url,
            data: {email: $(".newslettersubscribe").val()}
        })
            .done(function (data) {

                if(data.result =='ALR_in_DB'){
                    $(".newslettersubscribemsg").html('').addClass("success").html("Mail je že v bazi.");
                }else if(data.result =='saved'){
                    $(".newslettersubscribemsg").html('').addClass("success").html("HVALA!");
                }
            })
            .fail(function () {
                //alert('not yet configured');
            })
            .always(function () {
            });
        } else {
            $(".newslettersubscribe").addClass('error');
        }
    });


    $('.modal [data-dismiss="modal"]').on('click', function() {
        var target = $(this).data("next-target");
        if (target) {
            $(this).closest('.modal').data("next-target", target);
        }
    });
    $('.modal').on('hidden.bs.modal', function (e) {
        var target = $(this).data("next-target");
        $(this).data("next-target", "");
        if (target) {
            if(target == '#modal-doniraj-amount'){
                getppdata();
            }
            $(target).modal('show');
        }
    });

    $("#modal-doniraj-email #business-donation-btn").click(function () {
        var btn = $(this);
        $("#business-donation-email").removeClass('error');
        if (validateEmail($("#business-donation-email").val())) {

            var url = 'https://prispevaj.parlameter.si/bussines/';
            var jqxhr = $.ajax({
                method: "POST",
                url: url,
                data: {email: $("#business-donation-email").val(), message: $("#business-donation-message").val()}
            })
                .done(function (data) {
                    $(".business-donation").html('').addClass("success").html(data.result);
                    btn.hide();
                })
                .fail(function () {

                })
                .always(function () {
                });
        } else {
            $("#business-donation-email").addClass('error');
        }
    });


    $("#modal-doniraj-address #address-donation-btn").click(function () {

        $("#modal-doniraj-address .required").removeClass('error');
        $("#modal-doniraj-address .required").each(function () {
            if($(this).val() == ''){
                $(this).addClass("error");
            }
        });
        if($("#modal-doniraj-address .required.error").length > 0){
            return false;
        }

        var btn = $(this);

        var url = 'https://prispevaj.parlameter.si/donateUPN/';
        var jqxhr = $.ajax({
            method: "POST",
            url: url,
            data: {
                email: $("#address-donation-email").val(),
                name: $("#address-donation-name").val(),
                surname: $("#address-donation-surname").val(),
                address: $("#address-donation-address").val(),
                money: $("#donation-amount").val()
            }
        })
            .done(function (data) {
                $(".address-donation").html('').addClass("success").html(data.result);
                $(".card-error").hide();
                btn.hide();

                // $("#modal-doniraj-address").modal('hide');
                // $("#modal-doniraj-hvala-donacija").modal('show');
            })
            .fail(function () {

            })
            .always(function () {
            });
    });


    function getppdata() {
        var token;
        $("#paypal-container").html('');
        var jqxhr = $.ajax("https://prispevaj.parlameter.si/getBrainToken/")
            .done(function (data) {
                token = data.token;
                //PAYPAL
                braintree.setup(token, "custom", {
                    paypal: {
                        container: "paypal-container",
                    },
                    onPaymentMethodReceived: function (response) {

                        console.log(response);

                        $.ajax({
                            method: "POST",
                            url: "https://prispevaj.parlameter.si/cardPayPalResponse/",
                            data: {
                                nonce: response['nonce'],
                                email: response.details.email,
                                money: $("#donation-amount").val(),
                                purpose: "Donacija parlameter"
                            }
                        }).done(function (resp) {
                            console.log(resp);
                            if (resp.status == "OK") {
                                $("#modal-doniraj-card").modal('hide');
                                $("#modal-doniraj-hvala-donacija").modal('show');
                            }else {
                                alert(resp.status);
                            }
                        });
                    }
                });

            })
            .fail(function () {
                $("#" + urlid).html(urlid + " error");
            })
            .always(function () {
            });
    }


    $("#modal-doniraj-card #modal-doniraj-amount-card").click(function () {

        $(".card-error").hide();
        $("#modal-doniraj-card .required").removeClass('error');
        $("#modal-doniraj-card .required").each(function () {
            if($(this).val() == ''){
                $(this).addClass("error");
            }
        });
        if($("#modal-doniraj-card .required.error").length > 0){
            return false;
        }

        var token;
        var jqxhr = $.ajax("https://prispevaj.parlameter.si/getBrainToken/")
            .done(function (data) {
                token = data.token;

//CARD
                var client = new braintree.api.Client({
                    clientToken: token
                });

                client.verify3DS({
                    amount: $("#donation-amount").val(),
                    creditCard: {
                        number: $("#card-donation-card-number").val(),
                        expirationDate: $("#card-donation-surname").val(),
                        cvv: $("#card-donation-address").val(),
                    }
                }, function (err, response) {

                    if (err) {
                        $(".card-error").show();
                        console.log(err);
                    }
                    else {
                        $(".card-error").hide();
                        console.log(response);
                        console.log(response['nonce']);

                        //Normal
                        if ($("#donation-monthly").is(':checked')) {
                            $.ajax({
                                method: "POST",
                                url: "https://prispevaj.parlameter.si/cardResponse/",
                                data: {
                                    nonce: response['nonce'],
                                    email: $("#card-donation-email").val(),
                                    money: $("#donation-amount").val(),
                                    purpose: "Donacija parlameter"
                                }
                            }).done(function (resp) {
                                console.log(resp);
                                if (resp.status == "OK") {


                                    //data-dismiss="modal" data-next-target="#modal-doniraj-hvala-donacija"

                                    $("#modal-doniraj-card").modal('hide');
                                    $("#modal-doniraj-hvala-donacija").modal('show');


                                } else {
                                    alert(resp.status)
                                }
                            });
                        } else {
                            //Recurring

                            $.ajax({
                                method: "POST",
                                url: "https://prispevaj.parlameter.si/responseRecurring/",
                                data: {
                                    nonce: response['nonce'],
                                    email: $("#card-donation-email").val(),
                                    money: $("#donation-amount").val(),
                                    purpose: "Donacija parlameter"
                                }
                            }).done(function (resp) {
                                console.log(resp);
                                if (resp.status == "OK") {

                                    //data-dismiss="modal" data-next-target="#modal-doniraj-hvala-donacija"

                                    $("#modal-doniraj-card").modal('hide');
                                    $("#modal-doniraj-hvala-donacija").modal('show');


                                } else {
                                    alert(resp.status)
                                }
                            });
                        }
                    }
                });

            });

    });

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
                tag.onreadystatechange = function () {
                    if (tag.readyState == "loaded" || tag.readyState == "complete") {
                        tag.onreadystatechange = null;
                        callback();
                    }
                };
            } else { //Others
                tag.onload = function () {
                    callback();
                };
            }
            tag.src = url;
            document.getElementsByTagName("head")[0].appendChild(tag);
        }
    }

    /*$(".doniraj").click(function () {
        loadScript('https://js.braintreegateway.com/js/braintree-2.30.0.min.js', function () {
            loadScript('https://js.braintreegateway.com/web/3.5.0/js/three-d-secure.min.js', function () {
                loadScript('https://js.braintreegateway.com/web/3.5.0/js/hosted-fields.min.js', function () {
                });
            });
        });
    });*/

    $(".measure").click(function () {

        var b = $(this);
        var c = b.data('mc');
        var a = b.data('ma');
        var n = b.data('mn');
        var v = b.data('mv');

        measure(c,a,n,v);

    });

    $(".card-share").click(function () {
        var n;
        var b = $(this).closest('.card-container');
        if(b.data('id')!=''){
            n = b.data('id');
        }else{
            n = b.find('h1').text();
        }
        measure("card","share-share",n,'');
    });
    $(".card-embed").click(function () {
        var n;
        var b = $(this).closest('.card-container');
        if(b.data('id')!=''){
            n = b.data('id');
        }else{
            n = b.find('h1').text();
        }
        measure("card","share-embed",n,'');
    });
    $(".card-info").click(function () {
        var n;
        var b = $(this).closest('.card-container');
        if(b.data('id')!=''){
            n = b.data('id');
        }else{
            n = b.find('h1').text();
        }
        measure("card","share-info",n,'');
    });

    function mcSearch(){
        if($(".session-search-container").length > 0){
            var bs = '';
            bs = $(".session-search-container .search input").val();
            if(bs!='') {
                measure("search", "query", bs);
            }
        }
    }
    mcSearch();


    function sendDataObvestila() {

/*
        {
            "email": "tom@tomboy.si",
            "keywords": [
                {
                    "keyword": "ivan",
                    "reminder": "day",
                    "mode":"natancno"
                }
        ]
        }
        */

var keyword = $("#obvestilaData input[name=keyword]").val();
var email = $("#obvestilaData input[name=email]").val();

//var reminder = $("#obvestilaData input[name=reminder]").val();
//var mode = $("#obvestilaData input[name=mode]").val();
var reminder = $("#obvestilaData input[name='reminder[]']:checked").val();
var mode = $("#obvestilaData input[name='mode[]']:checked").val();


var data = {
    "email": email,
    "keyword": keyword,
    "reminder": reminder,
    "mode": mode
};

        var text = $(".replaceme").text();
        text = text.replace('#keyword#', keyword);
        text = text.replace('#email#', email);
        $(".replaceme").text(text);

        console.log(data);
        $.ajax({
            method: "POST",
            url: "https://obvestila.parlameter.si/setSettings/",
            data: data,
            //dataType: 'j'
        }).done(function (resp) {
            console.log(resp);
            // if (resp.status == "OK") {
            //
            //
            //     //data-dismiss="modal" data-next-target="#modal-doniraj-hvala-donacija"
            //
            //     $("#modal-doniraj-card").modal('hide');
            //     $("#modal-doniraj-hvala-donacija").modal('show');
            //
            //
            // } else {
            //     alert(resp.status)
            // }
        });

    }


    // $("#obvestila button").click(function(event){
    //
    //     event.preventDefault();
    //     //return false;
    // });
    $("#obvestilasubmit").click(function(){

        sendDataObvestila();
        return false;
    });


    $("#obvestila .action").click(function () {

        var error = false;
        var nextStep = $(this).data('step');
        if(!error){
            $(".step").hide();

            $(".step"+nextStep).show();
        }

    });



});
