var AddPersonDialog = function(config) {
	var w = config.writer;
	
	$(document.body).append(''+
	'<div id="addPersonDialog">'+
		'<div id="personName">'+
		'<label>Name</label>'+
		'<input type="text" name="first" value=""/>'+
		'<input type="text" name="middle" value=""/>'+
		'<input type="text" name="maiden" value=""/>'+
		'<input type="text" name="last" value=""/>'+
		'</div>'+
		'<div>'+
		'<label for="dob">Date of Birth (if known)</label><input type="text" id="dob" style="margin-bottom: 5px;"/><br />'+
	    '<label for="dod">Date of Death (if known)</label><input type="text" id="dod" />'+
	    '<p>Format: yyyy-mm-dd<br/>e.g. 2010-10-05</p>'+
	    '</div>'+
	    '<div>'+
	    '<label>Occupation (if known)</label><select name="occupation">'+
	    '<option></option>'+
	    '<option>Author</option>'+
	    '<option>Teacher</option>'+
	    '<option>Engineer</option>'+
	    '</select>'+
	    '</div>'+
	    '<button>Add Further Information</button>'+
	    '<p>Note: for DEMO purposes only. Saves are NOT permanent.'+
	'</div>');
	
	var addPerson = $('#addPersonDialog');
	addPerson.dialog({
		modal: true,
		resizable: false,
		closeOnEscape: false,
		open: function(event, ui) {
			$('#addPersonDialog').parent().find('.ui-dialog-titlebar-close').hide();
		},
		title: 'Create New Person',
		height: 350,
		width: 465,
		autoOpen: false,
		buttons: {
			'Submit for Review': function() {
				alert('New records can\'t be added yet. The popup is here only to solicit feedback.');
				addPerson.dialog('close');
			},
			'Cancel': function() {
				addPerson.dialog('close');
			}
		}
	});
	
	var lifeSpan = $('#dob, #dod').datepicker({
		dateFormat: 'yy-mm-dd',
		constrainInput: false,
		changeMonth: true,
		changeYear: true,
		yearRange: '-210:+10',
		minDate: new Date(1800, 0, 1),
		maxDate: new Date(2020, 11, 31),
		showOn: 'button',
		buttonText: 'Date Picker',
		buttonImage: 'img/calendar.png',
		buttonImageOnly: true,
		onSelect: function(selectedDate) {
			var option = this.id == "dob" ? "minDate" : "maxDate";
			var instance = $(this).data("datepicker");
			var date = $.datepicker.parseDate(instance.settings.dateFormat || $.datepicker._defaults.dateFormat, selectedDate, instance.settings);
			dateRange.not(this).datepicker("option", option, date);
		}
	});
	
	$('#addPersonDialog input[name="first"]').watermark('First');
	$('#addPersonDialog input[name="middle"]').watermark('Middle');
	$('#addPersonDialog input[name="maiden"]').watermark('Maiden');
	$('#addPersonDialog input[name="last"]').watermark('Last');
	
	$('#addPersonDialog > button').button();
	
	return {
		show: function(config) {
			$('#addPersonDialog input').val('');
			$('#addPersonDialog select').val('');
			addPerson.dialog('open');
		},
		hide: function() {
			addPerson.dialog('close');
		}
	};
};