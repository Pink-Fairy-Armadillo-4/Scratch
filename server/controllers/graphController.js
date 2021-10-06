const graphController = {};

graphController.createNodes = (req, res, next) => {
  if (!res.locals.skills) {
    return next();
  }

  const skillName = [];
  const nodes = [];
  const links = [];
  const seenUser = {};
  for (const skill of res.locals.skills) {
    const skillNode = {
      id: skill.name,
      name: skill.name,
      group: skill.skillGroup,
      radius: process.env.SKILL_R ? process.env.SKILL_R : 8,
    };

    skillName.push(skillNode.id);
    nodes.push(skillNode);

    for (const user of skill.teachers) {
      const userNode = {
        id: user._id,
        name: user.firstName + ' ' + user.lastName,
        email: user.email,
        group: user.userGroup,
        radius: process.env.USER_R ? process.env.USER_R : 12,
      };

      const link = {
        source: userNode.id,
        target: skillNode.id,
        value: process.env.LINK_V ? process.env.LINK_V : 2,
      };
      if (!(userNode.id in seenUser)) {
        nodes.push(userNode);
        seenUser[userNode.id] = true;
      }
      links.push(link);
    }
  }

  res.locals.skillName = skillName;
  res.locals.nodes = nodes;
  res.locals.links = links;
  return next();
};

module.exports = graphController;
