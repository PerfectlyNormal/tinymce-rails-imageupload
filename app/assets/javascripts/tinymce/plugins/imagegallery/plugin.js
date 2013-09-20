(function() {
  tinymce.PluginManager.requireLangPack('imagegallery');

  tinymce.create('tinymce.plugins.ImageGallery', {
    ImageGallery: function(ed, url) {
      var form, iframe, win, editor = ed;
      function showDialog() {
        this.win = editor.windowManager.open({
          width:  800 + parseInt(editor.getLang('imagegallery.delta_width', 0), 10),
          height: 600 + parseInt(editor.getLang('imagegallery.delta_height', 0), 10),
          url: url + '/dialog.html',
        }, {
          plugin_url: url
        });
      }
      // Add a button that opens a window
      editor.addButton('imagegallery', {
        tooltip: ed.translate('Insert an image from gallery'),
        icon : 'image',
        onclick: showDialog
      });

      // Adds a menu item to the tools menu
      editor.addMenuItem('imagegallery', {
        text: ed.translate('Insert an image from gallery'),
        icon : 'image',
        context: 'insert',
        onclick: showDialog
      });
    }
  });

  tinymce.PluginManager.add('imagegallery', tinymce.plugins.ImageGallery);
})();
