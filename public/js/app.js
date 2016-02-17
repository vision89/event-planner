(function(document) {
	'use strict';

	window.APP = window.APP || {};
	window.VTILAPP = Object.create(null);

	// Register the callback to be fired every time auth state changes
	let ref = new Firebase("https://swanky-event-planner.firebaseIO.com");

	//signing in
	let signInEmailEl = 			document.getElementById('signin-email');
	let signInPasswordEl = 			document.getElementById('signin-password');
	let signInContainerEl = 		document.getElementById('sign-in-container');
	let signOutLinkEl =				document.getElementById('sign-out-link');
	let signInLinkEl =				document.getElementById('sign-in-link');

	//signing up
	let signUpContainerEl = 		document.getElementById('sign-up-container');
	let eventPlannerContainerEl = 	document.getElementById('event-planner-container');
	let signupNameEl = 				document.getElementById('signup-name');
	let signupEmailEl = 			document.getElementById('signup-email');
	let signupPasswordEl = 			document.getElementById('signup-password');
	let signupPassword2El = 		document.getElementById('signup-password2');
	let signupEmployerEl =			document.getElementById('signup-employer');
	let signupTitleEl =				document.getElementById('signup-title');
	let signupBirthday =			document.getElementById('signup-birthday');
	let submitPasswordButton =		document.getElementById('submit-password-button');
	let signupAdditionalInfoEl =	document.getElementById('signup-additional-info');
	let signupSwitchEl =			document.getElementById('switch-1');

	//Reset Password
	let resetPasswordContainerEl =	document.getElementById('reset-password-container');
	let resetPasswordEmail =		document.getElementById('reset-password-email');

	//event creation
	let eventNameEl =				document.getElementById('event-name');
	let eventTypeEl =				document.getElementById('event-type');
	let eventHostEl =				document.getElementById('event-host');
	let startDateEl =				document.getElementById('start-date');
	let endDateEl =					document.getElementById('end-date');
	let contentEl = 				document.getElementById('vtil-content');
	let inputEl = 					document.getElementById('vtil-input');
	let locationInputEl	=			document.getElementById('location-input');
	let streetNumberEl =			document.getElementById('street-number');
	let routeEl =					document.getElementById('route');
	let cityEl =					document.getElementById('city');
	let stateEl =					document.getElementById('state');
	let postalCodeEl =				document.getElementById('postal-code');
	let countryEl =					document.getElementById('country');
	let messageEl =					document.getElementById('message');
	let progressBarEl =				document.getElementById('progress-bar');
	let progressBarLabelEl =		document.getElementById('progress-bar-label');
	let addressList = [streetNumberEl, routeEl, cityEl, stateEl, postalCodeEl, countryEl];

	//event display
	let eventContainerEl =			document.getElementById('event-container');
	let showEventContainerEl =		document.getElementById('show-event-container');

	let events = [];			//The users events
	let userRef;				//Tag input list
	let eventRef;				//Events
	let extraRef;				//Extra user data
	let placeSearch;			//Location search
	let autocomplete;			//Location search
	let storeExtra = false;		//Store extra user info
	let fieldsCompleted = 0;	//Fields filled out

	//Validation
	let validator = 			new FV.Validator();
	let passwordField = 		new FV.Field("Password1", signupPasswordEl);
	let password2Field = 		new FV.Field("Password2", signupPassword2El, signupPasswordEl);
	let emailField =			new FV.Field('EmailError', signupEmailEl);

	let valCheckLengthEl =		document.getElementById('val-check-length');
	let valCheckSpecialEl =		document.getElementById('val-check-special');
	let valCheckUpperEl =		document.getElementById('val-check-upper');
	let valCheckLowerEl =		document.getElementById('val-check-lower');
	let valCheckMatchEl =		document.getElementById('val-check-match');
	let valCheckRequiredEl =	document.getElementById('val-check-required');
	let valCheckNumberEl =		document.getElementById('val-check-number');
	let valCheckEmailEl =		document.getElementById('val-check-email');

	passwordField.constraints = [
		new FV.Constraint(FV.Validator.MINLENGTH, 
			"* Password must be at least 8 characters long.\n",
			8),
		new FV.Constraint(FV.Validator.CONTAINSUPPER,
			"* Password must contain at least one upper case letter.\n"),
		new FV.Constraint(FV.Validator.CONTAINSLOWER,
			"* Password must contain at least one lower case letter.\n"),
		new FV.Constraint(FV.Validator.CONTAINSSPECIAL,
			"* Password must contain at least one special character (!, @, #, $, %, ^, &, *).\n"),
		new FV.Constraint(FV.Validator.CONTAINSNUMBER,
			"* Password must contain at least one number.\n")
	];

	password2Field.constraints = [new FV.Constraint(FV.Validator.EQUALSFIELD,
			"* Must match your password.\n")];

	emailField.constraints = [new FV.Constraint(FV.Validator.EMAIL, "* Must be a valid email address.\n")];

	validator.fields = [passwordField, password2Field, emailField];


	/******************************************************************
	Sign up functionality
	/******************************************************************

	/**
	 * User is signing up
	 * 
	 */
	APP.signUp = function() {

		ref.createUser({
		  email    : signupEmailEl.value,
		  password : signupPasswordEl.value
		}, function(error, userData) {

		  if (error) {

		    console.log("Error creating user:", error);

		  } else {

		  	storeExtra = true;

		    APP.signIn(signupEmailEl.value, signupPasswordEl.value);

		  }
		  
		});

	};

	/**
	 * Check for various validation errors
	 * 
	 */
	function checkValFields(errorTypes) {

		if(errorTypes.indexOf(FV.Validator.EMAIL) === -1) {

			valCheckEmailEl.className = 'val-check-good';
			valCheckEmailEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i> Must use a valid email address';

		} else {

			valCheckEmailEl.className = 'val-check-bad';
			valCheckEmailEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i> Must use a valid email address';

		}

		if(errorTypes.indexOf(FV.Validator.MINLENGTH) === -1) {

			valCheckLengthEl.className = 'val-check-good';
			valCheckLengthEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i> Password must be at least 8 characters long';

		} else {

			valCheckLengthEl.className = 'val-check-bad';
			valCheckLengthEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i> Password must be at least 8 characters long';

		}

		if(errorTypes.indexOf(FV.Validator.CONTAINSUPPER) === -1) {

			valCheckUpperEl.className = 'val-check-good';
			valCheckUpperEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i> Password must contain at least one upper case character';

		} else {

			valCheckUpperEl.className = 'val-check-bad';
			valCheckUpperEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i> Password must contain at least one upper case character';

		}

		if(errorTypes.indexOf(FV.Validator.CONTAINSLOWER) === -1) {

			valCheckLowerEl.className = 'val-check-good';
			valCheckLowerEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i> Password must contain at least one lower case character';

		} else {

			valCheckLowerEl.className = 'val-check-bad';
			valCheckLowerEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i> Password must contain at least one lower case character';

		}

		if(errorTypes.indexOf(FV.Validator.CONTAINSSPECIAL) === -1) {

			valCheckSpecialEl.className = 'val-check-good';
			valCheckSpecialEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i> Password must contain at least one special character (!, @, #, $, %, ^, &, *)';

		} else {

			valCheckSpecialEl.className = 'val-check-bad';
			valCheckSpecialEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i> Password must contain at least one special character (!, @, #, $, %, ^, &, *)';

		}

		if(errorTypes.indexOf(FV.Validator.EQUALSFIELD) === -1 && signupPasswordEl.value !== '' && signupPassword2El.value !== '') {

			valCheckMatchEl.className = 'val-check-good';
			valCheckMatchEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i> Passwords must match';

		} else {

			valCheckMatchEl.className = 'val-check-bad';
			valCheckMatchEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i> Passwords must match';

		}

		if(errorTypes.indexOf(FV.Validator.CONTAINSNUMBER) === -1) {

			valCheckNumberEl.className = 'val-check-good';
			valCheckNumberEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i> Password must contain at least one number';

		} else {

			valCheckNumberEl.className = 'val-check-bad';
			valCheckNumberEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i> Password must contain at least one number';

		}

		if( signupNameEl.value === '' || signupEmailEl.value === '' || signupPasswordEl.value === '' || signupPassword2El.value === '') {

			valCheckRequiredEl.className = 'val-check-bad';
			valCheckRequiredEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i> All required fields must be filled out';

		} else {

			valCheckRequiredEl.className = 'val-check-good';
			valCheckRequiredEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i> All required fields must be filled out';

		}

	}

	/**
	 * Validate sign up page
	 * 
	 * @param  {Boolean} skipCustomValidation checks if we will show custom validation
	 * 
	 */
	APP.validateSignUp = function (skipCustomValidation) {

		let errors = 			validator.checkForErrors();
		let errorTypes = [];
		let passwordErrors = 	"";
		let password2Errors = 	"";
		let emailErrors =		"";

		errors.forEach(error => {

			switch(error.name) {

				case "Password1":

					passwordErrors += error.error;
					errorTypes.push(error.type);
					break;

				case "Password2":

					password2Errors += error.error;
					errorTypes.push(error.type);
					break;

				case "EmailError":
				
					emailErrors += error.error;
					errorTypes.push(error.type);
					break;	

			}

		});

		if(passwordErrors !== '') {

			passwordErrors = "Please correct the following errors:\n" + passwordErrors;

		}

		if(password2Errors !== '') {

			password2Errors = "Please correct the following errors:\n" + password2Errors;

		}

		if(emailErrors !== '') {

			emailErrors = "Please correct the following errors:\n" + emailErrors;

		}

		//These will only display one at a time
		if (!skipCustomValidation) {

			signupPasswordEl.setCustomValidity(passwordErrors);
			signupPassword2El.setCustomValidity(password2Errors);

		}

		checkValFields(errorTypes);

	};

	/**
	 * Validating input before submitting the password
	 * 
	 */
	submitPasswordButton.onclick = APP.validateSignUp;

	/**
	 * Show/hide additional info
	 * 
	 */
	APP.showAdditionalInfo = function() {

		signupAdditionalInfoEl.hidden = !signupSwitchEl.checked;

	};

	/******************************************************************
	Sign in functionality
	/******************************************************************

	/**
	 * User has signed in
	 *
	 */
	function authHandler (error, authData) {

		if(error) {

			//Handle the error

		} else if (!authData) {

			console.log("User is logged out");

		} else {

			userRef = ref.child('users/' + authData.uid);
			eventRef = userRef.child('events/');
			extraRef = userRef.child('extra/');

			//If just signing up store the extra user data
			if(storeExtra === true) {

				storeExtra = false;

				extraRef.set({

					name: signupNameEl.value,
					employer: signupEmployerEl.value,
					title: signupTitleEl.value,
					birthday: signupBirthday.value

				});

			}

			signOutLinkEl.hidden = false;
			signInLinkEl.hidden = true;

			APP.displayEventCreation();

			/**
			 * Get the data
			 * @param  {Object} snapshot value of the event
			 */
			eventRef.on("value", function(snapshot) {

			  events = snapshot.val();

			  _redrawEvents();
			  
			}, function(err) {

				console.log('Error: ', err);

			});

		}

	}

	/**
	 * User is signing in
	 * 
	 */
	APP.signIn = function(emailIn, passwordIn) {

		var email = emailIn || signInEmailEl.value;
		var password = passwordIn || signInPasswordEl.value;

		// Sign in with an email/password combination
		ref.authWithPassword({
		  email    : email ,
		  password : password
		}, authHandler);

	};

	/******************************************************************
	Sign out functionality
	/******************************************************************

	/**
	 * User is signing out
	 * 
	 */
	APP.signOut = function() {

		signOutLinkEl.hidden = true;
		signInLinkEl.hidden = false;
		ref.unauth();
		eventRef.off();
		extraRef.off();
		userRef = undefined;
		eventRef = undefined;
		extraRef = undefined;
		signInEmailEl.value = 		'';
		signInPasswordEl.value = 	'';
		signupNameEl.value = 		'';
		signupEmailEl.value = 		'';
		signupPasswordEl.value = 	'';
		signupPassword2El.value = 	'';
		_clearElements();
		_clearEl(eventContainerEl);
		APP.showSignIn();

	};

	/******************************************************************
	Reset password functionality
	/******************************************************************

	/**
	 * Reset the users password
	 * 
	 */
	APP.resetPassword = function() {

		ref.resetPassword({
		  email: ""
		}, function(error) {
		  if (error) {
		    switch (error.code) {
		      case "INVALID_USER":
		        console.log("The specified user account does not exist.");
		        break;
		      default:
		        console.log("Error resetting password:", error);
		    }
		  } else {
		    console.log("Password reset email sent successfully!");
		  }
		});

	};

	/******************************************************************
	Event functionality
	/******************************************************************

	/**
	* Instantiate a new vtil object
	* 
	**/ 
	VTILAPP.vtil = new VTIL(contentEl, inputEl, 'VTILAPP.vtil');

	/**
	 * Checks if fields are completed
	 * 
	 */
	APP.checkEventFields = function() {

		let completed = 0;

		if(eventNameEl.value !== '') {

			completed += 1;

		}

		if(eventTypeEl.value !== '') {

			completed += 1;

		}

		if(eventHostEl.value !== '') {

			completed += 1;

		}

		if(startDateEl.value !== '') {

			completed += 1;

		}

		if(endDateEl.value !== '') {

			completed += 1;

		}

		if(VTILAPP.vtil.tags.length > 0) {

			completed += 1;

		}
		
		if(streetNumberEl.value !== '') {

			completed += 1;

		}

		if(routeEl.value !== '') {

			completed += 1;

		}

		if(cityEl.value !== '') {

			completed += 1;

		}
		
		if(stateEl.value !== '') {

			completed += 1;

		}
		
		if(postalCodeEl.value !== '') {

			completed += 1;

		}

		if(countryEl.value !== '') {

			completed += 1;

		}

		if(messageEl.value !== '') {

			completed += 1;

		}
		
		fieldsCompleted = completed;
		progressBarLabelEl.innerHTML = fieldsCompleted.toString() + ' of 13 fields completed'
		progressBarEl.value = fieldsCompleted;

	};

	/**
	 * Display event creation if user has logged in
	 * 
	 */
	APP.displayEventCreation = function() {

		if(eventRef) {

			showEventPlanner();

		}

	};

	/**
	 * Display events if user has logged in
	 * 
	 */
	APP.displayEvents = function() {

		if(eventRef) {

			showEventContainer();

		}

	};

	/**
	* Clear all child elements
	*
	**/ 
	function _clearEl(el) {

		while (el.firstChild) {

			el.removeChild(el.firstChild);

		}

	}

	/**
	 * Draw the events to te screen
	 * 
	 */
	function _redrawEvents() {

		_clearEl(eventContainerEl);

		events.forEach(function(event) {

			//Create the card
			var cardDiv = document.createElement('div');
			cardDiv.className = "card-width mdl-card mdl-shadow--2dp vert-cent animated slideInDown"

			//Card Title
			var cardTitleDiv = document.createElement('div');
			cardTitleDiv.className = "mdl-card__title";
			var headerDiv = document.createElement('h2');
			headerDiv.className = "mdl-card__title-text";
			headerDiv.appendChild(document.createTextNode(event.title));

			var del = document.createElement('a');
			del.setAttribute('href', "#");
			del.setAttribute('title', "Delete");
			del.className = "card-trash";
			del.setAttribute('onclick', 'APP.removeEvent("' + event.id + '")');
			del.innerHTML = '<i class="fa fa-trash-o"></i>';

			headerDiv.appendChild(del);
			cardTitleDiv.appendChild(headerDiv);
			cardDiv.appendChild(cardTitleDiv);

			//Card Body
			var cardContentDiv = document.createElement('div');
			cardContentDiv.className = "mdl-card__supporting-text";
			var p = document.createElement('p');
			p.innerHTML = "<b>" + event.host + '</b> is hosting a ' + '<b>' + 
			event.type + '</b> at ';
			cardContentDiv.appendChild(p);

			p = document.createElement('p');
			p.innerHTML = event.address + '<br />' + event.city + ', ' + 
			event.state + ' ' + event.zip + '<br />' + event.country;
			cardContentDiv.appendChild(p);

			p = document.createElement('p');
			p.appendChild(document.createTextNode("on"));
			cardContentDiv.appendChild(p);

			p = document.createElement('p');
			var begin = new Date(event.begin);
			var end = new Date(event.end);
			p.innerHTML = '<b>' + begin.toLocaleString() + '</b>' + ' to ' + 
			'<b>' + end.toLocaleString() + '</b>';
			cardContentDiv.appendChild(p);

			p = document.createElement('p');
			p.innerHTML = 'and <b>' + event.host + '</b> wishes to let you know that<br/>' + event.message;
			cardContentDiv.appendChild(p);

			cardDiv.appendChild(cardContentDiv);
			eventContainerEl.appendChild(cardDiv);

		});

	}

	/**
	 * Add a person
	 * 
	 */
	APP.addTag = function() {

		VTILAPP.vtil.addTag();
		APP.checkEventFields();

	};
 
	/**
	 * Clear guests
	 * 
	 */
	function _clearGuests() {

		var tags = VTILAPP.vtil.tags.slice(0);

		tags.forEach(function(tag) {

			VTILAPP.vtil.removeTag(tag.id);

		});

	}

	/**
	 * Clear the address elements
	 * @param  {Boolean} pred disable the field or not?
	 * 
	 */
	function _clearAddress(pred) {

		addressList.forEach(function(addressEl) {

		  	addressEl.value = '';
		  	addressEl.disabled = pred;

		  });

	}

	/**
	 * Clear the form elements
	 * 
	 */
	function _clearElements() {

		eventNameEl =				document.getElementById('eventName');
		eventTypeEl =				document.getElementById('eventType');
		eventHostEl =				document.getElementById('eventHost');
		startDateEl =				document.getElementById('startDate');
		endDateEl =					document.getElementById('endDate');
		locationInputEl	=			document.getElementById('location-input');

		_clearAddress(true);
		_clearGuests();

	}

	/**
	 * Fills in the address when the location is retrieved
	 * 
	 */
	function _fillInAddress() {
	  // Get the place details from the autocomplete object.
	  var place = autocomplete.getPlace();

	  _clearAddress(false);

	  // Get each component of the address from the place details
	  // and fill the corresponding field on the form.
	  for (var component of place.address_components) {

	    var addressType = component.types[0];

	    switch(addressType) {

	    	//Address1
	    	case 'street_number':
	    		streetNumberEl.value = component.short_name;
	    		break;

	    	//Address2
	    	case 'route':
	    		routeEl.value = component.short_name;
	    		break;

	    	//City
	    	case 'locality':
	    		cityEl.value = component.short_name;
	    		break;

	    	//State
	    	case 'administrative_area_level_1':
	    		stateEl.value = component.short_name;
	    		break;

	    	//Zip
	    	case 'postal_code':
	    		postalCodeEl.value = component.short_name;
	    		break;

	    	//Country
	    	case 'country':
	    		countryEl.value = component.short_name;
	    		break;

	    }

	  }

	}

	/**
	 * Initializes the autocomplete object using the location
	 * 
	 */
	APP.initAutocomplete = function() {
	  // Create the autocomplete object, restricting the search to geographical
	  // location types.
	  autocomplete = new google.maps.places.Autocomplete(
	      /** @type {!HTMLInputElement} */(locationInputEl),
	      {types: ['geocode']});

	  // When the user selects an address from the dropdown, populate the address
	  // fields in the form.
	  autocomplete.addListener('place_changed', _fillInAddress);
	};

	/**
	 * Get the location
	 * 
	 */
	APP.geolocate = function() {

	  if (navigator.geolocation) {

	    navigator.geolocation.getCurrentPosition(function(position) {

	      let geolocation = {

	        lat: position.coords.latitude,
	        lng: position.coords.longitude

	      };

	      let circle = new google.maps.Circle({

	        center: geolocation,
	        radius: position.coords.accuracy

	      });

	      autocomplete.setBounds(circle.getBounds());

	    });

	  }

	};

	/**
	 * Remove an event from events
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	APP.removeEvent = function(id) {

		let index = -1;

		for(let i = 0; i < events.length; ++i) {

			if(id === events[i].id) {

				index = i;
				break;

			}

		}

		if(index !== -1) {

			events = events.splice(index, 1);
			eventRef.set(events);

		}

	};

	/**
	 * Save the event
	 *
	 */
	APP.submitForm = function() {

		var d = new Date();

		events.push({

			'id': 		d.toISOString(),
			'title': 	eventNameEl.value,
			'type': 	eventTypeEl.value,
			'host': 	eventHostEl.value,
			'begin': 	startDateEl.value,
			'end': 		endDateEl.value,
			'guests': 	VTILAPP.vtil.tags,
			'address': 	streetNumberEl.value + ' ' + routeEl.value,
			'city': 	cityEl.value,
			'state': 	stateEl.value,
			'zip': 		postalCodeEl.value,
			'country': 	countryEl.value,
			'message': 	messageEl.value

		});

		eventRef.set(events);

		_clearElements();

	};

	/**
	 * Sign out on exit
	 * 
	 */
	window.onbeforeunload = APP.signOut;

	/******************************************************************
	Display functionality
	/******************************************************************

	/**
	 * Show the sign up form
	 * 
	 */
	APP.showSignUp = function() {

		signInContainerEl.hidden = true;
		eventPlannerContainerEl.hidden = true;
		signUpContainerEl.hidden = false;
		resetPasswordContainerEl.hidden = true;
		showEventContainerEl.hidden = true;
		APP.validateSignUp(true);

	};

	/**
	 * Show the sign in form
	 * 
	 */
	APP.showSignIn = function() {

		signInContainerEl.hidden = false;
		eventPlannerContainerEl.hidden = true;
		signUpContainerEl.hidden = true;
		resetPasswordContainerEl.hidden = true
		showEventContainerEl.hidden = true;

	};

	/**
	 * Show the event planner
	 * 
	 */
	function showEventPlanner () {

		signInContainerEl.hidden = true;
		eventPlannerContainerEl.hidden = false;
		signUpContainerEl.hidden = true;
		resetPasswordContainerEl.hidden = true;
		showEventContainerEl.hidden = true;

		APP.checkEventFields();

	};

	/**
	 * Show the reset password screen
	 * 
	 */
	APP.showResetPassword = function() {

		signInContainerEl.hidden = true;
		eventPlannerContainerEl.hidden = true;
		signUpContainerEl.hidden = true;
		resetPasswordContainerEl.hidden = false;
		showEventContainerEl.hidden = true;

	};

	/**
	 * Show the events
	 * 
	 */
	function showEventContainer () {

		signInContainerEl.hidden = true;
		eventPlannerContainerEl.hidden = true;
		signUpContainerEl.hidden = true;
		resetPasswordContainerEl.hidden = true;
		showEventContainerEl.hidden = false;

	};

})(document);