const restify = require('restify');
const restifyValidator = require('restify-validator');
const util = require('util');

const models = require('./models/index');

let errorMessages = null;

function verifyRequiredParams(request){
  request.assert('title', 'title is a required field').notEmpty();
  const errors = request.validationErrors();
  if (errors) {
    errorMessages = {
      error: 'true',
      message: util.inspect(errors)
    };
    return false;
  }
  return true;

};

function getAllBoards(request, response, next){
  models.Board.findAll({}).then((boards) => {
    const data = { error: 'false', data: boards };
    response.send(data);
    next();
  })
};

function getBoard(request, response, next){
  models.Board.find({
    where: {
      'id': request.params.id
    }
  }).then((board) => {
      const data = {error: 'false', data: board};
      response.send(data);
      next();
  });
};

function addBoard(request, response, next){
  if (!verifyRequiredParams(request)) {
    response.send(422, errorMessages);
    return;
  }
  models.Board.create({
    title: request.params['title']
  }).then((board) => {
      const data = {
        error: "false",
        message: "New contact created successfully",
        data: board
      };
      response.send(data);
      next();
  });
};

function updateBoard(request, response, next){
  if (!verifyRequiredParams(request)) {
    response.send(422, errorMessages);
  }
  models.Board.find({where: { 'id': request.params.id}}).then((board) => {
      board.updateAttributes({title: request.params['title']}).then((updatedBoard) => {
        const data = {
          error: 'false',
          message: 'Updated board successfully',
          data: updatedBoard
        };
        response.send(data);
        next();
      });
  });
};

function deleteBoard(request, response, next){

};

const server = restify.createServer();

server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());
server.use(restifyValidator);

server.get('/api/v1/boards',getAllBoards);
server.get('/api/v1/board/:id',getBoard);
server.post('/api/v1/board',addBoard);
server.put('/api/v1/board/:id',updateBoard);
server.del('/api/v1/board/:id',deleteBoard);

server.listen(3000, function() {
    console.log('REST API Server listening at http://localhost:3000');
});
