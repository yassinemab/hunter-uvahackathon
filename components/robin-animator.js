/* Offline SVG animation component. No libraries, fonts or network requests. */
  let nextId = 0;
  const clamp = (n, a = 0, b = 1) => Math.max(a, Math.min(b, n));
  const ease = t => 1 - Math.pow(1 - clamp(t), 3);
  const arrow = `<path d="M-102 0H-9" stroke="#405948" stroke-width="6" stroke-linecap="round"/><path d="M0 0L-16-9L-12 0L-16 9Z" fill="#e8bf61" stroke="#33493a" stroke-width="2"/><path d="M-83 0L-101-13H-113L-99 0L-113 13H-101Z" fill="#d77a4e" stroke="#33493a" stroke-width="2"/>`;
  const fox = `<g class="fox-motion">
    <g class="tail"><path class="robin-outline" fill="#d97945" d="M123 265C167 292 182 298 224 267C245 252 261 251 274 249C267 285 253 325 219 338C186 354 147 323 119 311Z"/><path fill="#f8e9cc" d="M244 261L231 284L247 282L231 307L244 305C261 284 268 266 270 254Z"/></g>
    <g class="quiver"><path class="robin-outline" fill="#946743" d="M26 170L54 165L71 266Q55 283 39 269Z"/><path class="robin-outline fine" fill="#b37c4c" d="M22 168L52 161L57 180L26 187Z"/><path d="M31 170L17 131M42 166L32 122M49 163L45 128" stroke="#394f3c" stroke-width="4"/><path d="M17 145L4 133L5 121L17 131L22 115L28 120L26 137ZM32 137L20 125L21 112L32 122L38 107L44 113L40 131ZM45 143L34 131L35 117L45 128L51 113L57 119L54 135Z" fill="#cb5a42" stroke="#394f3c" stroke-width="2"/></g>
    <g class="legs"><path class="robin-outline" fill="#d97945" d="M65 280L60 330L81 337L100 288M113 282L124 329L145 328L143 278"/><path class="robin-outline" fill="#48663a" d="M62 320L80 327L81 345H39Q33 331 51 329Z"/><path class="robin-outline" fill="#48663a" d="M123 321L143 320L159 335Q170 347 154 347H120Z"/></g>
    <path class="robin-outline" fill="#73934d" d="M61 179Q95 165 130 180L147 284Q106 310 59 282L51 218Z"/>
    <path fill="#a6b268" d="M69 184L82 198L96 181L106 206L125 186L134 252Q104 273 70 253Z"/>
    <path class="robin-outline fine" fill="#314b38" d="M62 265Q101 278 142 265L146 280Q104 292 62 281Z"/>
    <rect class="robin-outline fine" x="93" y="270" width="19" height="16" rx="3" fill="#d9ad58"/>
    <path class="robin-outline fine" fill="#aa7546" d="M124 174L137 181L72 268L60 258Z"/>
    <g class="draw-arm"><path class="robin-outline" fill="#d97945" d="M67 201Q49 221 75 232L165 204L160 187L83 210Z"/><path class="robin-outline" fill="#799750" d="M62 185L80 195L73 219L51 214Z"/><path class="robin-outline fine" fill="#e5955b" d="M156 188Q170 179 177 187L182 202Q178 216 165 209L155 202Z"/></g>
    <g class="bow-arm"><path class="robin-outline" fill="#d97945" d="M125 198L211 172L219 186L130 219Z"/><path class="robin-outline" fill="#78954b" d="M120 183L139 190L145 211L123 220Z"/><g class="bow"><path class="robin-outline" fill="none" stroke="#745234" stroke-width="8" d="M233 84Q302 171 232 263"/><path class="bow-string" d="M233 84L232 263" fill="none" stroke="#dbcba2" stroke-width="2.5"/><path class="robin-outline fine" fill="#e79b63" d="M211 172Q219 162 229 170L237 178L232 193L218 193Z"/></g></g>
    <g class="head"><path class="robin-outline" fill="#de824c" d="M50 75L40 22L82 56L145 54L181 26L172 94Q179 134 148 156L105 183L66 161Q35 140 50 75Z"/><path fill="#704c37" d="M51 38L57 72L74 61ZM164 47L149 62L168 76Z"/><path fill="#f8edd7" d="M49 109L68 117L72 101L91 126L122 131L154 112L151 153L105 179L67 156Z"/><path fill="#f8edd7" d="M91 128Q99 110 112 126L125 136L106 151L87 140Z"/><g class="eyes"><g class="eye-left"><ellipse cx="77" cy="100" rx="11" ry="16" fill="#fff8e4"/><ellipse cx="81" cy="102" rx="5.5" ry="9" fill="#273f33"/><circle cx="83" cy="98" r="2" fill="white"/></g><g class="eye-right"><ellipse cx="133" cy="100" rx="11" ry="16" fill="#fff8e4"/><ellipse cx="137" cy="102" rx="5.5" ry="9" fill="#273f33"/><circle cx="139" cy="98" r="2" fill="white"/></g></g><path class="robin-outline fine brows" d="M65 79L83 76M124 76L141 80" fill="none"/><path class="robin-outline fine" fill="#293c31" d="M95 126Q106 120 118 126L112 137Q105 143 99 137Z"/><path class="robin-outline fine smile" d="M91 144Q106 160 126 142" fill="none"/><path class="robin-outline fine worry" d="M94 154Q105 144 119 151" fill="none" opacity="0"/><path d="M60 132L71 135M142 135L153 132" stroke="#b96840" stroke-width="3" stroke-linecap="round"/>
    <g class="hat"><path class="robin-outline" fill="#7c9a4c" d="M46 67L79 9Q89-1 111 11L161 54Z"/><path fill="#aabd71" d="M81 13L66 52L130 41L108 14Z"/><path class="robin-outline" fill="#54703b" d="M32 63Q103 34 173 57Q168 79 135 77L73 84Q43 82 32 63Z"/><path class="robin-outline fine" fill="#cd654c" d="M140 48Q153 3 207-11Q201 14 180 28L159 35L149 51Z"/><path class="robin-outline fine" d="M151 44L192 3" fill="none"/></g></g>
  </g>`;
  function scene(id, background) {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="mh-scene" viewBox="0 0 900 550" role="img" aria-label="Robin de vos met pijl en boog"><style>.mh-scene{display:block;width:100%;height:auto}.mh-scene .robin-outline{stroke:#2c4235;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.mh-scene .fine{stroke-width:3}</style><defs><radialGradient id="glow-${id}"><stop stop-color="#f6f6d8" stop-opacity=".9"/><stop offset="1" stop-color="#f6f6d8" stop-opacity="0"/></radialGradient></defs>
    <g class="environment" ${background ? '' : 'opacity="0"'}><circle cx="468" cy="246" r="255" fill="url(#glow-${id})"/><path d="M0 366Q111 279 229 330Q386 235 555 318Q709 225 900 310V550H0Z" fill="#d9e3cb"/><path d="M0 432Q184 331 383 402Q623 324 900 409V550H0Z" fill="#c7d6b7"/><g fill="#cbd8bc"><path d="M52 0L100 0L88 321L137 401L22 392L61 313Z"/><path d="M775 0H823L819 367L866 400H755L785 360Z"/><path d="M64 176L7 95L19 82L68 135ZM801 162L864 76L880 88L808 199Z"/></g><g fill="#e8edda"><ellipse cx="62" cy="42" rx="122" ry="57"/><ellipse cx="830" cy="25" rx="140" ry="67"/></g><g fill="#a5bc91"><path d="M84 455L71 430L79 432L87 445L97 419L99 445L112 433L105 457Z"/><path d="M805 462L790 437L800 440L810 450L822 424L823 451L838 439L831 464Z"/></g><g stroke="#abc396" stroke-width="3" stroke-linecap="round"><path d="M126 469H146M545 472H564M593 461H605M776 479H796"/></g></g>
    <ellipse class="ground-shadow" cx="312" cy="486" rx="132" ry="14" fill="#61714e" opacity=".12"/>
    <g class="stump"><path fill="#a6865d" stroke="#665437" stroke-width="4" d="M200 454L199 483Q285 505 377 485L371 454Z"/><ellipse cx="285" cy="454" rx="87" ry="16" fill="#d8ba85" stroke="#665437" stroke-width="4"/><ellipse cx="285" cy="454" rx="55" ry="8" fill="none" stroke="#b49865" stroke-width="2"/><path d="M213 468L213 483M237 472L238 489M330 473L328 490M358 468L358 483" stroke="#856a46" stroke-width="3"/></g>
    <g class="target-anchor" transform="translate(715 275)"><g class="target"><path d="M-16 68L-38 198M16 68L39 198M-33 167H33" stroke="#6c5b3d" stroke-width="10" stroke-linecap="round"/><ellipse cy="205" rx="65" ry="9" fill="#526646" opacity=".12"/><circle r="88" fill="#cba96b" stroke="#3b503b" stroke-width="5"/><circle r="79" fill="#c7654c"/><circle r="59" fill="#fff0ce"/><circle r="40" fill="#c7654c"/><circle r="22" fill="#fff0ce"/><circle r="10" fill="#c7654c"/><path d="M-58-52A79 79 0 0 1 65-44" stroke="#df8b66" stroke-width="4" fill="none" stroke-linecap="round"/></g></g>
    <g class="fox-anchor" transform="translate(185 108)">${fox}</g>
    <g class="flight" opacity="0">${arrow}</g>
    <circle class="impact" cx="715" cy="275" r="12" fill="none" stroke="#f4d479" stroke-width="7" opacity="0"/>
    <g class="sparkles" opacity="0" fill="#e1aa48"><path d="M650 164L655 177L668 182L655 187L650 200L645 187L632 182L645 177Z"/><path d="M785 239L790 252L803 257L790 262L785 275L780 262L767 257L780 252Z"/><path d="M700 137L704 145L712 149L704 153L700 161L696 153L688 149L696 145Z"/></g>
    <g class="break-anchor" transform="translate(528 209)"><g class="broken-arrow" opacity="0"><g class="shard-left"><path d="M-83 0H-4L4-5L0 4" fill="none" stroke="#405948" stroke-width="8" stroke-linecap="round"/><path d="M-67 0L-85-17H-101L-82 0L-101 17H-85Z" fill="#d77a4e" stroke="#33493a" stroke-width="3"/></g><g class="shard-right"><path d="M0 0L6-5L10 0H78" fill="none" stroke="#405948" stroke-width="8" stroke-linecap="round"/><path d="M92 0L71-13L76 0L71 13Z" fill="#e8bf61" stroke="#33493a" stroke-width="3"/></g><g class="crack" stroke="#d98b52" stroke-width="4" stroke-linecap="round"><path d="M-10-21L-18-37M12-21L22-37M-11 22L-20 37M15 21L25 35"/></g></g></g>
    <g class="dust" opacity="0" fill="#ab9870"><circle cx="841" cy="459" r="8"/><circle cx="862" cy="465" r="5"/><circle cx="826" cy="465" r="4"/></g></svg>`;
  }
  export class RobinHoodAnimator {
    constructor(container, options = {}) {
      if (typeof container === 'string') container = document.querySelector(container);
      if (!container) throw new Error('RobinHoodAnimator needs a container element.');
      this.container = container;
      this.id = ++nextId;
      this.speed = options.speed || 1;
      this.media = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = options.reducedMotion ?? this.media.matches;
      this.state = 'idle'; this.started = performance.now(); this.pending = null; this.completed = false;
      container.innerHTML = scene(this.id, options.background !== false);
      this.svg = container.querySelector('svg');
      this.parts = Object.fromEntries(['fox-motion','tail','head','eye-left','eye-right','bow-arm','draw-arm','bow-string','target','flight','impact','sparkles','broken-arrow','shard-left','shard-right','crack','dust','smile','worry','hat'].map(name => [name, this.svg.querySelector('.' + name)]));
      this.frame = this.frame.bind(this); this.raf = requestAnimationFrame(this.frame);
    }
    play(state = 'idle') {
      if (!['idle', 'correct', 'incorrect', 'lose-arrow'].includes(state)) throw new Error('Unknown animation: ' + state);
      if (this.destroyed) throw new Error('This animator has been destroyed.');
      if (this.pending) { this.pending({state:this.state,cancelled:true}); this.pending=null; }
      this.state = state; this.started = performance.now(); this.completed = false; this.container.dataset.animation = state;
      this.container.dispatchEvent(new CustomEvent('robin:start', {detail:{state}}));
      this.render(0);
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(this.frame);
      if (state === 'idle') return Promise.resolve({state, cancelled:false});
      if (this.reducedMotion) {
        this.completed = true;
        cancelAnimationFrame(this.raf);
        this.container.dispatchEvent(new CustomEvent('robin:complete', {detail:{state}}));
        return Promise.resolve({state, cancelled:false});
      }
      return new Promise(resolve => { this.pending = resolve; });
    }
    setSpeed(value) { if (!Number.isFinite(value) || value <= 0) throw new Error('Speed must be positive.'); const now=performance.now(); this.started=now-(now-this.started)*this.speed/value; this.speed=value; }
    setReducedMotion(value) { this.reducedMotion=Boolean(value); }
    frame(now) {
      if(this.destroyed) return;
      const t=(now-this.started)/1000*this.speed;
      this.render(t);
      if (this.state !== 'idle' && t >= 3.0) {
        const finished=this.state, resolve=this.pending; this.pending=null;
        this.completed = true;
        this.render(2.1);
        this.container.dispatchEvent(new CustomEvent('robin:complete',{detail:{state:finished}}));
        if(resolve) resolve({state:finished,cancelled:false});
      }
      if(!this.destroyed && !this.completed && !this.reducedMotion) this.raf=requestAnimationFrame(this.frame);
    }
    render(t) {
      const p=this.parts, reduced=this.reducedMotion;
      const idle=this.state==='idle', shot=['correct','incorrect'].includes(this.state), correct=this.state==='correct', lost=this.state==='lose-arrow';
      const visible=(el,value) => el.setAttribute('opacity',value);
      let bob=reduced?0:Math.sin(t*2.3)*2.4, tilt=0;
      if(!reduced && correct && t>1.05 && t<2.4) bob-=Math.abs(Math.sin((t-1.05)*8))*13;
      if(!reduced && (lost || this.state==='incorrect') && t>1.15) tilt=Math.sin(clamp((t-1.15)*2)*Math.PI)*-4;
      p['fox-motion'].setAttribute('transform',`translate(0 ${bob}) rotate(${tilt} 100 300)`);
      p.tail.setAttribute('transform',`rotate(${reduced?0:Math.sin(t*2)*5} 135 282)`);
      p.head.setAttribute('transform',`rotate(${reduced?0:Math.sin(t*1.4)*1.5+(lost&&t>.4?-5:0)} 104 170)`);
      const blink=idle&&!reduced ? ((t%4.5>3.65&&t%4.5<3.82) ? .12 : 1) : 1;
      p['eye-left'].setAttribute('transform',`translate(0 ${100*(1-blink)}) scale(1 ${blink})`);
      p['eye-right'].setAttribute('transform',`translate(0 ${100*(1-blink)}) scale(1 ${blink})`);
      const sad=lost&&t>.4 || this.state==='incorrect'&&t>1.2;
      visible(p.smile,sad?0:1);visible(p.worry,sad?1:0);
      const pull=shot&&!reduced ? Math.sin(clamp(t/.65)*Math.PI)*25 : 0;
      p['bow-string'].setAttribute('d',`M233 84L${233-pull} 175L232 263`);
      p['draw-arm'].setAttribute('transform',`translate(${-pull*.25} 0)`);
      p['bow-arm'].setAttribute('transform',`rotate(${shot&&!reduced?-4*Math.sin(clamp(t/.85)*Math.PI):0} 130 201)`);
      p.target.setAttribute('transform',`rotate(${correct&&!reduced&&t>=1.05&&t<1.5?Math.sin((t-1.05)*50)*3*Math.exp(-(t-1.05)*7):0})`);
      visible(p.flight,0);visible(p.impact,0);visible(p.sparkles,0);visible(p['broken-arrow'],0);visible(p.dust,0);
      if(shot) {
        const s=reduced?2.1:t;
        if(s>=.65) {
          const f=clamp((s-.65)/.4), x=correct?405+310*f:405+430*f, y=correct?283-8*f:283-143*f;
          let ax=x,ay=y,angle=correct?-1.5:-18;
          if(!correct && s>1.05){const fall=clamp((s-1.05)/.9);ax=835+12*fall;ay=140+318*fall*fall;angle=-18+100*fall;}
          p.flight.setAttribute('transform',`translate(${ax} ${ay}) rotate(${angle})`);
          visible(p.flight,correct?1:(s<2.45?1:Math.max(0,1-(s-2.45)*3)));
        }
        if(correct && s>=1.05){const impact=clamp((s-1.05)/.65);p.impact.setAttribute('r',12+impact*70);visible(p.impact,1-impact);visible(p.sparkles,clamp((s-1.05)*5)*(1-clamp((s-2.05)*3)));}
        if(!correct&&s>=1.8&&s<2.3)visible(p.dust,Math.sin((s-1.8)/.5*Math.PI));
      }
      if(lost) {
        const s=reduced?.95:t, split=clamp((s-.65)/.8), fall=ease(split), y=fall*245;
        visible(p['broken-arrow'],s<2.2?clamp(s*5):clamp((2.7-s)*2));
        p['broken-arrow'].setAttribute('transform','rotate(-12)');
        p['shard-left'].setAttribute('transform',`translate(${-35*split} ${y}) rotate(${-65*split})`);
        p['shard-right'].setAttribute('transform',`translate(${48*split} ${y*.95}) rotate(${85*split})`);
        visible(p.crack,s>.6&&s<.95?1:0);
      }
    }
    destroy() { cancelAnimationFrame(this.raf);this.destroyed=true;if(this.pending)this.pending({state:this.state,cancelled:true});this.pending=null;this.container.replaceChildren(); }
    static portrait() { const head=fox.slice(fox.indexOf('<g class="head">'),fox.lastIndexOf('</g>')); return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 -25 205 225" role="img" aria-label="Robin geeft een hint"><style>.robin-outline{stroke:#2c4235;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.fine{stroke-width:3}</style>${head}</svg>`; }
  }
