'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var uuidRegexp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

var JsonAPIMapper = function JsonAPIMapper() {
  _classCallCheck(this, JsonAPIMapper);

  this.serialize = function (modelName, resource) {
    //console.log('Before serialize-->' + JSON.stringify(resource));
    //console.log('Post serialize-->' + JSON.stringify(_.get(resource, modelName)[0]));
    return _lodash2['default'].get(resource, modelName)[0];
  };

  this.deserialize = function (modelName, resource) {
    //console.log('this in deserialize'  + JSON.stringify(resource));
    var fullJson = {};
    var result = [];
    _lodash2['default'].set(fullJson, modelName, result);
    _lodash2['default'].set(fullJson, 'linked', {});

    if (_lodash2['default'].isArray(resource)) {
      _lodash2['default'].forEach(resource, function (object) {
        result.push(apiMapper.deserializeObject(modelName, object, fullJson));
      });
    } else {

      result.push(apiMapper.deserializeObject(modelName, resource, fullJson));
    }
    _lodash2['default'].set(fullJson, modelName, result);
    if (_lodash2['default'].isEmpty(fullJson.linked)) delete fullJson.linked;

    return fullJson;
  };

  this.deserializeObject = function (modelName, resource, fullJson) {
    //console.log('deserialize started **********************************');
    //Create the full structure

    var pathMapper = function recurse(modelName, resource) {

      var json = {};
      if (!resource) {
        return undefined;
      }
      if (resource.toObject) {
        resource = resource.toObject();
      }
      json.id = resource._id;
      var relations = [];
      var model = require('mongoose').model(modelName);
      model.schema.eachPath(function (path, type) {
        //console.log('path-->' + path);
        //console.log('type-->' + JSON.stringify(type));
        if (path == '_id' || path == '__v') return;
        json[path] = resource[path];
        //Distinguish between refs with UUID values and properties with UUID values
        var hasManyRef = type.options.type && type.options.type[0] && type.options.type[0].ref;
        var isRef = !!(type.options.ref || hasManyRef);
        var instance = type.instance || (type.caster ? type.caster.instance : undefined);

        //console.log('before relation.push ' + (path != '_id' && instance == 'String' && uuidRegexp.test(resource[path]) && isRef));
        //console.log('path->' + path + ' instance--->' + instance);
        //console.log('regex test-->' + uuidRegexp.test(resource[path]));
        //console.log('resource[path]-->' + JSON.stringify(resource[path]));
        //console.log('isRef ' + isRef);

        if (path != '_id' && instance == 'String' && uuidRegexp.test(resource[path]) && isRef) {
          return relations.push(path);
        }
        //console.log(path + ' before resource[path]foreach____________' + JSON.stringify(resource[path]));
        if (resource[path] && resource[path].forEach) {

          var isLink = _lodash2['default'].every(resource[path], function (item) {
            //console.log('infor each item-->' + JSON.stringify(item));
            //console.log('check if _id is valid uuid-->' + uuidRegexp.test(item._id));
            //console.log('item-->' + JSON.stringify(item) + ' islink-->' + (_.isPlainObject(item)? uuidRegexp.test(item._id) : uuidRegexp.test(item)));
            return _lodash2['default'].isPlainObject(item) ? uuidRegexp.test(item._id) : uuidRegexp.test(item);
          });
          //console.log('OVERALL isLink -->' + isLink);
          if (isLink) {
            //console.log('*****************pushing relation' + path);
            relations.push(path);
          }
        }
      });
      //console.log('relations before check length' + JSON.stringify(relations));
      if (relations.length) {
        (function () {
          //crearte an attribute for model name and make it push in line number 133
          var links = {};
          _lodash2['default'].each(relations, function (relation) {
            var linked = fullJson.linked;
            //console.log('relation is -->' + relation);
            //console.log('json[relation]-->' + JSON.stringify(json[relation]));
            if (_lodash2['default'].isArray(json[relation]) && json[relation].length > 0) {
              _lodash2['default'].forEach(json[relation], function (link) {
                //console.log('in link' + JSON.stringify(link));
                //check object and is also unique
                if (!links[relation]) links[relation] = [];
                if (_lodash2['default'].isPlainObject(link)) {
                  if (!linked[relation]) linked[relation] = [];

                  if (_lodash2['default'].findIndex(linked[relation], 'id', link._id) < 0) {
                    linked[relation].push(pathMapper(relation, link));
                  }
                  links[relation].push(link._id);
                  link.id = link._id;
                  delete link._id;
                } else {
                  links[relation].push(link);
                }
              });
            }
            // console.log('link-->' + JSON.stringify(fullJson));

            delete json[relation];
          });
          //console.log('links' + JSON.stringify(_.keys(links)));
          if (_lodash2['default'].keys(links).length) {
            //console.log('added links to json' + JSON.stringify(links));
            json.links = links;
          }
        })();
      }
      return json;
    }; //recursive function end

    typeof recurse === 'undefined';
    var resultJSON = pathMapper(modelName, resource);

    //console.log(JSON.stringify(fullJson));
    //console.log('deserialize end **********************************');
    //  console.log('json-->' + JSON.stringify(json));
    return resultJSON;
  };
};

var apiMapper = new JsonAPIMapper();
exports['default'] = apiMapper;
module.exports = exports['default'];