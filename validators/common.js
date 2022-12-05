const { Joi, celebrator } = require('celebrate');

module.exports.celebrate = celebrator(
  { mode: 'full' },
  { abortEarly: false },
);

module.exports.schemaObjectId = Joi.string().hex().length(24);
module.exports.schemaURL = Joi.string().uri({ scheme: ['http', 'https'] });
