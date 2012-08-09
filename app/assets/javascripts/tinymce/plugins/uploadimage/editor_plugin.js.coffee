(->
  tinymce.PluginManager.requireLangPack('uploadimage')

  tinymce.create 'tinymce.plugins.UploadImagePlugin', {
    init: (ed, url) ->
      ed.addCommand 'mceUploadImage', ->
        ed.windowManager.open {
            file:   url + '/dialog.html',
            width:  320 + parseInt(ed.getLang('uploadimage.delta_width', 0)),
            height: 180 + parseInt(ed.getLang('uploadimage.delta_height', 0)),
            inline: 1
          }, {
            plugin_url: url
          }

      ed.addButton 'uploadimage', {
        title: 'uploadimage.desc',
        cmd:   'mceUploadImage',
        image: url + '/img/uploadimage.png'
      }

      # Selects the button in the UI when a image is selected
      ed.onNodeChange.add (ed, cm, n) ->
        cm.setActive('uploadimage', n.nodeName == 'IMG')

    createControl: (n, cm) ->
      null

    getInfo: () ->
      {
        longname: 'UploadImage plugin',
        author: 'Per Christian B. Viken (borrows heavily from work done by Peter Shoukry of 77effects.com)',
        authorurl: 'eastblue.org/oss',
        infourl: 'eastblue.org/oss',
        version: '1.0'
      }
  }

  tinymce.PluginManager.add 'uploadimage', tinymce.plugins.UploadImagePlugin
)()