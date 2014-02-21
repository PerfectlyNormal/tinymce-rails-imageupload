(function() {
  tinymce.PluginManager.requireLangPack('uploadimage');

  tinymce.create('tinymce.plugins.UploadImage', {
    UploadImage: function(ed, url) {
      var form,
          iframe,
          win,
          throbber,
          editor = ed;
      
      function showDialog() {
        win = editor.windowManager.open({
          title: ed.translate('Insert an image from your computer'),
          width:  500 + parseInt(editor.getLang('uploadimage.delta_width', 0), 10),
          height: 180 + parseInt(editor.getLang('uploadimage.delta_height', 0), 10),
          body: [
            {type: 'iframe',  url: 'javascript:void(0)'},
            {type: 'textbox', name: 'file', label: ed.translate('Choose an image'), subtype: 'file'},
            {type: 'textbox', name: 'alt',  label: ed.translate('Image description')},
            {type: 'container', classes: 'error', html: "<p style='color: #b94a48;'>&nbsp;</p>"},
          ],
          buttons: [
            {
              text: ed.translate('Insert'),
              onclick: insertImage,
              subtype: 'primary'
            },
            {
              text: ed.translate('Cancel'),
              onclick: ed.windowManager.close
            }
          ]
        }, {
          plugin_url: url
        });

        /* WHY DO YOU HATE <form>, TINYMCE!? */
        iframe = win.find("iframe")[0];
        form = createElement('form', {
          action: ed.getParam("uploadimage_form_url", "/tinymce_assets"),
          target: iframe._id,
          method: "POST",
          enctype: 'multipart/form-data',
          accept_charset: "UTF-8",
        });
        // Might have several instances on the same page, so let TinyMCE create unique IDs
        iframe.getEl().name = iframe._id;
        form.appendChild(createElement('input', {type: "hidden", name: "utf8", value: "✓"}));
        form.appendChild(createElement('input', {type: 'hidden', name: 'authenticity_token', value: getMetaContents('csrf-token')}));
        form.appendChild(createElement('input', {type: 'hidden', name: 'hint', value: ed.getParam("uploadimage_hint", "")}));
        win.find("*").each(function(ctrl) {
          var name = ctrl.name(),
              value = ctrl.value(),
              el;
          if (name && typeof(value) != "undefined") {
            /* WHAT IS THIS I DON'T EVEN… WHY DON'T YOU USE name ATTRIBUTES!? */
            el = ctrl.getEl();
            el.name = name;
            
            form.appendChild(el);
          }
        });

        var el = win.getEl();
        var body = document.getElementById(el.id + "-body");
        body.appendChild(form);
      }

      function insertImage() {
        throbber = new top.tinymce.ui.Throbber(win.getEl());
        throbber.show();

        form.submit();
      }

      function uploadDone() {
        if(throbber) {
          throbber.hide();
        }
      }

      function createElement(element, attributes) {
        var el = document.createElement(element);
        for(var property in attributes) {
          if (!(attributes[property] instanceof Function)) {
            el[property] = attributes[property];
          }
        }

        return el;
      }

      function getMetaContents(mn) {
        var m = document.getElementsByTagName('meta');

        for(var i in m)
          if(m[i].name == mn)
            return m[i].content;

        return null;
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
