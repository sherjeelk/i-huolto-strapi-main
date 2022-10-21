'use strict';

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

    const result = await strapi.query('services').delete({id_in: ids });
    return {status: 1, msg: 'Services delete successfully!', result};
  }
};
