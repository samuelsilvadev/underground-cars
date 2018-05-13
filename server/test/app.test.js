const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./../app');
const should = chai.should();

chai.use(chaiHttp);

describe('# COMPANY', () => {

	it('should message data from /', (done) => {
		chai.request(app)
			.get('/')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.message.should.equal('working...');				
				done();
			});
	});


	it('should get name and phone from company', (done) => {
		chai.request(app)
			.get('/company')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.name.should.equal('Underground\'s car');
				res.body.phone.should.equal('(00) 3333-2222');
				done();
			});
	});
});
