/*============================================================================*/
/* Material Design Chips implementation, by pimenta                           */
/*============================================================================*/
md_chips_keyCode = {
  BACKSPACE: 8,
  COMMA: 188,
  DELETE: 46,
  DOWN: 40,
  END: 35,
  ENTER: 13,
  ESCAPE: 27,
  HOME: 36,
  LEFT: 37,
  PAGE_DOWN: 34,
  PAGE_UP: 33,
  PERIOD: 190,
  RIGHT: 39,
  SPACE: 32,
  TAB: 9,
  UP: 38
};
var md_chips_nextid = 1;
function new_md_chip_id() {
  var id = "md-chip--"+(md_chips_nextid++);
  return id;
}
function md_chips_occurs(sub, str) {
  var tmp = sub.split(" ");
  for (i in tmp) if (tmp[i].indexOf(" ") == -1) {
    if (str.indexOf(tmp[i]) > -1) return true;
  }
  return false;
}
function upgrade_md_chip(jq) {
  if (jq.hasClass("md-chip--is-upgraded")) return false;
  
  var id = new_md_chip_id();
  
  // read input data
  var title = jq.attr("data-title");
  var desc = jq.html();
  
  // modify DOM
  jq
  .attr("id", id)
  .addClass("md-chip")
  .addClass("md-chip--is-upgraded")
  .html(
    "<input type=\"hidden\" value=\""+title+"\">"+
    "<div for=\""+id+"\" class=\"mdl-tooltip\">"+
      "<h1>"+title+"</h1>"+
      "<div>"+desc+"</div>"+
    "</div>"+
    "<div class=\"md-chip__title\">"+title+"</div>"
  );
  componentHandler.upgradeElements(jq.find(".mdl-tooltip").get(0));
  
  return true;
}
function upgrade_md_chip_deletable(jq) {
  if (!upgrade_md_chip(jq)) return false;
  
  // modify DOM
  jq
  .addClass("md-chip--deletable")
  .append("<i class=\"md-chip__icon material-icons\">cancel</i>");
  
  // hook events
  jq
  .focus(function() {
    jq.addClass("mdl-color--primary");
  })
  .blur(function() {
    jq.removeClass("mdl-color--primary");
  })
  .keydown(function(e) {
    switch (e.which) {
      case md_chips_keyCode.BACKSPACE:
        var foc = jq.prev();
        if (foc.length == 0) foc = jq.next();
        jq.remove();
        foc.focus();
        break;
      case md_chips_keyCode.LEFT:
        jq.prev().focus();
        break;
      case md_chips_keyCode.RIGHT:
        jq.next().focus();
        break;
      default:
        jq.siblings("input").focus();
        break;
    }
  })
  .find("i").click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    var input = jq.siblings("input");
    jq.remove();
    input.focus();
  });
  
  return true;
}
function insert_md_chips(jq, obj) {
  var input = jq.find(".mdl-textfield__input");
  var chip = input
  .before("<div data-title=\""+obj.title+"\">"+obj.desc+"</div>")
  .prev();
  upgrade_md_chip_deletable(chip);
  chip.find("input").attr("name", jq.attr("data-name")+"[]");
  input.val("").trigger("input");
}
function upgrade_md_chips_option(jq) {
  // read input data
  var title = jq.attr("data-title");
  var desc = jq.html();
  
  // modify DOM
  jq.addClass("md-chips__option")
  .html(
    "<div class=\"md-chips__option-title\">"+title+"</div>"+
    "<div class=\"md-chips__option-desc\">"+desc+"</div>"
  );
  
  // hook events
  jq
  .hover(function() {
    jq.siblings(".md-chips__option").removeClass("mdl-color--primary");
    jq.addClass("mdl-color--primary");
  }, function() {
    jq.removeClass("mdl-color--primary");
  })
  .click(function(e) {
    e.preventDefault();
    e.stopPropagation();
    jq.removeClass("mdl-color--primary");
    insert_md_chips(jq.parents(".md-chips"), {title: title, desc: desc});
  });
}
function update_md_chips_options(jq_md_chips) {
  var val = jq_md_chips.find(".mdl-textfield__input").val();
  var cnt = 0;
  jq_md_chips
  .find(".md-chips__option")
  .removeClass("mdl-color--primary")
  .css("display", "none")
  .each(function() {
    var opt = $(this);
    var str = opt.attr("data-title");
    if (
      md_chips_occurs(val, str) &&
      jq_md_chips.find(".md-chip[data-title='"+str+"']").length == 0
    ) {
      opt.css("display", "block");
      cnt++;
    }
  });
  jq_md_chips.find(".md-chips__options")
  .css("display", cnt ? "initial" : "none");
}
function render_md_chips_options(jq_md_chips, opts) {
  var html = "";
  for (i in opts) html += (
    "<div data-title=\""+opts[i].title+"\">"+opts[i].desc+"</div>"
  );
  jq_md_chips.find(".md-chips__options")
  .html(html)
  .children().each(function() {
    upgrade_md_chips_option($(this));
  });
  update_md_chips_options(jq_md_chips);
}
function upgrade_md_chips(jq) {
  // read input data
  var deny_arbitrary_input = (jq.attr("data-deny-arbitrary-input")!=undefined);
  var chips = [];
  jq.find(".md-chip").each(function() {
    var jqtmp = $(this);
    chips.push({title: jqtmp.attr("data-title"), desc: jqtmp.html()});
  });
  var opts = [];
  jq.find(".md-chips__option").each(function() {
    var jqtmp = $(this);
    opts.push({title: jqtmp.attr("data-title"), desc: jqtmp.html()});
  });
  
  // modify DOM
  jq
  .addClass("md-chips")
  .addClass("mdl-textfield")
  .addClass("mdl-js-textfield")
  .html(
    "<div class=\"md-chips__input-div\" tabindex=\"0\">"+
      "<input class=\"mdl-textfield__input\" autocomplete=\"off\">"+
      "<div class=\"md-chips__options mdl-shadow--8dp\"></div>"+
    "</div>"+
    "<label class=\"mdl-textfield__label hide\">"+
      jq.attr("data-label")+
    "</label>"
  );
  for (i in chips) insert_md_chips(jq, chips[i]);
  render_md_chips_options(jq, opts);
  componentHandler.upgradeElements(jq.get(0));
  
  // get some objects
  var input = jq.find(".mdl-textfield__input");
  var options = jq.find(".md-chips__options").css("display", "none");
  var label = jq.find(".mdl-textfield__label");
  
  // hook events
  var updateui = function() {
    update_md_chips_options(jq);
    if (input.val() != "" || jq.find(".md-chip").length > 0) {
      label.addClass("hide");
    }
    else {
      jq.removeClass("is-dirty");
      label.removeClass("hide");
    }
  };
  var selopt = function(changecb) {
    seloptaux = function(tmp) {
      while (tmp.length > 0) {
        if (tmp.css("display") == "none") tmp = changecb(tmp);
        else {
          tmp.addClass("mdl-color--primary");
          return true;
        }
      }
      return false;
    };
    var tmp = options.find(".md-chips__option.mdl-color--primary");
    if (tmp.length == 0) seloptaux(options.find(".md-chips__option").first());
    else if (seloptaux(changecb(tmp))) tmp.removeClass("mdl-color--primary");
  };
  jq.find(".md-chips__input-div").focus(function() {
    input.focus();
  });
  input
  .focus(function() {
    updateui();
  })
  .blur(function() {
    options.css("display", "none");
  })
  .on("input", function(e) {
    updateui();
  })
  .keydown(function(e) {
    switch (e.which) {
      case md_chips_keyCode.BACKSPACE:
      case md_chips_keyCode.LEFT:
        if (input.val() == "") input.prev().focus();
        break;
      case md_chips_keyCode.UP:
        selopt(function(obj) {
          return obj.prev(".md-chips__option");
        });
        break;
      case md_chips_keyCode.DOWN:
        selopt(function(obj) {
          return obj.next(".md-chips__option");
        });
        break;
      case md_chips_keyCode.ENTER:
        var val = input.val(), desc = "";
        var opt = jq.find(".md-chips__option.mdl-color--primary");
        if (
          options.css("display") != "none" &&
          opt.length == 1 &&
          opt.css("display") != "none"
        ) {
          val = opt.attr("data-title");
          desc = opt.find(".md-chips__option-desc").html();
        }
        var chip = jq.find(".md-chip[data-title='"+val+"']");
        if (chip.length > 0) {
          e.preventDefault();
          e.stopPropagation();
          chip.focus();
          return;
        }
        opt = jq.find(".md-chips__option[data-title='"+val+"']");
        if (deny_arbitrary_input && opt.length == 0) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        if (opt.length > 0) desc = opt.find(".md-chips__option-desc").html();
        insert_md_chips(jq, {title: val, desc: desc});
        break;
    }
  });
}
function init_md_chips() {
  $(".md-chips").each(function() {
    upgrade_md_chips($(this));
  });
  $(".md-chip").each(function() {
    upgrade_md_chip($(this));
  });
}
