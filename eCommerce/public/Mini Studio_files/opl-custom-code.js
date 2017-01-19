// ------------------------------------------------------------------------
// Smooth Scrolling - http://codepen.io/HZaccaro/pen/zvrgLb
// ------------------------------------------------------------------------

$(function smoothScrollYo() {
  // This will select everything with the class smoothScroll
  // This should prevent problems with carousel, scrollspy, etc...
  $('.smoothScroll').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000); // The number here represents the speed of the scroll in milliseconds
        return false;
      }
    }
  });
});

// Change the speed to whatever you want
// Personally i think 1000 is too much
// Try 800 or below, it seems not too much but it will make a difference


// ------------------------------------------------------------------------
// Mobile Navigation: Menu Button
// ------------------------------------------------------------------------

function toggleNav() {
	var ele = document.getElementById("mobile-navigation-toggle");
	var text = document.getElementById("mobile-nav-button-link");
	if(ele.style.display == "block") {
    		ele.style.display = "none";
  	}
	else {
		ele.style.display = "block";
	}
};

// ------------------------------------------------------------------------
// Download Modal - https://codepen.io/ariwinokur/pen/vGzELM
// ------------------------------------------------------------------------

$(function modalYo() {

  var appendthis = ("<div class='modal-overlay js-modal-close'></div>");

  $("button[data-modal-id]").click(function(e) {
    e.preventDefault();
    $("body").append(appendthis);
    $(".modal-overlay").fadeTo(500, 0.7);
    $(".js-modalbox").fadeIn(500);
    var modalBox = $(this).attr('data-modal-id');
    $("#" + modalBox).fadeIn($(this).data());
  });

  $(".js-modal-close, .modal-overlay").click(function() {
    $(".modal-box, .modal-overlay").fadeOut(500, function() {
      $(".modal-overlay").remove();
    });
  });

  $(window).resize(function() {
    $(".modal-box").css({
      top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
      left: ($(window).width() - $(".modal-box").outerWidth()) / 2
    });
  });

  $(window).resize();

});


// ------------------------------------------------------------------------
// Email Octopus - https://emailoctopus.com/bundles/emailoctopuslist/js/formEmbed.js
// ------------------------------------------------------------------------

var emailOctopus={successMessage:'Thanks for subscribing!',missingEmailAddressMessage:'Your email address is required.',invalidEmailAddressMessage:'Your email address looks incorrect, please try again.',botSubmissionErrorMessage:'This doesn\'t look like a human submission.',invalidParametersErrorMessage:'This form has missing or invalid fields.',unknownErrorMessage:'Sorry, an unknown error has occurred. Please try again later.',isBotPost:function(){return $('.email-octopus-form-row-hp input').val();},basicValidateEmail:function(email){var regex=/\S+@\S+\.\S+/;return regex.test(email);},ajaxSuccess:function(){var $form=$('.email-octopus-form');$form.trigger('email-octopus.success');var $successRedirectUrl=$form.find('.email-octopus-success-redirect-url').val();if($successRedirectUrl&&$successRedirectUrl.trim()){window.location.href=$successRedirectUrl;}else{$('.email-octopus-success-message').text(emailOctopus.successMessage);$form.hide();}},ajaxError:function(textStatus){var response=$.parseJSON(textStatus.responseText);if(response&&response.error&&response.error.code){switch(response.error.code){case'INVALID_PARAMETERS':$('.email-octopus-error-message').text(emailOctopus.invalidParametersErrorMessage);return;case'BOT_SUBMISSION':$('.email-octopus-error-message').text(emailOctopus.botSubmissionErrorMessage);return;}}
$('.email-octopus-error-message').text(emailOctopus.unknownErrorMessage);},ajaxSubmit:function(){var $form=$('.email-octopus-form');$.ajax({type:$form.attr('method'),url:$form.attr('action'),data:$form.serialize(),success:function(){emailOctopus.ajaxSuccess();},error:function(textStatus){emailOctopus.ajaxError(textStatus);},});}}
$(function(){$('.email-octopus-form').submit(function(e){$('.email-octopus-error-message').empty();var emailAddress=$('.email-octopus-email-address').val();if(emailOctopus.isBotPost()){$('.email-octopus-error-message').text(emailOctopus.botSubmissionErrorMessage);}else if(!$.trim(emailAddress)){$('.email-octopus-error-message').text(emailOctopus.missingEmailAddressMessage);}else if(!emailOctopus.basicValidateEmail(emailAddress)){$('.email-octopus-error-message').text(emailOctopus.invalidParametersErrorMessage);}else{emailOctopus.ajaxSubmit();}
return false;});});