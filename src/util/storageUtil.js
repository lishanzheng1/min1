export default {
  //往缓存保存数据
  save (key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  //根据key读取缓存数据
  read (key) {
    return JSON.parse(window.localStorage.getItem(key) || null);
  }
}
