const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./../app');
const should = chai.should();

chai.use(chaiHttp);

describe('# TESTING CARS MODULE', () => {

	beforeEach(done => {
		chai.request(app)
			.post('/car')
			.send({
				image: 'Test 1',
				brandModel: 'Brand 1',
				year: '2018',
				plate: '123456',
				color: 'Red'
			})
			.end((err, res) => {
				done();
			});
	})

	it('should get 1 car', (done) => {
		chai.request(app)
			.get('/car')
			.end((err, res) => {
				res.should.have.status(200);
				res.body.length.should.be.eql(1);
				res.body[0].image.should.equal('Test 1');
				res.body[0].brandModel.should.equal('Brand 1');
				res.body[0].year.should.equal('2018');
				res.body[0].plate.should.equal('123456');
				res.body[0].color.should.equal('Red');
				done();
			});
	});

	it('should save 1 car', (done) => {
		chai.request(app)
			.post('/car')
			.send({
				image: 'Test 2',
				brandModel: 'Brand 2',
				year: '2010',
				plate: '1234568910',
				color: 'Blue'
			})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.message.should.equal('success');
				done();
			});
	});

	it('should DELETE car', (done) => {

		const plateCar = '123456';

		chai.request(app)
			.del('/car')
			.send({
				plate: plateCar
			})
			.end((err, res) => {
				res.should.have.status(200);
				res.body.message.should.equal('success');
				done();
			});
	});

});
