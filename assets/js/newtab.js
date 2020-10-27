$(".nav-left").on("click", "li", function (e) {
  e.preventDefault();
    $(".nav-left").children().removeClass('show');
    $(".nav-left").children().removeClass('active');
    $(".tab-content").children().removeClass('show');
    $(".tab-content").children().removeClass('active');
  if (!$(this).hasClass('add-profile')) {
      $(this).tab('show');
  } else {
    if ($(".nav-left").children().length <= 4) {
      e.preventDefault();
      var id = $(".nav-left").children().length - 1;
      var closeId = 'close_' + id;
      $(this).closest('li').before(`<li class="nav-item active show" style="float:left"><a style="display:inline" data-toggle="tab" role="tab" href="#profile_${id}">New Tab <span style="display:inline" id="${closeId}"><i class="fa fa-times"></i></span></a> </li>`);
      $('#profile_'+id).addClass("active show");
    }

    if( $(".nav-left").children().length == 5) {
       $('.add-profile').hide();
    }
  }
});

$(".nav-left").on("click", "span", function (e) {
  e.stopPropagation();
  $(this).parent().remove();
  $('.add-profile').show();
  $('.nav-left li').children('a').last().click();
});

var rangeSlider = function () {
  var slider = $('.range-slider'),
    range = $('.range-slider__range'),
    value = $('.range-slider__value');

  slider.each(function () {

    value.each(function () {
      var value = $(this).prev().attr('value');
      $(this).html(value);
    });

    range.on('input', function () {
      $(this).next(value).html(this.value);
    });
  });
};

rangeSlider();

//change icon on click
// $('.play-stop').on('click', function () {
//   $(this).find($('.icofont')).toggleClass('icofont-stop icofont-play');
//   $(this).toggleClass('btn-warning btn-danger');
// });
// $('.save-edit').on('click', function () {
//   $(this).find($('.icofont')).toggleClass('icofont-edit icofont-save');
//   $(this).toggleClass('btn-info btn-success');
// })

function showTabProfile() {
  var totalTab = $('.nav-left li').length;
  if(totalTab < 4){
    $('.nav-left li:last').after('<li class="nav-item add-profile" id="add-profile"><i class="fa fa-plus"></i></li>');
  }
}
showTabProfile();

$(document).ready(function () {
  var counter = 0;

  $(".addrow").on("click", function () {
      var orderList = $(this).closest('div').find('.order-list');
      var newRow = $("<div class='row item-comment'>");
      var cols = "";
      cols += '<div class="col-md-8" ><input type="text" class="form-control" name="comments[]"/></div>';
      cols += '<div class="col-md-4" ><input type="button" class="ibtnDel btn btn-danger btn-click"  value="Delete"></div>';
      cols += '</div>';
      newRow.append(cols);
      orderList.append(newRow);
      counter++;
  });


  $(".order-list").on("click", ".ibtnDel", function (event) {
    $(this).closest("div.item-comment").remove();
    counter -= 1
});
});




function calculateRow(row) {
  var price = +row.find('input[name^="price"]').val();

}

function calculateGrandTotal() {
  var grandTotal = 0;
  $(".order-list").find('input[name^="price"]').each(function () {
      grandTotal += +$(this).val();
  });
  $("#grandtotal").text(grandTotal.toFixed(2));
}
