var should = require('should'),
    Job    = require('../lib/gearmanode/job').Job;


describe('Job', function() {

    describe('#constructor', function() {
        it('should return default instance of Job', function() {
            var job = new Job({ name: 'reverse', payload: 'hi' });
            job.should.be.an.instanceof(Job);
            job.name.should.equal('reverse');
            job.payload.should.equal('hi');
            job.background.should.be.false;
            job.priority.should.equal('NORMAL');
            job.encoding.should.equal('utf8');
        })
        it('should return special instance of Job', function() {
            var job = new Job(
                { name: 'reverse', payload: 'hi', background: true, priority: 'HIGH', encoding: 'ascii' }
            );
            job.should.be.an.instanceof(Job);
            job.name.should.equal('reverse');
            job.payload.should.equal('hi');
            job.background.should.be.true;
            job.priority.should.equal('HIGH');
            job.encoding.should.equal('ascii');
        })
        it('should return error when missing mandatory options', function() {
            var job = new Job();
            job.should.be.an.instanceof(Error);
            job = new Job(null);
            job.should.be.an.instanceof(Error);
            job = new Job(true);
            job.should.be.an.instanceof(Error);
            job = new Job({});
            job.should.be.an.instanceof(Error);
            job = new Job({ name: 'foo' });
            job.should.be.an.instanceof(Error);
            job = new Job({ payload: 'foo' });
            job.should.be.an.instanceof(Error);
        })
        it('should return error when incorrect options', function() {
            var job = new Job({ name: 'foo', payload: 'bar', background: 'baz' });
            job.should.be.an.instanceof(Error);
            job = new Job({ name: 'foo', payload: 'bar', priority: 'baz' });
            job.should.be.an.instanceof(Error);
            job = new Job({ name: 'foo', payload: 'bar', encoding: 'baz' });
            job.should.be.an.instanceof(Error);
        })
    })

    describe('#abort', function() {
        it('should emit event', function(done) {
            var job = new Job({ name: 'reverse', payload: 'hi' });
            job.on('aborted', function() {
                job.processing.should.be.false;
                done();
            })
            job.abort();
        })
    })

    describe('#_getPacketType', function() {
        it('should return instance of Socket', function() {
            var job = new Job({ name: 'reverse', payload: 'hi' });
            job._getPacketType().should.equal(Job.PACKET_TYPES.SUBMIT_JOB);
            job = new Job({ name: 'reverse', payload: 'hi', priority: 'LOW' });
            job._getPacketType().should.equal(Job.PACKET_TYPES.SUBMIT_JOB_LOW);
            job = new Job({ name: 'reverse', payload: 'hi', priority: 'HIGH'  });
            job._getPacketType().should.equal(Job.PACKET_TYPES.SUBMIT_JOB_HIGH);
            job = new Job({ name: 'reverse', payload: 'hi', background: true });
            job._getPacketType().should.equal(Job.PACKET_TYPES.SUBMIT_JOB_BG);
            job = new Job({ name: 'reverse', payload: 'hi', background: true, priority: 'LOW' });
            job._getPacketType().should.equal(Job.PACKET_TYPES.SUBMIT_JOB_LOW_BG);
            job = new Job({ name: 'reverse', payload: 'hi', background: true, priority: 'HIGH'  });
            job._getPacketType().should.equal(Job.PACKET_TYPES.SUBMIT_JOB_HIGH_BG);
        })
    })

})