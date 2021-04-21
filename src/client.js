import api from '@cocreate/api'

const CoCreateSendGrid = {
	id: 'sendgrid',
	actions: [
		'domainList',
		'domainAuthenticate',
		'sendDNSEmail',
		'getSubUsersList',
		'postSubUser',
		'getMarketingContacts',
		'postMarketingContact',
		'getMarketingStats',
		'getMarketingSinglesends',
		'getEmailAddress',
		'EmailValidation',
		'sendEmail',
		'domainValidate'
	],

	render_domainList: function (data) {
		console.log(data);
	},

	render_domainValidate: function (data) {
		console.log(data);
	},
	render_domainAuthenticate: function (data) {
		if (data.object == "error") {
            alert(data.data)
        }
		//console.log(data);
		data = {data: data};
    	console.log("DAta ",data)
    	CoCreate.api.render('sendgridDomainAuthenticate', data);	
	},

	render_sendDNSEmail: function (data) {
		console.log(data);
	},

	render_getSubUsersList: function (data) {
		console.log(data);
	},

	render_getMarketingContacts: function (data) {
		console.log(data);
	},
	
	render_postMarketingContact: function (data) {
		console.log(data);
	},
	
	render_getMarketingStats: function (data) {
		console.log(data);
	},
	
	render_getMarketingSinglesends: function (data) {
		console.log(data);
	},
	
	render_getEmailAddress: function (data) {
		console.log(data);
	},
	
	render_EmailValidation: function (data) {
		console.log(data);
	},
	
	render_sendEmail : function (data) {
		console.log(data);
	},
}

api.init({
	name: CoCreateSendGrid.id, 
	module:	CoCreateSendGrid
});

export default CoCreateSendgrid;