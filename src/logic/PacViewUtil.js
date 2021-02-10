import _ from 'lodash';
import XRegExp from 'xregexp';
import PacUtil from '../lib/util';
import { STR_REG_URL } from '../lib/const';

class PacViewUtil {
  allItemReplace(orgText, words, func) {
    let counter = 0;
    const execRegExexReplace = (strLine, reg) => {
      if (!XRegExp.test(strLine, reg)) {
        return [strLine];
      }
      const splitArr = XRegExp.split(strLine, reg);
      const children = [];
      for (let i = 0; i < splitArr.length; i++) {
        const buf = splitArr[i];
        if (XRegExp.test(buf, reg)) {
          children.push(func(buf, counter));
          counter += 1;
        } else {
          children.push(buf);
        }
      }
      return children;
    };

    const execStrReplace = (strLine, word) => {
      const bufs = strLine.split(word);
      if (bufs.length === 1) {
        return [strLine];
      }
      const children = [];
      for (let i = 0; i < bufs.length; i++) {
        children.push(bufs[i]);
        if (i < bufs.length - 1) {
          counter += 1;
          children.push(func(word, counter));
        }
      }
      return children;
    };

    const itemRep = (lines, word) => {
      const retList = [];
      for (let i = 0; i < lines.length; i++) {
        if (typeof lines[i] === 'string') {
          if (typeof word === 'string') {
            retList.push(execStrReplace(lines[i], word));
          } else {
            retList.push(execRegExexReplace(lines[i], word));
          }
        } else {
          retList.push(lines[i]);
        }
      }
      return _.flatten(retList);
    };

    let ret = (typeof orgText === 'string') ? [orgText] : orgText;
    for (let i = 0; i < words.length; i++) {
      ret = itemRep(ret, words[i]);
    }
    return ret;
  }

  splitLineList(datas) {
    const ret = [[]];
    for (let i = 0; i < datas.length; i++) {
      const dat = datas[i];
      if (typeof datas[i] === 'string') {
        if (/\n/.test(dat)) {
          const buf = dat.split('\n');
          ret[ret.length - 1].push(buf.shift());
          for (let j = 0; j < buf.length; j++) {
            ret.push([buf[j]]);
          }
        } else {
          ret[ret.length - 1].push(dat);
        }
      } else {
        ret[ret.length - 1].push(dat);
      }
    }
    return ret;
  }

  getTweetTargetWords(tw) {
    const words = tw.ws;
    const wordCcodeMap = {};
    const targets = [];
    if (words) {
      const mapFunc = (cd, word) => {
        wordCcodeMap[word] = cd;
        targets.push(word);
        if (/^\d{4}$/.test(word)) {
          const zenkakuWord = PacUtil.toZenkaku(word);
          wordCcodeMap[zenkakuWord] = cd;
          targets.push(zenkakuWord);
        }
      };

      for (let i = 0; i < words.length; i++) {
        _.mapValues(words[i], mapFunc);
      }
    }

    return { targets, wordCcodeMap };
  }

  getBasicStylingTweetText(tw) {
    let text = tw.text || tw.t;
    if (tw.retweet_text) {
      const reg = XRegExp('^(?<retweet>RT\\s@\\w+:\\s)');
      const retweet = XRegExp.exec(tw.text, reg).retweet;
      text = `${retweet}\n${tw.retweet_text}`;
    }
    let t = _.unescape(text);
    // 最後のURLに改行を付ける
    const lastUrl = XRegExp(`(?<url> ${STR_REG_URL}$)`, 'x');
    t = XRegExp.replace(t, lastUrl, '\n$<url>');

    return t;
  }

  getTwitterScreenNamesInText(txt) {
    const ret = [];
    XRegExp.forEach(txt, /@([a-zA-Z0-9_]+)/, (match) => {
      ret.push(match[1]);
    });
    return ret;
  }

  priceFormat(pmap, isPriceDiff, ccode) {
    const fmtMode = (ccode === 'USDJPY') ? 'float' : 'int';
    let p = '-';
    let sign = '';
    let df = '';
    let style = {};
    if (pmap && pmap.p && pmap.p !== '-') {
      p = (fmtMode === 'int') ? parseInt(pmap.p, 10) : parseFloat(pmap.p);
      if (isPriceDiff && pmap.lp && pmap.lp !== '-') {
        const lastPrice = (fmtMode === 'int') ? parseInt(pmap.lp, 10) : parseFloat(pmap.lp);
        let diff = p - lastPrice;
        if (fmtMode === 'float') {
          diff = diff.toFixed(2);
        }
        let signCap = '';
        if (diff > 0) {
          sign = '+';
          signCap = '+';
          style = { color: '#ed0000' };
        } else if (diff < 0) {
          sign = '-';
          signCap = '';
          style = { color: 'blue' };
        }
        df = `(${signCap}${diff})`;
      }
    }
    return { p, sign, df, style };
  }
}

export default new PacViewUtil();
