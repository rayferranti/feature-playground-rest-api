const restify = require('restify');
const restifyValidator = require('restify-validator');
const util = require('util');

const models = require('./models/index');

const errorMessages = null;

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
function verifyRequiredParams(request){
  console.log("here");
  request.assert('title', 'title is a required field').notEmpty;
  const errors = request.validationErrors();
  if (errors) { 
    console.log(errors);
    errorMessages = {
      error: 'true',
      message: util.inspect(errors)
    };
    return false;
  }
  return true;

};
function addBoard(request, response, next){
  if (!verifyRequiredParams(request)) {
    response.send(422, errorMessages);
    return;
  }
  response.send(request.params);
  next();

};
function updateBoard(request, response, next){

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
