import axios from 'axios'
import qs from 'qs'
import storageUtil from '../util/storageUtil'

export default function ajax (url, data={}, type='GET') {

  return new Promise(function (resolve, reject) {
    let promise
    if (type === 'GET') {
      let dataStr = ''
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }

      promise = axios.get(url, {
        headers: {
          'sessionId': storageUtil.read("sessionId")
        }
      })
    } else {
      promise = axios.post(url, qs.stringify(data), {
        headers: {
          'sessionId': storageUtil.read("sessionId")
        }
      })
    }
    promise.then(function (response) {
      resolve(response.data)
    }).catch(function (error) {
      reject(error)
    })
  })
}
