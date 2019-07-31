export default {
  //删除对象里面  值为空的 属性   比如{key:"",name:"123"} ==> {name:"123"}
  deleteEmptyProperty (object){
    for (var i in object) {
      var value = object[i];
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          if (value.length == 0) {
            delete object[i];
            continue;
          }
        }
        this.deleteEmptyProperty(value);
        if (this.isEmpty(value)) {
          delete object[i];
        }
      } else {
        if (value === '' || value === null || value === undefined) {
          delete object[i];
        } else {
        }
      }
    }
  },
  //判断对象是否为空
  isEmpty (object) {
    for (var name in object) {
      return false;
    }
    return true;
  }
}
