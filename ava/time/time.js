module.exports = function() {
  var today = new Date();
  var dd = today.getDate();
  var tt = today.getHours();
  var mi = today.getMinutes();
  var se = today.getSeconds();
  var mm = today.getMonth() + 1; //January 0
  const yyyy = today.getFullYear();
  // var results;
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (mi < 10) {
    mi = "0" + mi;
  }
  if (tt < 10) {
    tt = "0" + tt;
  }
  if (se < 10) {
    se = "0" + se;
  }
  today = yyyy + "-" + mm + "-" + dd + " " + tt + ":" + mi + ":" + se;
  return today;
};
