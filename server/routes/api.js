const express = require('express');
const dbController = require('../controllers/dbController');
const graphController = require('../controllers/graphController');

const router = express.Router();

router.get('/allUsers', 
  dbController.getUsers, 
  (req, res) => {
    res.status(200).json(res.locals.users);
  }
);

router.get('/allUserGroups', dbController.getUserGroups, (req, res) => {
  res.status(200).json(res.locals.userGroups);
});

router.get('/allSkills', dbController.getSkills, (req, res) => {
  res.status(200).json(res.locals.skills);
});

router.get('/allSkillGroups', dbController.getUserGroups, (req, res) => {
  res.status(200).json(res.locals.skillGroups);
});

router.get('/nodes/:sourceEmail', 
  dbController.getSkills, 
  dbController.getMessages,
  graphController.createNodes, 
  (req, res) => {
    const data = {
      skills: res.locals.skillName,
      messages: res.locals.messages,
      nodes: res.locals.nodes,
      links: res.locals.links,
    };
    res.status(200).json(data);
  }
);

router.get('/nodes', 
  dbController.getSkills, 
  graphController.createNodes, 
  (req, res) => {
    const data = {
      skills: res.locals.skillName,
      messages: res.locals.messages,
      nodes: res.locals.nodes,
      links: res.locals.links,
    };
    res.status(200).json(data);
  }
);

router.post('/sendMessage', 
  dbController.createMessage,
  (req, res) => {
    res.sendStatus(200);
  });

module.exports = router;
