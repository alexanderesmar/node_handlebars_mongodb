const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


//initializations
const app = express();
require('./database');
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialdir: path.join(app.get('views'), 'partials'),
    extname: '.hbs', 
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
      }
}) );

app.set('view engine', '.hbs');

//middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true, 
    saveUninitialized: true
}));

//uso de passport des pues de seeion del framework express
app.use(passport.initialize());
app.use(passport.session());
//usar flash despues de passport
app.use(flash());

//globals vars
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;   //03:11:00
    next();
});


//routes
app.use(require('.\\routes\\index'));
app.use(require('.\\routes\\notes'));
app.use(require('.\\routes\\users'));


//statics files
app.use(express.static(path.join(__dirname, 'public')));

//server start

app.listen(app.get('port'), ()=>{
    console.log('server on port ', app.get('port'));
});