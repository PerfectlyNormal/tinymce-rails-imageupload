(function() {
  tinymce.PluginManager.requireLangPack('uploadimage');

  tinymce.create('tinymce.plugins.UploadImage', {
    UploadImage: function(ed, url) {
      var PLUGIN_CLASS = 'mce-plugins-uploadimage';
      var form,
        iframe,
        win,
        throbber,
        selectedClass = '',
        editor = ed;

      function showDialog() {
        var node = ed.selection.getNode();

        if (node && node.tagName === 'IMG') {
          showUpdateDialog();
        } else {
          showInsertDialog();
        }
      }

      function showInsertDialog() {
        var classList = getClassList();
        var body = [
          { type: 'iframe', url: 'javascript:void(0)' },
          {
            type: 'textbox',
            name: 'file',
            label: ed.translate('Choose an image'),
            subtype: 'file'
          },
          {
            type: 'textbox',
            name: 'alt',
            label: ed.translate('Image description')
          }
        ];

        if (classList.length > 0) {
          selectedClass = classList[0].value;
          body = body.concat([
            {
              type: 'listbox',
              name: 'class',
              label: ed.translate('Class'),
              values: classList,
              onSelect: function(e) {
                selectedClass = this.value();
              }
            }
          ]);
        }

        body = body.concat([
          {
            type: 'container',
            classes: 'error',
            html: "<p style='color: #b94a48;'>&nbsp;</p>"
          },

          // Trick TinyMCE to add a empty div that "preloads" the throbber image
          { type: 'container', classes: 'throbber' }
        ]);

        win = editor.windowManager.open(
          {
            title: ed.translate('Insert an image from your computer'),
            width: 520 + parseInt(editor.getLang('uploadimage.delta_width', 0), 10),
            height: 180 + parseInt(editor.getLang('uploadimage.delta_height', 0), 10),
            body: body,
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
          },
          {
            plugin_url: url
          }
        );

        /* WHY DO YOU HATE <form>, TINYMCE!? */
        iframe = win.find('iframe')[0];
        form = createElement('form', {
          action: ed.getParam('uploadimage_form_url', '/tinymce_assets'),
          target: iframe._id,
          method: 'POST',
          enctype: 'multipart/form-data',
          accept_charset: 'UTF-8'
        });

        // Might have several instances on the same page,
        // so we TinyMCE create unique IDs and use those.
        iframe.getEl().name = iframe._id;

        // Create some needed hidden inputs
        form.appendChild(createElement('input', { type: 'hidden', name: 'utf8', value: '✓' }));
        form.appendChild(
          createElement('input', {
            type: 'hidden',
            name: 'authenticity_token',
            value: getMetaContents('csrf-token')
          })
        );
        form.appendChild(
          createElement('input', {
            type: 'hidden',
            name: hintName(),
            value: hintValue()
          })
        );

        var el = win.getEl();
        var body = document.getElementById(el.id + '-body');

        // Copy everything TinyMCE made into our form
        var containers = body.getElementsByClassName('mce-container');
        for (var i = 0; i < containers.length; i++) {
          form.appendChild(containers[i]);
        }

        // Fix inputs, since TinyMCE hates HTML and forms
        var inputs = form.getElementsByTagName('input');
        for (var i = 0; i < inputs.length; i++) {
          var ctrl = inputs[i];

          if (ctrl.tagName.toLowerCase() === 'input' && ctrl.type !== 'hidden') {
            if (ctrl.type === 'file') {
              ctrl.name = inputName('file');

              // Hack styles
              tinymce.DOM.setStyles(ctrl, {
                border: 0,
                boxShadow: 'none',
                webkitBoxShadow: 'none'
              });
            } else {
              ctrl.name = inputName('alt');
            }
          }
        }

        body.appendChild(form);
      }

      function showUpdateDialog() {
        var node = ed.selection.getNode();
        var classList = getClassList();
        var body = [
          {
            type: 'textbox',
            name: 'alt',
            value: node.getAttribute('alt'),
            label: ed.translate('Image description')
          }
        ];

        if (classList.length > 0) {
          for (var i = 0; i < classList.length; i++) {
            if (node.className.indexOf(classList[i].value) > 0) {
              selectedClass = classList[i];
            }
          }

          selectedClass = selectedClass || classList[0].value;
          body = body.concat([
            {
              type: 'listbox',
              name: 'class',
              label: ed.translate('Class'),
              value: selectedClass.value,
              values: classList,
              onSelect: function(e) {
                selectedClass = this.value();
              }
            }
          ]);
        }

        win = editor.windowManager.open(
          {
            title: ed.translate('Update image'),
            width: 520 + parseInt(editor.getLang('uploadimage.delta_width', 0), 10),
            height: 180 + parseInt(editor.getLang('uploadimage.delta_height', 0), 10),
            body: body,
            buttons: [
              {
                text: ed.translate('Update'),
                onclick: updateImage,
                subtype: 'primary'
              },
              {
                text: ed.translate('Cancel'),
                onclick: ed.windowManager.close
              }
            ]
          },
          {
            plugin_url: url
          }
        );
      }

      function hintName() {
        return inputName(ed.getParam('uploadimage_hint_key', 'hint'));
      }

      function hintValue() {
        return ed.getParam('uploadimage_hint', '');
      }

      function inputName(name) {
        if (ed.getParam('uploadimage_model', false)) {
          return ed.getParam('uploadimage_model') + '[' + name + ']';
        } else {
          return name;
        }
      }

      function windowData() {
        if (ed.windowManager.windows[0]) {
          return ed.windowManager.windows[0].toJSON();
        } else {
          return {};
        }
      }

      function insertImage() {
        if (getInputValue(inputName('file')) === '') {
          return handleError('You must choose a file');
        }

        throbber = new top.tinymce.ui.Throbber(win.getEl());
        throbber.show();

        clearErrors();

        /* Add event listeners.
         * We remove the existing to avoid them being called twice in case
         * of errors and re-submitting afterwards.
         */
        var target = iframe.getEl();
        if (target.attachEvent) {
          target.detachEvent('onload', uploadDone);
          target.attachEvent('onload', uploadDone);
        } else {
          target.removeEventListener('load', uploadDone);
          target.addEventListener('load', uploadDone, false);
        }

        form.submit();
      }

      function updateImage(e) {
        var node = ed.selection.getNode();
        var data = windowData();

        node.setAttribute('class', defaultClass() + ' ' + data.class);
        node.setAttribute('alt', data.alt);
        win.close();
      }

      function uploadDone() {
        if (throbber) {
          throbber.hide();
        }
        try {
          var target = iframe.getEl();
          if (target.document || target.contentDocument) {
            var doc = target.contentDocument || target.contentWindow.document;
            if (String(doc.contentType).indexOf('html') > -1) {
              handleResponse(doc.getElementsByTagName('body')[0].innerHTML);
            } else {
              handleResponse(doc.getElementsByTagName('pre')[0].innerHTML);
            }
          }
        } catch (e) {
          handleError("Didn't get a response from the server");
        }
      }

      function handleResponse(ret) {
        try {
          var json = tinymce.util.JSON.parse(ret);

          if (json['error']) {
            handleError(json['error']['message']);
          } else {
            ed.execCommand('mceInsertContent', false, buildHTML(json));
            ed.windowManager.close();
          }
        } catch (e) {
          handleError('Got a bad response from the server');
        }
      }

      function clearErrors() {
        var message = win.find('.error')[0].getEl();

        if (message) {
          message.getElementsByTagName('p')[0].innerHTML = '&nbsp;';
        }
      }

      function handleError(error) {
        var message = win.find('.error')[0].getEl();

        if (message) {
          message.getElementsByTagName('p')[0].innerHTML = ed.translate(error);
        }
      }

      function createElement(element, attributes) {
        var el = document.createElement(element);
        for (var property in attributes) {
          if (!(attributes[property] instanceof Function)) {
            el[property] = attributes[property];
          }
        }

        return el;
      }

      function buildHTML(json) {
        var image = json[ed.getParam('uploadimage_model', 'image')];
        var figure = ed.getParam('uploadimage_figure', false);
        var altText = getInputValue(inputName('alt'));

        var imgstr = "<img src='" + image['url'] + "'";

        if (defaultClass() !== '') {
          imgstr += " class='" + defaultClass() + ' ' + selectedClass + "'";
        }

        if (image['height']) {
          imgstr += " height='" + image['height'] + "'";
        }
        if (image['width']) {
          imgstr += " width='" + image['width'] + "'";
        }

        imgstr += " alt='" + altText + "'/>";

        if (figure) {
          var figureClass = ed.getParam('uploadimage_figure_class', 'figure');
          var figcaptionClass = ed.getParam('uploadimage_figcaption_class', 'figcaption');

          var figstr = '<figure';

          if (figureClass !== '') {
            figstr += " class='" + figureClass + "'";
          }
          figstr += '>' + imgstr;
          figstr += '<figcaption';
          if (figcaptionClass !== '') {
            figstr += " class='" + figcaptionClass + "'";
          }
          figstr += '>' + altText + '</figcaption>';
          figstr += '</figure>';

          return figstr;
        } else {
          return imgstr;
        }
      }

      function getInputValue(name) {
        var inputs = form.getElementsByTagName('input');

        for (var i in inputs) {
          if (inputs[i].name === name) {
            return inputs[i].value;
          }
        }

        return '';
      }

      function getMetaContents(mn) {
        var m = document.getElementsByTagName('meta');

        for (var i in m) {
          if (m[i].name === mn) {
            return m[i].content;
          }
        }

        return null;
      }

      function defaultClass() {
        return ed.getParam('uploadimage_default_img_class', '') + ' ' + PLUGIN_CLASS;
      }

      function getClassList() {
        var config = ed.getParam('image_class_list', []);
        var values = [];
        for (var i = 0; i < config.length; i++) {
          values[i] = {
            text: config[i]['title'],
            value: config[i]['value']
          };
        }
        return values;
      }

      if (editor.getParam('uploadimage', true)) {
        // Add a button that opens a window
        editor.addButton('uploadimage', {
          tooltip: ed.translate('Insert/update an image'),
          icon: 'image',
          onclick: showDialog,
          stateSelector: '.' + PLUGIN_CLASS
        });

        // Adds a menu item to the tools menu
        editor.addMenuItem('uploadimage', {
          text: ed.translate('Insert/update an image'),
          icon: 'image',
          context: 'insert',
          onclick: showDialog
        });
      }
    }
  });

  tinymce.PluginManager.add('uploadimage', tinymce.plugins.UploadImage);
})();
