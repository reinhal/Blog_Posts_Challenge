const chai = require('chai');
const chaiHTTP = require('chai-http');

// importing app, runServer and closeServer
const {app, runServer, closeServer} = require('../server'); 

const expect = chai.expect;
chai.use(chaiHttp);

describe('BlogPosts', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});

	it('should retrieve one or more posts on GET', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			expect(res).to.have.status(200);
			expect(res).to.be.json;
			expect(res.body).to.be.('array');
			expect(res.body.length).to.be.at.least(1);
			const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
			res.body.forEach(function(item) {
				expect(item).to.be.a('object');
				expect(item).to.include.keys(expectedKeys);
			});
		});
	});

	it('should add a new blog post on POST', function() {
		const newPost = {title: 'Salami Magna Ribeye', content: 'In picanha pork. Aliqua strip steak hamburger irure occaecat est. Aliquip frankfurter turkey qui dolor. Labore pastrami corned beef frankfurter tail excepteur eu. Qui rump beef ribeye jerky nostrud. Short loin veniam irure ribeye capicola pastrami. Venison meatball ut exercitation, irure pork chop enim.', author: 'Bresaola Dolore', publishDate: 'May, 4, 2018'}
		return chai.request(app)
		.post('/blog-posts')
		.send(newPost)
		.then(function(res) {
			expect(res).to.have.status(201);
        	expect(res).to.be.json;
        	expect(res.body).to.be.a('object');
        	expect(res.body).to.include.keys('id', 'title', 'content', 'author', 'publishDate');
        	expect(res.body.id).to.not.equal(null);
        	expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}));
		});
	});

	it('shoule update posts on PUT', function() {
		const updatePost = {
			title: 'Spicy Jalapeno',
			content: 'Filet mignon biltong andouille pork chop pig t-bone, labore salami non esse. Ex fugiat nisi brisket, ball tip adipisicing esse rump dolor ea enim hamburger aute salami. Officia lorem doner rump ut drumstick exercitation do pancetta kevin enim. Brisket buffalo qui et.',
			author: 'Aute Laboris',
			publishDate: "May, 7, 2018"
		};

		return chai.request(app)
			.get('/blog-posts')
			.then(function(res) {
				updatePost.id = res.body[0].id;
				return chai.request(app)
				.put(`/blog-posts/${updatePost.id}`)
				.send(updatePost);
			})
			.then(function(res) {
				expect(res).to.have.status(200);
        		expect(res).to.be.json;
        		expect(res.body).to.be.a('object');
        		expect(res.body).to.deep.equal(updatePost);
			});
	});

	it('should delete posts on DELETE', function() {
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res) {
			return chai.request(app)
				.delete(`/blog-posts/${res.body[0].id}`);
		})
		.then(function(res) {
			expect(res).to.have.status(204);
		})
	})
});







































