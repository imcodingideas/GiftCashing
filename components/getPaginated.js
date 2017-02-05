module.exports = (Model, populate, query, req, perPage) => {
  let pagination = {
    page: parseInt(req.query.page) > 0 ? req.query.page : 1,
    pages: 0,
    perPage: perPage || 30,
    records: 0,
    showing: 0
  };
  
  return new Promise((resolve, reject) => {
    Model.find(query).count().exec((err, count) => {
      if (err) return reject(err);
      
      pagination.records = count;
      pagination.pages = Math.ceil(count / pagination.perPage);
      req.query.page = pagination.page = pagination.page > pagination.pages
        ? pagination.pages
        : pagination.page;
      req.query.page = pagination.page = pagination.page < 1
        ? 1
        : pagination.page;
      pagination.showing = count > 0 ? pagination.perPage * pagination.page : 0;
      
      Model = Model.find(query)
                   .skip((pagination.page - 1) * pagination.perPage)
                   .limit(pagination.perPage);
      
      if (populate && populate.length > 0) {
        Model = Model.populate(populate);
      }
      
      Model.exec((err, items) => {
        if (err) return reject(err);
        resolve({
          query: req.query,
          pagination,
          items: items || []
        });
      });
    });
  });
};