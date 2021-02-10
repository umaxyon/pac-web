import moment from 'moment';

class PacDate {
  constructor() {
    moment.locale('ja', {
      weekdays: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
      weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
    });
    this.YMDHms = 'YYYY/MM/DD_HH:mm:ss';
    this.YMDHm = 'YYYY/MM/DD_HH:mm';
    this.YMD = 'YYYYMMDD';
    this.fmt = (date, fmt) => (date.format(fmt));
    this.now = fmt => (this.fmt(moment(), fmt || this.YMDHms));
    this.nowMin = () => (this.now(this.YMDHm));
    this.today = () => (this.fmt(moment(), this.YMD));
    this.yesterday = () => (this.dayAgo(1, this.YMD));
    this.minAgo = (min, fmt) => {
      const d = moment().subtract(min || 1, 'minute');
      return this.fmt(d, fmt || this.YMDHms);
    };
    this.hourAgo = (hour, fmt) => {
      const d = moment().subtract(hour || 1, 'hour');
      return this.fmt(d, fmt || this.YMDHms);
    };
    this.dayAgo = (day, fmt) => {
      const d = moment().subtract(day || 1, 'days');
      return this.fmt(d, fmt || this.YMDHms);
    };
    this.transShort = (dateStr) => {
      const m = this.toDate(dateStr);
      return m.format('M/D(ddd) H:mm');
    };
    this.transLong = (dateStr) => {
      const m = this.toDate(dateStr);
      return m.format('YYYY/M/D(ddd) H:mm');
    };
    this.sameDayTime = (dateStr, HH, mm, ss) => {
      const ymd = dateStr.split('_')[0];
      return `${ymd}_${HH || '00'}:${mm || '00'}:${ss || '00'}`;
    };
    this.toDate = (dateStr) => {
      const fmt = (dateStr.length === 8) ? this.YMD : this.YMDHms;
      return moment(dateStr, fmt);
    };
    this.nowDate = () => moment();
    this.isMarketTime = (targetMoment) => {
      const m = targetMoment || this.nowDate();
      const ymd = m.format('YYYY-MM-DD');
      return m.isBetween(`${ymd} 08:59:59`, `${ymd} 15:00:01`);
    };
  }
}

export default new PacDate();
