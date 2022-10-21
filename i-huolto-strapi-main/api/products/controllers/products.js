const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const _ = require('lodash');

const formatError = error => [
  { messages: [{ id: error.id, message: error.message, field: error.field }] },
];


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
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

    const result = await strapi.query('products').delete({id_in: ids });
    return {status: 1, msg: 'Products delete successfully!', result};
  },

  async deleteImages(ctx) {
    const ids = ctx.request.body.ids;
    if (!ids){
      return ctx.badRequest(
        null,
        formatError({
          id: 'id',
          message: "Ids is required!",
          field: ['ids'],
        })
      );
    }


    // let files = await strapi.query('file', 'upload').find({ id_in: ids }, ['role']);
    await strapi.query('file', 'upload').delete({id_in: ids });
    return {status: 1, msg: 'Files removed successfully!'};
    },

  async getDisk(ctx) {
    // let files = await strapi.query('file', 'upload').find({ id_in: ids }, ['role']);
    const files = await strapi.query('file', 'upload').find();
    const size = _.sumBy(files, item => item.size);

    return {status: 1, size};
  },

};
