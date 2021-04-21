'use strict';
const api = require('@cocreate/api');
const axios = require("axios").default;
const sgMail = require('@sendgrid/mail');

const hostName = "https://api.sendgrid.com/v3";

class CoCreateSendGrid {
  constructor(wsManager) {
    this.wsManager = wsManager;
    this.module_id = "sendgrid";
    this.enviroment = 'test';
    this.init();
    this.apiKey = null;
    this.apiKeyMail = null;
  }

  init() {
    if (this.wsManager) {
      //this.wsManager.on(this.module_id, (socket, data) => this.sendSendGrid(socket, data));
      this.wsManager.on(this.module_id,		(socket, data, roomInfo) => this.sendSendGrid(socket, data, roomInfo));
    }
  }

  async sendSendGrid(socket, data,roomInfo) {
    console.log("Data sengrid ",data)
    const type = data['type'];
    let params = data['data'];
    const module_id = this.module_id;
    
    	 // connect api
  	 try{
  	       let enviroment = typeof params['enviroment'] != 'undefined' ? params['enviroment'] : this.enviroment;
           let org_row = await api.getOrg(params,this.module_id);
           this.apiKey = org_row['apis.'+this.module_id+'.'+enviroment+'.apiKey'];
           this.apiKeyMail = org_row['apis.'+this.module_id+'.'+enviroment+'.apiKeyMail'];
           console.log("API sengrid ",this.apiKeyMail)
           sgMail.setApiKey(this.apiKeyMail);
  	 }catch(e){
  	   	console.log(this.module_id+" : Error Connect to api",e)
  	   	return false;
  	 }
  
		
		
		/// WE NEED APIKEY IN ALL METHODS, BUT APIKEY IS ON SOCKET LISTEN
		//vars asign by jeanmendoza 13_abril_2021 params = params["data"];
		params = params["data"];
    switch (type) {
      case 'sendEmail':
        await this.sendEmail(socket, type, params);
        break;

      case 'domainList':
        await this.getDomainList(socket, type, params);
        break;

      case 'domainAuthenticate':
        await this.authenticateDomain(socket, type, params);
        break;
        
      case 'domainValidate':
        await this.domainValidate(socket, type, params);
        break;
        
      case 'sendDNSEmail':
        await this.sendDNSEmail(socket, type, params);
        break;

      case 'getSubUsersList':
        await this.getSubUsersList(socket, type, params);
        break;

      case 'postSubUser':
        await this.postSubUser(socket, type, params);
        break;

      case 'postSubUser':
        await this.postSubUser(socket, type, params);
        break;

      case 'getMarketingContacts':
        await this.getMarketingContacts(socket, type, params);
        break;

      case 'postMarketingContact':
        await this.postMarketingContact(socket, type, params);
        break;

      case 'getMarketingStats':
        await this.getMarketingStats(socket, type, params);
        break;

      case 'getMarketingSinglesends':
        await this.getMarketingSinglesends(socket, type, params);
        break;

      case 'EmailValidation':
        await this.EmailValidation(socket, type, params);
        break;

      case 'getEmailAddress':
        await this.getEmailAddress(socket, type, params);
        break;

    }
  }

  async sendEmail(socket, type, params) {
    try {
      const { to, from , subject, html } = params
     let text=(typeof params['text'] == 'undefined') ? 'Cocreate' :  params['text'];
		const msg = {
		  to,
		  from,
		  subject,
		  text,
		  html,
		};
		console.log("msg ",msg)
		const data = await sgMail.send(msg);
		
    	api.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getDomainList(socket, type, params) {
    try {
      const { data } = await axios.get(`${hostName}/whitelabel/domains`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      api.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async authenticateDomain(socket, type, params) {
    try {
      const { domain_name } = params
      const { data } = await axios.post(`${hostName}/whitelabel/domains`, {
        domain: domain_name,
        custom_spf: false,
        default: false,
        valid:true,
        automatic_security: true
      }, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      api.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async sendDNSEmail(socket, type, params) {
    try {
      const { link_id, domain_id, email } = params
      const { data } = await axios.post(`${hostName}/whitelabel/dns/email`, {
        "link_id": Number(link_id),
        "domain_id": Number(domain_id),
        email
      }, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      api.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async postSubUser(socket, type, params) {
    try {
      const { username, email, password, ips } = params
      const { data } = await axios.post(`${hostName}/subusers`, {
        username,
        email,
        password,
        ips
      }, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      api.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getSubUsersList(socket, type) {
    try {
      const { data } = await axios.get(`${hostName}/subusers`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      api.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getMarketingContacts(socket, type) {
    try {
      const { data } = await axios.get(`${hostName}/marketing/contacts`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      api.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async postMarketingContact(socket, type, params) {
    try {
      const { email, first_name, last_name, city, country, postal_code, address_line_1 } = params
      const { data } = await axios.put(`${hostName}/marketing/contacts`, {
        "contacts": [
          {
            address_line_1,
            "alternate_emails": [email],
            city,
            country,
            email,
            first_name,
            last_name,
            postal_code,
            "custom_fields": {}
          }
        ]
      }, {
        "headers": {
          "authorization": this.apiKey,
          "Content-Type": "application/json"
        }
      })
      api.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getMarketingStats(socket, type) {
    try {
      const { data } = await axios.get(`${hostName}/marketing/stats/automations`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      api.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getMarketingSinglesends(socket, type) {
    try {
      const { data } = await axios.get(`${hostName}/marketing/stats/singlesends`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      api.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async EmailValidation(socket, type, params) {
    try {
      const { email } = params
      const { data } = await axios.post(`${hostName}/validations/email`, { email }, {
        "headers": {
          "authorization": this.apiKey,
          "Content-Type": "application/json"
        }
      })
      api.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getEmailAddress(socket, type) {
    try {
      const { data:userEmail } = await axios.get(`${hostName}/user/email`, {
        "headers": {
          "authorization": this.apiKey,
          "Content-Type": "application/json"
        }
      })
        const { data } = await axios.get(`${hostName}/verified_senders`, {
        "headers": {
          "authorization": this.apiKey,
          "Content-Type": "application/json"
        }
      })
      const resposne = {
        data:  { "userEmail"  :userEmail.email,	"results" : data.results },
        object: "list"
      }
      api.send_response(this.wsManager, socket, { "type": type, "response": resposne }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async domainValidate(socket, type, params) {
    try {
      const { id_domain } = params
      const { data } = await axios.post(`${hostName}/whitelabel/domains/${id_domain}/validate`,{}, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      
      api.send_response(this.wsManager, socket, { "type": type, "response": data }, this.module_id)

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }
  
  handleError(socket, type, error) {
    console.log(error)
    const response = {
      'object': 'error',
      'data': error.response || error.response.data || error.response.body || error.message || error,
    };
    api.send_response(this.wsManager, socket, { type, response }, this.module_id);
  }
  
}

module.exports = CoCreateSendGrid;