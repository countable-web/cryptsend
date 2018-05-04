const server = require('../index.js');
const request = require('supertest')(server);
const fs = require('fs');
const path = require('path');

describe('GET /mkdir', function() {
  let secretPath = '';
  after('delete secret folder', function(done) {
    fs.rmdir(secretPath.split('/').slice(2).join(path.sep), function(err) {
      if (err) return done(err);
      fs.rmdir(secretPath.split('/').slice(2, 4).join(path.sep), function(err) {
        if (err) return done(err);
        done();
      });
    });
  });

  it('create secret folder', function(done) {
    request.get('/mkdir')
    .expect(302)
    .end(function(err, res) {
      if (err) return done(err);
      secretPath = res.headers.location;
      // console.log(secretPath);
      done();
    });
  });
});

describe('File operations', function() {
  let secretPath = '';
  before('create secret folder', function(done) {
    request.get('/mkdir')
    .end(function(err, res) {
      if (err) return done(err);
      secretPath = res.headers.location;
      // console.log(secretPath);
      done();
    });
  });

  after('delete secret folder', function(done) {
    fs.rmdir(secretPath.split('/').slice(2).join(path.sep), function(err) {
      if (err) return done(err);
      fs.rmdir(secretPath.split('/').slice(2, 4).join(path.sep), function(err) {
        if (err) return done(err);
        done();
      });
    });
  });

  describe('POST /secret/folder', function() {
    it('upload file to secret folder', function(done) {
      request.post(secretPath)
      //Gian: using the regression-contol file here instead of creating one from scratch.
      .attach('test-file', './data/cc8/tluICx+fpoDNb+DsLMquWl+aai5sVg/regression-control.txt')
      .expect(200, done);
    });
  });

  describe('GET /ls', function() {
    it('list files', function(done) {
      request.get(secretPath.replace("dir", "ls"))
      // .expect(200, done);
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        //Gian: uncomment the log below if you want to check the files on the list. Otherwise, we could end the test earlier with 'expect(200, done)'.
        // console.log(res.text);
        done();
      });
    });
  });

  describe('DELETE /secret/folder/file', function() {
    it('delete file', function(done) {
      request.delete(secretPath + '/regression-control.txt')
      .expect(204, done);
    });
  });
});
