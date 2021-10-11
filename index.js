const { IPSet } = require( 'futoin-ipset' );  
const CIDR = require('cidr-js');
const cidr = new CIDR();

const faker = require('faker');

const randomCidr = () => {
  let randomIP = faker.internet.ip(); 
  let range = 26 + Math.floor(Math.random() * 6);
  return `${randomIP}/${range}`;
}

const buildAndRecordTestData = (ipset, backtrack) => {
  const list = 'rando-list'
  for(let i=0; i < (1<<10); i++) {
    let block = randomCidr();
    console.log('adding block', block, `using ${list}`);
    backtrack.push(block);
    ipset.add(block, list);
  }
  console.log(backtrack);
}

const matchAddresses = (ipset, addresses) => {
  addresses.forEach((address) => {
     console.log('testing', address, ipset.match(address));
  });
}

const checkEachBlock = (ipset, backtrack) => {
  backtrack.forEach((block) => {
    console.log('matching items from this block', block);
    let addresses = cidr.list(block);
    console.log(addresses);
    matchAddresses(ipset, addresses); 
  });
}

const qed = () => {
  const ipset = new IPSet();
  const backtrack = []
  console.log('Add and verify a set of good blocks using randolist');
  buildAndRecordTestData(ipset, backtrack);
  checkEachBlock(ipset, backtrack);
  let notOnTheList = randomCidr(),
      expanded = cidr.list(notOnTheList);
  
  console.log(`\n\nTesting a random non added block ${notOnTheList}`, expanded);
  expanded.forEach((address) => console.log(ipset.match(address), 'testing', address));
}

qed();
