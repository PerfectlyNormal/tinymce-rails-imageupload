(function() {
  tinymce.PluginManager.requireLangPack('uploadimage');

  tinymce.create('tinymce.plugins.UploadImage', {
    UploadImage: function(ed, url) {
      var form, iframe, win, editor = ed;
      
      function showDialog() {
        this.win = editor.windowManager.open({
          title: ed.translate('Insert an image from your computer'),
          width:  400 + parseInt(editor.getLang('uploadimage.delta_width', 0), 10),
          height: 180 + parseInt(editor.getLang('uploadimage.delta_height', 0), 10),
          body: [
            {type: 'textbox', name: 'file', label: ed.translate('Choose an image'), subtype: 'file'},
            {type: 'textbox', name: 'alt',  label: ed.translate('Image description')},
          ],
          buttons: [
            {
              text: ed.translate('Insert'),
              onclick: function() { console.log("FIXME: Submit the form please.") }
            },
            {
              text: ed.translate('Cancel'),
              onclick: ed.windowManager.close
            }
          ]
        }, {
          plugin_url: url
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
