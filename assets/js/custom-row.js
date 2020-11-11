
$("#add-row").on('click', function(){
    var html = '';
    html += '<div class="card">';
    html += '<div class="card-block">';
    html += '<div class="row align-items-end">';
    html += '<div class="col-sm-5">'
    html += '<input type="text" class="form-control" placeholder="Term">'
    html += '</div>';
    html += '<div class="col-sm-5">'
    html += '<input type="text" class="form-control" placeholder="Definition">';
    html += '</div>';
    html += '<div class="col-sm-1">'
    html += '<button id="remove-row" class="btn btn-sm waves-effect waves-dark btn-danger btn-outline-danger"><i class="icofont icofont-trash"></i></button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('.add-rows').append(html);
});

$(document).on('click', '#remove-row', function(){
    $(this).closest('.card').remove();
});