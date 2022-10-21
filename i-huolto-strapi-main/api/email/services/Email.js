const Handlebars = require('handlebars');
const mailgun = require("mailgun-js");
const path = require('path');
const DOMAIN = 'https://api.mailgun.net/v3/mg.litcode.io';
const API_KEY = '2725edc4cff35d0157ae150b13620db4-9ad3eb61-7543950d';
const nodemailer = require("nodemailer");
const from = "Team Litcode <no-reply@litcode.io>";
const emailDir = path.join(__dirname, '../../../templates');
const orderTemplate = "/order.html"

const transporter = nodemailer.createTransport({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: 'postmaster@mg.litcode.io',
    pass: '3173c921b2978d4ab7dac9993ee5fc1c-9ad3eb61-af6eb2c3'
  }
});

module.exports = {

  /**
   * Send an order email
   * @param order Object of the order
   * @returns {Promise<void>}
   */
  sendOrderEmail(order){
    const data = { "name": "Alan", "hometown": "Somewhere, TX",
      "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};
     this.sendTemplate(orderTemplate, order, ['siddharthsaxena0@gmail.com', 'suman@litcode.io'], 'Order Email', 'Order email')
       .then(r => console.log('Sent order email successfully!'))
       .catch(e => console.log('Unable to send order email!', e));
  },


  /**
   * This function can be used to send any email
   * @param to
   * @param subject
   * @param text Text type of email
   * @param html HTML version of email
   * @returns {Promise<void>}
   */
  async send(to, subject, text, html){
   // send email
    await transporter.sendMail({from, to, subject, html, text});
  },

  /**
   * This function can be used to send email from templates
   * @param path
   * @param data It is the data which we need to pass to the template
   * @param to
   * @param subject
   * @param text Text version of html
   * @returns {Promise<void>}
   */
  async sendTemplate(path, data, to, subject, text){
    // send email
    const file = await strapi.services.util.readHTMLFile(emailDir + path);
    if (file){
      const template = Handlebars.compile(file);
      const result = template(data);
      console.log('Sending email with this data', data);
      // once ready we can replace this with actual email
      await transporter.sendMail({from, to, subject, html: result, text});
    } else {
      console.log("Something is wrong with template file!");
    }
  }


};
