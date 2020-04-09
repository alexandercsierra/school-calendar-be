const router = require('express').Router();
const Template = require('../model/Template');

// GET global posts
router.post('/:googleId', async (req, res) => {
  // const googleId = req.params.googleId;
  let googleId = req.body.id;
  console.log('googleid', googleId)
  try {
    const template = await Template.find()
      .where('googleId')
      .equals(googleId)
      .limit(10);
    res.status(200).json(template);
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

// POST to DB
router.post('/', async (req, res) => {
  const template = new Template({
    summary: req.body.summary,
    description: req.body.description,
    starttime: req.body.starttime,
    endtime: req.body.endtime,
    googleId: req.body.googleId
  });
  try {
    const savedTemplate = await template.save();
    res.status(201).json(savedTemplate);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// DELETE a specific post
router.delete('/:templateId', async (req, res) => {
  try {
    const removedTemplate = await Template.findByIdAndDelete({
      _id: req.params.templateId
    });
    res.status(200).json(removedTemplate);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;


// {
// 	"_id": "5e86bbf1d5d25d00172b8975",
//   "summary": "test 3",
//   "description": "yes",
//   "starttime": "14:00",
//   "endtime": "17:00",
//   "googleId": "113291777180716766021"
// }
