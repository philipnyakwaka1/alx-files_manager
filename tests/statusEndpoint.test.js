const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('GET /status', () => {
    it('should return status 200 and "OK"', (done) => {
        chai.request(app)
            .get('/status')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.text).to.equal('OK');
                done();
            });
    });
});
