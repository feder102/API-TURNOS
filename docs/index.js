const yamljs = require('yamljs');
const openapidoc = yamljs.load('./docs/openapi.yaml');

module.exports=openapidoc;