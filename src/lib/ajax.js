import jQuery from 'jquery';
import jqias from './vender/jquery-ias.min';


const Masonry = require('masonry-layout');

class PacAjax {
  constructor() {
    jqias(jQuery);
    function beforeAwsLambdaCallback(callback) {
      function wrapCb(data) {
        const iasData = `
        <div id="list_box">
          <div class="list_item" style="display:none;">
        </div><div class="list_item">${data}</div></div>`;
        callback(iasData);
      }
      return wrapCb;
    }

    const orgGet = jQuery.get;
    jQuery.get = function getWrap(url, data, callback, ...args) {
      orgGet(url, data, beforeAwsLambdaCallback(callback), ...args);
    };

    this.defaultAjaxParam = {
      type: 'GET',
      dataType: 'json',
      timeout: 30 * 1000,
    };
    this.defaultInfinityParam = {
      container: '',
      item: '',
      pagination: '',
      next: '.next',
      delay: 700,
    };
  }

  get(param, successCb, errorCb) {
    const para = Object.assign({}, this.defaultAjaxParam, param);
    const eCb = (xhr, st, err) => {
      console.log(`${st} ${err}`);
      if (errorCb) {
        errorCb(xhr, st, err);
      }
    };
    const sCb = (dt, st, xhr) => {
      if (!dt) {
        eCb(xhr, st, 'no data. but somehow success callback was called.');
        return;
      }
      successCb(dt, st, xhr);
    };
    jQuery.ajax(para).done(sCb).fail(eCb);
  }

  initInfinityScroll(param) {
    (($) => {
      const cont = document.querySelector(param.container);
      const msnry = new Masonry(cont, {
        itemSelector: '.item',
      });
      const para = Object.assign({}, this.defaultInfinityParam, param);
      const ias = $.ias(para);
      ias.extension(new $.pac.IASSpinnerExtension());
      ias.extension(new $.pac.IASNoneLeftExtension({ html: '<div class="ias-noneleft" style="text-align:center;font-size:0.7em;"><p><em>最後のデータです。</em></p></div>' }));
      ias.extension(new $.pac.IASTriggerExtension({ offset: 3, html: '<div class="w-100" style="text-align: center;font-size:0.8em;"><span class="badge badge-pill badge-info">さらに読み込む</span></div>' }));

      ias.on('load', (e) => {
        // e.url = e.url || param.url;
        e.url = param.url;
        if (location.search && e.url.indexOf(location.search.slice(1)) === -1) {
          e.url += location.search;
        }
      });
      ias.on('loaded', (data) => {
        ias.nextUrl = ias.getNextUrl(data);
      });
      ias.on('render', (items) => {
        if (param.renderd_callback) {
          param.renderd_callback(items);
        }
        return false;
      });
      ias.on('rendered', (items) => {
        if (param.callback) {
          param.callback(items);
        } else {
          msnry.appended(items);
        }
        ias.next();
      });

      ias.on('noneLeft', () => {
        $(param.container).data('end', true);
      });
      ias.on('ready', () => {
        if ($(param.container).data('end')) {
          $('.ias-trigger-next').hide();
        }
      });
    })(jQuery);
  }
}

export default new PacAjax();
