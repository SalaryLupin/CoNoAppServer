const should = require('should');
const request = require('supertest');
const app = require('../../app');


const tagController = require("./tag.controller")
describe('GET /api/song/category', () => {
  it('should return 200 status code', (done) => {
    request(app)
        .get('/api/song/category')
        .expect(200)
        .end((err, res) => {
          if (err) throw err;
          // equal 은 == 만 검사, eql은 내부 속성이 같은지 검사
          // 참고 : // equal 은 == 만 검
          res.body.should.eql(tagController.category)
          done();
        })
  });
});
