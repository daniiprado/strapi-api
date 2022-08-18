'use strict';

/**
 * `log` middleware.
 */
const removePasswords = (key, value) =>
  key === "password" ? "******" : value;

const models = {
  "login": "Login",
  "register": "Account Registration",
  "local": "Account Login",
  "entity": "Entity",
  "entity-type": "Entity Type",
  "franchise": "Franchise",
  "product": "Product",
  "product-type": "Product Type",
  "population-group": "Population Group",
  "rate": "Rate",
  "content-types": "Admin Content Type",
  "content-manager": "Admin Content Manager",
}

const methods = {
  "get": "View",
  "post": "Create",
  "put": "Update",
  "patch": "Update",
  "delete": "Delete",
}

const getContentType = (path) => {
  const content = Object.keys(models).filter((model) => path.includes(model))
  return models[content[0]] ?? "Unknown Model"
};

const getActionType = (method, path) => {
  const action = methods[method.toLowerCase()] ?? "Unknown Action in";
  const model = getContentType(path)
  return `${action} ${model}`
};

module.exports = (config, { strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info('Auditing changes.');
    await next();
    if (ctx.request.method.toLowerCase() !== 'get') {
      if (ctx.state && ctx.state.user) {
        // user state available for logging
        const contentType = ctx.params.model ?? ctx._matchedRoute
        const entry = {
          contentType: getContentType(contentType),
          action: getActionType(ctx.request.method, contentType),
          statusCode: ctx.response.status,
          author: {
            id: ctx.state.user.id,
            email: ctx.state.user.email,
            ip: ctx.request.ip,
          },
          method: ctx.request.method,
          route: ctx._matchedRoute,
          params: ctx.params,
          request: ctx.request.body,
          content: ctx.response.body,
        };
        if (
          (ctx.params.model && ctx.params.model.includes("audit")) ||
          (ctx.params.uid && ctx.params.uid.includes("audit"))
        ) {
          //Do nothing
        } else {
          strapi.log.debug(JSON.stringify(entry, removePasswords))
          await strapi.entityService.create("api::audit.audit",{
            data: {
              ...entry,
              request: JSON.stringify(entry.request, removePasswords),
            }
          });
        }
      } else {
        // user state not available for logging
        const entry = {
          contentType: getContentType(ctx._matchedRoute),
          action: getActionType(ctx.request.method, ctx._matchedRoute),
          statusCode: ctx.response.status,
          author: {
            id:
              ctx.response.body && ctx.response.body.user
                ? ctx.response.body.user.id
                : "Not found",
            email:
              ctx.response.body && ctx.response.body.user
                ? ctx.response.body.user.email
                : "Not found",
            ip: ctx.request.ip,
          },
          method: ctx.request.method,
          route: ctx._matchedRoute,
          params: ctx.params,
          request: ctx.request.body,
          content: ctx.response.body,
        };
        if (
          (ctx.params.model && ctx.params.model.includes("audit")) ||
          (ctx.params.uid && ctx.params.uid.includes("audit"))
        ) {
          //Do nothing
        } else {
          strapi.log.debug(JSON.stringify(entry, removePasswords))
          await strapi.entityService.create("api::audit.audit",{
            data: {
              ...entry,
              request: JSON.stringify(entry.request, removePasswords),
            }
          });
        }
      }
    }
  };
};
