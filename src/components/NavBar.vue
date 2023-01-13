<template>
  <div id="NavBar" >
    <router-link v-if="(showStore()===true)||(showProduct()===true)" style="color:white;margin:10px" to="/storageTable">  ТАБЛИЦА СКЛАДА  </router-link>
    <router-link v-if="(showStore()===true)||(showProduct()===true)" style="color:white;margin:10px" to="/redactStorage">  РЕДАКТИРОВАНИЕ СКЛАДА  </router-link>
    <router-link v-if="showProduct()===true" style="color:wheat;margin:10px" to="/productTable">  ТАБЛИЦА ПРОДУКТОВ  </router-link>
    <router-link v-if="showProduct()===true" style="color:wheat;margin:10px" to="/redactProduct">  РЕДАКТИРОВАНИЕ ПРОДУКТА  </router-link>
    <router v-if="(showStore()===true)||(showProduct()===true)" style="color:red;margin:10px" v-on:click="logout()">  ВЫХОД </router>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  data(){
    return{
    }
  },
  methods:{
    showStore(){
      let u = this.$store.getters.username
      let p = this.$store.getters.password
      if((u==='user')&&(p==='user')){
        return true
      }else{
        return false
      }
    },
    showProduct(){
      let u = this.$store.getters.username
      let p = this.$store.getters.password
      if((u==='admin')&&(p==='admin')){
        return true
      }else{
        return false
      }
    },
    logout(){
      this.$store.commit("changeU",'')
      this.$store.commit("changeP",'')
      this.$store.commit("changeStore", {})
      this.$store.commit("changeProd",{})
      this.$router.push("loginPage")
    }
  }
}
</script>

<style scoped>
#NavBar{
  margin-top:50px;
}
</style>