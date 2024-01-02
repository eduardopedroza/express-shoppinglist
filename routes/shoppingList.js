const express = require('express')
const router = new express.Router()
const ExpressError = require('../expressError')
const items = require('../fakeDb')

router.get('/', function(req, res) {
  res.json({ items });
})

router.post('/', function(req, res) {
  try {
    if (!req.body.name || !req.body.price) {
      throw new ExpressError('Name and price are required', 400);
    }
    let new_item = {
      name: req.body.name,
      price: req.body.price
    }
    items.push(new_item);
    return res.status(201).json({ item: new_item });
  } catch(e) {
    return next(e);
  }
})

router.get('/:name', function(req, res) {
  let item_req = items.find(item => item.name === req.params.name);
  if (item_req === undefined) {
    throw new ExpressError('Item not found', 404);
  }
  res.json({ item: item_req })
})

router.patch('/:name', function(req, res, next) {
  try {
    const item_req = items.find(item => item.name === req.params.name);
    if (!item_req) {
      throw new ExpressError('Item not found', 404);
    }

    if (req.body.name) item_req.name = req.body.name;
    if (req.body.price) item_req.price = req.body.price;

    return res.json({ 'updated': item_req });
  } catch (e) {
    return next(e);
  }
});


router.delete('/:name', function(req, res, next) {
  try {
    const itemIndex = items.findIndex(item => item.name === req.params.name);
    if (itemIndex === -1) {
      throw new ExpressError('Item not found', 404);
    }

    items.splice(itemIndex, 1);
    return res.json({ message: 'Deleted' });
  } catch (e) {
    return next(e);
  }
});


module.exports = router;
