const get = function get(request, response) {
  return Promise.resolve().then(() => {
    response.send({
      ok: true
    });
  });
};

export default get;
