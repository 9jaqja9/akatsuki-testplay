(() => {
  const $ = selector => document.querySelector(selector);
  const lines = [
    {who:'半蔵', face:'017_cd2e8e5c5.webp', text:'「殿、俺の後ろへ。\n……あやめ、前の忍びを押さえるぞ。」', direction:'忍びが前に出る。左馬之助はその奥、雪姫はさらに後方で戦況を見ている。'},
    {who:'あやめ', face:'015_a9631a15d.webp', text:'「分かった！\n家康様には近づけさせないよ！」', direction:'半蔵とあやめが、家康の前へ出る。', clash:true},
    {who:'左馬之助', face:'012_f81fdb814.webp', text:'「そこまでだ。\n徳川家康殿、御身を預からせていただく。」', direction:'忍びたちの背後で、左馬之助が静かに口を開く。'},
    {who:'雪姫', face:'016_e2b459444.webp', text:'「待って。家康様を捕らえるなんて、\n私は聞いていない……。」', direction:'後方に控えていた雪姫が、左馬之助へ問い掛ける。'},
    {who:'半蔵', face:'017_cd2e8e5c5.webp', text:'「……雪姫。\nなぜ、お前がそこにいる。」', direction:'刃の向こうで、半蔵と雪姫の視線が交わる。'}
  ];
  let index=0, seen=0, effectTimer;
  function clash(){
    clearTimeout(effectTimer);
    $('.screen').classList.remove('clashing');
    void $('.screen').offsetWidth;
    $('.screen').classList.add('clashing');
    effectTimer=setTimeout(()=>$('.screen').classList.remove('clashing'),950);
    window.akatsukiReferenceEffects.run('slash');
    const scene=$('.scene');
    if(scene.scrollWidth>scene.clientWidth) scene.scrollTo({left:scene.scrollWidth*.43-scene.clientWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
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
    $('#nextLine').textContent=index===lines.length-1?'❯　最初の会話へ':'❯　会話を進める';
    if(line.clash)clash();
    else if($('.scene').scrollWidth>$('.scene').clientWidth){
      const actor=document.querySelector('[data-name="'+line.who+'"]');
      if(actor)$('.scene').scrollTo({left:actor.offsetLeft-$('.scene').clientWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  }
  $('#nextLine').addEventListener('click',()=>{index=(index+1)%lines.length;seen=Math.max(seen,index);render()});
  $('#playClash').addEventListener('click',clash);
  $('#playThunder').addEventListener('click',()=>window.akatsukiReferenceEffects.run('thunder'));
  $('#resetScene').addEventListener('click',()=>{clearTimeout(effectTimer);$('.screen').classList.remove('clashing');window.akatsukiReferenceEffects.clear();index=0;seen=0;render();$('.scene').scrollLeft=0});
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
  render();
})();
