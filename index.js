const { IPSet, Address4, Address6 } = require( 'futoin-ipset' );  
const CIDR = require('cidr-js');
const faker = require('faker');

const cidr = new CIDR();
const randomCidr = () => {
  let randomIP = faker.internet.ip(); 
  let range = 26 + Math.floor(Math.random() * 6);
  return `${randomIP}/${range}`;
}

const buildAndRecordTestData = (ipset, backtrack) => {
  for(let i=0; i<10; i++) {
    let block = randomCidr();
    console.log('adding block', block);
    backtrack.push(block);
    ipset.add(block, 'randolist');
  }
  console.log(backtrack);
}

const matchResults = (ipset, results) => {
  results.forEach((result) => {
     console.log(ipset.match(result), 'testing', result);
  });
}

const checkEachBlock = (ipset, backtrack) => {
  backtrack.forEach((block) => {
    console.log('matching items from this block', block);
    let results = cidr.list(block);
    console.log(results);
    matchResults(ipset, results); 
  });
}

const postiveTests = () => {
}

const qed = () => {
  const ipset = new IPSet();
  const backtrack = []
  console.log('add and verify a set of good blocks using randolist');
  buildAndRecordTestData(ipset, backtrack);
  checkEachBlock(ipset, backtrack);
  let notOnTheList = randomCidr(),
      expanded = cidr.list(notOnTheList);
  console.log(`testing a randon non added block ${notOnTheList}`, expanded);
  expanded.forEach((result) => console.log(ipset.match(result), 'testing', result));
}

qed();
