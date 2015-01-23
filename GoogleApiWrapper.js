'use strict';
/* global gapi */

/**
 * Google Api Wrapper.
 * Handles loading of google js api client and loading of api clients including cloud endpoints.
 * Requires jQuery
 *
 * @author Johann Wagner
 */
var GoogleApiWrapper = (function() {
  function googleApiWrapper() {
    var self = this;
    this.apiUrl = window.location.protocol + '//' + window.location.host + '/_ah/api';
    this.api = {};
    this.gapiClient = $.Deferred(); // will be resolved by api loaded callback

    // Load an api via gapi.client.load but do not store
    this.loadApi = function(apiName, version, apiUrl) {
      var dfd = $.Deferred();
      version = version || 'v1';
      self.gapiClient.then(function(client) {
        if (apiUrl) {
          client.load(apiName, version, function() {
            console.log(apiName + '(' + version + ') api loaded');
            dfd.resolve(client[apiName]);
          }, apiUrl);
        } else {
          client.load(apiName, version, function() {
            console.log(apiName + '(' + version + ') api loaded');
            dfd.resolve(client[apiName]);
          });
        }
      });

      return dfd.promise();
    }

    // Get a promise for an api. Loaded apis will be remembered for future use
    this.get = function(apiName, version, apiUrl){
      var dfd = $.Deferred();
      if(self.api[apiName]){
        dfd.resolve(self.api[apiName]);
      } else {
        self.loadApi(apiName, version, apiUrl).then(function(api){
          self.api[apiName] = api;
          dfd.resolve(self.api[apiName]);
        });
      }

      return dfd.promise();
    }

    // Wrapper for gapi.request
    this.request = function(path, method, params, headers, body) {
      var dfd = $.Deferred();
      self.gapiClient.then(function(client) {
        var args = {};
        if (path)
          args.path = path;
        if (method);
        args.method = method;
        if (params)
          args.params = params;
        if (headers)
          args.headers = headers;
        if (body)
          args.body = body;

        client.request(args).then(function(result) {
          dfd.resolve(result);
        });
      });

      return dfd.promise();
    };

    // Register callback & load gapi client
    (function load() {
      window.resolveGapiPromise = function() {
        self.gapiClient.resolve(gapi.client);
      };

      var script = document.createElement("script");
      script.type = "text/javascript";
      script.src = "//apis.google.com/js/client.js?onload=resolveGapiPromise";
      script.charset = "utf-8";

      document.body.appendChild(script);
    })();
  };

  return new googleApiWrapper();
})();