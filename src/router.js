const express = require('express')
const router = express.Router()
const path = require('path')
const validator = require('validator')
const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage(path.join(__dirname, '/storage'))

router.get('/', (req, res) => res.render('index.ejs', {links: JSON.parse(localStorage.getItem('links')) || []}))

router.post('/', (req, res) => {
  let {link} = req.body
  if(!link || validator.isEmpty(link.trim())) return res.redirect('/')

  let [linkName, linkUrl] = link.replace(' ', '').split(',')
  if(!linkUrl || !validator.isURL(linkUrl)) return res.redirect('/')
  
  if(!linkName || validator.isEmpty(linkName)) return res.redirect('/')

  const savedLinks = JSON.parse(localStorage.getItem('links')) || []
  const linkObject = {
    name: linkName,
    url: linkUrl
  }
  savedLinks.push(linkObject)
  localStorage.setItem('links', JSON.stringify(savedLinks))
  return res.redirect('/')
})

router.get('/delete/:url', (req, res) => {
  const linkName = req.params.url
  if(!linkName || validator.isEmpty(linkName)) return res.redirect('/')
  const savedLinks = JSON.parse(localStorage.getItem('links'))
  savedLinks.map((link, index) => {
    if(link.name == linkName) return savedLinks.splice(index, 1)
  })
  localStorage.setItem('links', JSON.stringify(savedLinks))
  return res.redirect('/')
})
module.exports = router