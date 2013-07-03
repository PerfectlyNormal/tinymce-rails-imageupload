var UploadImageDialog = {
  editor: undefined,

  init: function() {
    var editor = this.editor = top.tinymce.activeEditor;
    this.f = document.forms[0];
    this.f.action = editor.getParam("uploadimage_form_url", "/tinymce_assets");
    document.getElementById("hint").value = editor.getParam("uploadimage_hint", "");
    document.getElementById("authenticity_token").value = this.getMetaContents('csrf-token');

    this.iframe = document.getElementById("hidden_upload");
    this.translatePage();
  },

  // Mostly copied straight from tinyMCE3.
  // Probably a better way to make this work.
  translatePage: function() {
    var expr   = /\{#([^\}]+)\}/g,
        title  = document.title,
        editor = top.tinymce.activeEditor,
        i18n   = top.tinymce.i18n,
        html   = document.body.innerHTML,
        newValue;

    // Replace a=x with a="x" in IE
    if(top.tinymce.isIE)
      html = html.replace(/ (value|title|alt)=([^"][^\s>]+)/gi, ' $1="$2"')

    document.dir = editor.getParam('directionality','');

    newValue = html.replace(expr, function(full, key) {
      console.log("Translating '" + key + "'");
      return i18n.translate(key);
    });

    if(newValue != html)
      document.body.innerHTML = newValue;

    if ((newValue = i18n.translate(title)) && newValue != title)
      document.title = newValue;
  },

  insert: function() {
    // Detach events first, then attach to avoid double event triggering
    if(this.iframe.attachEvent) {
      this.iframe.detachEvent('onload', UploadImageDialog.uploadDone);
      this.iframe.attachEvent('onload', UploadImageDialog.uploadDone);
    } else {
      this.iframe.removeEventListener('load', UploadImageDialog.uploadDone);
      this.iframe.addEventListener('load', UploadImageDialog.uploadDone, false);
    }
    var input = document.getElementById("file_upload");

    if(input.value != "") {
      top.tinymce.DOM.removeClass(document.getElementById("upload_spinner"), 'inactive');
      this.f.submit();
    } else {
      this.handleError('You must choose a file');
    }
  },

  uploadDone: function() {
    top.tinymce.DOM.addClass(document.getElementById("upload_spinner"), 'inactive');
    var iframe = document.getElementById("hidden_upload");
    if(iframe.document || iframe.contentDocument) {
      var doc = iframe.contentDocument || iframe.contentWindow.document;
      UploadImageDialog.handleResponse(doc.getElementsByTagName("body")[0].innerHTML);
    } else {
      UploadImageDialog.handleError("Didn't get a response from the server");
    }
  },

  handleResponse: function(ret) {
    try {
      var json = JSON.parse(ret);

      if(json["error"])
        UploadImageDialog.handleError(json["error"]["message"]);
      else {
        this.editor.execCommand('mceInsertContent', false, UploadImageDialog.buildHTML(json));
        this.editor.windowManager.close();
      }
    } catch(e) {
      UploadImageDialog.handleError('Got a bad response from the server');
    }
  },

  buildHTML: function(json) {
    var default_class = this.editor.getParam("uploadimage_default_img_class", "");
    var alt_text = document.getElementById("alt_text").value;

    var imgstr = "<img src='" + json["image"]["url"] + "'";

    if(default_class != "")
      imgstr += " class='" + default_class + "'";

    if(json["image"]["height"])
      imgstr += " height='" + json["image"]["height"] + "'";
    if(json["image"]["width"])
      imgstr += " width='"  + json["image"]["width"]  + "'";

    imgstr += " alt='" + alt_text + "'/>";

    return imgstr;
  },

  handleError: function(error) {
    var className = 'invalid';
    var label   = document.getElementById("file_upload_label");
    var message = document.getElementById("error_message");

    if(message)
      message.innerHTML = top.tinymce.i18n.translate(error);

    // Add the 'invalid' class, avoiding duplicates
    if(label) {
      var cn = label.className;
      if(cn.indexOf(className) == -1) {
        if(cn != '')
          className = ' ' + className;
        label.className = cn + className;
      }
    }
  },

  getMetaContents: function(mn) {
    var m = (window.opener || window.parent).document.getElementsByTagName('meta');

    for(var i in m)
      if(m[i].name == mn)
        return m[i].content;

    return null;
  },
};

window.onload = function() {
  UploadImageDialog.init();
}