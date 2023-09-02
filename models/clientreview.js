const mongoose = require("mongoose"),
        jsonSelect = require('mongoose-json-select'),
        helpers = require("../lib/helpers");
    
module.exports = db => {
    let schema = require("../schemas/clientreview.js")
    let modeDef = db.getModelFromSchema(schema)

    modeDef.schema.methods.toHAL = function() {
        return helpers.makeHAL(this.toJSON())
    }
    modelDef.schema.post('save', function(doc, next) {
        db.model('Book').update({_id: doc.book}, {$addToSet: {review: this.id}}, next)
    })
    return mongoose.model(modelDef.name, modelDef.schema)
}