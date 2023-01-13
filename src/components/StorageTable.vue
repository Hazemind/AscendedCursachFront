<template>
  <div id="storageTable">
    <h1>Таблица склада</h1>
    <!-- Кнопки -->
    <div>
      <b-button variant="primary" v-on:click="addToTable">Добавить запись</b-button>
    </div>
    <!-- Контейнер для таблицы и действий с таблицой -->
    <b-container class="mt-2" style="min-width: 90%;">
      <h2>Фильтры</h2>
      <div style=" display:flex; max-height: 38px">
        <!--Фильтры таблицы-->
        <b-form-input style="max-width: 13%;margin-left:5px;margin-right:5px" type="text" v-model="filterCellNumber"/>
        <b-form-input style="max-width: 19%;margin-left:5px;margin-right:5px" type="text" v-model="filterQuanity"/>
        <b-form-input style="max-width: 13.5%;margin-left:5px;margin-right:5px" type="text" v-model="filterCellSize"/>
        <b-form-select style="max-width: 18%;margin-left:5px;margin-right:5px" :options="productNamesList"  v-model="filterProductName"/>
        <b-datepicker style="max-width: 20%;margin-left:5px;margin-right:5px" v-model="filterDate" range ></b-datepicker>
        <div style="max-height: 38px">
          <b-button style="margin-left:5px;margin-right:5px;" variant="primary" v-on:click="showWithFilters()" >Применить</b-button>
          <b-button style="margin-left:5px;margin-right:5px;" variant="warning" v-on:click="clearFilter()" >X</b-button>
        </div>
      </div>
      <!-- Сама таблица -->
      <b-table class="mt-4" hover id="warehouseTable" :items="warehouse" :fields="warehouseFields" :sort-by="sortBy" small>
        <template v-slot:cell(rowAction)="row">
          <b-button class="delete-button" variant="primary" v-on:click="startRedactingStorage(row.item.cellNumber)">Редактировать</b-button>
        </template>
      </b-table>
    </b-container>
    <div>
      <!-- Скролл таблицы -->
      <b-button v-if="this.$store.getters.paginator.from!==0" v-on:click="changeFromAndTo(false)">Назад</b-button>
      {{this.$store.getters.paginator.from +1}} - {{this.$store.getters.paginator.to}} из {{this.$store.getters.paginator.max}}
      <b-button v-if="this.$store.getters.paginator.to!==this.$store.getters.paginator.max" v-on:click="changeFromAndTo(true)">Вперёд</b-button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueAxios from "vue-axios";
import axios from "axios";

Vue.use(VueAxios, axios)
export default {
  name:"storageTable",
  data() {
    return {
      productNamesList:[],
      warehouse: [],
      dbStorageTable:[],
      dbProductTable:[],
      warehouseFields:[
        {key:'cellNumber',label:'Номер ячейки'},
        {key:'productNumber',label:'Количество товаров'},
        {key:'slotSize',label:'Размер ячейки'},
        {key:'productName',label:'Название продукта'},
        {key:'dateOfChange',label:'Дата изменения'},
        {key:'rowAction',label:'Действие'}
      ],
      sortBy: 'cellNumber',
      filterCellNumber:'',
      filterQuanity:'',
      filterCellSize:'',
      filterProductName:'',
      filterDate:'',
      maxRows:''
    }
  },
  methods:{
    showWithFilters(){
      let text = {}
      text.cellNumber = null
      text.quanity = -1
      text.cellSize = -1
      text.productId = null
      text.lastChangeTime = null
      if (this.filterCellNumber !== ''){
        text.cellNumber = this.filterCellNumber
      }
      if (this.filterQuanity !== ''){
        text.quanity = this.filterQuanity
      }
      if (this.filterCellSize !== ''){
        text.cellSize = this.filterCellSize
      }
      if (this.filterProductName !== ''){
        let length = this.dbProductTable.data.length
        for (let i=0;i<length;i++){
          if (this.filterProductName == this.dbProductTable.data[i].name){
            text.productId = this.dbProductTable.data[i].id
            break
          }
        }
      }
      if (this.filterDate !== ''){
        text.lastChangeTime = this.filterDate
      }
      console.log(text)
      axios
          .post('http://95.216.8.101:8080/storage/api/v1/loadStorageList2',text)
          .catch(err=>console.log(err))
          .then(response=>{this.createFromAndTo(response.data.storageSize,0);this.getLoadStorageList2(text)})
    },
    clearFilter(){
      this.filterCellNumber =''
      this.filterQuanity =''
      this.filterCellSize =''
      this.filterProductName =''
      this.filterDate =''
      this.getSizeOfStorageList()
    },
    addToTable(){
      this.$store.commit('changeStore',{})
      this.$router.push('redactStorage')
    },
    showResponse(){
      let length = this.dbStorageTable.data.storageList.length
      let counter = 0
      let date = new Date()
      this.warehouse = []
      this.getProductNames()
      while (counter < length) {
        date = this.dbStorageTable.data.storageList[counter].lastChangeTime.slice(0, 19).replace('T', ' ');
        this.warehouse.push({
          cellNumber: this.dbStorageTable.data.storageList[counter].cellNumber,
          productNumber: this.dbStorageTable.data.storageList[counter].quanity,
          slotSize: this.dbStorageTable.data.storageList[counter].cellSize,
          productName: this.dbStorageTable.data.storageList[counter].productId,
          dateOfChange: date
        })
        counter++
      }
      this.listProductNames()
    },
    listProductNames(){
      let length = this.dbProductTable.data.length
      this.productNamesList=[]
      for (let i=0;i<length;i++){
        this.productNamesList.push(this.dbProductTable.data[i].name)
      }
    },
    getProductNames(){
      let lengthProduct=this.dbProductTable.data.length
      let lengthStorage=this.dbStorageTable.data.storageList.length
      let counterP = 0
      let counterS = 0
      while((counterS<lengthStorage)){
        while (counterP<lengthProduct){
          if (this.dbStorageTable.data.storageList[counterS].productId == this.dbProductTable.data[counterP].id){
            this.dbStorageTable.data.storageList[counterS].productId = this.dbProductTable.data[counterP].name
          }
          counterP++
        }
        counterP=0
        counterS++
      }
    },
    startRedactingStorage(index){
      let test = {}
      let l =this.warehouse.length
      for(let i=0;i<l;i++){
        if (index === this.warehouse[i].cellNumber){
          test = {...this.warehouse[i]}
          break
        }
      }
      test.quanity = test.productNumber
      test.cellSize = test.slotSize
      delete test.productNumber
      delete test.slotSize
      this.$store.commit('changeStore',test)
      this.$router.push('redactStorage')
    },
    getLoadProductList(){
      axios
          .get('http://95.216.8.101:8080/products/api/v1/loadProductList')
          .then(response=>{this.dbProductTable = response;
            this.getSizeOfStorageList()})
    },
    getSizeOfStorageList(){
      axios
          .get('http://95.216.8.101:8080/storage/api/v1/loadStorageList?')
          .then(response=>{this.createFromAndTo(response.data.storageSize,0);this.getLoadStorageList()})
    },
    createFromAndTo(size,from){
      this.$store.commit('changeMax', size)
      this.$store.commit('changeFrom',from)
      if (size<this.maxRows){
        this.$store.commit('changeTo',size)
      }else{
        this.$store.commit('changeTo',this.maxRows)
      }
    },
    getLoadStorageList(){
      axios
          .get('http://95.216.8.101:8080/storage/api/v1/loadStorageList?from='+(this.$store.getters.paginator.from)+'&to='+this.maxRows)
          .then(response=>{this.dbStorageTable = response;this.showResponse()})
    },
    getLoadStorageList2(obj){
      axios
          .post('http://95.216.8.101:8080/storage/api/v1/loadStorageList2?from='+this.$store.getters.paginator.from+'&to='+this.maxRows,obj)
          .then(response=>{this.dbStorageTable = response;this.showResponse()})
    },
    changeFromAndTo(key){
      let from = this.$store.getters.paginator.from
      let to = this.$store.getters.paginator.to
      let max = this.$store.getters.paginator.max
      if (key){
        if ((to+this.maxRows)>=max){
          this.$store.commit("changeTo",max)
          this.$store.commit("changeFrom",to)
        }else{
          this.$store.commit("changeTo",to+this.maxRows)
          this.$store.commit("changeFrom",to)
        }
      }else {
        if ((from - this.maxRows <= 0)) {
          this.$store.commit("changeFrom", 0)
          this.$store.commit("changeTo", from)
        } else {
          this.$store.commit("changeFrom", from - this.maxRows)
          this.$store.commit("changeTo", from)
        }
      }
      console.log(this.$store.getters.paginator.from + " - " + this.$store.getters.paginator.to + " - " + this.$store.getters.paginator.max)
      this.getLoadStorageList()
    },
    kickImposter(){
      if (!((this.$store.getters.username==='user' &&this.$store.getters.password==='user')||
          (this.$store.getters.username==='admin' &&this.$store.getters.password==='admin'))){
        alert('КУДА СОБРАЛСЯ?')
        this.$router.push('loginPage')
      }
    }
  },
  mounted(){
    this.kickImposter()
    this.getLoadProductList()
    this.maxRows = 7
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#storageTable{
  color:white;
  padding-top:20px
}
.b-table{
  color:white
}
</style>
