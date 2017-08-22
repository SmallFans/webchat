/**
 * Created by yangjiao on 2017/8/22.
 */
var currentAgent={id:"@fdab6a4f3ec981aa4dcd3de64dca3ab4",nick:"小粉丝",sign:""};
$(document).ready(function () {
  initContacter()
  chatInit()
})

//初始化用户列表

var initContacter = function () {
  var userList = [
    {
      id : "2260de0a6aeec2555ef67388bd41a6a5",
      nick : "张三",
      remark:""
    },
    {
      id : "2260de0a6aeec2555ef67388bd41a6a4",
      nick : "李四",
      remark:"李四"
    },
    {
      id : "2260de0a6aeec2555ef67388bd41a6a3",
      nick : "王五",
      remark:"王五"
    }
  ]
  var pan = $(".chat03_content")
  for(var i = 0;i<userList.length;i++){
    var _user=userList[i];
    var _nick= $.trim(_user.remark)?$.trim(_user.remark):$.trim(_user.nick);
    pan.find("ul").append("<li ds_action='showUserMsg' ds_data='"+userList[i].id+"' class='ds_do_action' uli_index='"+i+"'>"+
      "<div href='javascript:void(0);'><img class='userHeadImg' src='img/userImg.png'></div>"+
      "<div href='javascript:void(0);' class='chat03_name'>"+userList[i].nick+"</div>"+
      "<div href='javascript:void(0);' class='chat03_remark'>"+userList[i].remark+"</div>"+
      "<div href='javascript:void(0);' class='chat03_count' id='"+userList[i].id+"' nick='"+_nick+"' value='0'></div>"+
      "</li>"
    )
  }
  var myContainer = $(".chat03_title");
  myContainer.find(".display_name").html(currentAgent.nick).attr("myId",currentAgent._id);
}
var showUserMsg = function (msgId,src) {
  $(".showList").show()
  var name=src.find(".chat03_count").attr("nick");
  src.addClass("choosed")
  src.siblings().removeClass("choosed");
  var _id = src.children(".chat03_count").attr("id");
  var _nick = src.children(".chat03_count").attr("nick");
  var _head = src.find(".userHeadImg").attr("src");
  userListIndex = $(".chat03_content li[ds_data='"+msgId+"']").attr("uli_index")
  $(".chat01_title").find(".contacter_img").attr("src",_head);
  $("#chat01_name").html(name);
  $("input[name=currentId]").val(_id);
  var chatPane=$(".chat01_content").find("div[id='mes"+_id+"']");
  if (chatPane.length <= 0) {
    $(".chat01_content").append("<div class='message_box' id='mes"+_id+"'></div>")
    var pane= $(".chat01_content").find("div[id='mes"+_id+"']");
    queryMsgHistory(currentAgent, function(msgList){
      msgList = msgList || []
      var html=[];
      for (var j = msgList.length-1; j >= 0; j--) {
        html.push(showMsg(msgList[j]));
      }
      pane.prepend(html.join(""));
    })
  }
}

var queryMsgHistory = function(currentAgent, callback) {
  var msgList = [
    {content: '咱家开的手机铃声1'},
    {content: '咱家开的手机铃声2'},
    {content: '咱家开的手机铃声3'},
    {content: '咱家开的手机铃声4'},
    {content: '咱家开的手机铃声5'}
  ]
  if (typeof callback == "function") {
    callback(msgList);
  }
}
var chatInit = function () {
  $(".showList").hide()
  $(document).on("click", ".ds_do_action", function (event) {
    event.preventDefault();
    var src = $(event.currentTarget);
    var action = src.attr("ds_action");
    var data = src.attr('ds_data');
    var actionHandler = eval(action);
    if (actionHandler) {
      actionHandler(data, src);
    } else {
      console.log('action handler [' + action + '] is not support!');
    }
  });
}