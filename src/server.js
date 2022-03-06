'use strict';
const api = require('@cocreate/api');
const axios = require("axios").default;
const sgMail = require('@sendgrid/mail');

const hostName = "https://api.sendgrid.com/v3";

class CoCreateSendGrid {
  constructor(wsManager) {
    this.wsManager = wsManager;
    this.name = "sendgrid";
    this.init();
    this.apiKey = null;
    this.apiKeyMail = null;
  }

  init() {
    if (this.wsManager) {
      this.wsManager.on(this.name, (socket, data, socketInfo) => this.sendSendGrid(socket, data, socketInfo));
    }
  }

  async sendSendGrid(socket, data, socketInfo) {
		let params = data['data'];
    let action = data['action'];
		let environment;

    try{
      let org = await api.getOrg(data, this.name);
      if (params.environment){
        environment = params['environment'];
        delete params['environment'];  
      } else {
        environment = org.apis[this.name].environment;
      }

      this.apiKey = org.apis[this.name][environment].apiKey;
      this.apiKeyMail = org.apis[this.name][environment].apiKeyMail;
      if(this.apiKeyMail)
        sgMail.setApiKey(this.apiKeyMail);
    } catch (e) {
      console.log(this.name + " : Error Connect to api", e)
      return false;
    }

    try{
      let response;
      switch (action) {
        case 'sendEmail':
          response = await this.sendEmail(socket, action, params);
          break;

        case 'domainList':
          response = await this.getDomainList(socket, action, params);
          break;

        case 'domainAuthenticate':
          response = await this.authenticateDomain(socket, action, params);
          break;

        case 'domainValidate':
          response = await this.domainValidate(socket, action, params);
          break;

        case 'sendDNSEmail':
          response = await this.sendDNSEmail(socket, action, params);
          break;

        case 'getSubUsersList':
          response = await this.getSubUsersList(socket, action, params);
          break;

        case 'postSubUser':
          response = await this.postSubUser(socket, action, params);
          break;

        case 'postSubUser':
          response = await this.postSubUser(socket, action, params);
          break;

        case 'getMarketingContacts':
          response = await this.getMarketingContacts(socket, action, params);
          break;

        case 'postMarketingContact':
          response = await this.postMarketingContact(socket, action, params);
          break;

        case 'getMarketingStats':
          response = await this.getMarketingStats(socket, action, params);
          break;

        case 'getMarketingSinglesends':
          response = await this.getMarketingSinglesends(socket, action, params);
          break;

        case 'EmailValidation':
          response = await this.EmailValidation(socket, action, params);
          break;

        case 'getEmailAddress':
          response = await this.getEmailAddress(socket, action, params);
          break;

      }
      this.wsManager.send(socket, this.name, { action, response })

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  handleError(socket, action, error) {
    const response = {
      'object': 'error',
      'data': error || error.response || error.response.data || error.response.body || error.message || error,
    };
    this.wsManager.send(socket, this.name, { action, response })
  }	

  async sendEmail(params) {
      const { to, from, subject, html } = params
      console.log("Console ", typeof params['text'])
      let text = (typeof params['text'] == 'undefined' || params['text'] == '') ? 'Cocreate' : params['text'];
      const msg = {
        to,
        from,
        subject,
        text,
        html,
      };
      console.log("msg ", msg)
      const response = await sgMail.send(msg);
      return response;
  }

  async getDomainList() {
    const response = await axios.get(`${hostName}/whitelabel/domains`, {
      "headers": {
        "authorization": this.apiKey,
      }
    })
    return response;
  }

  async authenticateDomain(socket, action, params) {
    try {
      const { domain_name } = params
      const data = await axios.post(`${hostName}/whitelabel/domains`, {
        domain: domain_name,
        custom_spf: false,
        default: false,
        valid: true,
        automatic_security: true
      }, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async sendDNSEmail(socket, action, params) {
    try {
      const { link_id, domain_id, email } = params
      const data = await axios.post(`${hostName}/whitelabel/dns/email`, {
        "link_id": Number(link_id),
        "domain_id": Number(domain_id),
        email
      }, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async postSubUser(socket, action, params) {
    try {
      const { username, email, password, ips } = params
      const data = await axios.post(`${hostName}/subusers`, {
        username,
        email,
        password,
        ips
      }, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async getSubUsersList(socket, action) {
    try {
      const data = await axios.get(`${hostName}/subusers`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async getMarketingContacts(socket, action) {
    try {
      const data = await axios.get(`${hostName}/marketing/contacts`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async postMarketingContact(socket, action, params) {
    try {
      const { email, first_name, last_name, city, country, postal_code, address_line_1 } = params
      const data = await axios.put(`${hostName}/marketing/contacts`, {
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
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async getMarketingStats(socket, action) {
    try {
      const data = await axios.get(`${hostName}/marketing/stats/automations`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async getMarketingSinglesends(socket, action) {
    try {
      const data = await axios.get(`${hostName}/marketing/stats/singlesends`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      const resposne = {
        data: data,
        object: "list"
      }
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async EmailValidation(socket, action, params) {
    try {
      const { email } = params
      const data = await axios.post(`${hostName}/validations/email`, { email }, {
        "headers": {
          "authorization": this.apiKey,
          "Content-Type": "application/json"
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async getEmailAddress(socket, action) {
    try {
      const { data: userEmail } = await axios.get(`${hostName}/user/email`, {
        "headers": {
          "authorization": this.apiKey,
          "Content-Type": "application/json"
        }
      })
      const data = await axios.get(`${hostName}/verified_senders`, {
        "headers": {
          "authorization": this.apiKey,
          "Content-Type": "application/json"
        }
      })
      const resposne = {
        data: { "userEmail": userEmail.email, "results": data.results },
        object: "list"
      }
      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

  async domainValidate(socket, action, params) {
    try {
      const { id_domain } = params
      const data = await axios.post(`${hostName}/whitelabel/domains/${id_domain}/validate`, {}, {
        "headers": {
          "authorization": this.apiKey,
        }
      })

      return data;

    } catch (error) {
      this.handleError(socket, action, error)
    }
  }

}

module.exports = CoCreateSendGrid;