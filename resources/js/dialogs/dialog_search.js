var SearchDialog = function(config) {
  var w = config.writer;
  var currentType = null;

  var mode = null;
  var ADD = 0;
  var EDIT = 1;

  $(document.body).append(''+
    '<div id="searchDialog">'+
    // need absolute positioning so accordion height is calculated properly
    '<div style="position: absolute; top: 10px; left: 10px; right: 10px; height: 31px;">'+
    '<label for="search_query">Search</label>'+
    '<input type="text" name="query" id="search_query" />'+
    '</div>'+
    '<div style="position: absolute; top: 41px; left: 10px; right: 10px; bottom: 70px;">'+
    '<div id="lookupServices">'+
    '<div id="lookup_project">'+
    '<h3><a href="#">Results from '+w.project+' Project</a></h3>'+
    '<div><div class="searchResultsParent"><ul class="searchResults"></ul></div></div>'+
    '</div>'+
    '<div id="lookup_viaf">'+
    '<h3><a href="#">Results from Web</a></h3>'+
    '<div><div class="searchResultsParent"><ul class="searchResults"></ul></div></div>'+
    '</div>'+
    '<div id="lookup_alternate">'+
    '<h3><a href="#">Alternate Identifier</a></h3>'+
    '<div>'+
    '<div><input type="radio" name="altLookup" /><label for="search_name">Name</label><ins name="name" class="ui-icon ui-icon-help">&nbsp;</ins><br/><input type="text" name="name" id="search_name" /></div>'+
    '<div><input type="radio" name="altLookup" /><label for="search_localid">Local Identifier</label><ins name="localid" class="ui-icon ui-icon-help">&nbsp;</ins><br/><input type="text" name="localid" id="search_localid" /></div>'+
    '<div><input type="radio" name="altLookup" /><label for="search_uri">URI</label><ins name="uri" class="ui-icon ui-icon-help">&nbsp;</ins><br/><input type="text" name="uri" id="search_uri" /></div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '<div id="certainty" style="position: absolute; bottom: 0; left: 10px; right: 10px; height: 65px;">'+
    '<p>This identification is:</p>'+
    '<input type="radio" id="c_definite" name="certainty" value="definite" /><label for="c_definite">Definite</label>'+
    '<input type="radio" id="c_reasonable" name="certainty" value="reasonable" /><label for="c_reasonable">Reasonably Certain</label>'+
    '<input type="radio" id="c_speculative" name="certainty" value="speculative" /><label for="c_speculative">Speculative</label>'+
    '</div>'+
    '</div>');

  var search = $('#searchDialog');
  search.dialog({
    modal: true,
    resizable: false,
    dialogClass: 'splitButtons',
    closeOnEscape: false,
    open: function(event, ui) {
      var chunk = $('#searchDialog').parent();
      $('#searchDialog').parent().find('.ui-dialog-titlebar-close').hide();
    },
    height: 550,
    width: 400,
    autoOpen: false
  });

  var searchInput = $('#search_query')[0];
  $(searchInput).bind('keyup', function() {
    doQuery();
  });

  $('#lookupServices').accordion({
    header: 'div > h3',
    fillSpace: true,
    change: function(event, ui) {
      doQuery();
    }
  });

  $('#lookup_alternate ins').click(function() {
    var type = $(this).attr('name');
    var msg = '';
    if (type == 'name') {
      msg = 'Enter a first and last name, which will be encoded as a FOAF URN.';
    } else if (type == 'localid') {
      msg = 'Enter the local id that you system uses for this person. It will be encoded as an URN.';
    } else if (type == 'uri') {
      msg = 'Enter a resolvable URI that identifies this person, e.g. their VIAF URI, LOC URI, etc.';
    }
    w.d.show('message', {
      title: 'Help',
      msg: msg
    });
  });
  $('#lookup_alternate input[type="text"]').focus(function() {
    $(this).prevAll('input').prop('checked', true);
  }).keyup(function() {
    $(this).css({
      borderColor: '#ccc'
    });
  });

  $('#certainty').buttonset();

  var doQuery = function() {
    var lookupService = $('#lookupServices div.ui-accordion-content-active').parent()[0].id;
    var type = $('#ui-dialog-title-searchDialog').text();
    $('div.ui-accordion-content-active div.searchResultsParent').css({
      borderColor: '#fff'
    });

    $('div.ui-accordion-content-active ul').first().html('<li class="unselectable last"><span>Searching...</span></li>');

    var query = searchInput.value;

    if (lookupService == 'lookup_project') {
      var url = 'http://apps.testing.cwrc.ca/services/entity_lookup/uap'+encodeURIComponent('?q=authlabel:'+query+'&d=orlando&f=by_auth_label&v=auth_label');
      $.ajax({
        url: cwrc_params.authority_url + type,
        // data: {
        // q: 'authlabel:'+query,
        // d: 'orlando',
        // f: 'by_auth_label',
        // v: 'auth_label'
        // },
        dataType: 'text json',
        success: function(data, status, xhr) {
       
          if ($.isPlainObject(data)) data = [data];
          if (data != null) {
            handleResults(data, 'project');
          } else {
            $('div.ui-accordion-content-active div.searchResultsParent ul').first().html('<li class="unselectable last"><span>No results.</span></li>');
          }
        },
        error: function(xhr, status, error) {
          if (status == 'parsererror') {
            var lines = xhr.responseText.split(/\n/);
            if (lines[lines.length-1] == '') {
              lines.pop();
            }
            var string = lines.join(',');
            var data = $.parseJSON('['+string+']');
            handleResults(data, 'project');
          } else {
            $('div.ui-accordion-content-active div.searchResultsParent ul').first().html('<li class="unselectable last"><span>Server error.</span></li>');
          }
        }
      });
    } else if (lookupService == 'lookup_viaf') {
 
      $.ajax({
        url: 'http://viaf.org/viaf/AutoSuggest',
        data: {
          query: query
        },
        dataType: 'jsonp',
        success: function(data, status, xhr) {
          if (data != null && data.result != null) {
            handleResults(data.result, 'viaf');
          } else {
            $('div.ui-accordion-content-active div.searchResultsParent ul').first().html('<li class="unselectable last"><span>No results.</span></li>');
          }
        },
        error: function() {
          $('div.ui-accordion-content-active div.searchResultsParent ul').first().html('<li class="unselectable last"><span>Server error.</span></li>');
        }
      });
    } 
  };

  var handleResults = function(results, lookup) {
    var formattedResults = '';
    var last = '';

    if (results.length == 0) {
      $('div.ui-accordion-content-active div.searchResultsParent ul').first().html('<li class="unselectable last"><span>No results.</span></li>');
    } else {
      var r, i, label;
      for (i = 0; i < results.length; i++) {
        r = results[i];

        if (lookup == 'project') {
          label = r.identifier;
        } else if (lookup == 'viaf') {
          label = r.term;
        } else {
          label = r[currentType];
        }

        if (i == results.length - 1) last = 'last';
        else last = '';

        formattedResults += '<li class="unselectable '+last+'">';
        $.each(r,function(i, val){
          formattedResults += '<span>'+val+'</span><br />';
        });
      //  formattedResults += '<span>'+label+'</span><br />';
      //  formattedResults += '<span>'+r.Place+'</span><br />';
        formattedResults += '</li>';
      }

      $('div.ui-accordion-content-active div.searchResultsParent ul').first().html(formattedResults);

      $('div.ui-accordion-content-active div.searchResultsParent ul li').each(function(index) {
        $(this).data(results[index]);
      });

      $('div.ui-accordion-content-active div.searchResultsParent ul li').click(function(event) {
        $('div.ui-accordion-content-active div.searchResultsParent').css({
          borderColor: '#fff'
        });
        var remove = $(this).hasClass('selected');
        $('div.ui-accordion-content-active ul li').removeClass('selected');
        if (!remove ) $(this).addClass('selected');
      });

      $('div.ui-accordion-content-active div.searchResultsParent ul li').dblclick(function(event) {
        $('div.ui-accordion-content-active ul li').removeClass('selected');
        $(this).addClass('selected');
        searchResult();
      });
    }
  };

  var searchResult = function(cancelled) {
    if(cancelled){
      search.dialog('close');
      currentType = null;
    }
    var data = null;
    if (!cancelled) {
      var certainty = $('#certainty input:checked').val();
      var lookupService = $('#lookupServices div.ui-accordion-content-active').parent()[0].id;
      if (lookupService == 'lookup_alternate') {
        var type = $('#lookup_alternate input[name="altLookup"]:checked');
        if (type.length == 1) {
          var value = type.nextAll('input').val();
          if (value == '') {
            $('#lookup_alternate input[type="text"]').css({
              borderColor: '#ccc'
            });
            type.nextAll('input').css({
              borderColor: 'red'
            });
            return false;
          } else {
            data = {
              type: 'alt_id',
              typeName: type.nextAll('input').attr('name'),
              value: value
            };
          }
        } else {
          $('#lookup_alternate input[type="text"]').css({
            borderColor: '#ccc'
          });
          $('#lookup_alternate input[name="altLookup"]').first().prop('checked', true).nextAll('input').css({
            borderColor: 'red'
          });
          return false;
        }
      } else {
        data = $('div.ui-accordion-content-active ul li.selected').data();
        
        if (data) {
          for (var key in data) {
            if (key.match(/jQuery/)) {
              delete data[key];
            }
          }
        } else {
          $('div.ui-accordion-content-active div.searchResultsParent').css({
            borderColor: 'red'
          });
          return false;
        }
      }
    }
    if (!(mode == EDIT && data == null)) {

      data.certainty = certainty;
      w.finalizeEntity(w.editor.currentEntity, data);
    }
  
    search.dialog('close');
  
    currentType = null;
  };

  var createNew = function() {
    w.d.show('add'+currentType, {});
  };

  return {
    show: function(config) {
      currentType = config.type;
      mode = config.entry ? EDIT : ADD;
      var prefix = 'Tag ';

      if (mode == EDIT) {
        prefix = 'Edit ';
      }

      $('div.searchResultsParent').css({
        borderColor: '#fff'
      });
      $('div.searchResultsParent').children('ul').html('');

      $('#lookup_alternate input[type="text"]').css({
        borderColor: '#ccc'
      }).val('');

      $('#c_definite').trigger('click');

      var query = w.entities[w.editor.currentEntity].props.content;
      searchInput.value = query;

      var title = prefix+config.title;
      search.dialog('option', 'title', title);
      search.dialog('option', 'buttons', [{
        text: 'Cancel',
        click: function() {
          searchResult(true);
        }
      },{
        text: 'Add New '+config.title,
        click: function() {
          createNew();
        }
      },{
        text: 'Tag '+config.title,
        click: function() {
          searchResult();
        }
      }]);
      if (config.pos) {
        search.dialog('option', 'position', [config.pos.x, config.pos.y]);
      } else {
        search.dialog('option', 'position', 'center');
      }
      search.dialog('open');

      $('#lookupServices').accordion('resize');
      if ($('#lookupServices').accordion('option', 'active') == 0) {
        doQuery();
      } else {
        $('#lookupServices').accordion('activate', 0);
      }
    },
    hide: function() {
      search.dialog('close');
    }
  };
};


