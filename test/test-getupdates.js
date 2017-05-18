var assert = require('chai').assert;
var gas = require('gas-local');
var Sugar = require('sugar');
var request = require('sync-request');
var config = require('config');

// $ yarn add https://github.com/ina6ra/gas-mock
var mock = require('gas-mock');

var mymock = mock.gas_mock();

// ソースフォルダの指定はプロジェクトルートからの相対パス
var glib = gas.require('./src', mymock);

describe('getupdates.js', function() {

  var setup = config.get('Setup');
  var fixture = config.get('Fixture');

  // test for myGetUpdates()
  describe('#myGetUpdates()', function() {

    it('投稿テスト', function() {
      // Properties.getProperty の上書き
      Sugar.Object.set(mymock, 'Properties.getProperty', function(key) {
        return setup['ScriptProperties'][key];
      });
      // HTTPResponse.getContentText の上書き
      Sugar.Object.set(mymock, 'HTTPResponse.getContentText', function(charset) {
        var json = {
          result: [fixture['createPayloadList']['all']]
        };
        return JSON.stringify(json);
      });
      // UrlFetchApp.fetch の上書き
      Sugar.Object.set(mymock, 'UrlFetchApp.fetch', function(url, params) {
        return this.response;
      });
      assert.equal(glib.myGetUpdates(), true);
    });
  });
});
