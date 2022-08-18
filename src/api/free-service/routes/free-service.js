'use strict';

/**
 * free-service router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::free-service.free-service');
