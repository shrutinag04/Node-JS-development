//require modules
const express= require('express');
const morgan= require('morgan');
const itemsRoutes=require('./routes/itemsRoutes');
const methodOverride=require('method-override');

//create app
const app=express();

//configure app
let port=3000;
let host='localhost';
app.set('view engine','ejs');

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

//set up routes
app.get('/',(req,res)=>{
    res.render('index');
});

app.use('/items',itemsRoutes);

app.use((req,res,next)=>{
    let err=new Error('The server canonot locate ' + req.url);
    err.status=404;
    next(err);
})

app.use((err,req,res,next)=>{
    console.log(err.stack);
    if(!err.status){
        err.status=500;
        err.message=("Internal Server Error");
    }
    res.status(err.status);
    res.render('error',{error:err});
});

//start the server
app.listen(port,host,()=>{
    console.log('server is running on port',port);
})