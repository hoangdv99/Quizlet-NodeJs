

$(document).ready(function() {
  $(".continuesBtn").on( "click", function(e) {
    e.preventDefault();
    loaddingPage();
    var form = $(this).parents('form:first');
    var id = form.find('input[name="id"]').val();
    $.post( "/actions/continues", {
      id
      }).done(
      function( data ) {
        if(data){
          // form.find('input[name="id"]').val('');
          checkStatusButton(3,form);
          unLoaddingPage();
          setFlash('success',3,form)
        }
    });
  });

  $(".stopBtn").on( "click", function(e) {
    e.preventDefault();
    loaddingPage();
    var form = $(this).parents('form:first');
    var id = form.find('input[name="id"]').val();
    $.post( "/actions/stop", {
      id
      }).done(
      function( data ) {
        if(data){
          // form.find('input[name="id"]').val('');
          checkStatusButton(2,form);
          unLoaddingPage();
          setFlash('success',2,form)
        }
    });
  });

  $(".pauseBtn").on( "click", function(e) {
    e.preventDefault();
    loaddingPage();
    var form = $(this).parents('form:first');
    var id = form.find('input[name="id"]').val();
    $.post( "/actions/pause", {
      id
      }).done(
      function( data ) {
        if(data){
          checkStatusButton(4,form);
          unLoaddingPage();
          setFlash('success',4,form);
        }
    });
  });

  $(".runBtn").on( "click", function(e) {
    e.preventDefault();
    loaddingPage();
    var form = $(this).parents('form:first');
    var id = form.find('input[name="id"]').val();
    var title = form.find('input[name="title"]').val();
    var hashtags = form.find('input[name="hashtags"]').val();
    var minLikes = form.find('input[name="minLikes"]').val();

    var autolikeCheckbox = form.find('input[name="autolikeCheckbox"]').is(":checked") ? true : false;
    var selectAutolikeSpeed = form.find('select[name="selectAutolikeSpeed"]').val();
    var autoFollowCheckbox = form.find('input[name="autoFollowCheckbox"]').is(":checked") ? true : false;
    var selectAutofollowSpeed = form.find('select[name="selectAutofollowSpeed"]').val();
    var autocommentCheckbox = form.find('input[name="autocommentCheckbox"]').is(":checked") ? true : false;
    var selectAutocommentSpeed = form.find('select[name="selectAutocommentSpeed"]').val();
    var comments = form.find("input[name='comments[]']").map(function(){
        if($(this).val()){
            return $(this).val();
        }
      }).get();
    if(validateFormProfile(form, title, hashtags, autolikeCheckbox, selectAutolikeSpeed, autoFollowCheckbox, selectAutofollowSpeed, autocommentCheckbox, selectAutocommentSpeed, comments).length === 0 ){
        $.post( "/actions/run", {
          id, title, minLikes, hashtags, autolikeCheckbox, selectAutolikeSpeed, autoFollowCheckbox, selectAutofollowSpeed, autocommentCheckbox, selectAutocommentSpeed, comments
          }).done(
          function( data ) {
            if(data){
              checkStatusButton(data.status,form);
              form.find('input[name="id"]').val(data.id);
              $('li.active > a').text(data.title);
              $('li.active > span').remove();
              unLoaddingPage();
              setFlash('success',data.status,form);
            }
        });
    } else {
      unLoaddingPage();
    }
  });

  function setFlash(type,status,form) {
      console.log(status);
      if(type == 'success') {
          if(status == 1) showText = 'Profile is running';
          if(status == 2) showText = 'Profile is stoped';
          if(status == 3) showText = 'Profile is continuesing';
          if(status == 4) showText = 'Profile is pausing';
          form.find('.flash-sucess').text(showText)
          form.find('.flash-sucess').show();
          setTimeout(function(){ 
            form.find('.flash-sucess').hide(); 
            }, 3000);
      }

      if(type == 'error') {
          showText = 'An error occurred';
          form.find('.flash-sucess').text(showText)
          form.find('.flash-sucess').show();
          setTimeout(function(){ 
            form.find('.flash-sucess').hide(); 
            }, 3000);
      }

  }

  function loaddingPage() {
    document.querySelector( ".pcoded-content").style.visibility = "hidden"; 
    document.querySelector( "#loader").style.visibility = "visible";
    $('#loader').css('z-index',99999);
  }

  function unLoaddingPage() {
    document.querySelector( ".pcoded-content").style.visibility = "visible"; 
    document.querySelector( "#loader").style.visibility = "none";
     $('#loader').css('z-index',0);
  }

  function checkStatusButton(status, form){
      var start = true;         
      var pause = false;         
      var continues = false;         
      var stop = false;    
      var classButton = 'disabled-button';
      var disabled = 'disabled';

      // <!-- run -->
      if(status == 1) {
        start = false;
        pause = true;
        continues = false;
        stop = true;
      }   
      
      // <!-- stop -->
      if(status == 2) {
        start = true;
        pause = false;
        continues = false;
        stop = false;
      } 

      // <!continues -->
      if(status == 3) {
        start = false;
        pause = true;
        continues = false;
        stop = true;
      } 

      // <!-- pause -->
      if(status == 4) {
        start = false;
        pause = false;
        continues = true;
        stop = true;
      }

      console.log('status: ' + status);
      console.log('start: ' + start);
      console.log('pause: ' + pause);
      console.log('stop: ' + stop);

      form.find('button.runBtn').removeClass(classButton);
      form.find('button.pauseBtn').removeClass(classButton);
      form.find('button.continuesBtn').removeClass(classButton);
      form.find('button.stopBtn').removeClass(classButton);

      form.find('button.runBtn').removeAttr(disabled);
      form.find('button.pauseBtn').removeAttr(disabled);
      form.find('button.continuesBtn').removeAttr(disabled);
      form.find('button.stopBtn').removeAttr(disabled);

      
      if(!start) {
        form.find('button.runBtn').addClass(classButton);
        form.find('button.runBtn').attr('disabled',true);
      }

      if(!pause) {
        form.find('button.pauseBtn').addClass(classButton);
        form.find('button.pauseBtn').attr('disabled',true);
      }

      if(!continues) {
        form.find('button.continuesBtn').addClass(classButton);
        form.find('button.continuesBtn').attr('disabled',true);
      }

      if(!stop) {
        form.find('button.stopBtn').addClass(classButton);
        form.find('button.stopBtn').attr('disabled',true);
      }
  }

  function validateFormProfile(form, title, hashtags, autolikeCheckbox, selectAutolikeSpeed, autoFollowCheckbox, selectAutofollowSpeed, autocommentCheckbox, selectAutocommentSpeed, comments){
    form.find( ".error" ).remove();
    var errors = [];

    if(!title) {
      errors.push('title');
      form.find('input[name="title"]').after('<p class="error"><i class="fa fa-times" aria-hidden="true"></i> Profile name is required</p>' );
    }

    if(!hashtags) {
      errors.push('hashtags');
      form.find('input[name="hashtags"]').after('<p class="error"><i class="fa fa-times" aria-hidden="true"></i> Hash tags is required</p>' );
    }

    if(form.find('input[name="autolikeCheckbox"]').is(":checked") && !selectAutolikeSpeed){
      errors.push('selectAutolikeSpeed');
      form.find('select[name="selectAutolikeSpeed"]').after('<p class="error"><i class="fa fa-times" aria-hidden="true"></i> Speed Auto Like is required</p>' );
    }

    if(form.find('input[name="autoFollowCheckbox"]').is(":checked") && !selectAutofollowSpeed) {
      errors.push('selectAutofollowSpeed');
      form.find('select[name="selectAutofollowSpeed"]').after('<p class="error"><i class="fa fa-times" aria-hidden="true"></i> Speed Auto Follow is required</p>' );
    }

    if(form.find('input[name="autocommentCheckbox"]').is(":checked") && !selectAutocommentSpeed) {
      errors.push('selectAutocommentSpeed');
      form.find('select[name="selectAutocommentSpeed"]').after('<p class="error"><i class="fa fa-times" aria-hidden="true"></i> Speed Auto comment is required</p>' );
    }

    if(form.find('input[name="autocommentCheckbox"]').is(":checked") && selectAutocommentSpeed > 0 && comments.length === 0 ){
      errors.push('comments');
      form.find('.addrow').after('<p class="error"><i class="fa fa-times" aria-hidden="true"></i> Comments is required</p>' );
    }
     return errors;
  }

  function setVisible(selector, visible) {
    document.querySelector(selector).style.display = visible ? 'block' : 'none';
  }

});



