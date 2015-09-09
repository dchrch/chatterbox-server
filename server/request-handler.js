var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};

var messages = [];


exports.requestHandler = function(request, response) {

  var sendResponse = function(statusCode, data, headers) {
    headers = headers || defaultCorsHeaders;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  };

  var collectData = function(callback) {
    var data = "";
    request.on('data', function(chunk) {
      // console.log('chunk:', chunk);
      data += chunk;
      // console.log('data:', data);
    });
    request.on('end', function() {
      // console.log('end data:', data);
      callback(JSON.parse(data));
    });
  };

  console.log("Serving request type " + request.method + " for url " + request.url);

  var storage = {results: messages};
  console.log('url:', request.url);
  if (request.url.slice(0, 9) !== '/classes/' && request.url !== '/') {
    sendResponse(404);
  }
  if (request.method === 'GET') {
    sendResponse(200, storage);
  }
  if (request.method === 'POST') {
    collectData(function(data) {
      messages.push(data);
    });
    // console.log('storage:', storage);
    sendResponse(201, storage);
  }
  if (request.method === 'OPTIONS') {
    sendResponse(200, null);
  }
};


