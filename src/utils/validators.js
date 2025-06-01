function isAtleast18 (DoB) {
    const dob = new Date(DoB);
    const today = new Date();
    const agediff = today.getFullYear() - dob.getFullYear();
    if (agediff > 18) return true;
    const monthdiff = today.getMonth() - dob.getMonth();
    const daydiff = today.getDate() - dob.getDate();
    if (agediff === 18) {
      if (monthdiff > 0) {
        return true;
      }
      else if (monthdiff === 0 && daydiff >= 0 ) {
        return true;
      }
    }
    return false;
  }
  module.exports = {isAtleast18,}