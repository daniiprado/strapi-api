'use strict';

/**
 * transaction-or-service service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::transaction-or-service.transaction-or-service');
