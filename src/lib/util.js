import $ from 'jquery';
import _ from 'lodash';

class PacUtil {
  documentHeight() {
    return $(document).height();
  }

  documentWidth() {
    return $(document).width();
  }

  isWidthSmall() {
    return this.documentWidth() < 360;
  }

  isWidthBig() {
    return this.documentWidth() > 600;
  }

  strCut(target, len) {
    if (!target) {
      return '';
    }
    if (target.length <= len) {
      return target;
    }
    return target.substring(0, len) + '...';
  }

  toZenkaku(hankakuStr) {
    return hankakuStr.replace(/[A-Za-z0-9]/g, s => String.fromCharCode(s.charCodeAt(0) + 65248));
  }

  toComma(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }

  generateUuid() {
    const chars = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.split('');
    for (let i = 0, len = chars.length; i < len; i++) {
      switch (chars[i]) {
        case 'x':
          chars[i] = Math.floor(Math.random() * 16).toString(16);
          break;
        case 'y':
          chars[i] = (Math.floor(Math.random() * 4) + 8).toString(16);
          break;
        default:
      }
    }
    return chars.join('');
  }

  /**
   * modelKeysに寄せてtargetsをソートする。
   * @param {Array} modelKeys ソートの見本stringキーリスト
   * @param {Array} targets ソートしたい対象の Hash in List.
   * @param {string} keyName targets内のソートキー名
   */
  toAlignKeysSort(modelKeys, targets, keyName) {
    const retList = [];
    for (let i = 0; i < modelKeys.length; i++) {
      for (let j = 0; j < targets.length; j++) {
        const row = targets[j];
        if (row[keyName] === modelKeys[i]) {
          retList.push(row);
          break;
        }
        if (j === modelKeys.length - 1) {
          retList.push(null);
        }
      }
    }
    return retList;
  }

  topToKeyFromList(dataList, keyName, stopKey, isStopKeyContain) {
    const retList = [];
    for (let i = 0; i < dataList.length; i++) {
      const dt = dataList[i];
      if (dt[keyName] === stopKey) {
        if (isStopKeyContain) {
          retList.push(dt);
        }
        break;
      }
      retList.push(dt);
    }
    return retList;
  }

  keyToLastFromList(dataList, keyOb, cnt) {
    // 例: keyOb = { id_str: 'xxxx'}
    const retList = [];
    let i = cnt || _.findIndex(dataList, keyOb) + 1;
    for (; i < dataList.length; i++) {
      retList.push(dataList[i]);
    }
    return retList;
  }

  getHashInOb(ob, keyName) {
    if (!_.isEmpty(ob)) {
      const keys = Object.keys(ob);
      if (keys.length === 1) {
        const o = ob[keys[0]];
        if (o) {
          return (keyName) ? o[keyName] : o;
        }
      } else {
        return (keyName) ? ob[keyName] : ob;
      }
    }
    return undefined;
  }

  device() {
    const ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 ||
        ua.indexOf('iPod') > 0 ||
        (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)) {
      return 'sp';
    } else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
      return 'tab';
    }
    return 'other';
  }
}

export default new PacUtil();
