exports.validateId = (req, res, next)=>{

    let storyId = req.params.id;
    if(storyId.match(/^[0-9a-fA-F]{24}$/)) {
        return next();
    } else {
        let err = new Error('Invalid story id');
        err.status = 400;

        return next(err);
    }
};