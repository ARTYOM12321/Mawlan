const factory = require('./HandlerFactory');
const garage = require('.//..//Models//garageModel');

//----------------------------------------------------------------
//----------------------------------------------------------------

exports.getAllGarage = factory.getAll(garage);
exports.getGarage = factory.getOne(garage);
exports.CreateGarage = factory.CreateOne(garage);
exports.UpdateGarage = factory.UpdateOne(garage);
exports.DeleteGarage = factory.deleteOne(garage);
exports.SearchGarage = factory.PartialSearch(garage);
