const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment');
const Handlebars = require('handlebars');

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];


module.exports = {

  async placeOrder(ctx) {
    let order;
    // const slot = ctx.request.body.slotId;
    // const fullName = ctx.request.body.f_name + ' ' + ctx.request.body.l_name;
    const errMsg = 'Failed to book slot for the selected booking!';
    const status = 'ORDER_PLACED';

    // Create order

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      data.status = status;
      data.date = moment().toISOString();
      order = await strapi.services.order.create(data, { files });
    } else {
      const orderBody = ctx.request.body;
      orderBody.status = status;
      order = await strapi.services.order.create(orderBody);
    }

    //Get scheduler info from server
    // const entity = await strapi.services.scheduler.find();
      // send this slot to scheduler
      try {
        // const res = await axios.put(entity.book_url + `${slot}/${entity.KEY}`, {available: false, booking: order.id, username: fullName, slot, company: entity.company});
        await this.sendOrderPlaceEmail(order);
        // strapi.services.email.sendOrderEmail(order);
        return {status: 1, msg: 'Order placed successfully!', order};
      }catch (e) {
        console.log('Error occurred while trying', e);
        return {status : 0, errMsg};
      }
  },

  async deleteMultiple(ctx){
    const ids = ctx.request.body.ids;
    if(!ids){
      return ctx.badRequest(
        null,
        formatError({
          id: 'id',
          message: 'Ids is required',
          field: ['ids']
        })
      )
    }

    const result = await strapi.query('order').delete({id_in: ids });
    return {status: 1, msg: 'Orders deleted successfully!', result};
  },

  async sendOrderPlaceEmail(order){
    console.log('Send email Function called!');
    const templates = await strapi.query('emails').find({});
    order.date = moment(order.date).format('DD-MM-YYYY HH:mm');
    order.images = order.images.map(item => {
      return {url: 'https://api.i-huolto.fi' + item.url}
    })
    const orderPlace = _.find(templates, {trigger: 'ORDER_PLACE'})
    if (order.email && orderPlace){
      const temp = Handlebars.compile(orderPlace.html)
      const result = temp(order);
      await strapi.plugins['email'].services.email.send({
        to: order.email,
        from: 'I-huolto <no-reply@i-huolto.fi>',
        replyTo: 'info@i-huolto.fi',
        subject: orderPlace.subject,
        text: orderPlace.text,
        html: result,
      });
    }

    const orderRcvd = _.find(templates, {trigger: 'ORDER_RECEIVED'})
    const temp = Handlebars.compile(orderRcvd.html);
    const result = temp(order);
    await strapi.plugins['email'].services.email.send({
      to: 'sherjeelk@gmail.com, gaurav.rawat@litcode.io, i-huolto@i-huolto.fi',
      from: 'I-huolto <no-reply@i-huolto.fi>',
      replyTo: 'info@i-huolto.fi',
      subject: orderRcvd.subject,
      text: orderRcvd.text,
      html: result,
    });

  },


};
