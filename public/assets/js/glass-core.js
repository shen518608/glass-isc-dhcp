/**
 * Created by cmiles on 8/9/2017.
 */

$( document ).ajaxComplete(function( event, request, settings ) {

	/*
	* Properly check pjax requests to see if we are in the dashboard or not
	*/
	if(/v_ajax/.test(settings.url)){
		request = settings.url;
		request = request.replace("\?v_ajax", "").trim();

		if(request == "/" && in_dashboard != 1) {
			in_dashboard = 1;
		}
		else {
			in_dashboard = 0;
		}
	}

	/*
	* Form input focus event
	*/
	$('.form-control').focus(function () {
		$(this).parent().addClass('focused');
	});

	//On focusout event
	$('.form-control').focusout(function () {
		var $this = $(this);
		if ($this.parents('.form-group').hasClass('form-float')) {
			if ($this.val() == '') { $this.parents('.form-line').removeClass('focused'); }
		}
		else {
			$this.parents('.form-line').removeClass('focused');
		}
	});

	//On label click
	$('body').on('click', '.form-float .form-line .form-label', function () {
		$(this).parent().find('input').focus();
	});

	//Not blank form
	$('.form-control').each(function () {
		if ($(this).val() !== '') {
			$(this).parents('.form-line').addClass('focused');
		}
	});

	$('.form-line').removeClass("focused");
});

$( document ).ready(function() {
	$('.form-line').removeClass("focused");
});

function modal (title, content, buttons) {
	$('#modal-buttons').html('');
	$('#modal-title').html(title);
	$('#modal-body').html(content);

	// <button type="button" class="btn btn-link waves-effect">SAVE CHANGES</button>
	if(buttons != '') {
		$('#modal-buttons').html(buttons);
	}
	$('#mdModal').modal('show');
}

function get_form_query_string(form_id){
	query_string = "";
	$('#' + form_id).find('input, select, textarea').each(function (key) {
		val = $(this).val();
		if (val == 'undefined') {
			val = '';
		}
		if($(this).attr('type') == "checkbox"){
			if (!$(this).is(':checked')) {
				val = 0;
			}
		}
		query_string = query_string + "&" + $(this).attr('id') + "=" + encodeURIComponent(val);
	});
	return query_string;
}

function save_config() {
	glass_settings = get_form_query_string("glass-settings-form");

	$.post( "/glass_settings_save", glass_settings, function( data ) {
		$( "#glass_settings_result" ).html( data );
	});
}

function notification(text){
	colorName = 'bg-black';
	animateEnter = 'animated fadeInDown';
	animateExit = 'animated fadeOutUp';
	var allowDismiss = true;

	$.notify({
			message: text
		},
		{
		type: colorName,
		allow_dismiss: allowDismiss,
		newest_on_top: true,
		timer: 1000,
		animate: {
			enter: animateEnter,
			exit: animateExit
		},
		template: '<div data-notify="container" class="bootstrap-notify-container alert alert-dismissible {0} ' + (allowDismiss ? "p-r-35" : "") + '" role="alert">' +
		'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
		'<span data-notify="icon"></span> ' +
		'<span data-notify="title">{1}</span> ' +
		'<span data-notify="message">{2}</span>' +
		'<div class="progress" data-notify="progressbar">' +
		'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
		'</div>' +
		'<a href="{3}" target="{4}" data-notify="url"></a>' +
		'</div>'
	});
}