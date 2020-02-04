const blockBookings = require('../models/blockBookings');
const rrules = require('rrule');
const lodash = require('lodash');
const moment = require('moment');

/**
 * Method to validate if an appointment schedule time overlapps an existing blocked booking
 * Reads all the block bookings from database calculate rule occurence for that day
 * and validate if it intersect the block booking range
 */
exports.validateIfOverlapExists =  async (appointmentStartTime, duration) => {
  const bookings  =  await blockBookings.getAll();
  var bookingId;
  outerLoop: for(var blockBooking of bookings) {
    if(!lodash.isNull(blockBooking.recurrence)){
      const ruleOptions = rrules.RRule.parseString(
        blockBooking.recurrence
      );
      ruleOptions.dtstart = moment(blockBooking.startTime).toDate();
       
      if(!lodash.isEmpty(blockBooking.endDate)){
        ruleOptions.until = moment(blockBooking.endDate).toDate();
      }
      const rrule = new rrules.RRule(ruleOptions);
      const date = moment(moment(appointmentStartTime).format('YYYY-MM-DD'));
      const ruleSet = rrule.between(date.toDate(), date.clone().add(1, 'day').toDate());
      if(!lodash.isEmpty(ruleSet)){
        for(var rule of ruleSet){
          if(isOverlapping(appointmentStartTime, duration, rule, blockBooking.duration)){
            bookingId = blockBooking.id;
            break outerLoop;
          }
        }
      }
    }else{
      if(isOverlapping(appointmentStartTime, duration, blockBooking.startTime, blockBooking.duration)){
        bookingId = blockBooking.id;
        break outerLoop;
      }
    }
  }
  return bookingId;
};

function isOverlapping(appointmentStartTime, appointmentDuration, blockBookingStartTime, blockBookingDuration){
  const appointmentStartTimeM = moment(appointmentStartTime);
  const appointmentEndTimeM = moment(appointmentStartTime).add(appointmentDuration,'minute');
  const blockBookingStartTimeM = moment(blockBookingStartTime);
  const blockBookingEndTimeM = moment(blockBookingStartTime).add(blockBookingDuration,'minute');
  
  if(
    (appointmentStartTimeM.isAfter(blockBookingStartTimeM) && appointmentEndTimeM.isBefore(blockBookingEndTimeM)) ||
    (appointmentStartTimeM.isBefore(blockBookingStartTimeM) && appointmentEndTimeM.isBefore(blockBookingEndTimeM) &&
    appointmentEndTimeM.isAfter(blockBookingStartTimeM)) ||
    (appointmentStartTimeM.isBefore(blockBookingStartTimeM) && appointmentEndTimeM.isAfter(blockBookingEndTimeM)) ||
    (appointmentStartTimeM.isAfter(blockBookingStartTimeM) && appointmentEndTimeM.isAfter(blockBookingEndTimeM) && 
    appointmentStartTimeM.isBefore(blockBookingEndTimeM))
  ){
    return true;
  }
  return false;
}
