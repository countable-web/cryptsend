
require('../index.js');
const request = require('superagent');
const assert = require('assert');

describe('API', function() {
      it('works', function(done){
            assert.equal(true,true);
					  request
						 .get('localhost:1234/')
						 .then(function(res) {
               assert.equal(res.status, 200);
               done();
						 })
						 .catch(function(err) {
               throw(err);
						 });
      });
});

