import _ from 'lodash';

const uuidRegexp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i;

class JsonAPIMapper {

  serialize = (modelName, resource) => {
    //console.log('Before serialize-->' + JSON.stringify(resource));
    //console.log('Post serialize-->' + JSON.stringify(_.get(resource, modelName)[0]));
    return _.get(resource, modelName)[0];
  }

  deserialize = (modelName, resource) => {
    //console.log('this in deserialize'  + JSON.stringify(resource));
    let fullJson = {};
    let result = [];
    _.set(fullJson, modelName, result);
    _.set(fullJson, 'linked', {});

    if(_.isArray(resource)) {
       _.forEach(resource, function(object) {
          result.push(apiMapper.deserializeObject(modelName, object, fullJson));

       });
    } else {

        result.push(apiMapper.deserializeObject(modelName, resource, fullJson));
    }
    _.set(fullJson, modelName, result);
    if(_.isEmpty(fullJson.linked)) delete fullJson.linked;

    return fullJson;
  }

  deserializeObject = (modelName, resource, fullJson) => {
    //console.log('deserialize started **********************************');
    //Create the full structure

    let pathMapper = function recurse (modelName, resource) {

        let json = {};
        if (!resource) {
            return undefined;
        }
        if (resource.toObject) {
            resource = resource.toObject();
        }
        json.id = resource._id;
        var relations = [];
        let model = require('mongoose').model(modelName);
        model.schema.eachPath(function (path, type) {
          //console.log('path-->' + path);
          //console.log('type-->' + JSON.stringify(type));
          if (path == '_id' || path == '__v') return;
          json[path] = resource[path];
          //Distinguish between refs with UUID values and properties with UUID values
          let hasManyRef = (type.options.type && type.options.type[0] && type.options.type[0].ref);
          let isRef = !!(type.options.ref || hasManyRef);
          let instance = type.instance ||
              (type.caster ? type.caster.instance : undefined);

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

            var isLink = _.every(resource[path], function(item) {
              //console.log('infor each item-->' + JSON.stringify(item));
              //console.log('check if _id is valid uuid-->' + uuidRegexp.test(item._id));
              //console.log('item-->' + JSON.stringify(item) + ' islink-->' + (_.isPlainObject(item)? uuidRegexp.test(item._id) : uuidRegexp.test(item)));
               return _.isPlainObject(item)? uuidRegexp.test(item._id) : uuidRegexp.test(item);

            });
            //console.log('OVERALL isLink -->' + isLink);
            if(isLink) {
              //console.log('*****************pushing relation' + path);
              relations.push(path);
            }
          }
        });
        //console.log('relations before check length' + JSON.stringify(relations));
        if (relations.length) {
    //crearte an attribute for model name and make it push in line number 133
          let links = {};
          _.each(relations, function (relation) {
            let linked = fullJson.linked;
            //console.log('relation is -->' + relation);
            //console.log('json[relation]-->' + JSON.stringify(json[relation]));
              if (_.isArray(json[relation]) && json[relation].length > 0) {
                  _.forEach(json[relation],function(link){
                    //console.log('in link' + JSON.stringify(link));
                    //check object and is also unique
                    if(!links[relation]) links[relation] = [];
                    if(_.isPlainObject(link)) {
                      if(!linked[relation]) linked[relation] = [];

                     if(_.findIndex(linked[relation], 'id', link._id) < 0) {
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
          if (_.keys(links).length) {
            //console.log('added links to json' + JSON.stringify(links));
              json.links = links;
          }

        }
      return json;
    }//recursive function end

    typeof recurse === 'undefined';
    let resultJSON = pathMapper(modelName, resource);

    //console.log(JSON.stringify(fullJson));
    //console.log('deserialize end **********************************');
  //  console.log('json-->' + JSON.stringify(json));
    return resultJSON;

  }
}

let apiMapper = new JsonAPIMapper();
export default apiMapper;
