/* signIn Modal Controller */
(function($, vm) {
  /* hide error when modal is re-opened */
  $(document).on('hidden.bs.modal', '#modal-signIn', function() { $('#signIn-error').hide });

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

})(jQuery, vm);
