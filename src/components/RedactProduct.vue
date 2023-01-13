<template>
  <div id="RedactProduct">
    <h1 style="color:wheat">Редактирование продукта</h1>
    <label>Номер продукта</label>
    <b-input style="text-align:center;" v-model="id"></b-input>
    <label>Название продукта</label>
    <b-input style="text-align:center;" v-model="name"></b-input>
    <label>Город продукта</label>
    <b-input style="text-align:center;" v-model="city"></b-input>
    <br>
    <b-button variant="primary" v-on:click="saveProduct()">Сохранить продукт</b-button>
    <b-button variant="danger" v-on:click="deleteProduct(id)">Удалить продукт</b-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RedactProduct",
  data(){
    return{
      id:'',
      name:'',
      city:''
    }
  },
  methods:{
    saveProduct(){
      let text = {}
      text.id = this.id
      text.name = this.name
      text.city = this.city
      axios.post('http://95.216.8.101:8080/products/api/v1/saveProduct',text,
          {auth:{username:this.$store.getters.username,password:this.$store.getters.password}}).catch(err=>console.log(err))
          .then(response=>{console.log(response);alert('Успешное сохранение');this.$router.push('productTable')})
    },
    deleteProduct(id){
      axios.delete('http://95.216.8.101:8080/products/api/v1/deleteProduct?id='+id,
          {auth:{username:this.$store.getters.username,password:this.$store.getters.password}}).catch(err=>console.log(err))
          .then(response=>{console.log(response);alert('Успешное удаление');this.$router.push('productTable')})
    },
    loadInputs(){
      this.id = this.$store.getters.prod.id
      this.name = this.$store.getters.prod.name
      this.city = this.$store.getters.prod.city
    },
    kickImposter(){
      if (!((this.$store.getters.username==='admin' &&this.$store.getters.password==='admin'))){
        alert('КУДА СОБРАЛСЯ?')
        this.$router.push('loginPage')
      }
    }
  },
  mounted(){
    this.kickImposter()
    this.loadInputs()
  }
}
</script>

<style scoped>
#RedactProduct{
  background-color:#49505a;
  height:200px;
  margin:100px;
  color:white;
  padding-left: 30%;
  padding-right: 30%;
}
</style>