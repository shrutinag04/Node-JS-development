exports.validateId = (req, res, next)=>{

    let itemId = req.params.id;
    if(itemId.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid item id');
        err.status = 400;
        //res.redirect('back');

        return next(err);
    }
};