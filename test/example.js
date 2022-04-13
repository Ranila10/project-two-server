process.env.TESTENV = true

let Feeding = require('../app/models/feeding.js')
let User = require('../app/models/user')

const crypto = require('crypto')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../server')
chai.should()

chai.use(chaiHttp)

const token = crypto.randomBytes(16).toString('hex')
let userId
let feedingId

describe('Feedings', () => {
  const feedingParams = {
    title: '13 JavaScript tricks SEI instructors don\'t want you to know',
    text: 'You won\'believe number 8!'
  }

  before(done => {
    Feeding.deleteMany({})
      .then(() => User.create({
        email: 'caleb',
        hashedPassword: '12345',
        token
      }))
      .then(user => {
        userId = user._id
        return user
      })
      .then(() => Feeding.create(Object.assign(feedingParams, {owner: userId})))
      .then(record => {
        feedingId = record._id
        done()
      })
      .catch(console.error)
  })

  describe('GET /feedings', () => {
    it('should get all the feedings', done => {
      chai.request(server)
        .get('/feedings')
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.feedings.should.be.a('array')
          res.body.feedings.length.should.be.eql(1)
          done()
        })
    })
  })

  describe('GET /feedings/:id', () => {
    it('should get one feeding', done => {
      chai.request(server)
        .get('/feedings/' + feedingId)
        .set('Authorization', `Token token=${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.feeding.should.be.a('object')
          res.body.feeding.title.should.eql(feedingParams.title)
          done()
        })
    })
  })

  describe('DELETE /examples/:id', () => {
    let feedingId

    before(done => {
      Feeding.create(Object.assign(feedingParams, { owner: userId }))
        .then(record => {
          feedingId = record._id
          done()
        })
        .catch(console.error)
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .delete('/feedings/' + feedingId)
        .set('Authorization', `Bearer notarealtoken`)
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should be succesful if you own the resource', done => {
      chai.request(server)
        .delete('/feedings/' + feedingId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('should return 404 if the resource doesn\'t exist', done => {
      chai.request(server)
        .delete('/feedings/' + feedingId)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(404)
          done()
        })
    })
  })

  describe('POST /feedings', () => {
    it('should not POST an feeding without a title', done => {
      let noTitle = {
        text: 'Untitled',
        owner: 'fakedID'
      }
      chai.request(server)
        .post('/feedings')
        .set('Authorization', `Bearer ${token}`)
        .send({ feeding: noTitle })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not POST an feeding without text', done => {
      let noText = {
        title: 'Not a very good feeding, is it?',
        owner: 'fakeID'
      }
      chai.request(server)
        .post('/feedings')
        .set('Authorization', `Bearer ${token}`)
        .send({ feeding: noText })
        .end((e, res) => {
          res.should.have.status(422)
          res.should.be.a('object')
          done()
        })
    })

    it('should not allow a POST from an unauthenticated user', done => {
      chai.request(server)
        .post('/feedings')
        .send({ feeding: feedingParams })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should POST an feeding with the correct params', done => {
      let validFeeding = {
        title: 'I ran a shell command. You won\'t believe what happened next!',
        text: 'it was rm -rf / --no-preserve-root'
      }
      chai.request(server)
        .post('/feedings')
        .set('Authorization', `Bearer ${token}`)
        .send({ example: validFeeding })
        .end((e, res) => {
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('feeding')
          res.body.feeding.should.have.property('title')
          res.body.feeding.title.should.eql(validFeeding.title)
          done()
        })
    })
  })

  describe('PATCH /feedings/:id', () => {
    let feedingId

    const fields = {
      title: 'Find out which HTTP status code is your spirit animal',
      text: 'Take this 4 question quiz to find out!'
    }

    before(async function () {
      const record = await Feeding.create(Object.assign(feedingParams, { owner: userId }))
      feedingId = record._id
    })

    it('must be owned by the user', done => {
      chai.request(server)
        .patch('/feedings/' + feedingId)
        .set('Authorization', `Bearer notarealtoken`)
        .send({ feeding: fields })
        .end((e, res) => {
          res.should.have.status(401)
          done()
        })
    })

    it('should update fields when PATCHed', done => {
      chai.request(server)
        .patch(`/feedings/${feedingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ feeding: fields })
        .end((e, res) => {
          res.should.have.status(204)
          done()
        })
    })

    it('shows the updated resource when fetched with GET', done => {
      chai.request(server)
        .get(`/feedings/${feedingId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((e, res) => {
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.feeding.title.should.eql(fields.title)
          res.body.feeding.text.should.eql(fields.text)
          done()
        })
    })

    it('doesn\'t overwrite fields with empty strings', done => {
      chai.request(server)
        .patch(`/feedings/${feedingId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ feeding: { text: '' } })
        .then(() => {
          chai.request(server)
            .get(`/feedings/${feedingId}`)
            .set('Authorization', `Bearer ${token}`)
            .end((e, res) => {
              res.should.have.status(200)
              res.body.should.be.a('object')
              // console.log(res.body.example.text)
              res.body.feeding.title.should.eql(fields.title)
              res.body.feeding.text.should.eql(fields.text)
              done()
            })
        })
    })
  })
})
