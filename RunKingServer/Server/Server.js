
var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var userRepository = new UserRepository();

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', function (req, res) {
    res.send('Hello World!');
})

/*var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

})*/


app.get('/users',function (req,res) {

    //res.send("Users");
    res.json({users: userRepository.findAll()});
})

app.get('/users/:id', function (request, response) {
    var userId = request.params.id;
    try {
        response.json(userRepository.find(userId));
    } catch (exeception) {
        response.send(404);
    }

});


app.post('/users', function (request, response) {
    var user = request.body;
    //var user = JSON.parse(data);
    console.log("Entro POst");
    userRepository.save({
        name: user.name ,
        userName: user.userName ,
        email: user.email,
        password: user.password
    });
    response.sendStatus(200);
});

app.put('/users/:id', function (request, response) {
    var user = request.body;
    var userId = request.params.id;
    try {
        var persistedUser = userRepository.find(userId);
        userRepository.save({
            userId: persistedUser.userId,
            userName: user.userName ,
            name: user.name ,
            email: user.email ,
            password: user.password
        });
        response.send(200);
    } catch (exception) {
        response.send(404);
    }
});

app.delete('/users/:id', function (request, response) {
    try {
        userRepository.remove(request.params.id);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});

app.get('/routes',function (req,res) {
    res.send("Routes")
    response.json({routes: taskRepository.findAll()});
})

app.get('/routes/:id', function (request, response) {
    var routesId = request.params.id;
    try {
        response.json(taskRepository.find(routesId));
    } catch (exeception) {
        response.send(404);
    }

});


function UserRepository() {

    this.users = [];
    this.nextId = 1
}
/**
 * Find a task by id
 * Param: id of the task to find
 * Returns: the task corresponding to the specified id
 */
UserRepository.prototype.find = function (id) {
    var user = this.users.filter(function(item) {
        return item.userId == id;
    })[0];
    if (null == user) {
        throw new Error('task not found');
    }
    return user;
}
/**
 * Find the index of a task
 * Param: id of the task to find
 * Returns: the index of the task identified by id
 */
UserRepository.prototype.findIndex = function (id) {
    var index = null;
    this.users.forEach(function(item, key) {
        if (item.userId == id) {
            index = key;
        }
    });
    if (null == index) {
        throw new Error('task not found');
    }
    return index;
}
/**
 * Retrieve all tasks
 * Returns: array of tasks
 */
UserRepository.prototype.findAll = function () {
    return this.users;
}
/**
 * Save a task (create or update)
 * Param: task the task to save
 */
UserRepository.prototype.save = function (user) {
    if (user.userId == null || user.userId == 0) {
        user.userId = this.nextId;
        this.users.push(user);
        this.nextId++;
    } else {
        var index = this.findIndex(user.userId);
        this.users[index] = user;
    }
}
/**
 * Remove a task
 * Param: id the of the task to remove
 */
UserRepository.prototype.remove = function (id) {
    var index = this.findIndex(id);
    this.users.splice(index, 1);
}






function RouteRepository() {}
/**
 * Find a task by id
 * Param: id of the task to find
 * Returns: the task corresponding to the specified id
 */
RouteRepository.prototype.find = function (id) {}
/**
 * Find the index of a task
 * Param: id of the task to find
 * Returns: the index of the task identified by id
 */
RouteRepository.prototype.findIndex = function (id) {}
/**
 * Retrieve all tasks
 * Returns: array of tasks
 */
RouteRepository.prototype.findAll = function () {
    return this.tasks;
}
/**
 * Save a task (create or update)
 * Param: task the task to save
 */
RouteRepository.prototype.save = function (task) {}
/**
 * Remove a task
 * Param: id the of the task to remove
 */
RouteRepository.prototype.remove = function (id) {}


app.listen(3000);
