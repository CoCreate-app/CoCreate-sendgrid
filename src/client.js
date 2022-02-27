import api from '@cocreate/api'

const CoCreateSendGrid = {
	name: 'sendgrid',
	actions: {
		domainList: {},
		domainAuthenticate: {},
		sendDNSEmail: {},
		getSubUsersList: {},
		postSubUser: {},
		getMarketingContacts: {},
		postMarketingContact: {},
		getMarketingStats: {},
		getMarketingSinglesends: {},
		getEmailAddress: {},
		EmailValidation: {},
		sendEmail: {},
		domainValidate: {}
	}
}

api.init({
	name: CoCreateSendGrid.name, 
	component:	CoCreateSendGrid
});

export default CoCreateSendGrid;