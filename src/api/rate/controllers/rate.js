'use strict';

/**
 *  rate controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// module.exports = createCoreController('api::rate.rate');

module.exports = createCoreController('api::rate.rate', ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::rate.rate', {
      ...query,
      populate: {
        Product: {
          population_group_id: true,
          target_consumer_income_id: true,
          transaction_or_service_id: true,
          channel_id: true,
          debit_card_free_services_id: true,
          savings_account_free_services_id : true,
          product_type_id: true,
          free_service_ids: true,
          insurance_carrier_id: true,
          credit_type_id: true,
        },
        entity_id: {
          entity_type_id: true,
        },
        product_id: true,
      },
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);

  }
}));
