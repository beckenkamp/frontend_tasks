$(function () {
    $('#datetime').datetimepicker();
});

$(document).ready(function(){

    $.ajax({
        url: 'https://api.agendor.com.br/v1/tasks?organization=2639132',
        headers: {
            'Authorization': 'Token f23cc874-d25b-4992-b396-8206e2261202',
            'Content-type': 'application/json'
        }
    }).done(function(data){
        $.each(data, function(key, val){
            $.get('/static/js/templates/task.mst', function(template) {
                var rendered = Mustache.render(template, {
                                                            user: val.user.name,
                                                            text: val.text,
                                                            date: moment(val.dueDate).format('dddd MMM DD h:mm a'),
                                                            done: val.done
                                                        });
                $('#task-list').append(rendered);
            });
        });
    });

});