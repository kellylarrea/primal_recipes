const express = require('express')
const router = express.Router()
const axios = require('axios')
const { route } = require('./auth')
const isLoggedIn = require('../middleware/isLoggedIn')
const db = require('../models')
const methodOverride = require('method-override')


//this is our route for keto recipe results
router.get('/results', isLoggedIn, function (req, res) {
    let ketoResults = req.query.ketoResults
    // console.log('ketoResults')
    axios.get(`https://api.edamam.com/api/recipes/v2?type=public&q=${ketoResults}&app_id=58a9c1a2&app_key=ab32153cf843d90e7bb4a956102855b5&diet=low-carb&health=keto-friendly`)
        .then(apiResults => {
            // console.log(apiResults.data.hits)
            const results = apiResults.data.hits
            // console.log('these are the results', results)
            res.render('ketoRecipes/ketoResults', { results: results })
        })
        .catch(error => {
            console.log(error)
        })
})


//this is the route for serch bar. 
router.get('/search', isLoggedIn, function (req, res) {
    res.render('ketoRecipes/ketoRecipeSearch')
})


//this is the route to add to userketorecipe dB
router.post('/results', isLoggedIn, (req, res) => {
    db.userKetoRecipe.create({
        ketoRecipeLabel: req.body.recipeLabel,
        ketoRecipeUrl: req.body.recipeUrl,
        userId: res.locals.currentUser.id,
        // console.log(req.body.recipeLabel)
        // console.log(req.body.recipeUrl)
    })
        .then(createdFave => {
            console.log(createdFave)
            res.redirect('/profile')
        })
        .catch(err => {
            console.log(err)
        })
})

module.exports = router