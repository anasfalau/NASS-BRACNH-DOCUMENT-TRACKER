// ================================================================
//  NASS Branch Tracker — Messenger
//  WhatsApp-style DMs + Group chats for all logged-in staff.
//  Left sidebar: conversation list.  Right: message thread.
//  Type @AI in any conversation to invoke the AI assistant.
//  Lazy-loaded on first click of the topbar Chat button.
// ================================================================
(function(){
'use strict';
var _sb=window._sb;
var AI_URL='https://sblqmpmawkogbbzzkwxt.supabase.co/functions/v1/chat';

// ── State ─────────────────────────────────────────────────────────
var _myId='',_myEmail='';
var _convs=[];        // [{id,type,name,last_msg_at,members[],lastMsg,unread}]
var _activeId=null;   // currently open conversation id
var _msgs=[];         // messages in active conversation
var _users=[];        // all users for picker (from nass_profiles)
var _sub=null;        // realtime subscription
var _unread=0;        // total unread count (for topbar badge)
var _open=false;
var _panel=null;
var _grpSelected=[];  // users selected for new group

// ── Helpers ───────────────────────────────────────────────────────
function _esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function _fmt(ts){var d=new Date(ts);return d.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});}
function _fmtRel(ts){
  var d=new Date(ts),now=new Date(),diff=now-d;
  if(diff<60000)return'now';
  if(diff<3600000)return Math.floor(diff/60000)+'m';
  if(d.toDateString()===now.toDateString())return _fmt(ts);
  var yest=new Date(now);yest.setDate(yest.getDate()-1);
  if(d.toDateString()===yest.toDateString())return'Yesterday';
  return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'});
}
function _fmtDay(ts){
  var d=new Date(ts),now=new Date();
  if(d.toDateString()===now.toDateString())return'Today';
  var yest=new Date(now);yest.setDate(yest.getDate()-1);
  if(d.toDateString()===yest.toDateString())return'Yesterday';
  return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
}
function _convName(c){
  if(c.type==='group')return c.name||'Group';
  var other=c.members&&c.members.find(function(m){return m.user_id!==_myId;});
  return other?(other.user_email||'?').split('@')[0]:'Direct Message';
}
function _convAv(c){
  if(c.type==='group')return'&#128101;';
  var other=c.members&&c.members.find(function(m){return m.user_id!==_myId;});
  return other?_esc((other.user_email||'?')[0].toUpperCase()):'?';
}
function _shortName(email,isAi){
  if(isAi)return'NASS AI';
  if(email===_myEmail)return'You';
  return (email||'?').split('@')[0];
}
function _lastPreview(m){
  if(!m)return'';
  var who=m.is_ai_response?'AI':(m.user_email===_myEmail?'You':(m.user_email||'').split('@')[0]);
  return who+': '+(m.content||'').substring(0,55)+(m.content&&m.content.length>55?'…':'');
}

// ── Build panel DOM ───────────────────────────────────────────────
function _build(){
  _panel=document.createElement('div');
  _panel.id='ms-panel';
  _panel.className='ms-panel';
  _panel.innerHTML=
    // ── Left sidebar ──────────────────────────────────────────────
    '<div class="ms-sidebar">'+
      '<div class="ms-sb-hdr">'+
        '<span class="ms-sb-title">Messages</span>'+
        '<div class="ms-sb-btns">'+
          '<button class="ms-icon-btn" id="ms-new-dm-btn" title="New Direct Message">'+
            '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'+
          '</button>'+
          '<button class="ms-icon-btn" id="ms-new-grp-btn" title="New Group Chat">'+
            '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">'+
              '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>'+
              '<path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'+
            '</svg>'+
          '</button>'+
          '<button class="ms-icon-btn ms-close-btn" onclick="window._nassMsClose()" title="Close">'+
            '<svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">'+
              '<line x1="1" y1="1" x2="13" y2="13"/><line x1="13" y1="1" x2="1" y2="13"/>'+
            '</svg>'+
          '</button>'+
        '</div>'+
      '</div>'+
      '<div class="ms-sb-search-wrap">'+
        '<input class="ms-sb-search" id="ms-sb-search" placeholder="Search conversations&#8230;" autocomplete="off">'+
      '</div>'+
      '<div class="ms-conv-list" id="ms-conv-list">'+
        '<div class="ms-splash"><div class="ms-splash-icon">&#128172;</div><div class="ms-splash-txt">Loading&#8230;</div></div>'+
      '</div>'+
    '</div>'+
    // ── Right thread ──────────────────────────────────────────────
    '<div class="ms-thread" id="ms-thread">'+
      '<div class="ms-thread-empty">'+
        '<div style="font-size:48px;margin-bottom:12px">&#128172;</div>'+
        '<div style="font-size:14px;font-weight:600;color:var(--fg-muted);margin-bottom:6px">Select a conversation</div>'+
        '<div style="font-size:12px;color:var(--fg-subtle)">or start a new DM / Group above</div>'+
      '</div>'+
    '</div>'+
    // ── DM picker modal ───────────────────────────────────────────
    '<div class="ms-modal" id="ms-dm-modal" style="display:none">'+
      '<div class="ms-modal-box">'+
        '<div class="ms-modal-hdr"><span>New Direct Message</span>'+
          '<button class="ms-modal-x" id="ms-dm-close">&#10005;</button></div>'+
        '<input class="ms-modal-srch" id="ms-dm-search" placeholder="Search users&#8230;" autocomplete="off">'+
        '<div class="ms-picker-list" id="ms-dm-list"><div class="ms-splash-txt" style="padding:20px;text-align:center">Loading users&#8230;</div></div>'+
      '</div>'+
    '</div>'+
    // ── Group creator modal ───────────────────────────────────────
    '<div class="ms-modal" id="ms-grp-modal" style="display:none">'+
      '<div class="ms-modal-box">'+
        '<div class="ms-modal-hdr"><span>New Group Chat</span>'+
          '<button class="ms-modal-x" id="ms-grp-close">&#10005;</button></div>'+
        '<input class="ms-modal-srch" id="ms-grp-name" placeholder="Group name&#8230;" maxlength="60" style="border-bottom-width:2px">'+
        '<div class="ms-picker-sect-lbl">Add Members</div>'+
        '<input class="ms-modal-srch" id="ms-grp-search" placeholder="Search users&#8230;" autocomplete="off">'+
        '<div class="ms-picker-list" id="ms-grp-list"><div class="ms-splash-txt" style="padding:20px;text-align:center">Loading users&#8230;</div></div>'+
        '<div class="ms-grp-chips" id="ms-grp-chips"></div>'+
        '<div class="ms-modal-foot">'+
          '<button class="btn btn-navy" style="width:100%" id="ms-grp-create-btn">Create Group</button>'+
        '</div>'+
      '</div>'+
    '</div>';

  document.body.appendChild(_panel);

  // Wire events
  document.getElementById('ms-new-dm-btn').onclick=_openDmModal;
  document.getElementById('ms-new-grp-btn').onclick=_openGrpModal;
  document.getElementById('ms-dm-close').onclick=_closeDmModal;
  document.getElementById('ms-grp-close').onclick=_closeGrpModal;
  document.getElementById('ms-grp-create-btn').onclick=_createGroup;
  document.getElementById('ms-sb-search').oninput=function(){_renderConvList(this.value);};
  document.getElementById('ms-dm-search').oninput=function(){_renderPickerList('ms-dm-list',this.value,_startDM);};
  document.getElementById('ms-grp-search').oninput=function(){_renderGrpPickerList(this.value);};
}

// ── Conversation list ─────────────────────────────────────────────
function _renderConvList(filter){
  var el=document.getElementById('ms-conv-list');if(!el)return;
  var list=_convs.slice();
  if(filter){var f=filter.toLowerCase();list=list.filter(function(c){return _convName(c).toLowerCase().indexOf(f)>-1;});}
  if(!list.length){
    el.innerHTML='<div class="ms-splash"><div class="ms-splash-icon">&#128172;</div><div class="ms-splash-txt">No conversations yet.<br>Start a DM or group.</div></div>';
    return;
  }
  el.innerHTML='';
  list.forEach(function(c){
    var div=document.createElement('div');
    div.className='ms-conv-item'+(c.id===_activeId?' ms-conv-active':'');
    div.dataset.cid=c.id;
    var unread=c.unread||0;
    div.innerHTML=
      '<div class="ms-conv-av">'+_convAv(c)+'</div>'+
      '<div class="ms-conv-info">'+
        '<div class="ms-conv-r1">'+
          '<span class="ms-conv-nm">'+_esc(_convName(c))+'</span>'+
          '<span class="ms-conv-ts">'+(c.last_msg_at?_fmtRel(c.last_msg_at):'')+'</span>'+
        '</div>'+
        '<div class="ms-conv-r2">'+
          '<span class="ms-conv-pv">'+_esc(c.lastMsg||'')+'</span>'+
          (unread>0?'<span class="ms-unread">'+unread+'</span>':'')+
        '</div>'+
      '</div>';
    div.onclick=function(){_openConv(c.id);};
    el.appendChild(div);
  });
}

// ── Load all conversations ────────────────────────────────────────
async function _loadConvs(){
  try{
    var r=await _sb.from('nass_conversations').select('*').order('last_msg_at',{ascending:false}).limit(60);
    if(r.error)throw r.error;
    var list=r.data||[];
    if(!list.length){_convs=[];_renderConvList('');return;}
    var ids=list.map(function(c){return c.id;});
    // Fetch members
    var mr=await _sb.from('nass_conv_members').select('*').in('conversation_id',ids);
    var allMembers=mr.data||[];
    // Fetch last message per conversation
    var lgr=await _sb.from('nass_messages').select('conversation_id,content,created_at,user_email,is_ai_response').in('conversation_id',ids).order('created_at',{ascending:false}).limit(ids.length*3);
    var lastMsgs={};
    (lgr.data||[]).forEach(function(m){if(!lastMsgs[m.conversation_id])lastMsgs[m.conversation_id]=m;});
    // Fetch my read timestamps
    var rdr=await _sb.from('nass_conv_members').select('conversation_id,last_read_at').eq('user_id',_myId).in('conversation_id',ids);
    var myReads={};
    (rdr.data||[]).forEach(function(r){myReads[r.conversation_id]=r.last_read_at;});
    // Build conv objects
    _convs=list.map(function(c){
      var members=allMembers.filter(function(m){return m.conversation_id===c.id;});
      var lm=lastMsgs[c.id]||null;
      // Simple unread: if last message is newer than my last_read and not from me
      var unread=0;
      if(lm&&lm.user_id!==_myId){
        var myRead=myReads[c.id];
        if(!myRead||new Date(lm.created_at)>new Date(myRead))unread=1;
      }
      return Object.assign({},c,{members:members,lastMsg:_lastPreview(lm),unread:unread});
    });
    _unread=_convs.reduce(function(s,c){return s+(c.unread||0);},0);
    _badge();
    _renderConvList(document.getElementById('ms-sb-search')?document.getElementById('ms-sb-search').value:'');
  }catch(e){
    console.error('[MS] loadConvs',e);
    var el=document.getElementById('ms-conv-list');
    if(el)el.innerHTML='<div class="ms-splash"><div class="ms-splash-icon">&#9888;</div><div class="ms-splash-txt">Could not load conversations.</div></div>';
  }
}

// ── Open conversation ─────────────────────────────────────────────
async function _openConv(convId){
  _activeId=convId;
  var conv=_convs.find(function(c){return c.id===convId;});
  if(!conv)return;
  // Clear unread for this conv
  conv.unread=0;
  _unread=Math.max(0,_convs.reduce(function(s,c){return s+(c.unread||0);},0));
  _badge();
  _renderConvList(document.getElementById('ms-sb-search')?document.getElementById('ms-sb-search').value:'');
  // Build thread UI
  _renderThreadShell(conv);
  // Load messages
  try{
    var r=await _sb.from('nass_messages').select('*').eq('conversation_id',convId).order('created_at',{ascending:true}).limit(200);
    if(r.error)throw r.error;
    _msgs=r.data||[];
    _renderMsgs();
    // Mark as read
    _sb.from('nass_conv_members').update({last_read_at:new Date().toISOString()}).eq('conversation_id',convId).eq('user_id',_myId).then(function(){});
  }catch(e){
    var el=document.getElementById('ms-msgs');
    if(el)el.innerHTML='<div class="ms-msgs-info">Could not load messages. Check connection.</div>';
  }
}

// ── Render thread shell ───────────────────────────────────────────
function _renderThreadShell(conv){
  var t=document.getElementById('ms-thread');if(!t)return;
  var nm=_convName(conv);
  var sub='';
  if(conv.type==='group'){
    sub='<div class="ms-th-sub">'+(conv.members?conv.members.length:0)+' members &bull; Type @AI for AI assistant</div>';
  }else{
    var other=conv.members&&conv.members.find(function(m){return m.user_id!==_myId;});
    sub='<div class="ms-th-sub">'+(other?_esc(other.user_email):'Direct message')+'</div>';
  }
  t.innerHTML=
    '<div class="ms-th-hdr">'+
      '<div class="ms-th-av">'+_convAv(conv)+'</div>'+
      '<div><div class="ms-th-nm">'+_esc(nm)+'</div>'+sub+'</div>'+
    '</div>'+
    '<div class="ms-msgs" id="ms-msgs"><div class="ms-msgs-info">Loading&#8230;</div></div>'+
    '<div class="ms-inp-row">'+
      '<input class="ms-inp" id="ms-inp" placeholder="Message&#8230; type @AI for assistant" maxlength="2000" autocomplete="off">'+
      '<button class="ms-send" id="ms-send" title="Send (Enter)">'+
        '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>'+
      '</button>'+
    '</div>';
  var inp=document.getElementById('ms-inp');
  if(inp){
    inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();_send();}});
    setTimeout(function(){inp.focus();},80);
  }
  document.getElementById('ms-send').onclick=_send;
}

// ── Render messages ───────────────────────────────────────────────
function _renderMsgs(){
  var el=document.getElementById('ms-msgs');if(!el)return;
  if(!_msgs.length){
    el.innerHTML='<div class="ms-splash"><div class="ms-splash-icon">&#128075;</div><div class="ms-splash-txt">No messages yet. Say hello!</div></div>';
    return;
  }
  el.innerHTML='';
  var lastDay='';
  _msgs.forEach(function(m){
    var day=_fmtDay(m.created_at);
    if(day!==lastDay){
      lastDay=day;
      var dl=document.createElement('div');dl.className='ms-day-lbl';dl.textContent=day;el.appendChild(dl);
    }
    el.appendChild(_bubble(m));
  });
  _scrollBottom();
}

// ── Single message bubble ─────────────────────────────────────────
function _bubble(m){
  var isMe=m.user_id===_myId,isAi=!!m.is_ai_response;
  var div=document.createElement('div');
  div.className='ms-msg'+(isMe?' ms-mine':'')+(isAi?' ms-ai':'');
  div.dataset.mid=m.id;
  var av=isAi?'&#129302;':(isMe?_esc(_myEmail[0].toUpperCase()):_esc((m.user_email||'?')[0].toUpperCase()));
  var sender=_shortName(m.user_email,isAi);
  var txt=_esc(m.content).replace(/@AI/gi,'<span class="ms-mention">@AI</span>');
  div.innerHTML=
    '<div class="ms-bbl-av">'+av+'</div>'+
    '<div class="ms-bbl-body">'+
      (isMe?'':'<div class="ms-bbl-sender">'+_esc(sender)+'</div>')+
      '<div class="ms-bbl">'+txt+'</div>'+
      '<div class="ms-bbl-ts">'+_fmt(m.created_at)+'</div>'+
    '</div>';
  return div;
}

// ── Append a single live message ──────────────────────────────────
function _appendLive(m){
  var el=document.getElementById('ms-msgs');if(!el)return;
  var splash=el.querySelector('.ms-splash');if(splash)splash.remove();
  if(_msgs.length){
    var last=_msgs[_msgs.length-1];
    if(_fmtDay(last.created_at)!==_fmtDay(m.created_at)){
      var dl=document.createElement('div');dl.className='ms-day-lbl';dl.textContent=_fmtDay(m.created_at);el.appendChild(dl);
    }
  }
  _msgs.push(m);
  el.appendChild(_bubble(m));
  _scrollBottom();
}

function _scrollBottom(){var el=document.getElementById('ms-msgs');if(el)requestAnimationFrame(function(){el.scrollTop=el.scrollHeight;});}

// ── Typing indicator ──────────────────────────────────────────────
function _showTyping(){
  var el=document.getElementById('ms-msgs');if(!el)return;
  var t=document.createElement('div');t.id='ms-typing';t.className='ms-msg ms-ai';
  t.innerHTML='<div class="ms-bbl-av">&#129302;</div><div class="ms-bbl-body"><div class="ms-bbl-sender">NASS AI</div><div class="ms-bbl ms-dots"><span></span><span></span><span></span></div></div>';
  el.appendChild(t);_scrollBottom();
}
function _hideTyping(){var t=document.getElementById('ms-typing');if(t)t.remove();}

// ── Send message ──────────────────────────────────────────────────
async function _send(){
  if(!_activeId)return;
  var inp=document.getElementById('ms-inp');if(!inp||inp.disabled)return;
  var content=(inp.value||'').trim();if(!content)return;
  inp.value='';inp.disabled=true;
  var sb=document.getElementById('ms-send');if(sb)sb.disabled=true;
  var sess=null;
  try{sess=(await _sb.auth.getSession()).data.session;}catch(e){}
  // Insert user message
  try{
    var ins=await _sb.from('nass_messages').insert({
      conversation_id:_activeId,user_id:_myId,user_email:_myEmail,
      content:content,is_ai_response:false
    });
    if(ins.error)throw ins.error;
  }catch(e){
    console.error('[MS] send',e);
    inp.disabled=false;if(sb)sb.disabled=false;inp.focus();return;
  }
  // @AI trigger
  if(sess&&/@ai/i.test(content)){
    var query=content.replace(/@ai\s*/gi,'').trim()||content;
    _showTyping();
    try{
      var resp=await fetch(AI_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json','Authorization':'Bearer '+sess.access_token},
        body:JSON.stringify({message:query,context:[]})
      });
      var data=await resp.json().catch(function(){return{};});
      var reply=data.reply||data.message||data.content||data.response||'Sorry, I could not process that right now.';
      _hideTyping();
      await _sb.from('nass_messages').insert({
        conversation_id:_activeId,user_id:_myId,user_email:'nass.ai@system',
        content:reply,is_ai_response:true
      });
    }catch(e){_hideTyping();console.warn('[MS] AI',e);}
  }
  inp.disabled=false;if(sb)sb.disabled=false;inp.focus();
}

// ── Realtime subscription ─────────────────────────────────────────
function _subscribe(){
  if(_sub)return;
  _sub=_sb.channel('nass-messenger-v1')
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'nass_messages'},function(p){
      var m=p.new;
      // Update conv preview + sort
      var conv=_convs.find(function(c){return c.id===m.conversation_id;});
      if(conv){
        conv.last_msg_at=m.created_at;
        conv.lastMsg=_lastPreview(m);
        _convs.sort(function(a,b){return new Date(b.last_msg_at||0)-new Date(a.last_msg_at||0);});
      }
      if(m.conversation_id===_activeId){
        if(_msgs.find(function(x){return x.id===m.id;}))return;
        _appendLive(m);
        // Mark read
        _sb.from('nass_conv_members').update({last_read_at:new Date().toISOString()}).eq('conversation_id',_activeId).eq('user_id',_myId).then(function(){});
      }else if(m.user_id!==_myId){
        if(conv){conv.unread=(conv.unread||0)+1;}
        _unread++;
        _badge();
      }
      _renderConvList(document.getElementById('ms-sb-search')?document.getElementById('ms-sb-search').value:'');
    })
    .on('postgres_changes',{event:'INSERT',schema:'public',table:'nass_conversations'},function(){
      setTimeout(_loadConvs,600);
    })
    .subscribe();
}

// ── Badge on topbar button ────────────────────────────────────────
function _badge(){
  var b=document.getElementById('ms-badge');
  if(!b){
    var btn=document.getElementById('ms-btn');if(!btn)return;
    b=document.createElement('span');b.id='ms-badge';b.className='ms-badge';
    btn.style.position='relative';btn.appendChild(b);
  }
  if(_unread>0){b.textContent=_unread>9?'9+':String(_unread);b.style.display='flex';}
  else{b.style.display='none';}
}

// ── Load user list for pickers ────────────────────────────────────
async function _loadUsers(){
  if(_users.length)return;
  try{
    // nass_profiles uses user_id (FK to auth.users), not id
    var r=await _sb.from('nass_profiles').select('user_id,email,role').order('email');
    if(r.error)throw r.error;
    _users=(r.data||[])
      .map(function(u){return{id:u.user_id,email:u.email,role:u.role};})
      .filter(function(u){return u.id&&u.id!==_myId;});
  }catch(e){
    console.warn('[MS] loadUsers',e);
    _users=[];
  }
}

// ── Generic user picker list renderer ────────────────────────────
function _renderPickerList(elId,filter,onSelect){
  var el=document.getElementById(elId);if(!el)return;
  var list=_users.slice();
  if(filter){var f=filter.toLowerCase();list=list.filter(function(u){return(u.email||'').toLowerCase().indexOf(f)>-1;});}
  if(!list.length){el.innerHTML='<div class="ms-splash-txt" style="padding:20px;text-align:center">No users found.</div>';return;}
  el.innerHTML='';
  list.forEach(function(u){
    var div=document.createElement('div');
    div.className='ms-picker-item';
    div.innerHTML=
      '<div class="ms-picker-av">'+_esc((u.email||'?')[0].toUpperCase())+'</div>'+
      '<div class="ms-picker-info">'+
        '<div class="ms-picker-nm">'+_esc((u.email||'').split('@')[0])+'</div>'+
        '<div class="ms-picker-em">'+_esc(u.email||'')+'</div>'+
      '</div>';
    div.onclick=function(){onSelect(u);};
    el.appendChild(div);
  });
}

// ── DM Modal ──────────────────────────────────────────────────────
async function _openDmModal(){
  document.getElementById('ms-dm-modal').style.display='flex';
  document.getElementById('ms-dm-search').value='';
  await _loadUsers();
  _renderPickerList('ms-dm-list','',_startDM);
}
function _closeDmModal(){document.getElementById('ms-dm-modal').style.display='none';}

// ── Ensure identity is set before inserts ─────────────────────────
async function _ensureId(){
  if(_myId)return;
  try{var gu=await _sb.auth.getUser();if(gu.data&&gu.data.user){_myId=gu.data.user.id;_myEmail=gu.data.user.email;}}catch(e){}
}

// ── Find or create DM ─────────────────────────────────────────────
async function _startDM(u){
  _closeDmModal();
  await _ensureId();
  // Check for existing direct conversation
  try{
    var myR=await _sb.from('nass_conv_members').select('conversation_id').eq('user_id',_myId);
    var myIds=(myR.data||[]).map(function(r){return r.conversation_id;});
    if(myIds.length){
      var thR=await _sb.from('nass_conv_members').select('conversation_id').eq('user_id',u.id).in('conversation_id',myIds);
      var shared=(thR.data||[]).map(function(r){return r.conversation_id;});
      if(shared.length){
        var tR=await _sb.from('nass_conversations').select('id').eq('type','direct').in('id',shared);
        if(tR.data&&tR.data.length){
          await _loadConvs();
          _openConv(tR.data[0].id);
          return;
        }
      }
    }
  }catch(e){console.warn('[MS] find DM',e);}
  // Create new DM
  try{
    var cr=await _sb.from('nass_conversations').insert({type:'direct',created_by:_myId}).select().single();
    if(cr.error)throw cr.error;
    var cid=cr.data.id;
    await _sb.from('nass_conv_members').insert([
      {conversation_id:cid,user_id:_myId,user_email:_myEmail},
      {conversation_id:cid,user_id:u.id,user_email:u.email}
    ]);
    await _loadConvs();
    _openConv(cid);
  }catch(e){console.error('[MS] create DM',e);alert('Could not start conversation. Please try again.');}
}

// ── Group Modal ───────────────────────────────────────────────────
async function _openGrpModal(){
  _grpSelected=[];
  document.getElementById('ms-grp-modal').style.display='flex';
  document.getElementById('ms-grp-name').value='';
  document.getElementById('ms-grp-search').value='';
  document.getElementById('ms-grp-chips').innerHTML='';
  await _loadUsers();
  _renderGrpPickerList('');
}
function _closeGrpModal(){document.getElementById('ms-grp-modal').style.display='none';_grpSelected=[];}

function _renderGrpPickerList(filter){
  var el=document.getElementById('ms-grp-list');if(!el)return;
  var list=_users.filter(function(u){return!_grpSelected.find(function(s){return s.id===u.id;});});
  if(filter){var f=filter.toLowerCase();list=list.filter(function(u){return(u.email||'').toLowerCase().indexOf(f)>-1;});}
  if(!list.length){el.innerHTML='<div class="ms-splash-txt" style="padding:20px;text-align:center">No more users to add.</div>';return;}
  el.innerHTML='';
  list.forEach(function(u){
    var div=document.createElement('div');
    div.className='ms-picker-item';
    div.innerHTML=
      '<div class="ms-picker-av">'+_esc((u.email||'?')[0].toUpperCase())+'</div>'+
      '<div class="ms-picker-info">'+
        '<div class="ms-picker-nm">'+_esc((u.email||'').split('@')[0])+'</div>'+
        '<div class="ms-picker-em">'+_esc(u.email||'')+'</div>'+
      '</div>'+
      '<div class="ms-picker-add">+</div>';
    div.onclick=function(){_addGrpMember(u);};
    el.appendChild(div);
  });
}

function _addGrpMember(u){
  if(_grpSelected.find(function(s){return s.id===u.id;}))return;
  _grpSelected.push(u);
  _renderGrpChips();
  _renderGrpPickerList(document.getElementById('ms-grp-search').value||'');
}
window._msRemoveGrpMember=function(uid){
  _grpSelected=_grpSelected.filter(function(u){return u.id!==uid;});
  _renderGrpChips();
  _renderGrpPickerList(document.getElementById('ms-grp-search').value||'');
};
function _renderGrpChips(){
  var el=document.getElementById('ms-grp-chips');if(!el)return;
  if(!_grpSelected.length){el.innerHTML='';return;}
  el.innerHTML=_grpSelected.map(function(u){
    return'<span class="ms-chip">'+_esc((u.email||'').split('@')[0])+
      '<button onclick="window._msRemoveGrpMember(\''+u.id+'\')">&#10005;</button></span>';
  }).join('');
}

async function _createGroup(){
  var name=(document.getElementById('ms-grp-name').value||'').trim();
  if(!name){alert('Please enter a group name.');return;}
  if(!_grpSelected.length){alert('Please add at least one member.');return;}
  _closeGrpModal();
  await _ensureId();
  try{
    var cr=await _sb.from('nass_conversations').insert({type:'group',name:name,created_by:_myId}).select().single();
    if(cr.error)throw cr.error;
    var cid=cr.data.id;
    var members=[{conversation_id:cid,user_id:_myId,user_email:_myEmail}];
    _grpSelected.forEach(function(u){members.push({conversation_id:cid,user_id:u.id,user_email:u.email});});
    await _sb.from('nass_conv_members').insert(members);
    await _loadConvs();
    _openConv(cid);
  }catch(e){console.error('[MS] create group',e);alert('Could not create group. Please try again.');}
}

// ── Public open / close ───────────────────────────────────────────
window._nassMsOpen=async function(){
  // Always fetch identity fresh from Supabase auth — avoids timing issues
  // with window.userSession not yet set when the script first runs.
  try{
    var gu=await _sb.auth.getUser();
    if(gu.data&&gu.data.user){
      _myId=gu.data.user.id||'';
      _myEmail=gu.data.user.email||'';
    }
  }catch(e){}
  // Fallback to window.userSession if getUser fails
  if(!_myId){
    _myEmail=(window.userSession&&window.userSession.user&&window.userSession.user.email)||'';
    _myId=(window.userSession&&window.userSession.user&&window.userSession.user.id)||'';
  }
  if(!_panel)_build();
  _panel.classList.add('ms-open');
  _open=true;
  var btn=document.getElementById('ms-btn');if(btn)btn.classList.add('ms-btn-on');
  _loadConvs();
  _subscribe();
};
window._nassMsClose=function(){
  if(_panel)_panel.classList.remove('ms-open');
  _open=false;
  var btn=document.getElementById('ms-btn');if(btn)btn.classList.remove('ms-btn-on');
};
window._nassMsOpen();
})();
