'use strict';

/**
 *  free-service controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::free-service.free-service');
