import{n as r,e as o,s as l,t as n,f as i,g as u}from"./index-8a97ae8a.js";var p=function(){var e=this,s=e._self._c;return s("div",{staticClass:"container"},[s("div",{staticClass:"jumbotron"},[s("h1",[e._v("Login")]),s("hr"),s("b-link",{attrs:{href:e.loginUrl}},[e._v("Login with Google")])],1)])},d=[];const c={computed:{emailInputIsValid(){return this.emailInput.length>0},inputIsValid(){return this.emailInputIsValid&&this.passwordInputIsValid},loginUrl(){return`${o}api/auth/google`},passwordInputIsValid(){return this.passwordInput.length>0}},data(){return{emailInput:"",passwordInput:"",loading:!1}},methods:{async onLoginAttempt(){let t;this.loading=!0;try{t=await l.post("/login/password",{email:this.emailInput,password:this.passwordInput});const{message:e,success:s,token:a}=t.data;this.$notify({message:e,success:s}),s&&a&&(n(i).set(a),n(u).set(this.emailInput),document.location.href=`${o}/`)}catch{}this.loading=!1}},mounted(){const t=this.$route.query.token;(t==null?void 0:t.length)>0&&(n(i).set(t),document.location.href="/")}};var h=r(c,p,d,!1,null,"48ba2671",null,null);const _=h.exports;export{_ as default};