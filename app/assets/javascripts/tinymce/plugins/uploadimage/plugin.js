(function() {
  tinymce.PluginManager.requireLangPack('uploadimage');

  tinymce.create('tinymce.plugins.UploadImage', {
    UploadImage: function(ed, url) {
      var form, iframe, win, editor = ed;
      function showDialog() {
        editor.windowManager.open({
          title: ed.translate('Insert image'),
          file : url + '/dialog.html',
          width : 540,
          height: 145,
          buttons: [{
            text: ed.translate('Insert'),
            classes:'widget btn primary first abs-layout-item',
            disabled : true,
            onclick: 'close'
          },
          {
            text: ed.translate('Cancel'),
            onclick: 'close'
          }]
        });
      }
      // Add a button that opens a window
      editor.addButton('uploadimage', {
        tooltip: ed.translate('Insert an image from your computer'),
        icon : 'image',
        onclick: showDialog
      });

      // Adds a menu item to the tools menu
      editor.addMenuItem('uploadimage', {
        text: ed.translate('Insert an image from your computer'),
        icon : 'image',
        context: 'insert',
        onclick: showDialog
      });
    }
  });

  tinymce.PluginManager.add('uploadimage', tinymce.plugins.UploadImage);
})();
