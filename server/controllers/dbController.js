/* eslint-disable prefer-const */
const models = require('../models/pfaModels');
const mongoose = require('mongoose');

const dbController = {};

// Obtain all users matching query filter and returning specified fields
dbController.getUsers = async (req, res, next) => {
  try {
    // object specifying the filters on query
    const queryFilter = {};

    // object specifying the fields to be requested from db
    const specifiedFields = {
      firstName: 1,
      lastName: 1,
      email: 1,
    };

    const users = await models.User.find(queryFilter, specifiedFields);
    res.locals.users = users;
    res.locals.userCount = users.length;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught an error at dbController.getUsers',
      message: { err },
    });
  }
};

// Obtain all user groups matching query filter and returning specified fields
dbController.getUserGroups = async (req, res, next) => {
  try {
    // object specifying the filters on query
    const queryFilter = {};

    // object specifying the fields to be requested from db
    const specifiedFields = {
      name: 1,
      color: 1,
    };

    const userGroups = await models.UserGroup.find(
      queryFilter,
      specifiedFields
    );
    res.locals.userGroups = userGroups;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught an error at dbController.getUserGroups',
      message: { err },
    });
  }
};

// Obtain all skills matching query filter and returning specified fields
dbController.getSkills = async (req, res, next) => {
  try {
    // object specifying the filters on query
    const queryFilter = {};
    if (res.locals.getSkills == undefined && req.params.skill != 'all') {
      queryFilter.name = [req.params.skill];
    }
    // object specifying the fields to be requested from db
    const specifiedFields = {
      name: 1,
      skillGroup: 1,
      teachers: 1,
    };

    const skills = await models.Skill.find(queryFilter, specifiedFields);
    res.locals.skills = skills;
    res.locals.skillCount = skills.length;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught an error at dbController.getSkills',
      message: { err },
    });
  }
};

// Obtain all user groups matching query filter and returning specified fields
dbController.getSkillGroups = async (req, res, next) => {
  try {
    // object specifying the filters on query
    const queryFilter = {};

    // object specifying the fields to be requested from db
    const specifiedFields = {
      name: 1,
      color: 1,
    };

    const skillGroups = await models.SkillGroup.find(
      queryFilter,
      specifiedFields
    );
    res.locals.skillGroups = skillGroups;
    next();
  } catch (err) {
    next({
      log: 'Express error handler caught an error at dbController.getSkillGroups',
      message: { err },
    });
  }
};

dbController.createMessage = async (req, res, next) => {
  try {
    let {
      contactEmail,
      sourceName,
      sourceEmail,
      targetEmail,
      targetName,
      skill,
    } = req.body;

    if (!contactEmail) {
      contactEmail = sourceEmail;
    }

    const genMessage = (fromName, toName, skill) => {
      return (
        'Hi ' +
        toName +
        '. I saw on the platform that you are willing to teach ' +
        skill +
        ' and was wondering if I can learn from you. If you are avaliable, please contact me at: ' +
        contactEmail
      );
    };

    const messageDoc = {
      contactEmail,
      sourceName,
      sourceEmail,
      targetEmail,
      targetName,
      messageBody: genMessage(sourceName, targetName, skill),
      skill,
    };

    const message = await models.Message.create(messageDoc);

    return next();
  } catch (err) {
    console.log(err);
    return next();
  }
};

dbController.getMessages = async (req, res, next) => {
  try {
    // if (res.locals.tokenVerif == false) {
    //   return next();
    // }
    let targetEmail;

    if (req.params.targetEmail) {
      targetEmail = req.params.targetEmail;
    } else {
      targetEmail = req.body.targetEmail;
    }

    const queryFilter = {
      targetEmail,
    };

    const specifiedFields = {};

    const updateFields = {
      $set: {
        isRead: true,
      },
    };

    const messages = await models.Message.find(
      queryFilter,
      specifiedFields
    ).sort({ createdAt: -1 });
    await models.Message.updateMany(queryFilter, updateFields);

    res.locals.messages = messages;

    return next();
  } catch (err) {
    console.log('Error at dbController.getMessages');
    console.log(err);
    return next();
  }
};

dbController.delMessages = async (req, res, next) => {
  try {
    res.locals.deleted = false;

    if (!req.body.messageID) {
      return next();
    }

    const queryFilter = {
      _id: mongoose.Types.ObjectId(req.body.messageID),
    };

    const message = await models.Message.findOneAndDelete(queryFilter);

    if (message) {
      res.locals.deleted = true;
    }

    return next();
  } catch (err) {
    console.log('Error at dbController.delMessages');
    console.log(err);
    res.locals.deleted = false;
    return next();
  }
};

dbController.addSkill = async (req, res, next) => {
  try {
    const skillDoc = {
      name: req.body.skillName,
    };

    await models.Skill.create(skillDoc);

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.addSkill');
    console.log(err);
    res.locals.deleted = false;
    return next();
  }
};

dbController.delSkill = async (req, res, next) => {
  try {
    if (!req.body.skillName) {
      return next();
    }

    const queryFilter = {
      name: req.body.skillName,
    };

    const skill = await models.Skill.findOneAndDelete(queryFilter);


    const teachers = skill.teachers;

    const userIDs = [];
    for (const teacher of teachers) {
      userIDs.push(mongoose.Types.ObjectId(teacher._id));
    }

    
    await models.User.updateMany({_id: {$in: userIDs}}, {$pull: {teach: {name: skill.name}}});

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.delSkill');
    console.log(err);
    return next();
  }
};


dbController.addUserSkill = async (req, res, next) => {
  try {
    const { skillName, email } = req.body;
    console.log('req body: ', req.body);

    const userInfo = await models.User.findOne({email}, {});
    // console.log(userInfo);

    const newTeacher = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email,
      _id: userInfo._id
    };

    const skillInfo = await models.Skill.findOneAndUpdate({name: skillName}, { $push: {teachers: newTeacher}});

    console.log('skill: ', skillInfo);
    const newSkill = {
      name : skillInfo.name,
      _id : skillInfo._id,
    };

    await models.User.updateOne({email}, { $push: {teach: newSkill}});

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.addUserSkill');
    console.log(err);
    return next();
  }
};

module.exports = dbController;
