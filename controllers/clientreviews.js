const BaseController = require("./basecontroller"),
  swagger = require("swagger-node-restify");

class ClientReviews extends BaseController {
  constructor(lib) {
    super();
    this.lib = lib;
  }

  list(req, res, next) {
    this.lib.db
      .model("Client")
      .find()
      .sort("name")
      .exec((err, clients) => {
        if (err) return next(this.RESTError("InternalServerError", err));
        this.writeHAL(res, clients);
      });
  }

  create(req, res, next) {
    let newClient = req.body;

    let newClientModel = this.lib.db.model("Client")(newClient);
    newClientModel.save((err, client) => {
      if (err) return next(this.RESTError("InternalServerError", err));
      this.writeHAL(res, client);
    });
  }

  details(req, res, next) {
    let id = req.params.id;
    if (id != null) {
      this.lib.db
        .model("Client")
        .findOne({ _id: id })
        .exec((err, client) => {
          if (err) return next(this.RESTError("InternalServerError", err));
          if (!client)
            return next(
              this.RESTError(
                "ResourceNotFoundError",
                "The client id cannot be found"
              )
            );
          this.writeHAL(res, client);
        });
    } else {
      next(this.RESTError("InvalidArgumentError", "Invalid client id"));
    }
  }

  update(req, res, next) {
    let id = req.params.id;
    if (!id) {
      return next(this.RESTError("InvalidArgumentError", "Invalid id"));
    } else {
      let model = this.lib.db.model("Client");
      model.findOne({ _id: id }).exec((err, client) => {
        if (err) return next(this.RESTError("InternalServerError", err));
        client = Object.assign(client, req.body);
        client.save((err, newClient) => {
          if (err) return next(this.RESTError("InternalServerError", err));
          this.writeHAL(res, newClient);
        });
      });
    }
  }
}

module.exports = (lib) => {
  let controller = new Clients(lib);

  controller.addAction(
    {
      path: "/clients",
      method: "GET",
      summary: "Returns the list of clients ordered by name",
      responseClass: "Client",
      nickname: "getClient",
    },
    controller.list
  );

  controller.addAction(
    {
      path: "/clients",
      method: "POST",
      params: [
        swagger.bodyparam(
          "client",
          "The JSON representation of the client",
          "string"
        ),
      ],
      summary: "Adds a new client to the databas",
      responseClass: "Client",
      nickname: "addClient",
    },
    controller.create
  );

  controller.addAction(
    {
      path: "/clients/{id}",
      method: "GET",
      params: [swagger.pathParam("id", "The id of the client", "string")],
      summary: "Returns the data of one client",
      responseClass: "Client",
      nickname: "getClient",
    },
    controller.details
  );

  controller.addAction(
    {
      path: "/clients/{id}",
      method: "PUT",
      params: [
        swagger.pathParam("id", "The id of the client", "string"),
        swagger.bodyparam("client", "The content to overwrite", "string"),
      ],
      summary: "Updates the data of one client",
      responseClass: "Client",
      nickname: "updateClient",
    },
    controller.update
  );

  return controller;
};
