'use strict';
const api = require('@cocreate/api');
const axios = require("axios").default;
const sgMail = require('@sendgrid/mail');

const hostName = "https://api.sendgrid.com/v3";

class CoCreateSendGrid {
  constructor(wsManager) {
    this.wsManager = wsManager;
    this.moduleName = "sendgrid";
    this.init();
    this.apiKey = null;
    this.apiKeyMail = null;
  }

  init() {
    if (this.wsManager) {
      this.wsManager.on(this.moduleName, (socket, data, roomInfo) => this.sendSendGrid(socket, data, roomInfo));
    }
  }

  async sendSendGrid(socket, data, roomInfo) {
		let params = data['data'];
    let type = data['type'];
		let environment;

    try{
      let org = await api.getOrg(data, this.moduleName);
      if (params.environment){
        environment = params['environment'];
        delete params['environment'];  
      } else {
        environment = org['apis.' + this.moduleName + '.environment'];
      }

      this.apiKey = org['apis.' + this.moduleName + '.' + enviroment + '.apiKey'];
      this.apiKeyMail = org['apis.' + this.moduleName + '.' + enviroment + '.apiKeyMail'];
      if(this.apiKeyMail)
        sgMail.setApiKey(this.apiKeyMail);
    } catch (e) {
      console.log(this.moduleName + " : Error Connect to api", e)
      return false;
    }

    let response;
    try{
      switch (type) {
        case 'sendEmail':
          response = await this.sendEmail(socket, type, params);
          break;

        case 'domainList':
          response = await this.getDomainList(socket, type, params);
          break;

        case 'domainAuthenticate':
          response = await this.authenticateDomain(socket, type, params);
          break;

        case 'domainValidate':
          response = await this.domainValidate(socket, type, params);
          break;

        case 'sendDNSEmail':
          response = await this.sendDNSEmail(socket, type, params);
          break;

        case 'getSubUsersList':
          response = await this.getSubUsersList(socket, type, params);
          break;

        case 'postSubUser':
          response = await this.postSubUser(socket, type, params);
          break;

        case 'postSubUser':
          response = await this.postSubUser(socket, type, params);
          break;

        case 'getMarketingContacts':
          response = await this.getMarketingContacts(socket, type, params);
          break;

        case 'postMarketingContact':
          response = await this.postMarketingContact(socket, type, params);
          break;

        case 'getMarketingStats':
          response = await this.getMarketingStats(socket, type, params);
          break;

        case 'getMarketingSinglesends':
          response = await this.getMarketingSinglesends(socket, type, params);
          break;

        case 'EmailValidation':
          response = await this.EmailValidation(socket, type, params);
          break;

        case 'getEmailAddress':
          response = await this.getEmailAddress(socket, type, params);
          break;

      }
      this.wsManager.send(socket, this.moduleName, { type, response })

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  handleError(socket, type, error) {
    const response = {
      'object': 'error',
      'data': error || error.response || error.response.data || error.response.body || error.message || error,
    };
    this.wsManager.send(socket, this.moduleName, { type, response })
  }	

  async sendEmail(socket, type, params) {
    try {
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
      const data = await sgMail.send(msg);

      return data;

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getDomainList(socket, type, params) {
    try {
      const data = await axios.get(`${hostName}/whitelabel/domains`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async authenticateDomain(socket, type, params) {
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
      this.handleError(socket, type, error)
    }
  }

  async sendDNSEmail(socket, type, params) {
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
      this.handleError(socket, type, error)
    }
  }

  async postSubUser(socket, type, params) {
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
      this.handleError(socket, type, error)
    }
  }

  async getSubUsersList(socket, type) {
    try {
      const data = await axios.get(`${hostName}/subusers`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async getMarketingContacts(socket, type) {
    try {
      const data = await axios.get(`${hostName}/marketing/contacts`, {
        "headers": {
          "authorization": this.apiKey,
        }
      })
      return data;

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

  async postMarketingContact(socket, type, params) {
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
      this.handleError(socket, type, error)
    }
  }

  async getMarketingStats(socket, type) {
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
      this.handleError(socket, type, error)
    }
  }

  async getMarketingSinglesends(socket, type) {
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
      this.handleError(socket, type, error)
    }
  }

  async EmailValidation(socket, type, params) {
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
      this.handleError(socket, type, error)
    }
  }

  async getEmailAddress(socket, type) {
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
      this.handleError(socket, type, error)
    }
  }

  async domainValidate(socket, type, params) {
    try {
      const { id_domain } = params
      const data = await axios.post(`${hostName}/whitelabel/domains/${id_domain}/validate`, {}, {
        "headers": {
          "authorization": this.apiKey,
        }
      })

      return data;

    } catch (error) {
      this.handleError(socket, type, error)
    }
  }

}

module.exports = CoCreateSendGrid;