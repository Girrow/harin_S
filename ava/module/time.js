module.exports= function(){
  var today = new Date();
  var ss = today.getSeconds();
  var dd = today.getDate();
  var tt= today.getHours();
  var mm = today.getMonth()+1; //January 0
  const yyyy = today.getFullYear();
  // var results;
  if(dd<10) {
    dd='0'+dd
  }
  if(mm<10) {
    mm='0'+mm
  }
  today = yyyy+"-"+mm+"-"+dd+"-"+tt;
  return today;
}
