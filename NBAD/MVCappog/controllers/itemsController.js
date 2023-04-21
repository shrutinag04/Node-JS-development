const { nextTick } = require('process');
const model=require('../models/items');
exports.index= (req,res)=>{
    let items=model.find();
    JSON.stringify(items)
    res.render('./items/index',{items});
   console.log(items);
};
exports.new= (req,res)=>{
    res.render('./items/new');
};
exports.about= (req,res)=>{
    res.render('about');
};
exports.contact= (req,res)=>{
    res.render('contact');
};


exports.create= (req,res)=>{
    //res.send('Created a new item');
   let item=req.body;
   model.save(item);
   res.redirect('/items');
};
exports.show= (req,res,next)=>{
    let id=req.params.id;
    let items=model.findById(id);
    if(items){
        res.render('./items/show',{items});
    }else{
        let err=new Error('cannot find item with id' + id);
        err.status=404;
        next(err);
    }
};
exports.edit= (req,res,next)=>{
    let id=req.params.id;
    let items=model.findById(id);
    if(items){
        res.render('./items/edit',{items});
    }else{
        let err=new Error('cannot find item with id' + id);
        err.status=404;
        next(err);
    }
};
exports.update=(req,res,next)=>{
    let items=req.body;
    let id=req.params.id;
    if(model.updateById(id,items)){
        res.redirect('/items/'+id);
    }else{
        let err=new Error('cannot find item with id' + id);
        err.status=404;
        next(err);
    };
   
};
exports.delete=(req,res,next)=>{
    let id=req.params.id;
    if(model.deleteById(id)){
        res.redirect('/items');
    }
    else{
        let err=new Error('cannot find item with id' + id);
        err.status=404;
        next(err);
    }
};