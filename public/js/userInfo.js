/*jshint esversion: 6 */

var UserInfo = (function() {
	'use strict';

	let _userInfoNameEl = 				document.getElementById('user-info-name');
	let _userInfoEmployerEl = 			document.getElementById('user-info-employer');
	let _userInfoTitleEl = 				document.getElementById('user-info-title');
	let _userInfoBirthdayEl = 			document.getElementById('user-info-birthday');
	let _submitUserInfoButtonEl = 		document.getElementById('submit-user-info-button');
	let _userInfoSpinnerEl =			document.getElementById('user-info-spinner');
	let _userInfoOldPassword =			document.getElementById('user-info-old-password');
	let _userInfoNewPassword =			document.getElementById('user-info-new-password');
	let _userInfoNewPasswordRepeated =	document.getElementById('user-info-new-password-repeated');
	let _changePasswordButtonEl =		document.getElementById('change-password-button');
	let _userValCheckRequiredEl = 		document.getElementById('user-val-check-required');
	let _userValCheckLengthEl = 		document.getElementById('user-val-check-length');
	let _userValCheckUpperEl = 			document.getElementById('user-val-check-upper');
	let _userValCheckLowerEl = 			document.getElementById('user-val-check-lower');
	let _userValCheckNumberEl = 		document.getElementById('user-val-check-number');
	let _userValCheckMatchEl = 			document.getElementById('user-val-check-match');
	let _userNameDivEl =				document.getElementById('user-name-div');
	let _userOrganizationDivEl =		document.getElementById('user-organization-div');
	let _userJobDivEl =					document.getElementById('user-job-div');
	let _userBdayDivEl =				document.getElementById('user-bday-div');

	let _validator = 				new FV.Validator();
	let _passwordField = 			new FV.Field("Password1", _userInfoNewPassword);
	let _password2Field = 			new FV.Field("Password2", _userInfoNewPasswordRepeated, _userInfoNewPassword);

	_passwordField.constraints = [
		new FV.Constraint(FV.Validator.MINLENGTH, 
			"* Password must be at least 8 characters long.\n",
			8),
		new FV.Constraint(FV.Validator.CONTAINSUPPER,
			"* Password must contain at least one upper case letter.\n"),
		new FV.Constraint(FV.Validator.CONTAINSLOWER,
			"* Password must contain at least one lower case letter.\n"),
		new FV.Constraint(FV.Validator.CONTAINSNUMBER,
			"* Password must contain at least one number.\n")
	];

	_password2Field.constraints = [new FV.Constraint(FV.Validator.EQUALSFIELD,
			"* Must match your password.\n")];

	_validator.fields = [_passwordField, _password2Field];

	_submitUserInfoButtonEl.disabled = true;

	/**
	 * Private function for showing good/bad auth messages
	 * @param  {array} errorTypes Holds the errors present
	 * 
	 */
	function _checkValFields(errorTypes) {

		if(errorTypes.indexOf(FV.Validator.MINLENGTH) === -1) {

			_userValCheckLengthEl.className = 'val-check-good';
			_userValCheckLengthEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i>&nbsp;&nbsp;Password must be at least 8 characters long';

		} else {

			_userValCheckLengthEl.className = 'val-check-bad';
			_userValCheckLengthEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i>&nbsp;&nbsp;Password must be at least 8 characters long';

		}

		if(errorTypes.indexOf(FV.Validator.CONTAINSUPPER) === -1) {

			_userValCheckUpperEl.className = 'val-check-good';
			_userValCheckUpperEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i>&nbsp;&nbsp;Password must contain at least one upper case character';

		} else {

			_userValCheckUpperEl.className = 'val-check-bad';
			_userValCheckUpperEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i>&nbsp;&nbsp;Password must contain at least one upper case character';

		}

		if(errorTypes.indexOf(FV.Validator.CONTAINSLOWER) === -1) {

			_userValCheckLowerEl.className = 'val-check-good';
			_userValCheckLowerEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i>&nbsp;&nbsp;Password must contain at least one lower case character';

		} else {

			_userValCheckLowerEl.className = 'val-check-bad';
			_userValCheckLowerEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i>&nbsp;&nbsp;Password must contain at least one lower case character';

		}

		if(errorTypes.indexOf(FV.Validator.EQUALSFIELD) === -1 && _userInfoNewPassword.value !== '' && _userInfoNewPasswordRepeated.value !== '') {

			_userValCheckMatchEl.className = 'val-check-good';
			_userValCheckMatchEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i>&nbsp;&nbsp;Passwords must match';

		} else {

			_userValCheckMatchEl.className = 'val-check-bad';
			_userValCheckMatchEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i>&nbsp;&nbsp;Passwords must match';

		}

		if(errorTypes.indexOf(FV.Validator.CONTAINSNUMBER) === -1) {

			_userValCheckNumberEl.className = 'val-check-good';
			_userValCheckNumberEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i>&nbsp;&nbsp;Password must contain at least one number';

		} else {

			_userValCheckNumberEl.className = 'val-check-bad';
			_userValCheckNumberEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i>&nbsp;&nbsp;Password must contain at least one number';

		}

		if( _userInfoOldPassword === '' || _userInfoNewPassword.value === '' || _userInfoNewPasswordRepeated.value === '') {

			_userValCheckRequiredEl.className = 'val-check-bad';
			_userValCheckRequiredEl.innerHTML = '<i class="fa fa-thumbs-o-down"></i>&nbsp;&nbsp;All required fields must be filled out';

		} else {

			_userValCheckRequiredEl.className = 'val-check-good';
			_userValCheckRequiredEl.innerHTML = '<i class="fa fa-thumbs-o-up"></i>&nbsp;&nbsp;All required fields must be filled out';

		}

	}

	/**
	 * Add info to the page
	 * @param {object} snapshot The user info
	 */
	function _addInfo (snapshot) {

		let info = snapshot.val();

		_userInfoNameEl.value = info.name;

		if(_userInfoNameEl.value) {

			_userNameDivEl.className += ' is-dirty';

		}

		_userInfoEmployerEl.value =	info.employer;

		if(_userInfoEmployerEl.value) {

			_userOrganizationDivEl.className += ' is-dirty';

		}

		_userInfoTitleEl.value = info.title;

		if(_userInfoTitleEl.value) {

			_userJobDivEl.className += ' is-dirty';

		}

		_userInfoBirthdayEl.value =	info.birthday;

		if(_userInfoBirthdayEl.value) {

			_userBdayDivEl.className += ' is-dirty';

		}

		UserInfo.checkFields();

	}	

	

	/**
	 * Represents an UserInfo Planner Page
	 * @class UserInfo
	 * 
	 */
	return class UserInfo {

		/**
	     * UserInfo constructor.
	     * @constructs UserInfo
	     */
		constructor(extraRef, ref) {

			/**
	         * The events
	         * @member UserInfo#extraRef
	         * @type {object}
	         */
			this.extraRef = extraRef;

			/**
	         * Firebase ref
	         * @member UserInfo#ref
	         * @type {object}
	         */
			this.ref = ref;

			/**
	         * Users email
	         * @member UserInfo#email
	         * @type {string}
	         */
			this.email = undefined;

		}

		/**
		 * Name Element
		 * @return {Object} Name Element
		 * @memberof UserInfo
		 * @type {Object}
		 * 
		 */
		static get userInfoNameEl() {

			return _userInfoNameEl;

		}	

		/** 
		*   @function checkFields
		*   @memberof UserInfo
		*   
		*/
		static checkFields() {

			_submitUserInfoButtonEl.disabled = _userInfoNameEl.value === '';

		}

		/**
		 * Check Password Validation
		 * @function checkPasswords
		 * @memberof UserInfo
		 * 
		 */
		static checkPasswords() {

			let errors = 			_validator.checkForErrors();
			let errorTypes = 		[];
			let passwordErrors = 	"";
			let password2Errors = 	"";

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

				}

			});

			if(passwordErrors !== '') {

				passwordErrors = "Please correct the following errors:\n" + passwordErrors;

			}

			if(password2Errors !== '') {

				password2Errors = "Please correct the following errors:\n" + password2Errors;

			}

			_userInfoNewPassword.setCustomValidity(passwordErrors);
			_userInfoNewPasswordRepeated.setCustomValidity(password2Errors);

			_changePasswordButtonEl.disabled = errorTypes.length > 0;
			_checkValFields(errorTypes);

		}

		/**
		 * Changes the users password
		 * @function changePassword
		 * @memberof UserInfo
		 * @instance
		 * 
		 */
		changePassword() {

			_userInfoSpinnerEl.hidden = false;
			Displayer.userInfoContainerEl.hidden = true;

			this.ref.changePassword({

			  email: this.email,
			  oldPassword: _userInfoOldPassword.value,
			  newPassword: _userInfoNewPassword.value

			}, function(error) {

				_userInfoSpinnerEl.hidden = true;
				Displayer.userInfoContainerEl.hidden = false;

				if (error) {

					switch (error.code) {

					  case "INVALID_PASSWORD":
					    
					    Displayer.showSnackbar('Sorry!  The password is incorrect.  :-(');
					    break;

					  case "INVALID_USER":

					    Displayer.showSnackbar('Sorry!  The user account doesn\'t exist.  :-(');
					    break;

					  default:

					    Displayer.showSnackbar('Sorry!  There was an error changing your password.  :-(');
					
					}

				} else {

				Displayer.showSnackbar('Nice!  You just got yourself a brand new password.  :-)');
				}

				//Reset Vals
				_userInfoOldPassword.value = 			'';
			  	_userInfoNewPassword.value = 			'';
			  	_userInfoNewPasswordRepeated.value = 	'';
			  	UserInfo.checkPasswords();

			});

		}

		/**
		 * Updates the user info
		 * @function saveInfo
		 * @memberof UserInfo
		 * @instance
		 * 
		 */
		saveInfo() {

			_userInfoSpinnerEl.hidden = false;
			Displayer.userInfoContainerEl.hidden = true;

			this.extraRef.update({

				name: 		_userInfoNameEl.value,
				employer: 	_userInfoEmployerEl.value,
				title: 		_userInfoTitleEl.value,
				birthday: 	_userInfoBirthdayEl.value

			}, function(error) {

				_userInfoSpinnerEl.hidden = true;
				Displayer.userInfoContainerEl.hidden = false;

				if(error) {

					Displayer.showSnackbar('Error updating your info, Please forgive me! :-(');

				} else {

					Displayer.showSnackbar('Info upated, Aaaaawwwww Yeah! :-)');

				}

			});

		}

		/**
		 * Listens for user info data
		 * @function listenForData
		 * @memberof UserInfo
		 * @instance
		 * 
		 */
		listenForData() {

			try {

				this.extraRef.on("value", _addInfo);

			} catch(e) {

				//Sometimes we end up here signing out

			}

		}

		/**
		 * Turn off the extra fb listener
		 * @function dispose
		 * @memberof UserInfo
		 * @private
		 * @instance
		 * 
		 */
		dispose() {

			this.extraRef.off("value", _addInfo);

			this.extraRef =					undefined;
			this.ref =						undefined;
			this.email =					undefined;

			_userInfoNameEl.value = 		'';
			_userInfoEmployerEl.value = 	'';
			_userInfoTitleEl.value = 		'';
			_userInfoBirthdayEl.value = 	'';
			_userInfoOldPassword = 			'';
			_userInfoNewPassword = 			'';
			_userInfoNewPasswordRepeated = 	'';

		}

	};

})();