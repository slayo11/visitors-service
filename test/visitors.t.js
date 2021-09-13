const should = require('should');
const uuid = require('uuid');
const logger = require('pino')();
const VisitorsCounter = require('../src/service');

const visitorsSvc = new VisitorsCounter({}, logger, uuid.v1());

function nowIsoString() {
  const now = new Date();
  return now.toISOString();
}

describe('Visitors Service', async () => {
  before(async () => {
    await visitorsSvc.start();
  });

  it('Should count 3 unique counters', async () => {
    const ip1 = '83.150.59.250';
    const ip2 = '83.150.59.11';
    const ip3 = '83.150.59.13';
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip1 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip1 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip1 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip2 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip2 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip2 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip3 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip3 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip3 });
    await visitorsSvc.updateCount({ timestamp: nowIsoString(), ip: ip3 });

    const { payload: count } = await visitorsSvc.getInfo();
    count.should.equals(3);
  });

  after(async () => {
    await visitorsSvc.stop();
  });
});
