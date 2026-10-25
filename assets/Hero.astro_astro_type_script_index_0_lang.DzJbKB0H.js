function e(e){let i=window.matchMedia(`(prefers-reduced-motion: reduce)`);if(i.matches)return;let a=e.querySelector(`canvas`),o=e.querySelector(`img`),s=a.getContext(`webgl`,{alpha:!1,antialias:!1,premultipliedAlpha:!1,powerPreference:`low-power`});if(!s)return;let c=window.matchMedia(`(min-width: 768px)`),l=r(s,`
attribute vec2 a_pos;
void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }`,`
precision mediump float;
uniform sampler2D u_img;
uniform sampler2D u_mask;
uniform vec2 u_res;
uniform vec4 u_map;   // xy — смещение картинки (px), zw — её размер на экране (px)
uniform float u_t;
uniform vec2 u_ptr;
void main(){
  vec2 uv = (gl_FragCoord.xy - u_map.xy) / u_map.zw;
  float m = texture2D(u_mask, uv).r;
  float t = u_t;
  float w1 = sin(uv.y * 6.5 - t * 0.85 + sin(uv.x * 3.6 + t * 0.45) * 1.5);
  float w2 = sin(uv.x * 5.0 + t * 0.62 + uv.y * 2.6);
  float w3 = sin((uv.x + uv.y) * 10.0 - t * 1.15);
  vec2 d = vec2(w1 * 0.0040 + w3 * 0.0011, w2 * 0.0052 + w3 * 0.0009);
  d += u_ptr * 0.0026;
  vec4 c = texture2D(u_img, clamp(uv + d * m, 0.001, 0.999));
  float band = (uv.x * 0.85 - uv.y * 0.55) - (fract(t * 0.03) * 2.4 - 0.9);
  c.rgb += exp(-band * band * 36.0) * 0.055 * m;
  gl_FragColor = vec4(c.rgb, 1.0);
}`);if(!l)return;s.useProgram(l);let u=s.createBuffer();s.bindBuffer(s.ARRAY_BUFFER,u),s.bufferData(s.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),s.STATIC_DRAW);let d=s.getAttribLocation(l,`a_pos`);s.enableVertexAttribArray(d),s.vertexAttribPointer(d,2,s.FLOAT,!1,0,0);let f=e=>s.getUniformLocation(l,e),p=f(`u_res`),m=f(`u_map`),h=f(`u_t`),g=f(`u_ptr`);s.uniform1i(f(`u_img`),0),s.uniform1i(f(`u_mask`),1);let _=n(s),v=n(s),y={img:!1,mask:!1},b=``,x=``;function S(e,t,n){s.activeTexture(s.TEXTURE0+t),s.bindTexture(s.TEXTURE_2D,e),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!0),s.texImage2D(s.TEXTURE_2D,0,s.RGB,s.RGB,s.UNSIGNED_BYTE,n)}function C(){let t=o.currentSrc||o.src;if(!o.complete||!o.naturalWidth||t===b)return;b=t,S(_,0,o),y.img=!0;let n=c.matches?`desktop`:`mobile`;if(n!==x){x=n,y.mask=!1;let t=new Image;t.decoding=`async`,t.onload=()=>{S(v,1,t),y.mask=!0,E()},t.src=n===`desktop`?e.dataset.maskDesktop:e.dataset.maskMobile}E()}let w=0,T=0;function E(){let n=e.getBoundingClientRect(),r=Math.min(window.devicePixelRatio||1,c.matches?1.5:1.25);w=Math.max(1,Math.round(n.width*r)),T=Math.max(1,Math.round(n.height*r)),a.width=w,a.height=T,s.viewport(0,0,w,T),s.uniform2f(p,w,T);let i=o.naturalWidth||1,l=o.naturalHeight||1,u=Math.max(w/i,T/l),d=i*u,f=l*u,[h,g]=t(getComputedStyle(o).objectPosition),_=(w-d)*h,v=(T-f)*g,y=T-f-v;s.uniform4f(m,_,y,d,f)}let D=0,O=0,k=0,A=0;window.addEventListener(`pointermove`,e=>{e.pointerType===`mouse`&&(k=(e.clientX/window.innerWidth-.5)*2,A=-(e.clientY/window.innerHeight-.5)*2)},{passive:!0});let j=!0,M=0,N=!1,P=performance.now();function F(t){M=0,j&&!document.hidden&&(y.img&&y.mask&&(D+=(k-D)*.04,O+=(A-O)*.04,s.uniform1f(h,(t-P)/1e3),s.uniform2f(g,D,O),s.drawArrays(s.TRIANGLE_STRIP,0,4),N||(N=!0,e.classList.add(`is-live`))),M=requestAnimationFrame(F))}let I=()=>{M||=requestAnimationFrame(F)};new IntersectionObserver(([e])=>{j=e.isIntersecting,j&&I()}).observe(e),document.addEventListener(`visibilitychange`,I),new ResizeObserver(()=>{C(),E()}).observe(e),o.addEventListener(`load`,C),o.complete&&C(),i.addEventListener(`change`,()=>{i.matches&&(j=!1,e.classList.remove(`is-live`))}),I()}function t(e){let t=e.split(/\s+/).map(e=>e.endsWith(`%`)?parseFloat(e)/100:.5);return[t[0]??.5,t[1]??.5]}function n(e){let t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),t}function r(e,t,n){let r=(t,n)=>{let r=e.createShader(t);return e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:null},i=r(e.VERTEX_SHADER,t),a=r(e.FRAGMENT_SHADER,n);if(!i||!a)return null;let o=e.createProgram();return e.attachShader(o,i),e.attachShader(o,a),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)?o:null}var i=document.querySelector(`[data-silk]`);i&&e(i);