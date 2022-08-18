'use strict';

/**
 * free-service service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::free-service.free-service');
