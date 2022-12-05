const { Joi, Segments } = require('celebrate');

const {
  celebrate,
  schemaObjectId,
  schemaURL,
} = require('./common');

const schemaRouteMe = Joi.alternatives().try(
  Joi.string().equal('me'),
  schemaObjectId,
).required();

const schemaAvatar = schemaURL;
const schemaEmail = Joi.string().email().required();

const schemaPassword = Joi.string().required();
const schemaName = Joi.string().min(2).max(30);
const schemaAbout = Joi.string().min(2).max(30);

const schemaObjectRouteMe = Joi.object({
  id: schemaRouteMe,
}).required();
const schemaObjectProfile = Joi.object({
  name: schemaName,
  about: schemaAbout,
}).required();
const schemaObjectAvatar = Joi.object({
  avatar: schemaAvatar,
}).required();
const schemaObjectAuth = Joi.object({
  email: schemaEmail,
  password: schemaPassword,
}).required();
const schemaObjectUser = schemaObjectAuth
  .concat(schemaObjectProfile)
  .concat(schemaObjectAvatar);

const segmentBodyAuth = { [Segments.BODY]: schemaObjectAuth };
const segmentBodyUser = { [Segments.BODY]: schemaObjectUser };
const segmentParamsRouteMe = { [Segments.PARAMS]: schemaObjectRouteMe };

const celebrateBodyAuth = celebrate(segmentBodyAuth);
const celebrateBodyUser = celebrate(segmentBodyUser);
const celebrateParamsRouteMe = celebrate(segmentParamsRouteMe);

module.exports = {
  schemaAvatar,
  schemaEmail,
  celebrateBodyAuth,
  celebrateBodyUser,
  celebrateParamsRouteMe,
};
