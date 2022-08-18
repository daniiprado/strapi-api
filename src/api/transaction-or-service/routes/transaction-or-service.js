'use strict';

/**
 * transaction-or-service router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::transaction-or-service.transaction-or-service');
