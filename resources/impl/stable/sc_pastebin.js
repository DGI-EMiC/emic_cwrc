
//add annotation to fedora

function islandora_postData(title, data, type, color) {

  data = encodeURI(data);
  $.ajax({
    type:'POST',
    async:false,
    url:islandora_canvas_params.islandora_post_url,
    data: {
      title:title,
      data:data,
      type:type,
      color:color
    },
    success: function(data,status,xhr) {
      islandora_getAnnotation(data);
    },
    error: function(data,status,xhr) {
      alert('Failed to post')
    }
  });

}

// Adds divs for each type
//

function islandora_getList() {
 
  islandora_canvas_params.mappings = new Array();
  $.ajax({
    type:'GET',
    async:false,
    url: islandora_canvas_params.get_annotation_list_url,
    success: function(data,status,xhr) {
      var listdata = $.parseJSON(data);
      var pids = listdata.pids;
      if( listdata!= null && pids != null){
        for (var i=0,info;i < pids.length;i++){
          islandora_canvas_params.mappings[pids[i]['urn']] = pids[i]['color']
          var pid = pids[i]['id'];
          var temp = pids[i]['type'];
          var fixed_cat = temp.replace(/[^\w]/g,'');
          if(temp != type){

            var type_class = "annoType_" + fixed_cat;
            var blockId = 'islandora_annoType_'+ fixed_cat;
            var contentId = 'islandora_annoType_content_'+ fixed_cat;
            var idSelector = '#' + blockId;
    
            if($(idSelector).length == 0){

              header =  '<div class = "islandora_comment_type" id = "'+ blockId + '">';
              header += '<div class = "islandora_comment_type_title">' + temp + '</div>';
              header += '<div class = "islandora_comment_type_content" style = "display:none" id = "'+ contentId + '"></div>';
              header += '</div>';
             
              $('#comment_annos_block').append(header);
            }
          }

          $('#canvases .canvas').each(function() {
            // console.log(temp + " " + pid)
            var cnv = $(this).attr('canvas');
            islandora_getAnnotation(pid);
          });
          var type = temp;
        }
      }

      $(".islandora_comment_type_title").off();

      $(".islandora_comment_type_title").ready().on("click", function(){
        $(this).siblings('.islandora_comment_type_content').toggle();
      });
    },
    error: function(data,status,xhr) {
    // alert('Failed to retrieve List')
    }

  });
 
}


// get annotation data from Fedora and send it to load_comment_anno to be displayed

function islandora_getAnnotation(pid) {
  $.ajax({
    type:'GET',
    url: islandora_canvas_params.islandora_get_annotation + pid,
    success: function(data,status,xhr) {
      load_commentAnno(data);
    },
    error: function(data,status,xhr) {
    }
  });
}

 // deletes annotation from fedora

function islandora_deleteAnno(urn) {

  var selector = '#anno_'+urn;
  $parent = $(selector).closest('.islandora_comment_type');
  length = $parent.find('.canvas_annotation').length;

  if (length ==1){
    $parent.remove();
  }

  var classSelector = '.svg_'+urn;
  $.ajax({
    type:'POST',
    url:islandora_canvas_params.islandora_delete_annotation + urn,
    data: urn,
    success: function(data,status,xhr) {
      $(selector).next().remove();
      $(selector).remove();
      $(classSelector).remove();

    },
    error: function(data,status,xhr) {
    //   alert('Failed to delete annotation')
    }
  });
}

//updates existing annotations

function islandora_updateAnno(urn, title,annoType, content, color){
  $.ajax({
    type:'POST',
    url:islandora_canvas_params.islandora_update_annotation,
    data: {
      urn:urn,
      title:title,
      annoType:annoType,
      content:content,
      color:color
    },
    success: function(data,status,xhr) {
      $('#create_annotation_box').hide();
      var selector = '#anno_'+urn;
      var text = $(selector).text().trim().substring(2,100);
      old_title = $(selector).html();
      new_title = old_title.replace(text, title);

      $(selector).html(new_title);
      $(selector).next('.comment_text').find('.comment_type').text(annoType);
      $(selector).next('.comment_text').find('.comment_content').text(content);
      var fixed_cat = annoType.replace(/[^\w]/g,'');

      $annotation = $(selector).closest('.canvas_annotation');
      $destination = $('#islandora_annoType_content_' + fixed_cat);
      $annotation.appendTo($destination);
     
    },
    error: function(data,status,xhr) {
      alert('Failed to update annotation')
    }
  });
  $('#create_annotation').empty().append('Annotate');
  $('#create_annotation').css({
    color:'#000000'
  });
}