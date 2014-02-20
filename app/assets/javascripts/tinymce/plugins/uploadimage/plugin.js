(function() {
  tinymce.PluginManager.requireLangPack('uploadimage');

  tinymce.create('tinymce.plugins.UploadImage', {
    UploadImage: function(ed, url) {
      var form,
          iframe,
          win,
          editor = ed;
      
      function showDialog() {
        win = editor.windowManager.open({
          title: ed.translate('Insert an image from your computer'),
          width:  500 + parseInt(editor.getLang('uploadimage.delta_width', 0), 10),
          height: 180 + parseInt(editor.getLang('uploadimage.delta_height', 0), 10),
          body: [
            {type: 'iframe',  id: 'hidden_upload', classes: 'uploadimage-iframe', name: 'hidden_upload', url: 'javascript:void(0)'},
            {type: 'textbox', name: 'file', label: ed.translate('Choose an image'), subtype: 'file'},
            {type: 'textbox', name: 'alt',  label: ed.translate('Image description')},
          ],
          buttons: [
            {
              text: ed.translate('Insert'),
              onclick: insertImage,
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
      
      function insertImage() {
        var iframe = win.find("iframe")[0];
        var form = createForm(iframe._id);
        form.submit();
      }
      
      function createForm(target) {
        var form = document.createElement('form');
        form.action = ed.getParam("uploadimage_form_url", "/tinymce_assets");
        form.target = target;
        form.method = "POST";
        return form;
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
