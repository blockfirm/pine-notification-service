import assert from 'assert';
import sinon from 'sinon';
import handleError from '../src/handleError';

describe('handleError.js', () => {
  describe('handleError(error, response)', () => {
    let fakeResponse;

    beforeEach(() => {
      fakeResponse = {
        status: sinon.spy(),
        send: sinon.spy()
      };

      sinon.stub(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('accepts two arguments', () => {
      const actual = handleError.length;
      const expected = 2;

      assert.equal(actual, expected);
    });

    it('logs the error status and message using console.error()', () => {
      const errorStatus = 404;
      const errorMessage = 'bacd8b78-cb98-43e0-8600-63bc6e88a8af';
      const error = new Error(errorMessage);

      error.statusCode = errorStatus;
      handleError(error, fakeResponse);

      const firstArgument = console.error.getCall(0).args[0];

      assert(console.error.calledOnce);
      assert(firstArgument.indexOf(errorStatus) > -1);
      assert(firstArgument.indexOf(errorMessage) > -1);
    });

    it('calls response.send() with the error status and the error message wrapped in an object', () => {
      const errorStatus = 404;
      const errorMessage = '254db1ff-ca36-41e8-b7c3-a96ec2d944d9';
      const error = new Error(errorMessage);

      error.statusCode = errorStatus;

      handleError(error, fakeResponse);

      assert(fakeResponse.send.calledOnce);
      assert(fakeResponse.send.calledWith(errorStatus, { code: 'Error', message: errorMessage }));
    });

    describe('when error.statusCode is undefined', () => {
      it('defaults to 500 with code InternalServerError and a generic error message', () => {
        const errorMessage = '73428bc4-e34e-4e67-8acf-b92c866e7f9c';
        const error = new Error(errorMessage);

        const expectedResponse = {
          code: 'InternalServerError',
          message: 'An unexpected error occurred on the server'
        };

        handleError(error, fakeResponse);

        assert(fakeResponse.send.calledOnce);
        assert(fakeResponse.send.calledWith(500, expectedResponse));
      });
    });

    describe('when error.message is undefined', () => {
      it('defaults to "Unknown error"', () => {
        const error = new Error();

        error.statusCode = 418;

        handleError(error, fakeResponse);

        assert(fakeResponse.send.calledOnce);
        assert(fakeResponse.send.calledWith(418, { code: 'Error', message: 'Unknown error' }));
      });
    });
  });
});
