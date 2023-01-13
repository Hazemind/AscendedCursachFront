<template>
  <div id="RedactStorage">
    <h1>Редактирование склада</h1>
    <label>Номер ячейки</label>
    <b-form-input style="text-align:center;" v-model="cellNumber"></b-form-input>
    <label>Количество товаров</label>
    <b-form-input style="text-align:center;" v-model="quanity"></b-form-input>
    <label>Размер ячейки</label>
    <b-form-input style="text-align:center;" v-model="cellSize"></b-form-input>
    <label>Название продукта</label>
    <b-form-select style="text-align:center;" v-model="productName" :options="productNamesList" />
    <br><br>
    <b-button variant="primary" v-on:click="saveToDatabase(productName)" >Сохранить</b-button>
    <b-button variant="danger" v-on:click="deleteFromDatabase(cellNumber)">Удалить</b-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RedactStorage",
  data(){
    return{
      productNamesList:[],
      cellNumber:'',
      quanity:'',
      cellSize:'',
      productName:'',
      dbProductTable:[],
    }
  },
  props:[
      'storageNumber'
  ],
  methods:{
    saveToDatabase(name){
      console.log('started')
      let test = {}
      let productId
      let l = this.dbProductTable.data.length
      for (let i=0;i<l;i++){
        if(name==this.dbProductTable.data[i].name){
          productId = this.dbProductTable.data[i].id
          break
        }
      }
      test.cellNumber=this.cellNumber
      test.quanity=this.quanity
      test.cellSize=this.cellSize
      test.productId=productId
      console.log(test)
      axios.post('http://95.216.8.101:8080/storage/api/v1/saveStorage',test,
          {auth:{username:this.$store.getters.username,password:this.$store.getters.password}}).catch(err=>console.log(err))
          .then(response=>{console.log(response);alert('Успешное сохранение');this.$router.push('storageTable')})
    },
    deleteFromDatabase(num){
      axios.delete('http://95.216.8.101:8080/storage/api/v1/deleteStorage?id='+(num)+'&from=0&to=10',
          {auth:{username:this.$store.getters.username,password:this.$store.getters.password}}).catch(err=>console.log(err))
          .then (response=>{console.log(response);alert('Успешное удаление');this.$router.push('storageTable')})
    },
    getProductNames(){
      let l = this.dbProductTable.data.length
      for (let i=0;i<l;i++){
        this.productNamesList.push(this.dbProductTable.data[i].name)
      }
    },
    getLoadProductList(){
      axios
          .get('http://95.216.8.101:8080/products/api/v1/loadProductList')
          .then(response=>{this.dbProductTable = response;
          this.getProductNames();})
    },
    kickImposter(){
      if (!((this.$store.getters.username==='user' &&this.$store.getters.password==='user')||
          (this.$store.getters.username==='admin' &&this.$store.getters.password==='admin'))){
        alert('КУДА СОБРАЛСЯ?')
        this.$router.push('loginPage')
      }
    },
    loadInputs(){
      this.cellNumber = this.$store.getters.store.cellNumber
      this.quanity = this.$store.getters.store.quanity
      this.cellSize = this.$store.getters.store.cellSize
      this.productName = this.$store.getters.store.productName
    }
  },
  mounted(){
    this.kickImposter()
    this.getLoadProductList()
    this.loadInputs()
  }
}
</script>

<style scoped>
#RedactStorage{
  border-width:10px;
  background-color:#49505a;
  height:400px;
  margin:100px;
  color:white;
  padding-left: 30%;
  padding-right: 30%;
}
.b-form-input{
  text-align:center;
}
</style>