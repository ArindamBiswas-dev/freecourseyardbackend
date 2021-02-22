exports.getAll = async (req, res, next) => {
  try {

    const currentPageNo = req.query.page;

    const numberOfDocumentSendOneFetch = 4;

    const data = await req.app.locals.database
      .collection("coursedata")
      .find()
      .skip(currentPageNo * numberOfDocumentSendOneFetch)
      .limit(numberOfDocumentSendOneFetch)
      .toArray();
    res.status(200).json({
      data,
    });
  } catch (err) {
    console.error(err);
  }
};

exports.getPopularCholices = async (req, res, next) => {
  try {
    const data = await req.app.locals.database
      .collection("coursedata")
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
      .collection("coursedata")
      .insertOne(req.body);

    res.status(200).json({
      data,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getBySearch = async (req, res, next) => {
  try {
    const currentPageNo = req.query.page;

    const numberOfDocumentSendOneFetch = 4;

    const id = req.params.id;

    const data = await req.app.locals.database
      .collection("coursedata")
      .find({ $text: { $search: id } })
      .skip(currentPageNo * numberOfDocumentSendOneFetch)
      .limit(numberOfDocumentSendOneFetch)
      .toArray();

    // const data = await req.app.locals.database.collection('coursedata')
    //                 .find({$text: {$search: id}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}})
    //                 .toArray();

    res.status(200).json({
      data: data,
    });
  } catch (err) {
    console.log(err);
  }
};
