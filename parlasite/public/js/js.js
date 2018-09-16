/* eslint-disable */
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var shopData = null;

$(function() {
  $(".newslettersubscribeButton").click(function() {
    $(".newslettersubscribe").removeClass('error');
    if (validateEmail($(".newslettersubscribe").val())) {
      var url = 'https://gong.us2.list-manage.com/subscribe/post-json?u=96ef5b6d1dbe39953a3a1c215&amp;id=ec01d2995e&c=?';
      // var url = 'http://prispevaj.parlameter.si/parlamail/email/';

      var jqxhr = $.ajax({
          method: 'GET',
          url: url,
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          data: {
            email: $(".newslettersubscribe").val()
          }
        })
        .done(function(data) {
          console.log(data);
          $(".newslettersubscribemsg").html('').addClass("success").html("HVALA!");
        });
    }
  });

  $('#startshop').on('click', function() {
    $.get('https://shop.djnd.si/api/basket/', function(data) {
      shopData = data;
    });
  });

  $('#submitshop').on('click', function() {
    var data = {
      "product_id": 7,
      "quantity": parseInt($('#donation-amount').val(), 10),
    }

    $.ajax('https://shop.djnd.si/api/add_to_basket/?order_key=' + shopData.order_key, {
      data: JSON.stringify(data),
      contentType: 'application/json',
      type: 'POST',
      success: function(resp) {
        console.log(resp);

        var checkoutData = {
          "payment_type": "paypal",
          "name": "HR donacija",
          "address": "Internet!",
          "phone": "040433829",
          "info": "To je donacija iz hrvaškega Parlametra.",
          "email": "vsi@danesjenovdan.si",
          "subscription": $('#donation-monthly').prop('checked'),
          "delivery_method": "takeover",
          "success_url": thankYouUrl,
          "fail_url": errorUrl,
        }

        $.ajax('https://shop.djnd.si/api/checkout/?order_key=' + shopData.order_key, {
          data: JSON.stringify(checkoutData),
          contentType: 'application/json',
          type: 'POST',
          success: function(r) {
            console.log(r);
            document.location.href = r.redirect_url;
          }
        })
      }
    });
  });


  $('.modal [data-dismiss="modal"]').on('click', function() {
    var target = $(this).data("next-target");
    if (target) {
      $(this).closest('.modal').data("next-target", target);
    }
  });
  $('.modal').on('hidden.bs.modal', function(e) {
    var target = $(this).data("next-target");
    $(this).data("next-target", "");
    if (target) {
      // if (target == '#modal-doniraj-amount') {
      //     getppdata();
      // }
      $(target).modal('show');
    }
  });

  $("#modal-doniraj-email #business-donation-btn").click(function() {
    var btn = $(this);
    $("#business-donation-email").removeClass('error');
    if (validateEmail($("#business-donation-email").val())) {

      var url = 'http://prispevaj.parlameter.si/bussines/';
      var jqxhr = $.ajax({
          method: "POST",
          url: url,
          data: {
            email: $("#business-donation-email").val(),
            message: $("#business-donation-message").val()
          }
        })
        .done(function(data) {
          $(".business-donation").html('').addClass("success").html(data.result);
          btn.hide();
        })
        .fail(function() {

        })
        .always(function() {});
    } else {
      $("#business-donation-email").addClass('error');
    }
  });

  // $("#donation-monthly").on('click', function() {
  //     console.log($(this).attr('checked'));
  // });


  $("#modal-doniraj-address #address-donation-btn").click(function() {

    $("#modal-doniraj-address .required").removeClass('error');
    $("#modal-doniraj-address .required").each(function() {
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
      .done(function(data) {
        $(".address-donation").html('').addClass("success").html(data.result);
        $(".card-error").hide();
        btn.hide();
      })
      .fail(function() {

      })
      .always(function() {});
  });


  // function getppdata() {
  //     var token;
  //     $("#paypal-container").html('');
  //     var jqxhr = $.ajax("http://prispevaj.parlameter.si/getBrainToken/")
  //         .done(function (data) {
  //             token = data.token;

  //             braintree.setup(token, "custom", {
  //                 paypal: {
  //                     container: "paypal-container",
  //                 },
  //                 onPaymentMethodReceived: function (response) {

  //                     $.ajax({
  //                         method: "POST",
  //                         url: "http://prispevaj.parlameter.si/cardPayPalResponse/",
  //                         data: {
  //                             nonce: response['nonce'],
  //                             email: response.details.email,
  //                             money: $("#donation-amount").val(),
  //                             purpose: "Donacija parlameter"
  //                         }
  //                     }).done(function (resp) {
  //                         console.log(resp);
  //                         if (resp.status == "OK") {
  //                             $("#modal-doniraj-card").modal('hide');
  //                             $("#modal-doniraj-hvala-donacija").modal('show');
  //                         } else {
  //                             alert(resp.status);
  //                         }
  //                     });
  //                 }
  //             });

  //         })
  //         .fail(function () {
  //             $("#" + urlid).html(urlid + " error");
  //         })
  //         .always(function () {
  //         });
  // }


  $("#modal-doniraj-card #modal-doniraj-amount-card").click(function() {

    $(".card-error").hide();
    $("#modal-doniraj-card .required").removeClass('error');
    $("#modal-doniraj-card .required").each(function() {
      if ($(this).val() == '') {
        $(this).addClass("error");
      }
    });
    if ($("#modal-doniraj-card .required.error").length > 0) {
      return false;
    }

    var token;
    var jqxhr = $.ajax("http://prispevaj.parlameter.si/getBrainToken/")
      .done(function(data) {
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
        }, function(err, response) {

          if (err) {
            $(".card-error").show();
          } else {
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
              }).done(function(resp) {
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
              }).done(function(resp) {
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

  // mobile menu
  $('.mobile-menu__button').on('click', function(e) {
    e.preventDefault()

    $('mobile-menu__hamburger').removeClass('mobile-menu__hambuger--closed');
    $('.menu-container').toggleClass('open');
  })

  // search behaviour
  $('.open-search').on('click', function() {
    $('.menu').addClass('search-open');
    $('.menu a').addClass('hidden');
    $('.menu-search').removeClass('hidden');
    $('.open-search').addClass('hidden');
    $('.close-search').removeClass('hidden');
  });
  $('.close-search').on('click', function() {
    $('.menu').removeClass('search-open');
    $('.menu a').removeClass('hidden');
    $('.menu-search').addClass('hidden');
    $('.open-search').removeClass('hidden');
    $('.close-search').addClass('hidden');
  });

});

$(function () {
  // all links in legal text should open in a new tab
  $('.legal-text-container a').attr('target', '_blank');
});
