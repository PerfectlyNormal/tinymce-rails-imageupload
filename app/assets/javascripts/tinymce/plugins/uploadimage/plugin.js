(function() {
  tinymce.PluginManager.requireLangPack('uploadimage');

  tinymce.create('tinymce.plugins.UploadImage', {
    UploadImage: function(ed, url) {
      var form, iframe, win, editor = ed;
      function showDialog() {
        this.win = editor.windowManager.open({
          width:  350 + parseInt(editor.getLang('uploadimage.delta_width', 0), 10),
          height: 180 + parseInt(editor.getLang('uploadimage.delta_height', 0), 10),
          url: url + '/dialog.html',
        }, {
          plugin_url: url
        });
      }
      ed.addButton('uploadimage', {
        title: ed.translate('Insert an image from your computer'),
        onclick: showDialog,
        image: url + '/img/uploadimage.png',
        stateSelector: 'img[data-mce-uploadimage]'
      });
    }
  });

  tinymce.PluginManager.add('uploadimage', tinymce.plugins.UploadImage);
})();
