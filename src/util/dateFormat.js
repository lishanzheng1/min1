export default {
  //格式化时间     yyyy-MM-dd HH:mm:ss
  format1 (timeStr) {
    let myDate = new Date(timeStr);
    let year = myDate.getFullYear();
    let month = (myDate.getMonth() + 1) < 10 ? ('0' + (myDate.getMonth() + 1)) : (myDate.getMonth() + 1);
    let date = myDate.getDate() < 10 ? ('0' + myDate.getDate()) : myDate.getDate();
    let hour = myDate.getHours() < 10 ? ('0' + myDate.getHours()) : myDate.getHours();
    let minutes = myDate.getMinutes() < 10 ? ('0' + myDate.getMinutes()) : myDate.getMinutes();
    let second = myDate.getSeconds() < 10 ? ('0' + myDate.getSeconds()) : myDate.getSeconds();

    return year + "-" + month + "-" + date + " " + hour + ":" + minutes + ":" + second;
  }
}
