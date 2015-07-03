/* globals atom:false */

'use strict';

var Etherpad = require('./etherpad').Etherpad;

exports.activate = function () {
  var etherpad = new Etherpad('thumbnail-gifs');

  etherpad.setDefaults([
    'http://25.media.tumblr.com/tumblr_ma7rqzY6zQ1qis5xyo1_400.gif',
    'https://lh3.googleusercontent.com/-OUw4Q9scVeA/T88ag2ms7nI/AAAAAAAAGYk/k61JJgULnL0/s320/90.gif',
    'https://lh4.googleusercontent.com/-CRSjITDmb4I/USZTvuI_07I/AAAAAAAAIlU/CLKU1HbMC3c/w497-h373/dsf43.gif',
    'http://i.imgur.com/7Bo2HBb.gif',
    'https://gs1.wac.edgecastcdn.net/8019B6/data.tumblr.com/5dd5ebbd60379914270b43e5e9644465/tumblr_mkme23FRxa1qb5gkjo1_400.gif',
    'http://i.imgur.com/VPFVw.gif',
    'http://i.imgur.com/6xaYo.gif',
    'http://i.imgur.com/N0Qe0.gif',
    'http://i.imgur.com/2hyBM.gif',
    'http://i.imgur.com/yjfDD.gif',
    'http://25.media.tumblr.com/tumblr_lwlcls5ra01qzrlhgo1_r1_500.gif',
    'http://media.tumblr.com/tumblr_lmuonu2zHq1qzs6oc.gif',
    'http://s3-ec.buzzfed.com/static/enhanced/web05/2011/12/7/17/anigif_enhanced-buzz-2749-1323295539-27.gif',
    'http://media.topito.com/wp-content/uploads/2013/01/code-03.gif'
  ]);
  etherpad.loadPlaceholders();

  atom.workspace.onDidDestroyPaneItem(function (event) {
    if (event.pane.getItems().length === 0) {
      let paneElement = atom.views.getView(event.pane);
      if (paneElement) {
        let background = paneElement.querySelector('.background-message');
        if (background) {
          background.style.backgroundImage = `url(${etherpad.getRandomItem()})`;
        }
      }
    }
  });

};
