module.exports =
  (Model, query, callback, perPage) => {
    let pagination = {
      page: (parseInt(req.query.page) > 0)? req.query.page : 1,
      pages: 0,
      perPage: perPage || 1,
      records: 0,
      showing: 0
    };
    
    Model
      .find(query)
      .count()
      .exec((err, count) => {
        pagination.records = count;
        pagination.pages = Math.ceil(count / pagination.perPage);
        req.query.page = pagination.page = (pagination.page > pagination.pages) ? pagination.pages : pagination.page;
        req.query.page = pagination.page = (pagination.page < 1) ? 1 : pagination.page;
        pagination.showing = (count > 0) ? pagination.perPage * pagination.page : 0;
        
        callback(pagination);
      });
  };