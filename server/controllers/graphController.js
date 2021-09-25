const models = require('../models/pfaModels');

const graphController = {};

graphController.createNodes = (req, res, next) => {
  if (!res.locals.skills) {
    return next();
  }

  const skillName = [];
  const nodes = [];
  const links = [];

  for (const skill of res.locals.skills) {
    const skillNode = {
      id: skill.name,
      group: skill.skillGroup,
      radius: process.env.SKILL_R ? process.env.SKILL_R : 2
    };

    skillName.push(skillNode.id);
    nodes.push(skillNode);

    for (const user of skill.teachers) {
      const userNode = {
        id: '' + user.firstName + ' ' + user.lastName,
        group: user.userGroup,
        radius: process.env.USER_R ? process.env.USER_R : 2
      };

      const link = {
        source: userNode.id,
        target: skillNode.id,
        value: process.env.LINK_V ? process.env.LINK_V : 2
      };

      nodes.push(userNode);
      links.push(link);
    }
  }

  res.locals.skillName = skillName;
  res.locals.nodes = nodes;
  res.locals.links = links;
  return next();
};

module.exports = graphController;