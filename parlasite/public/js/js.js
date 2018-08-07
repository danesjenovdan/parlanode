/* eslint-disable */
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function toggleHeaderSearch(focus) {
    $(".searchiconbuttton").toggle();

    if (focus) {

        if ($(window).width() < 992) {
            $("#topheadersearch").css({"width": "100%"});
            $("header.header .twitter-typeahead").css({"width": "90%"});
        } else {
            $("#topheadersearch, #topheadersearch .form-group").css({"width": "100%"});
            $("header.header .twitter-typeahead").css({"width": "calc(100% - 50px)"});
            $('.header-searchhide').css({'width': '100%'});
            $('.header-search').css({
                'height': '100px',
                'margin-top': '-40px',
                'padding-top': '35px'
            });
            $('.tt-input, .tt-menu, .tt-dataset').css({'width': '100%'});
        }

        $(".header-searchhide").show();
        $("#topheadersearch .search-input-header").focus();
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
        return false;
    });

    var mps_search_token = new Bloodhound({
        'datumTokenizer': Bloodhound.tokenizers.obj.whitespace('name'),
        'queryTokenizer': Bloodhound.tokenizers.whitespace,
        'local': mps_data
    });

    var search_ops_data = ops_data;

    var i = 0;
    search_ops_data.forEach(function (e) {
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
            'name': 'poslanci',
            'display': 'name',
            'source': mps_search_token,
            'templates': {
                'empty': '<div class="searchheader results">POSLANKE IN POSLANCI</div><div class="searchperson-container">Med poslanci ni zadetkov</div>',
                'suggestion': function (datum) {
                    return '<div class="searchperson-container"><div class="avgminimg img-circle" style="width: 40px; height: 40px; background-image: url(\'http://cdn.parlameter.si/v1/parlassets/img/people/square/' + datum.gov_id + '.png\'); background-size: cover; float: left; left: -5px;"></div>' + datum.name + '</div>'
                },
                'header': '<div class="searchheader">POSLANKE IN POSLANCI</div>'
            }
        }, {
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
                measure("search", "header", "ps", value.name);
                window.location.href = value.url;
            } else {
                measure("search", "header", "p", value.name);
                window.location.href = value.url;
            }
            $('.search-input-header').typeahead('close').typeahead('val', '');

        });

        $(".tt-dataset.tt-dataset-seje").on("click", "div", function () {
            measure("search", "header", "s", $(this).data('query'));
            window.location.href = "/seje/isci?q=" + $(this).data('query');
            return false;
        });
    }

    updateHeaderSearch();


    $(".newslettersubscribeButton").click(function () {
        $(".newslettersubscribe").removeClass('error');
        if (validateEmail($(".newslettersubscribe").val())) {


            var url = 'http://prispevaj.parlameter.si/parlamail/email/';
            var jqxhr = $.ajax({
                method: "POST",
                url: url,
                data: {email: $(".newslettersubscribe").val()}
            })
                .done(function (data) {

                    if (data.result == 'ALR_in_DB') {
                        $(".newslettersubscribemsg").html('').addClass("success").html("Mail je že v bazi.");
                    } else if (data.result == 'saved') {
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


    $('.modal [data-dismiss="modal"]').on('click', function () {
        var target = $(this).data("next-target");
        if (target) {
            $(this).closest('.modal').data("next-target", target);
        }
    });
    $('.modal').on('hidden.bs.modal', function (e) {
        var target = $(this).data("next-target");
        $(this).data("next-target", "");
        if (target) {
            if (target == '#modal-doniraj-amount') {
                getppdata();
            }
            $(target).modal('show');
        }
    });

    $("#modal-doniraj-email #business-donation-btn").click(function () {
        var btn = $(this);
        $("#business-donation-email").removeClass('error');
        if (validateEmail($("#business-donation-email").val())) {

            var url = 'http://prispevaj.parlameter.si/bussines/';
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
            if ($(this).val() == '') {
                $(this).addClass("error");
            }
        });
        if ($("#modal-doniraj-address .required.error").length > 0) {
            return false;
        }

        var btn = $(this);

        var url = 'http://prispevaj.parlameter.si/donateUPN/';
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
            })
            .fail(function () {

            })
            .always(function () {
            });
    });


    function getppdata() {
        var token;
        $("#paypal-container").html('');
        var jqxhr = $.ajax("http://prispevaj.parlameter.si/getBrainToken/")
            .done(function (data) {
                token = data.token;

                braintree.setup(token, "custom", {
                    paypal: {
                        container: "paypal-container",
                    },
                    onPaymentMethodReceived: function (response) {

                        $.ajax({
                            method: "POST",
                            url: "http://prispevaj.parlameter.si/cardPayPalResponse/",
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
                            } else {
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
            if ($(this).val() == '') {
                $(this).addClass("error");
            }
        });
        if ($("#modal-doniraj-card .required.error").length > 0) {
            return false;
        }

        var token;
        var jqxhr = $.ajax("http://prispevaj.parlameter.si/getBrainToken/")
            .done(function (data) {
                token = data.token;

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
                    }
                    else {
                        $(".card-error").hide();

                        //Normal
                        if ($("#donation-monthly").is(':checked')) {
                            $.ajax({
                                method: "POST",
                                url: "http://prispevaj.parlameter.si/cardResponse/",
                                data: {
                                    nonce: response['nonce'],
                                    email: $("#card-donation-email").val(),
                                    money: $("#donation-amount").val(),
                                    purpose: "Donacija parlameter"
                                }
                            }).done(function (resp) {
                                console.log(resp);
                                if (resp.status == "OK") {

                                    $("#modal-doniraj-card").modal('hide');
                                    $("#modal-doniraj-hvala-donacija").modal('show');

                                } else {
                                    alert(resp.status)
                                }
                            });
                        } else {

                            $.ajax({
                                method: "POST",
                                url: "http://prispevaj.parlameter.si/responseRecurring/",
                                data: {
                                    nonce: response['nonce'],
                                    email: $("#card-donation-email").val(),
                                    money: $("#donation-amount").val(),
                                    purpose: "Donacija parlameter"
                                }
                            }).done(function (resp) {
                                console.log(resp);
                                if (resp.status == "OK") {

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

    $(".measure").click(function () {

        var b = $(this);
        var c = b.data('mc');
        var a = b.data('ma');
        var n = b.data('mn');
        var v = b.data('mv');

        measure(c, a, n, v);

    });

    $(".card-share").click(function () {
        var n;
        var b = $(this).closest('.card-container');
        if (b.data('id') != '') {
            n = b.data('id');
        } else {
            n = b.find('h1').text();
        }
        measure("card", "share-share", n, '');
    });
    $(".card-embed").click(function () {
        var n;
        var b = $(this).closest('.card-container');
        if (b.data('id') != '') {
            n = b.data('id');
        } else {
            n = b.find('h1').text();
        }
        measure("card", "share-embed", n, '');
    });
    $(".card-info").click(function () {
        var n;
        var b = $(this).closest('.card-container');
        if (b.data('id') != '') {
            n = b.data('id');
        } else {
            n = b.find('h1').text();
        }
        measure("card", "share-info", n, '');
    });

    function mcSearch() {
        if ($(".session-search-container").length > 0) {
            var bs = '';
            bs = $(".session-search-container .search input").val();
            if (bs != '') {
                measure("search", "query", bs);
            }
        }
    }

    mcSearch();

    $(".searchForm").submit(function () {
       var tmpVal = $(this).find(".form-control");
        if(tmpVal.val().length < 1 || tmpVal.val() === '/' || tmpVal.val() === '-'){
           tmpVal.val("parlameter");
       }
    });

    // mobile menu
    $('.mobile-menu__hambuger').on('click', function(e) {
        e.preventDefault()

        $(this).removeClass('mobile-menu__hambuger--closed');
        $('header.header .navbar').toggleClass('mobile-menu--opened');

        if($("header.header .navbar-default").hasClass('mobile-menu--opened')) {
          $("header.header .navbar-collapse").fadeIn()
          $('body').css('overflow', 'hidden');
        } else {
          $("header.header .navbar-collapse").fadeOut('fast')
          $('body').css('overflow', 'visible');
        }
    })

    $('header.header .navbar-collapse .search-field').on('keyup', function(e) {
      if (e.keyCode == 13) {
          $(this).parents('form').submit();
      }
    });

});
