/* signIn Modal Controller */
(function($, vm) {
  /* hide error when modal is re-opened */
  $(document).on('hidden.bs.modal', '#modal-signIn', function() { $('#signIn-error').hide });
  $(document).on('hidden.bs.modal', '#modal-register', function() { $('#register-error').hide, $('#register-error2').hide});
  

  $(document).on('click', '#button-signIn', function() {
    /* show the loading wheel */
    $('#signIn-loading').show();

    /* disable inputs */
    $('#signIn-username').disable(true);
    $('#signIn-password').disable(true);
    $('#button-signIn').disable(true);

    /* gather user inputs  */
    var user = $('#signIn-username').val();
    var pass = $('#signIn-password').val();

    /* execute login request */
    vm.User.login(user, pass)
      .done(function(data) {
        /* hide loader and close modal */
        $('#signIn-loading').hide();
        $('#modal-signIn').modal('hide');
      })
      .fail(function(data) {
        /* enable form functions again */
        $('#signIn-username').disable(false);
        $('#signIn-password').disable(false);
        $('#button-signIn').disable(false);

        /* show error and hide loader */
        $('#signIn-loading').hide();
        $('#signIn-error').slideDown(500);
      });
  });
  
  $(document).on('click', '#button-register', function() {
    /* show the loading wheel */
    $('#register-loading').show();

    /* disable inputs */
    $('#register-username').disable(true);
    $('#register-password').disable(true);
    $('#register-password-confirm').disable(true);
    $('#button-register').disable(true);

    /* gather user inputs  */
    var user = $('#register-username').val();
    var pass = $('#register-password').val();
    var conf = $('#register-password-confirm').val();

    /* execute login request */
    vm.User.register(user, pass, conf)
      .done(function(data) {
        /* hide loader and close modal */
        $('#register-loading').hide();
        $('#modal-register').modal('hide');
      })
      .fail(function(data) {
        /* enable form functions again */
        $('#register-username').disable(false);
        $('#register-password').disable(false);
        $('#register-password-confirm').disable(false);
        $('#button-register').disable(false);

        /* show error and hide loader */
        $('#register-loading').hide();
        $('#register-error').slideDown(500);
      });
  });

})(jQuery, vm);
