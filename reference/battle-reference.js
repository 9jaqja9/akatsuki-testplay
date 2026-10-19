(() => {
  const $ = selector => document.querySelector(selector);
  const lines = [
    {who:'半蔵', face:'017_cd2e8e5c5.webp', text:'「殿、俺の後ろへ。\n……あやめ、前の忍びを押さえるぞ。」', direction:'伊賀の山道。あやめと半蔵が家康を守り、道を塞ぐ忍びたちと対峙する。'},
    {who:'あやめ', face:'015_a9631a15d.webp', text:'「飛燕――！\n家康様には近づけさせないよ！」', direction:'あやめが巨大手裏剣・飛燕を構え、半蔵が忍びの刃を受け止める。', clash:true},
    {who:'左馬之助', face:'012_f81fdb814.webp', text:'「そこまでだ。\n徳川家康殿、御身を預からせていただく。」', direction:'忍びたちの背後で、左馬之助が静かに口を開く。'},
    {who:'雪姫', face:'016_e2b459444.webp', text:'「待って。家康様を捕らえるなんて、\n私は聞いていない……。」', direction:'後方に控えていた雪姫が、左馬之助へ問い掛ける。'},
    {who:'半蔵', face:'017_cd2e8e5c5.webp', text:'「……雪姫。\nなぜ、お前がそこにいる。」', direction:'刃の向こうで、半蔵と雪姫の視線が交わる。'}
  ];
  const initialMembers = {
    ayame: {hp:820,maxHp:1000,mp:60,maxMp:80},
    ieyasu: {hp:1100,maxHp:1200,mp:24,maxMp:40},
    hanzo: {hp:960,maxHp:1200,mp:70,maxMp:100}
  };
  let members;
  function resetMembers(){
    members=Object.fromEntries(Object.entries(initialMembers).map(([key,value])=>[key,{...value}]));
    updateMembers();
  }
  function updateMembers(){
    for(const [key,value] of Object.entries(members)){
      const card=$('[data-member="'+key+'"]');
      for(const resource of ['hp','mp']){
        card.querySelector('[data-resource="'+resource+'"]').value=value[resource];
        card.querySelector('[data-number="'+resource+'"]').textContent=value[resource]+' / '+value[resource==='hp'?'maxHp':'maxMp'];
      }
    }
  }
  function perform(kind){
    const costs={hien:{ayame:6},thunder:{hanzo:10},combo:{ayame:8,hanzo:8}}[kind]||{};
    window.akatsukiReferenceEffects.clear();
    if(Object.entries(costs).some(([key,cost])=>members[key].mp<cost)){
      $('#status').textContent='MPが足りません。「回復」で整えられます。';
      return;
    }
    for(const [key,cost] of Object.entries(costs))members[key].mp-=cost;
    if(kind==='heal')for(const member of Object.values(members)){
      member.hp=Math.min(member.maxHp,member.hp+120);
      member.mp=Math.min(member.maxMp,member.mp+15);
    }
    updateMembers();
    if(kind==='slash')clash();
    else window.akatsukiReferenceEffects.run(kind);
    if(kind==='heal'||kind==='guard'){
      const scene=$('.scene');
      scene.scrollTo({left:Math.max(0,scene.scrollWidth*.25-scene.clientWidth/2),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  }
  let index=0, seen=0, effectTimer;
  function clash(){
    clearTimeout(effectTimer);
    $('.screen').classList.remove('clashing');
    void $('.screen').offsetWidth;
    $('.screen').classList.add('clashing');
    effectTimer=setTimeout(()=>$('.screen').classList.remove('clashing'),950);
    window.akatsukiReferenceEffects.run('slash');
    const scene=$('.scene');
    if(scene.scrollWidth>scene.clientWidth) scene.scrollTo({left:scene.scrollWidth*.56-scene.clientWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  function render(){
    const line=lines[index];
    $('#speaker').textContent=line.who;
    $('#line').textContent=line.text;
    $('#line').style.whiteSpace='pre-line';
    $('#face').src='../assets/'+line.face;
    $('#face').alt=line.who+'の顔';
    $('#lineCount').textContent=String(index+1).padStart(2,'0')+' / 05';
    $('.stage-direction').textContent=line.direction;
    const nextLabel=index===lines.length-1?'最初の会話へ':'次の会話へ';
    $('#nextLine .command-label').textContent=index===lines.length-1?'最初へ':'会話';
    $('#nextLine').setAttribute('aria-label',nextLabel);
    $('#nextLine').title=nextLabel;
    if(line.clash)clash();
    else if($('.scene').scrollWidth>$('.scene').clientWidth){
      const actor=document.querySelector('[data-name="'+line.who+'"]');
      if(actor)$('.scene').scrollTo({left:actor.offsetLeft-$('.scene').clientWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  }
  $('#nextLine').addEventListener('click',()=>{index=(index+1)%lines.length;seen=Math.max(seen,index);render()});
  for(const [id,kind] of Object.entries({playClash:'slash',playHien:'hien',playThunder:'thunder',playGuard:'guard',playHeal:'heal',playCombo:'combo'})){
    $('#'+id).addEventListener('click',()=>perform(kind));
  }
  $('#resetScene').addEventListener('click',()=>{clearTimeout(effectTimer);$('.screen').classList.remove('clashing');window.akatsukiReferenceEffects.clear();resetMembers();index=0;seen=0;render();$('.scene').scrollLeft=0});
  $('#showLog').addEventListener('click',()=>{
    $('#logEntries').replaceChildren();
    lines.slice(0,seen+1).forEach(line=>{const p=document.createElement('p'),who=document.createElement('strong');who.textContent=line.who;p.append(who,document.createTextNode(line.text));$('#logEntries').append(p)});
    $('#logDialog').showModal();
  });
  $('#showTemplate').addEventListener('click',()=>$('#templateDialog').showModal());
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
  document.addEventListener('keydown',event=>{
    if(document.querySelector('dialog[open]')||event.target.closest('button'))return;
    if(['Enter','ArrowRight'].includes(event.key)){event.preventDefault();$('#nextLine').click()}
  });
  resetMembers();
  render();
})();
