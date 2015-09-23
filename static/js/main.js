$(function () {
    $('#datetime').datetimepicker({
        format: 'YYYY-MM-DD\\THH:mm:ssZZ',
        defaultDate: moment().format()
    });
});

/* Load tasks */
function refresh_tasks() {
    /* List tasks */
    $.ajax({
        url: 'https://api.agendor.com.br/v1/tasks?organization=2639132',
        headers: {
            'Authorization': 'Token f23cc874-d25b-4992-b396-8206e2261202',
            'Content-type': 'application/json'
        },
        cache: false
    }).done(function(data){
        $.each(data, function(key, val){
            $.get('/static/js/templates/task.mst', function(template) {
                var rendered = Mustache.render(template, {
                                                            user: val.user.name,
                                                            text: val.text,
                                                            date: moment(val.dueDate).format('dddd MMM DD h:mm a'),
                                                            done: val.done,
                                                            task_id: val.taskId
                                                        });
                $('#task-list').append(rendered);
            });
        });
    });
}

$(document).ready(function(){
    refresh_tasks();
});

/* Creates new task */
$('form').on('submit', function(e){
    e.preventDefault();

    $.ajax({
        type: 'post',
        url: 'https://api.agendor.com.br/v1/tasks',
        headers: {
            'Authorization': 'Token f23cc874-d25b-4992-b396-8206e2261202',
            'Content-type': 'application/json'
        },
        data: JSON.stringify({
            organization: 2639132,
            text: $('#text').val(),
            dueDate: $('#datetime').val(),
            assignedUsers: [8731]
        }),
        dataType: 'json',
        success: function(){
            $('#task-list').html('');
            refresh_tasks();
        }
    });

});


/* Check task as done */
$(document).on('change' , '.task-action-done' , function(){
    task_id = $(this).data('id');
    var field = $(this);

    $.ajax({
        method: 'put',
        url: 'https://api.agendor.com.br/v1/tasks/' + task_id,
        headers: {
            'Authorization': 'Token f23cc874-d25b-4992-b396-8206e2261202',
            'Content-type': 'application/json'
        },
        data: JSON.stringify({
            text: $(this).parent().parent().find('.task-text').html(),
            done: true,
            doneTime: moment().format()
        }),
        dataType: 'json'
    }).done(function(){
        field.parent().html('<i class="fa fa-check"></i>');
    });
});