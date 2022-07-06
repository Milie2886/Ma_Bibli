const express = require('express');
const router = express.Router();
const Livre = require('../models/livres');
const multer = require('multer');
const fs = require('fs');
const livres = require('../models/livres');

// image upload
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('image');

// Insérer un livre dans la bdd
router.post("/ajouter", upload, (req, res) => {
    const livre = new Livre({
        titre: req.body.titre,
        image: req.file.filename,
        category: req.body.category,
    })
    livre.save((err)=> {
        if(err){
            res.json({message: err.message, type: "danger"});
        } else {
            req.session.message = {
                type: "success",
                message: "Livre bien ajouté!",
            };
            res.redirect("/");
        }
    });
});
// Récupérer tous les livres
router.get("/", (req, res) => {
    Livre.find().exec((err, livres) => {
        if (err) {
            res.json({message: err.message})
        } else {
            res.render("index", {
                titre: "Accueil",
                livres: livres,
            })
        }
    })
});

router.get("/ajouter", (req, res) => {
    res.render("ajouter_livres", { titre: "Ajouter un livre"})
})

//Modifier un livre
router.get("/modifier/:id", (req, res) => {
    let id = req.params.id
    Livre.findById(id, (err, livre) => {
        if (err) {
            res.redirect('/');
        } else {
            if(livre == null) {
                res.redirect('/')
            } else {
                res.render("modifier_livre", { 
                    titre: "Modifier un livre",
                    livre: livre,
                })
            }
        }
    })
})

//Modifier un livre (POST)
router.post("/modifier/:id", upload, (req, res) => {
    let id = req.params.id
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync('./uploads/'+req.body.old_image);
        } catch (err) {
            console.log(err)
        }
    } else {
        new_image = req.body.old_image;
    }
    Livre.findByIdAndUpdate(id, {
        titre: req.body.titre,
        category: req.body.category,
        image: new_image,
    }, (err, result) => {
        if (err) {
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Livre modifié avec succès!',
            };
            res.redirect('/');
        }
    })
})
//Supprimer un livre
router.get("/delete/:id", (req, res) => {
    let id = req.params.id;
    Livre.findByIdAndRemove(id, (err, result) => {
        if (result.image != '') {
            try {
                fs.unlinkSync('./uploads/'+result.image);
            } catch (err) {
                console.log(err);
            }
        }
        if (err) {
            res.json({message: err.message})
        } else {
            req.session.message = {
                type: 'success',
                message: 'Livre supprimé avec succès!',
            };
            res.redirect("/");
        }
    })
});
module.exports = router;