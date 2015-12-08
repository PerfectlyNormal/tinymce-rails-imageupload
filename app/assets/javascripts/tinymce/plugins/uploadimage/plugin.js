(function() {
  tinymce.PluginManager.requireLangPack('uploadimage');

  tinymce.create('tinymce.plugins.UploadImage', {
    UploadImage: function(ed, url) {
      var form,
          iframe,
          throbber,
          editor = ed;

      function getImageSize(url, callback) {
        var img = document.createElement('img');

        function done(width, height) {
          if (img.parentNode) {
            img.parentNode.removeChild(img);
          }

          callback({width: width, height: height});
        }

        img.onload = function() {
          done(Math.max(img.width, img.clientWidth), Math.max(img.height, img.clientHeight));
        };

        img.onerror = function() {
          done();
        };

        var style = img.style;
        style.visibility = 'hidden';
        style.position = 'fixed';
        style.bottom = style.left = 0;
        style.width = style.height = 'auto';

        document.body.appendChild(img);
        img.src = url;
      }

      function showDialog() {
        var win, data = {}, dom = editor.dom, imgElm;
        var width, height, imageListCtrl, classListCtrl, imageDimensions = editor.settings.image_dimensions !== false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
          console.log("Great success! All the File APIs are supported.");
        } else {
          alert('The File APIs are not fully supported in this browser.');
        }

        imgElm = editor.selection.getNode();

        if (imgElm && (imgElm.nodeName != 'IMG' || imgElm.getAttribute('data-mce-object') || imgElm.getAttribute('data-mce-placeholder'))) {
          imgElm = null;
        }

        if (imgElm) {
          width = dom.getAttrib(imgElm, 'width');
          height = dom.getAttrib(imgElm, 'height');

          data = {
            src: dom.getAttrib(imgElm, 'src'),
            alt: dom.getAttrib(imgElm, 'alt'),
            title: dom.getAttrib(imgElm, 'title'),
            "class": dom.getAttrib(imgElm, 'class'),
            width: width,
            height: height
          };
        }

        function recalcSize() {
          var widthCtrl, heightCtrl, newWidth, newHeight;

          widthCtrl = win.find('#width')[0];
          heightCtrl = win.find('#height')[0];

          if (!widthCtrl || !heightCtrl) {
            return;
          }

          newWidth = widthCtrl.value();
          newHeight = heightCtrl.value();

          if (win.find('#constrain')[0].checked() && width && height && newWidth && newHeight) {
            if (width != newWidth) {
              newHeight = Math.round((newWidth / width) * newHeight);

              if (!isNaN(newHeight)) {
                heightCtrl.value(newHeight);
              }
            } else {
              newWidth = Math.round((newHeight / height) * newWidth);

              if (!isNaN(newWidth)) {
                widthCtrl.value(newWidth);
              }
            }
          }

          width = newWidth;
          height = newHeight;
        }

        function srcChange(e) {
          var srcURL, prependURL, absoluteURLPattern, meta = e.meta || {};

          if (imageListCtrl) {
            imageListCtrl.value(editor.convertURL(this.value(), 'src'));
          }

          tinymce.each(meta, function(value, key) {
            win.find('#' + key).value(value);
          });

          if (!meta.width && !meta.height) {
            srcURL = editor.convertURL(this.value(), 'src');

            // Pattern test the src url and make sure we haven't already prepended the url
            prependURL = editor.settings.image_prepend_url;
            absoluteURLPattern = new RegExp('^(?:[a-z]+:)?//', 'i');
            if (prependURL && !absoluteURLPattern.test(srcURL) && srcURL.substring(0, prependURL.length) !== prependURL) {
              srcURL = prependURL + srcURL;
            }

            this.value(srcURL);

            getImageSize(editor.documentBaseURI.toAbsolute(this.value()), function(data) {
              if (data.width && data.height && imageDimensions) {
                width = data.width;
                height = data.height;

                win.find('#width').value(width);
                win.find('#height').value(height);
              }
            });
          }
        }

        function srcChangeLocal(e) {
          var fr = new FileReader;

          fr.onload = function(){
            var local_image = new Image;
            local_image.onload = function(){
              win.find('#width').value(local_image.width);
              win.find('#height').value(local_image.height);
            }
            local_image.src = fr.result;
          }

          fr.readAsDataURL(e.currentTarget.files[0]);
        }

        win = editor.windowManager.open({
          title: ed.translate('Insert an image from your computer'),
          width:  500 + parseInt(editor.getLang('uploadimage.delta_width', 0), 10),
          height: 380 + parseInt(editor.getLang('uploadimage.delta_height', 0), 10),
          data: data,
          body: [
            {type: 'iframe',  url: 'javascript:void(0)'},
            {
              name: 'src',
              type: 'filepicker',
              filetype: 'image',
              label: 'Source',
              autofocus: true,
              onchange: srcChange
            },
            {type: 'textbox', name: 'file', label: ed.translate('Choose an image'), subtype: 'file', onchange: srcChangeLocal},
            {type: 'textbox', name: 'title', label: ed.translate('Image Title')},
            {type: 'textbox', name: 'alt',  label: ed.translate('Image description')},
            {
              name: 'class',
              type: 'listbox',
              label: 'Image Class',
              values: [{text: 'None', value: ''}, {text: 'Right half', value: 'img-right'},{text: 'Left half', value: 'img-left'}, {text: 'Full width', value: 'img-full'}]
            },
            {
              type: 'container',
              label: 'Dimensions',
              layout: 'flex',
              direction: 'row',
              align: 'center',
              spacing: 5,
              items: [
                {name: 'width', type: 'textbox', maxLength: 5, size: 3, onchange: recalcSize, ariaLabel: 'Width'},
                {type: 'label', text: 'x'},
                {name: 'height', type: 'textbox', maxLength: 5, size: 3, onchange: recalcSize, ariaLabel: 'Height'},
                {name: 'constrain', type: 'checkbox', checked: true, text: 'Constrain proportions'}
              ]
            },
            {type: 'container', classes: 'error', html: "<p style='color: #b94a48;'>&nbsp;</p>"},

            // Trick TinyMCE to add a empty div that "preloads" the throbber image
            {type: 'container', classes: 'throbber'},
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
          ],
        }, {
          plugin_url: url
        });

        // TinyMCE likes pointless submit handlers
        win.off('submit');
        win.on('submit', insertImage);

        /* WHY DO YOU HATE <form>, TINYMCE!? */
        iframe = win.find("iframe")[0];
        form = createElement('form', {
          action: ed.getParam("uploadimage_form_url", "/tinymce_assets"),
          target: iframe._id,
          method: "POST",
          enctype: 'multipart/form-data',
          accept_charset: "UTF-8",
        });

        // Might have several instances on the same page,
        // so we TinyMCE create unique IDs and use those.
        iframe.getEl().name = iframe._id;

        // Create some needed hidden inputs
        form.appendChild(createElement('input', {type: "hidden", name: "utf8", value: "✓"}));
        form.appendChild(createElement('input', {type: 'hidden', name: 'authenticity_token', value: getMetaContents('csrf-token')}));
        form.appendChild(createElement('input', {type: 'hidden', name: 'hint', value: ed.getParam("uploadimage_hint", "")}));


        var el = win.getEl();
        var body = document.getElementById(el.id + "-body");

        // Copy everything TinyMCE made into our form
        var containers = body.getElementsByClassName('mce-container');
        for(var i = 0; i < containers.length; i++) {
          form.appendChild(containers[i]);
        }

        // Fix inputs, since TinyMCE hates HTML and forms
        var inputs = form.getElementsByTagName('input');
        for(var i = 0; i < inputs.length; i++) {
          var ctrl = inputs[i];

          if(ctrl.tagName.toLowerCase() == 'input' && ctrl.type != "hidden") {
            if(ctrl.type == "file") {
              ctrl.name = "file";

              // Hack styles
              tinymce.DOM.setStyles(ctrl, {
                'border': 0,
                'boxShadow': 'none',
                'webkitBoxShadow': 'none',
              });
            } else {
              ctrl.name = "alt";
            }
          }
        }

        body.appendChild(form);

        function insertImage() {
          // get form values
          recalcSize();

          data = tinymce.extend(data, win.toJSON());

          if(data.src == "" && getInputValue("file") == "") {
            return handleError('You must choose a file or insert an url');
          }else if(data.src != "" && getInputValue("file") == ""){
            editor.execCommand('mceInsertContent', false, buildHTML(""));
            editor.windowManager.close();
          }else{
            /* Add event listeners.
             * We remove the existing to avoid them being called twice in case
             * of errors and re-submitting afterwards.
             */
            var target = iframe.getEl();
            if(target.attachEvent) {
              target.detachEvent('onload', uploadDone);
              target.attachEvent('onload', uploadDone);
            } else {
              target.removeEventListener('load', uploadDone);
              target.addEventListener('load', uploadDone, false);
            }

            form.submit();
            // handle upload
            throbber = new top.tinymce.ui.Throbber(win.getEl());
            throbber.show();

            clearErrors();
          }

        }

        function uploadDone() {
          if(throbber) {
            throbber.hide();
          }

          var target = iframe.getEl();
          if(target.document || target.contentDocument) {
            var doc = target.contentDocument || target.contentWindow.document;
            handleResponse(doc.getElementsByTagName("body")[0].innerHTML);
          } else {
            handleError("Didn't get a response from the server");
          }
        }

        function handleResponse(ret) {
          try {
            var json = tinymce.util.JSON.parse(ret);

            if(json["error"]) {
              handleError(json["error"]["message"]);
            } else {
              ed.execCommand('mceInsertContent', false, buildHTML(json));
              ed.windowManager.close();
            }
          }
          catch(e) {
            handleError('Got a bad response from the server');
          }
        }

        function clearErrors() {
          var message = win.find(".error")[0].getEl();

          if(message)
            message.getElementsByTagName("p")[0].innerHTML = "&nbsp;";
        }

        function handleError(error) {
          var message = win.find(".error")[0].getEl();

          if(message)
            message.getElementsByTagName("p")[0].innerHTML = ed.translate(error);
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

        function buildHTML(json) {
          var src = data.src;
          var alt_text = data.alt;
          var title_text = data.title;
          var width_text = data.width;
          var height_text = data.height;
          var class_text = data.class;

          if(json == ""){
            var imgstr = "<img src='" + data.src + "'";
          }else{
            var imgstr = "<img src='" + json["image"]["url"] + "'";
          }

          imgstr += " class='" + class_text + "'";

          if(height_text != "")
            imgstr += " height='" + height_text + "'";
          if(width_text != "")
            imgstr += " width='"  + width_text  + "'";
          if(title_text != "")
            imgstr += " title='"  + title_text  + "'";

          imgstr += " alt='" + alt_text + "'/>";

          return imgstr;
        }

        function getInputValue(name) {
          var inputs = form.getElementsByTagName("input");

          for(var i in inputs)
            if(inputs[i].name == name)
              return inputs[i].value;

          return "";
        }

        function getMetaContents(mn) {
          var m = document.getElementsByTagName('meta');

          for(var i in m)
            if(m[i].name == mn)
              return m[i].content;

          return null;
        }
      }


      // Add a button that opens a window
      editor.addButton('uploadimage', {
        tooltip: ed.translate('Insert an url or image from your computer'),
        icon : 'image',
        onclick: showDialog
      });

      // Adds a menu item to the tools menu
      editor.addMenuItem('uploadimage', {
        text: ed.translate('Insert an url or image from your computer'),
        icon : 'image',
        context: 'insert',
        onclick: showDialog
      });
    }
  });

  tinymce.PluginManager.add('uploadimage', tinymce.plugins.UploadImage);
})();