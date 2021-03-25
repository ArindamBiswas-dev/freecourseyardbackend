const bcrypt = require('bcryptjs');
const cryptoRandomString = require('crypto-random-string');
const jwt = require('jsonwebtoken');
const nodemailer = require('./nodemailer.config');
const { isAuth } = require('./isAuth.js');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config();

exports.getAll = async (req, res, next) => {
  try {
    const currentPageNo = req.query.page;

    const numberOfDocumentSendOneFetch = 4;

    const count = await req.app.locals.database
      .collection('coursedata')
      .count();

    const data = await req.app.locals.database
      .collection('coursedata')
      .find()
      .skip(currentPageNo * numberOfDocumentSendOneFetch)
      .limit(numberOfDocumentSendOneFetch)
      .toArray();
    res.status(200).json({
      data,
      count,
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({
      hello: 'hello',
    });
  }
};

exports.getPopularCholices = async (req, res, next) => {
  try {
    const data = await req.app.locals.database
      .collection('coursedata')
      .find()
      .toArray();

    res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addCourse = async (req, res, next) => {
  try {
    const data = await req.app.locals.database
      .collection('coursedata')
      .insertOne(req.body);

    res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getBySearch = async (req, res, next) => {
  console.log('df');
  try {
    const currentPageNo = req.query.page;

    const numberOfDocumentSendOneFetch = 4;

    const id = req.params.id;

    const count = await req.app.locals.database
      .collection('coursedata')
      .find({ $text: { $search: id } })
      .count();

    const data = await req.app.locals.database
      .collection('coursedata')
      .find({ $text: { $search: id } })
      .skip(currentPageNo * numberOfDocumentSendOneFetch)
      .limit(numberOfDocumentSendOneFetch)
      .toArray();

    console.log(count);
    // const data = await req.app.locals.database.collection('coursedata')
    //                 .find({$text: {$search: id}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})
    //                 .toArray();

    res.status(200).json({
      data: data,
      count,
    });
  } catch (err) {
    console.log(err);
  }
};

// single course search....
exports.getBySingleSearch = async (req, res, next) => {
  // console.log("req....")
  const id = req.params.id;
  // console.log('hi')
  try {
    const result = await req.app.locals.database
      .collection('coursedata')
      .findOne({
        _id: ObjectId(id),
      });
    // console.log(result)
    res.json({ result });
  } catch (error) {
    res.status(404).json({ status: error.message });
  }
};

// autocomplete search....
exports.getByAutocompleteSearch = async (req, res, next) => {
  // console.log(req.query.term);
  try {
    let result = await req.app.locals.database
      .collection('coursedata')
      .aggregate([
        {
          $search: {
            autocomplete: {
              query: `${req.query.term}`,
              path: 'title',
              fuzzy: {
                maxEdits: 2,
              },
            },
          },
        },
      ])
      .toArray();
    res.json({ result });
  } catch (error) {
    res.status(500).json({ status: error.message });
  }
};

// getCatagorySearch search....
exports.getCatagorySearch = async (req, res, next) => {
  try {
    const catagory = req.params.id;
    console.log(catagory);

    const currentPageNo = req.query.page;

    const numberOfDocumentSendOneFetch = 4;

    const count = await req.app.locals.database
      .collection('coursedata')
      .find({ catagories: { $in: [catagory.substring(1)] } })
      .count();

    const data = await req.app.locals.database
      .collection('coursedata')
      .find({ catagories: { $in: [catagory.substring(1)] } })
      .skip(currentPageNo * numberOfDocumentSendOneFetch)
      .limit(numberOfDocumentSendOneFetch)
      .toArray();

    console.log(data);

    res.status(200).json({
      data: data,
      count,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const favourite = [];
    const confirmationToken = cryptoRandomString({
      length: 10,
      type: 'url-safe',
    });

    const status = 'pending';

    const hashedPassword = await bcrypt.hash(password, 10);

    await req.app.locals.database.collection('userdata').insertOne({
      name,
      email,
      password: hashedPassword,
      confirmationToken,
      status,
      favourite,
    });
    nodemailer.sendConfirmationEmail(name, email, confirmationToken);

    res.json({ status: 'User Created' });
  } catch (error) {
    if (error.code === 11000)
      res.status(404).json({ status: 'User already exists' });
    else {
      console.log(error);
      res.status(404).json({ status: 'Internal server error' });
    }
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const confirmationToken = req.params.id;
    const user = await req.app.locals.database
      .collection('userdata')
      .findOne({ confirmationToken });

    if (!user) {
      return res.json({ status: `Can't find user` });
    }

    await req.app.locals.database
      .collection('userdata')
      .updateOne({ confirmationToken }, { $set: { status: 'active' } });

    res.json({ status: 'user activate' });
  } catch (error) {
    console.log(error);
  }
};

exports.logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await req.app.locals.database
      .collection('userdata')
      .findOne({ email });

    if (!user) {
      return res.status(404).json({ status: 'User does not exists' });
    }

    if (user.status === 'pending') {
      return res.json({ status: 'Verify the email before LogIn' });
    }

    if (await bcrypt.compare(password, user.password)) {
      //* send the jwt token to the user
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });
      return res.json({
        status: 'Login Successfull',
        token: token,
      });
    } else {
      console.log('not success');
      return res.status(404).json({ status: 'Email or Password is wrong' });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.setFavorite = async (req, res, next) => {
  try {
    const { token, courseId, addToFavorite } = req.body;

    // verify the token of the user and get the user ID from the token
    const userId = isAuth(token);

    // add/remove to the favorite
    if (addToFavorite === true) {
      const res = await req.app.locals.database
        .collection('userdata')
        .updateOne(
          { _id: ObjectId(userId) },
          { $push: { favourite: courseId } }
        );
    } else {
      const res = await req.app.locals.database
        .collection('userdata')
        .updateOne(
          { _id: ObjectId(userId) },
          { $pull: { favourite: courseId } }
        );
    }
    res.json({ status: 'ok' });
  } catch (error) {
    console.log(error.message);
    res.json({ status: error.message });
  }
};

exports.isFavorite = async (req, res, next) => {
  const token = req.query.token;
  const courseId = req.query.courseId;

  try {
    const userId = isAuth(token);
    const response = await req.app.locals.database
      .collection('userdata')
      .findOne({
        _id: ObjectId(userId),
        favourite: { $elemMatch: { $in: [courseId] } },
      });
    if (response) res.json({ status: 'ok' });
    else res.json({ status: null });
  } catch (error) {
    console.log(error.message);
    res.json({ status: error.message });
  }
};

exports.favorites = async (req, res, next) => {
  const token = req.query.token;
  try {
    const userId = isAuth(token);
    const response = await req.app.locals.database
      .collection('userdata')
      .findOne({ _id: ObjectId(userId) });
    let favouritesCourses = response.favourite;
    let data = [];

    data = await getFavoriteCourses(data, favouritesCourses, req);

    res.json({ data });
  } catch (error) {
    res.json({ status: error.message });
  }
};

async function getFavoriteCourses(data, favouritesCourses, req) {
  // console.log(favouritesCourses);
  for (let i = 0; i < favouritesCourses.length; i++) {
    let item = favouritesCourses[i];
    let course = await req.app.locals.database
      .collection('coursedata')
      .findOne({ _id: ObjectId(item) });
    data = [...data, course];
  }
  return data;
}
