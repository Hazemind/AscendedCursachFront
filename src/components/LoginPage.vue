<template>
  <div id="loginPage">
    <h1>Войдите в систему</h1>
    <div id="loginForms">
      <b-form-input v-model="username" placeholder="Логин"></b-form-input>
      <br>
      <b-form-input type="password" v-model="password" placeholder="Пароль"></b-form-input>
      <br>
      <b-button v-on:click="checkUser()">Войти</b-button>
      <router-view/>
    </div>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "loginPage",
  data(){
    return{
      username:'',
      password:'',
      role:''
    }
  },
  methods:{
    checkUser(){
      axios.get('http://95.216.8.101:8080/login/api/v1/login',{auth:{username:this.username,password:this.password}}).catch(err=>(this.error(err)))
          .then(response=>{this.checkAgain(response)})
    },
    error(err){
      alert("Неверный логин или пароль")
      console.log(err)
    },
    checkAgain(response){
      this.role=response.data
      if (this.role === 'admin'||this.role==='user'){
        this.$store.commit("changeU",this.role)
        this.$store.commit("changeP",this.role)
        this.$router.push("storageTable")
      }else{
        alert('Неверный логин или пароль')
      }
    }
  }
}
</script>

<style scoped>
#loginPage{
  height:400px;
  margin:200px;
  color:white;
  padding:40px;
}
#loginForms{
  top:200px;
  padding:30px;
  padding-left: 40%;
  padding-right: 40%;
}

</style>