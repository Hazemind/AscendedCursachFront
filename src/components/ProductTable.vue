<template>
  <div id="productTable">
    <h1 style="color:wheat">Таблица продуктов</h1>
    <!-- Кнопки -->
    <div>
      <b-button variant="primary" v-on:click="addToTable" >Добавить продукт</b-button>
    </div>
    <!-- Контейнер для таблицы и действий с таблицой -->
    <b-container class="mt-2" style="min-width: 90%;">
      <br>
      <!-- Сама таблица -->
      <b-table class="mt-4" hover id="productListTable" :items="productList" :fields="productListFields" :sort-by="sortBy" small>
        <template v-slot:cell(rowAction)="row">
          <b-button class="delete-button" variant="primary" v-on:click="startRedactingProduct(row.item.id)">Изменить</b-button>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(VueAxios, axios)
export default {
  name:"productTable",
  data() {
    return {
      productNamesList:[],
      productList: [],
      dbStorageTable:[],
      dbProductTable:[],
      productListFields:[
        {key:'id',label:'Номер продукта'},
        {key:'name',label:'Название продукта'},
        {key:'city',label:'Город продукта'},
        {key:'rowAction',label:'Действие'}
      ],
      sortBy: 'id',
    }
  },
  methods:{
    showResponse(){
      this.getProductNames()
      this.productList = this.dbProductTable.data
    },
    clearFilter(){
      this.tableFilter =''
    },
    addToTable(){
      this.$store.commit('changeProd',{})
      this.$router.push('redactProduct')
    },
    getProductNames(){
      let l = this.dbProductTable.data.length
      for (let i=0;i<l;i++){
        this.productNamesList.push(this.dbProductTable.data[i].name)
      }
    },
    startRedactingProduct(index){
      let test = {}
      let l = this.productList.length
      for(let i=0;i<l;i++){
        if (index === this.productList[i].id){
          test = {...this.productList[i]}
          break
        }
      }
      this.$store.commit('changeProd',test)
      this.$router.push('redactProduct')
    },
    getLoadProductList(){
      axios
          .get('http://95.216.8.101:8080/products/api/v1/loadProductList')
          .then(response=>{this.dbProductTable = response;
          this.showResponse()})
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
    this.getLoadProductList()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#productTable{
  color:white;
  padding-top:20px
}
.b-table{
  color:white
}
</style>
