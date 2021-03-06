// package: helloworld
// file: helloworld.proto

var helloworld_pb = require("./helloworld_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Greeter = (function () {
  function Greeter() {}
  Greeter.serviceName = "helloworld.Greeter";
  return Greeter;
}());

Greeter.SayHello = {
  methodName: "SayHello",
  service: Greeter,
  requestStream: false,
  responseStream: false,
  requestType: helloworld_pb.HelloRequest,
  responseType: helloworld_pb.HelloReply
};

Greeter.SayRepeatHello = {
  methodName: "SayRepeatHello",
  service: Greeter,
  requestStream: false,
  responseStream: true,
  requestType: helloworld_pb.RepeatHelloRequest,
  responseType: helloworld_pb.HelloReply
};

exports.Greeter = Greeter;

function GreeterClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

GreeterClient.prototype.sayHello = function sayHello(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Greeter.SayHello, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

GreeterClient.prototype.sayRepeatHello = function sayRepeatHello(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(Greeter.SayRepeatHello, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

exports.GreeterClient = GreeterClient;

