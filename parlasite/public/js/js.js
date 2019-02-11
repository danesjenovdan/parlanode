/* eslint-disable */

// HEADER LOGIC
$(function() {
  // show/hide mobile menu
  $('.mobile-menu__button').on('click', function(e) {
    e.preventDefault();
    $('mobile-menu__hamburger').removeClass('mobile-menu__hambuger--closed');
    $('.menu-container').toggleClass('open');
  });

  // show/hide header search
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

// LEGAL TEXT
$(function() {
  // all links in legal text should open in a new tab
  $('.legal-text-container a').attr('target', '_blank');
});

// SHOP/DONATION MODALS
$(function() {
  // modal navigation
  $('.modal [data-dismiss="modal"]').on('click', function() {
    var target = $(this).data('next-target');
    if (target) {
      $(this).closest('.modal').data('next-target', target);
    }
  });

  $('.modal').on('hidden.bs.modal', function() {
    var target = $(this).data('next-target');
    $(this).data('next-target', '');
    if (target) {
      $(target).modal('show');
    }
  });

  // donation via shop
  var shopData = null;

  $('#startshop').on('click', function() {
    $.get('https://shop.djnd.si/api/basket/', function(data) {
      shopData = data;
    });
  });

  $('#submitshop').on('click', function() {
    $('#submitshop').addClass('hidden');
    $('#modal-doniraj-amount .nalagalnik').removeClass('hidden');

    var data = {
      product_id: 7,
      quantity: parseInt($('#donation-amount').val(), 10),
    };

    if (data.quantity < 1) {
      $('#donation-amount').addClass('error');
      $('#submitshop').removeClass('hidden');
      $('#modal-doniraj-amount .nalagalnik').addClass('hidden');
      return;
    }

    $.ajax('https://shop.djnd.si/api/add_to_basket/?order_key=' + shopData.order_key, {
      data: JSON.stringify(data),
      contentType: 'application/json',
      type: 'POST',
      success: function() {
        var checkoutData = {
          payment_type: 'paypal',
          name: 'Parlameter donacija',
          address: 'Internet!',
          phone: '040433829',
          info: 'To je donacija iz Parlametra: ' + window.location.href,
          email: 'vsi@danesjenovdan.si',
          subscription: $('#donation-monthly').prop('checked'),
          delivery_method: 'takeover',
          success_url: donationThankYouUrl,
          fail_url: donationErrorUrl,
        };

        $('#donation-amount').removeClass('error');
        $.ajax('https://shop.djnd.si/api/checkout/?order_key=' + shopData.order_key, {
          data: JSON.stringify(checkoutData),
          contentType: 'application/json',
          type: 'POST',
          success: function(r) {
            if (r && r.redirect_url) {
              document.location.href = r.redirect_url;
            } else {
              $('#donation-amount').addClass('error');
              $('#submitshop').removeClass('hidden');
              $('#modal-doniraj-amount .nalagalnik').addClass('hidden');
            }
          }
        });
      }
    });
  });

  // corporate donation via email
  $("#modal-doniraj-email #business-donation-btn").on('click', function() {
    $("#business-donation-email").removeClass('error');
    if (validateEmail($("#business-donation-email").val())) {
      var url = 'https://shop.djnd.si/api/business/';

      $.ajax({
        method: "POST",
        url: url,
        data: {
          email: $("#business-donation-email").val(),
          message: $("#business-donation-message").val()
        },
        success: function() {
          $('#modal-doniraj-email').modal('hide');
        },
        error: function() {
          alert('Ups ... :(');
        }
      });
    } else {
      $("#business-donation-email").addClass('error');
    }
  });
});
