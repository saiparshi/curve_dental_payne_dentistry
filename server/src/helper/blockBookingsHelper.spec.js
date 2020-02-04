const blockBookingsHelper = require('./blockBookingsHelper'); 
const moment = require('moment');

describe('blockBookingsHelper' , ()=>{

  it('should return bookingId if appointment overlaps with block booking', async() =>{
    let bookingId = await blockBookingsHelper.validateIfOverlapExists(moment.utc('2018-10-17T10:20:00Z'), 45);
    
    expect(bookingId).toEqual('1');
  });

  it('should return null if appointment doesnot overlaps with any block booking', async() =>{
    let bookingId = await blockBookingsHelper.validateIfOverlapExists(moment.utc('2018-09-17T10:20:00Z'), 45);
    
    expect(bookingId).toBeUndefined();
  });

});