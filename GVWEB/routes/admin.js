var express = require('express');
var fs = require('fs');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('admin/admin', { title: 'Gigavoid - Admin'});
});

router.get('/tools', function(req, res, next) {
    if (req.session.isadmin)
        res.render('admin/tools', { title: 'Gigavoid - Admin'});
    else
        res.redirect('/admin');
});

router.post('/', function(req, res, next) {
    if(req.body.password === 'P@ssword'){
        req.session.isadmin = true;
        res.redirect('/admin/tools');
    }
    else
        res.render('admin/admin', { title: 'Gigavoid - Admin'});
});

router.post('/tools', function(req, res, next) {
    if (req.session.isadmin) {
        if (req.files.image == undefined){
            setDatabaseAndRender(req, res, '/images/default.png', true, req.body.page);
        }
        else {
            if (req.files.image.name.substr(-4) === '.png') {
                setDatabaseAndRender(req, res, '/uploads/' + req.files.image.name, false, req.body.page);
            }
            else {
                res.render('admin/tools', {title: 'Gigavoid - Admin', error: 'File must be a ".png".'});
                fs.unlink(req.files.image.path);
            }
        }
    }
    else {
        res.redirect('/admin');
        fs.unlink(req.files.image.path);
    }
});

function setDatabaseAndRender(req, res, imagename, defaultimage, page) {
    var db = req.app.get('database');
    var posts = db.get(page);
    posts.insert({
        header: req.body.header,
        size: req.body.size,
        image: imagename,
        content: req.body.content,
        date: new Date()
    }, function (error) {
        if (!defaultimage) {
            if (error) {
                fs.unlink(req.files.image.path);
                res.render('admin/tools', {title: 'Gigavoid - Admin', error: error});
            }
            else {
                fs.rename(req.files.image.path, './public/uploads/' + req.files.image.name);
                res.render('admin/tools', {title: 'Gigavoid - Admin', error: 'Posting was successful!'});
            }
        }
        else{
            res.render('admin/tools', {title: 'Gigavoid - Admin', error: 'Posting was successful!'});
        }
    });
}

module.exports = router;