/* eslint-disable prefer-const */
const User = require('../models/userModel');
const mongoose = require('mongoose');
const UserGroup = require('../models/userGroupModel');
const Skill = require('../models/skillModel');
const SkillGroup = require('../models/skillGroupModel.js');
const Message = require('../models/messageModel');

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

    const users = await User.find(queryFilter, specifiedFields);
    res.locals.users = users;
    res.locals.userCount = users.length;
    // next();

    res.status(200).json({ status: 'success', users });
  } catch (err) {
    next(err);
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

    const userGroups = await UserGroup.find(queryFilter, specifiedFields);
    res.locals.userGroups = userGroups;
    next();
  } catch (err) {
    next(err);
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

    const skills = await Skill.find(queryFilter, specifiedFields);
    res.locals.skills = skills;
    res.locals.skillCount = skills.length;
    next();
  } catch (err) {
    next(err);
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

    const skillGroups = await SkillGroup.find(queryFilter, specifiedFields);
    res.locals.skillGroups = skillGroups;
    next();
  } catch (err) {
    next(err);
  }
};

dbController.createMessage = async (req, res, next) => {
  try {
    let { contactEmail, sourceName, sourceEmail, targetEmail, targetName, skill } = req.body;

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

    const message = await Message.create(messageDoc);
    await User.updateOne({ email: targetEmail }, { $set: { newMessage: true } });

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

    const messages = await Message.find(queryFilter, specifiedFields).sort({
      createdAt: -1,
    });
    await Message.updateMany(queryFilter, updateFields);

    res.locals.messages = messages;

    return next();
  } catch (err) {
    next(err);
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

    const message = await Message.findOneAndDelete(queryFilter);

    if (message) {
      res.locals.deleted = true;
    }

    return next();
  } catch (err) {
    console.log('Error at dbController.delMessages');
    console.log(err);
    res.locals.deleted = false;
    return next(err);
  }
};

dbController.addSkill = async (req, res, next) => {
  try {
    const skillDoc = {
      name: req.body.skillName,
    };

    await Skill.create(skillDoc);

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.addSkill');
    console.log(err);
    res.locals.deleted = false;
    return next(err);
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

    const skill = await Skill.findOneAndDelete(queryFilter);

    const teachers = skill.teachers;

    const userIDs = [];
    for (const teacher of teachers) {
      userIDs.push(mongoose.Types.ObjectId(teacher._id));
    }

    await User.updateMany({ _id: { $in: userIDs } }, { $pull: { teach: { name: skill.name } } });

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.delSkill');
    console.log(err);
    return next(err);
  }
};

dbController.addUserSkill = async (req, res, next) => {
  try {
    const { skillName, email } = req.body;
    // console.log('req body: ', req.body);

    const userInfo = await User.findOne({ email }, {});

    const newTeacher = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email,
      _id: userInfo._id,
    };

    const skillInfo = await Skill.findOneAndUpdate(
      { name: skillName },
      { $push: { teachers: newTeacher } },
    );

    const newSkill = {
      name: skillInfo.name,
      _id: skillInfo._id,
    };

    await User.updateOne({ email }, { $push: { teach: newSkill } });

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.addUserSkill');
    console.log(err);
    return next(err);
  }
};

dbController.delUserSkill = async (req, res, next) => {
  try {
    const { skillName, email } = req.body;

    const userInfo = await User.findOneAndUpdate(
      { email },
      { $pull: { teach: { name: skillName } } },
    );

    const skillInfo = await Skill.findOneAndUpdate(
      { name: skillName },
      { $pull: { teachers: { email: email } } },
    );

    res.locals.getSkills = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.delUserSkill');
    console.log(err);
    return next(err);
  }
};

dbController.updateemail = async (req, res, next) => {
  try {
    const { newEmail, currentEmail } = req.body;

    const conflict = await User.findOne({ email: newEmail });

    if (conflict != null) {
      res.locals.update = false;
      return next();
    }

    const skillFilter = { 'teachers.email': currentEmail };
    const skillUpdate = { $set: { 'teachers.$.email': newEmail } };
    await Skill.updateMany(skillFilter, skillUpdate);

    const targetEmailFilter = { targetEmail: currentEmail };
    const targetEmailUpdate = { $set: { targetEmail: newEmail } };
    await Message.updateMany(targetEmailFilter, targetEmailUpdate);

    const sourceEmailFilter = { sourceEmail: currentEmail };
    const sourceEmailUpdate = { $set: { sourceEmail: newEmail } };
    await Message.updateMany(sourceEmailFilter, sourceEmailUpdate);

    const userFilter = { email: currentEmail };
    const userUpdate = { $set: { email: newEmail } };
    await User.updateOne(userFilter, userUpdate);

    res.locals.update = true;
    return next();
  } catch (err) {
    console.log('Error at dbController.delUserSkill');
    console.log(err);
    res.locals.update = false;
    return next(err);
  }
};

module.exports = dbController;
