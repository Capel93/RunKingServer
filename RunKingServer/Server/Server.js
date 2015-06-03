
var express = require('express');
var bodyParser = require("body-parser");
var http = require('http');
var mongoose = require('mongoose');

var fs = require('fs');
var jade = require('jade');
var session = require('client-sessions');

var app = express();



// =================================================================
// configuration ===================================================
// =================================================================
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // for parsing application/json
app.use(session({
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));





// =================================================================
// MongoDB ===================================================
// =================================================================

mongoose.connect('mongodb://localhost/runkingserver', function(err, res) {
    if(err) throw err;
    console.log('Connected to Database');
});

var Route = require('./models/route');
var User = require('./models/user');





// =================================================================
// HTML ===================================================
// =================================================================

app.get('/', function (req, res) {
     res.redirect('login');
});

app.get('/login', function (req, res) {
    res.sendFile('/home/joanmarc/Escritorio/Arquitectura/RunKingServer/RunKingServer/Server/login.html')
});


app.post('/login', function(req, res) {
    User.find({ username: req.body.username }, function(err, user) {
        if (err) {
            res.render('login', { error: 'Invalid email or password.' });
        } else {
            if (req.body.password === user.password) {
                // sets a cookie with the user's info
                sessionUser = user[0];
                res.redirect('/home');
            } else {
                res.render('login', { error: 'Invalid email or password.' });
            }
        }
    });
});

app.get('/home', function (req, res) {

    res.sendFile('/home/joanmarc/Escritorio/Arquitectura/RunKingServer/RunKingServer/Server/index.html')
});

app.get('/logout', function(req, res) {
    req.session.reset();
    res.redirect('/');
});


app.get('/css/style.css', function (req, res){
    res.sendFile('/home/joanmarc/Escritorio/Arquitectura/RunKingServer/RunKingServer/Server/css/style.css')
})






// =================================================================
// Users API ===================================================
// =================================================================

app.get('/friends/:email',function (req,res) {



        User.findOne({email: req.params.email}, function (err, user) {
            if (err) throw err;
            //console.log(user.username);
            // object of all the users
            console.log(user);
            res.json(user.friends);
        });

});

app.post('/friends/:email',function (req,res) {



    User.findOneAndUpdate({ email: req.body.email }, {"friends": [req.params.email]}, function(err, user) {
        if (err) throw err;

        // we have the updated user returned to us
        console.log(user);
    });

});

app.get('/users',function (req,res) {

    //res.send("Users");
    //res.json({users: userRepository.findAll()});
    if(req.get('content-type') == 'application/json'){

    }else{
        User.find({username: sessionUser.username}, function (err, users) {
            if (err) throw err;
            //console.log(user.username);
            // object of all the users
            console.log(users[0]);
            res.json(users[0].friends);
        });
    }


})



app.get('/users/:email', function (request, response) {

    if(request.get('content-type') == 'application/json') {
        var email = request.params.email;

        //response.json(userRepository.find(userId));
        User.findOne({email: email}, function(err, user) {
            if (err) throw err;

            // show the one user
            console.log(user);
            response.json(user);
            sessionUser = user;
        });
    }else{
        var email = request.params.email;
        try {
            //response.json(userRepository.find(userId));
            User.find({email: email}, function(err, user) {
                if (err) throw err;

                // show the one user
                console.log(user);
                response.json(user);
            });

        } catch (exeception) {
            response.send(404);
        }
    }

});


app.post('/users', function (request, response) {
    if(request.get('content-type') == 'application/json'){
        var data = request.body;
        //var user = JSON.parse(data);
        var new_user = new User({

            username: data.username,
            email: data.email,
            password: data.password


        });

        new_user.save(function(err) {
            if (err) throw err;

            console.log('User created!');
            console.log(new_user);
        });
    }else
    {


        var user = request.body;


        var new_user = new User({

            username: user.username,
            email: user.email,
            password: user.password


        });

        new_user.save(function (err) {
            if (err) throw err;

            console.log('User created!');
        });

    }
    //response.sendStatus(200);
    response.redirect('/home');
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
        //userRepository.remove(request.params.id);
        User.findByIdAndRemove(request.params.id, function(err) {
            if (err) throw err;

            // we have deleted the user
            console.log('User deleted!');
        });
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});




// =================================================================
// Routes API ===================================================
// =================================================================

app.get('/routes/:email',function (req,res) {
    if(req.get('content-type') == 'application/json') {
        Route.find({email: req.params.email}, function(err, routes) {
            if (err) throw err;

            // show the one user
            console.log(routes);
            res.json(routes);
        });

    }else{

    }

});

app.get('/routes.html',function (req,res) {
    res.sendFile("/home/joanmarc/Escritorio/Arquitectura/RunKingServer/RunKingServer/Server/routes.html")
})

app.get('/routes/:id', function (request, response) {
    var routesId = request.params.id;
    try {
        response.json(taskRepository.find(routesId));
    } catch (exeception) {
        response.send(404);
    }

});

app.get('/routes',function (req,res) {
    Route.find({},function(err, routes)
    {
        if (err) throw err;

        console.log(routes);
        res.json(routes);
    });
});

app.post('/routes', function (request, response) {
    if(request.get('content-type') == 'application/json'){
        var route = request.body;
        //var route = JSON.parse(data);
        var new_route = new Route({


            date: route.date,
            time: route.time,
            distance: route.distance,
            longitudes: JSON.parse(route.longitudes),
            latitudes: JSON.parse(route.latitudes),
            email: route.email



        });

        new_route.save(function(err) {
            if (err) throw err;

            console.log('User created!');
            console.log(new_route);
        });

        User.findOneAndUpdate({ eamil: route.email }, { $push: {"routes": new_route.id}}, function(err, user) {
            if (err) throw err;

            // we have the updated user returned to us
            console.log(user);
        });


    }else
    {


        var user = request.body;


        var new_user = new User({

            username: user.username,
            email: user.email,
            password: user.password


        });

        new_user.save(function (err) {
            if (err) throw err;

            console.log('User created!');
        });
        response.redirect('/home');
    }
    //response.sendStatus(200);

});

/*User.findByIdAndRemove(4, function(err) {
    if (err) throw err;

    // we have deleted the user
    console.log('User deleted!');
});*/









app.listen(3000);





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

    UsersSave();
}
/**
 * Remove a task
 * Param: id the of the task to remove
 */
UserRepository.prototype.remove = function (id) {
    var index = this.findIndex(id);
    this.users.splice(index, 1);
}


function RouteRepository() {

    this.routes = [];
    this.nextId = 1
}
/**
 * Find a task by id
 * Param: id of the task to find
 * Returns: the task corresponding to the specified id
 */
RouteRepository.prototype.find = function (id) {
    var route = this.routes.filter(function(item) {
        return item.routeId == id;
    })[0];
    if (null == route) {
        throw new Error('task not found');
    }
    return route;
}
/**
 * Find the index of a task
 * Param: id of the task to find
 * Returns: the index of the task identified by id
 */
RouteRepository.prototype.findIndex = function (id) {
    var index = null;
    this.routes.forEach(function(item, key) {
        if (item.routeId == id) {
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
RouteRepository.prototype.findAll = function () {
    return this.routes;
}
/**
 * Save a task (create or update)
 * Param: task the task to save
 */
RouteRepository.prototype.save = function (route) {
    if (route.routeId == null || route.routeId == 0) {
        route.routeId = this.nextId;
        this.routes.push(route);
        this.nextId++;
    } else {
        var index = this.findIndex(route.routeId);
        this.routes[index] = route;
    }
    RoutesSave();
}
/**
 * Remove a task
 * Param: id the of the task to remove
 */
RouteRepository.prototype.remove = function (id) {
    var index = this.findIndex(id);
    this.routes.splice(index, 1);
}