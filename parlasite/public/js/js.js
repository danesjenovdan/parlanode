/* eslint-disable */
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var shopData = null;

$(function() {
  $('#newsletterform').on('submit', function(e) {
    e.preventDefault();
    return false;
  });
  $("#submitnewsletteremail").click(function() {
    $(".newslettersubscribe").removeClass('error');
    if (validateEmail($(".newslettersubscribe").val())) {
      var url = 'https://gong.us2.list-manage.com/subscribe/post-json?u=96ef5b6d1dbe39953a3a1c215&id=ec01d2995e&c=?';

      var jqxhr = $.ajax({
          method: 'GET',
          url: url,
          dataType: 'json',
          contentType: "application/json; charset=utf-8",
          data: $('#newsletterform').serialize()
          // JSON.stringify({
          //   email: $(".newslettersubscribe").val()
          // }),
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
    $('#submitshop').addClass('hidden');
    $('#modal-doniraj-amount .nalagalnik').removeClass('hidden');
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
          "success_url": donationThankYouUrl,
          "fail_url": donationErrorUrl,
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

      var url = 'https://shop.djnd.si/api/business/';
      var jqxhr = $.ajax({
          method: "POST",
          url: url,
          data: {
            email: $("#business-donation-email").val(),
            message: $("#business-donation-message").val()
          }
        })
        .done(function(data) {
          $('#modal-doniraj-email').modal('hide');
        })
        .fail(function() {
          alert('Ups ... :(')
        });
    } else {
      $("#business-donation-email").addClass('error');
    }
  });

  // $("#donation-monthly").on('click', function() {
  //     console.log($(this).attr('checked'));
  // });

  // mobile menu
  $('.mobile-menu__button').on('click', function(e) {
    e.preventDefault()

    $('mobile-menu__hamburger').removeClass('mobile-menu__hambuger--closed');
    $('.menu-container').toggleClass('open');
  })

  // search behaviour
  $('.open-search').on('click', function() {
    $('.menu').addClass('hidden');
    $('.menu-search').removeClass('hidden');
    $('.open-search').addClass('hidden');
    $('.close-search').removeClass('hidden');
  });
  $('.close-search').on('click', function() {
    $('.menu').removeClass('hidden');
    $('.menu-search').addClass('hidden');
    $('.open-search').removeClass('hidden');
    $('.close-search').addClass('hidden');
  });

});

$(function () {
  // all links in legal text should open in a new tab
  $('.legal-text-container a').attr('target', '_blank');
});
