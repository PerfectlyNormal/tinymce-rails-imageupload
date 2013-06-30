(function() {
  tinymce.PluginManager.requireLangPack('uploadimage');
  tinymce.create('tinymce.plugins.UploadImagePlugin', {
    init: function(ed, url) {
      ed.addCommand('mceUploadImage', function() {
        return ed.windowManager.open({
          file: url + '/dialog.html',
          width: 350 + parseInt(ed.getLang('uploadimage.delta_width', 0)),
          height: 180 + parseInt(ed.getLang('uploadimage.delta_height', 0)),
          inline: 1
        }, {
          plugin_url: url
        });
      });
      ed.addButton('uploadimage', {
        title: 'uploadimage.desc',
        cmd: 'mceUploadImage',
        image: url + '/img/uploadimage.png'
      });
      return ed.onNodeChange.add(function(ed, cm, n) {
        return cm.setActive('uploadimage', n.nodeName === 'IMG');
      });
    },
    createControl: function(n, cm) {
      return null;
    },
    getInfo: function() {
      return {
        longname: 'UploadImage plugin',
        author: 'Per Christian B. Viken (borrows heavily from work done by Peter Shoukry of 77effects.com)',
        authorurl: 'eastblue.org/oss',
        infourl: 'eastblue.org/oss',
        version: '1.0'
      };
    }
  });
  return tinymce.PluginManager.add('uploadimage', tinymce.plugins.UploadImagePlugin);
})();