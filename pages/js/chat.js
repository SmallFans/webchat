/**
 * Created by yangjiao on 2017/8/22.
 */
var currentAgent={id:"@fdab6a4f3ec981aa4dcd3de64dca3ab4",nick:"out",sign:""};
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
      for (var j = msgList.length-1; j >= 0; j--) { //转html
        var changePane=pane.find("div[mid = '"+ msgList[j]._id +"']").find(".wrap-content");
        var selfPane=pane.find("div[mid = '"+ msgList[j]._id +"'][class='message clearfix self']")
        if(msgList[j].msgType==1 && selfPane.length<=0){
          changePane.html(msgList[j].content);
        }else if(msgList[j].msgType==1 && selfPane.length>0){
          var _txt=escapeHtml(msgList[j].content);
          _txt=_txt.replace(/\n/g,"<br/>");
          changePane.html(_txt);
        }
      }
      pane.show().siblings().hide();
      _locationMsg(pane);
    })
  } else {
    chatPane=$(".chat01_content").find("div[id='mes"+_id+"']");
    var userPane=$(".chat03_content").find("div[id = '"+msgId+"']");
    var msgList=userPane.data("user_msgs")||[];
    if(msgList.length>0){
      userPane.data("user_msgs",[]);
      for(var j = 0;j<msgList.length;j++){
        var msgTime=msgList[j].time;
        var date=new Date();
        date.setTime(msgTime*1000);
        var msgItem = {
          _id:msgList[j].mid,
          createTime:msgList[j].time,
          createTimeStr:getCurrentDateTime(date),
          msgType:msgList[j].type,
          fromUser:msgList[j].fromUser,
          toUser:msgList[j].toUser,
          content:msgList[j].content,
          isRealtime:true
        }
        chatPane.append(showMsg(msgItem));
        var lastEles=chatPane.find('div.message:last').find(".wrap-content");
        var _txt=escapeHtml(msgList[j].content);
        _txt=_txt.replace(/\n/g,"<br/>");
        lastEles.html(_txt);
      }
      chatPane.show().siblings().hide();
      _locationMsg(chatPane);
    }else{
      chatPane.show().siblings().hide();
    }
  }
}
var _locationMsg=function (container) {
  window.setTimeout(function () {
    var lastMsg = container.find(".message:last");
    if (lastMsg.length > 0) {
      var scrollTop = lastMsg.offset().top - container.offset().top + container.scrollTop() + lastMsg.innerHeight();
      container.scrollTop(scrollTop);
    }
  }, 500);
}
var showMsg = function (wxObj) {
  var time = wxObj.createTime;
  var msgId = wxObj._id;
  var revoke = wxObj.revoke||false;
  var timeDesc = "";
  wxObj.ts=time;
  wxObj.time = timeDesc;
  var msgType = wxObj.msgType;
  var type=wxObj.fromUser==currentAgent.nick?"out":"in";
  if(wxObj.isRealtime){//实时消息
    type=wxObj.fromUser==currentAgent.id?"out":"in";
  }
  var tmpl = "";
  if(type=='in'){
    if(msgType == 1){
      tmpl = "tmpl_newwebchat_msg_from";
    }
  }else{
    if(msgType == 1){
      tmpl = "tmpl_newwebchat_msg_to";
    }
  }
  tmpl = template(tmpl, wxObj);
  return tmpl;
}
/**
 * 解码程html符号
 * @param str
 * @returns {*}
 */
function escapeHtml(str){
  str = String(str).replace(/&/gm, "&amp;").replace(/</gm, "&lt;")
    .replace(/>/gm, "&gt;").replace(/"/gm, "&quot;").replace(/'/gm,"&#39;");
  return str;
}
var queryMsgHistory = function(currentAgent, callback) {
  var msgList = [
    {
      content: '咱家开的手机铃声1',
      createTime: '2017年8月23日',
      _id:'2260de0a6aeec2555ef67388bd41a6a5',
      msgType: 1,
      fromUser: '李四',
      toUser: '张三',
      createTimeStr: '2017年8月24日',
      isRealtime: false
    }
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