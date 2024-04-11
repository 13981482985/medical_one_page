<template>
    <div class="contain">
      <div class="step">
        <el-steps :active="active" align-center>
          <el-step title="选择数据"></el-step>
          <el-step title="特征选择"></el-step>
          <el-step title="方法选择" v-if="type==4"></el-step>
          <el-step title="结果展示"></el-step>
        </el-steps>
      </div>
      <div class="mainCharacter">
        <div class="left_sidebar">
            <el-tree ref="tree"
            show-checkbox
            :check-strictly="true"  
            :data="treeData"
            :props="defaultProps"
            node-key="id"
            default-expand-all
            :default-checked-keys="defaultCheckedKeys"
            @check="handleCheck" 
            >
          </el-tree>
        </div>
        <div class="right">
            <div class="info">
              <el-alert
                title="特征下方进度条为特征数据完备率"
                type="info"
                center
                show-icon>
              </el-alert>
            </div>
            <br><br v-if="curentAnalyzeStep==1">            
            <h2 style="text-align: center" v-if="step==1">选择需要缺失补齐的特征</h2><h2 style="text-align: center; margin-top:-15px" v-if="step==2" class="top">选择需要统计分析的特征</h2>
            <!--缺失值补齐，病人画像， 描述性分析的 特征选择-->
            <div class="selectClass" v-if="curentAnalyzeStep==1">
              <h3>文本类型特征</h3>
              <div class="contain3">
                <div class="block" v-for="feat in featureData" :key="feat.id" v-if="feat.featureDataType==3">
                    <el-checkbox v-model="feat.cheack" @change="handleCheckboxChange(feat)" class="checkbox-font-size">{{feat.label}}</el-checkbox>
                    <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 100px;" class="custom-progress" ></el-progress> -->
                    <el-progress :percentage="Math.round(100 - feat.missRate)" :stroke-width=8 :format="format" :color="getProgressStatus(feat.missRate)" style="width: 100px;"></el-progress>
                </div>
                <div class="block invisible" v-for="n in (5 - countVisibleFeatures(3) % 5) % 5" :key="n.id"></div>
              </div>
              <h3>连续数字类型特征</h3>
              <div class="contain1">
                <div class="block" v-for="feat in featureData" :key="feat.id" v-if="feat.featureDataType==1">
                  <el-checkbox v-model="feat.cheack" @change="handleCheckboxChange(feat)" class="checkbox-font-size">{{feat.label}}</el-checkbox>
                  <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 120px;" class="custom-progress" :color="getProgressColor(feat.missRate)"></el-progress> -->
                  <el-progress :percentage="Math.round(100 - feat.missRate)" :format="format" :color="getProgressStatus(feat.missRate)" style="width: 100px;"></el-progress>
                </div>
              <div class="block invisible" v-for="n in (5 - countVisibleFeatures(1) % 5 % 5) % 5" :key="n.id"></div>
              </div>
              <h3>离散数字类型特征</h3>
              <div class="contain2">
                <div class="block" v-for="feat in featureData" :key="feat.id" v-if="feat.featureDataType==2">
                    <el-checkbox v-model="feat.cheack" @change="handleCheckboxChange(feat)" class="checkbox-font-size">{{feat.label}}</el-checkbox>
                    <!-- <el-progress :percentage="feat.missRate" :stroke-width=8 style="width: 120px;" class="custom-progress" :color="getProgressColor(feat.missRate)"></el-progress> -->
                    <el-progress :percentage="Math.round(100 - feat.missRate)" :format="format" :color="getProgressStatus(feat.missRate)" style="width: 100px;"></el-progress>
                </div>
                <div class="block invisible" v-for="n in (5 - countVisibleFeatures(2) % 5% 5) % 5" :key="n.id"></div>
              </div>
            </div>
            <!--单因素分析的特征选择-->
            <div class="selectClassSingle" v-if="curentAnalyzeStep==2">
              <h3 style="text-align: center; font-size: 24px">选择作为分组依据特征</h3>
              <div class="contain4">
                <div class="block" v-for="(feat,index) in featureData" :key="index" v-if="feat!=observeFeaure && feat.discrete && feat.missRate<50">
                    <el-checkbox v-model="feat.cheack" @change="handleCheckboxChangeGroup(feat)" class="checkbox-font-size">{{feat.label}}</el-checkbox>
                    <el-progress :percentage="Math.round(100 - feat.missRate)" :format="format" :color="getProgressStatus(feat.missRate)" style="width: 100px;"></el-progress>
                </div>
                <div class="block invisible" v-for="n in (5 - getGroupFeatLength() % 5) % 5" :key="n.id"></div>
              </div>
               <h3 style="text-align: center; font-size: 24px">选择需要观察的特征</h3>
              <div class="contain5">
                <div class="block" v-for="(feat,index) in featureData" :key="index" v-if="feat!=groupFeature && feat.missRate<50">
                    <el-checkbox v-model="feat.cheack" @change="handleCheckboxChangeObserve(feat)" class="checkbox-font-size">{{feat.label}}</el-checkbox>
                    <el-progress :percentage="Math.round(100 - feat.missRate)" :format="format" :color="getProgressStatus(feat.missRate)" style="width: 100px;"></el-progress>
                </div>
                <div class="block invisible" v-for="n in (5 - getObserveFeatLength() % 5) % 5" :key="n.id"></div>
              </div>
            </div>

            <div class="consistencyAnalyze" v-if="curentAnalyzeStep==3">
               <h3 style="text-align: center; font-size: 24px">选择作为分组依据特征</h3>
               <div class="contain6">
                <div class="block" v-for="(feat,index) in featureData" :key="index" v-if="feat.featureDataType!=3 && feat.missRate<30">  <!--只显示数据类型为数值的字段-->
                    <el-checkbox v-model="feat.cheack" @change="handleCheckboxChangeConsis(feat)" class="checkbox-font-size">{{feat.label}}</el-checkbox>
                    <el-progress :percentage="Math.round(100 - feat.missRate)" :format="format" :color="getProgressStatus(feat.missRate)" style="width: 100px;"></el-progress>
                </div>
                <div class="block invisible" v-for="n in (5 - getConsistencyAnalyzeLength() % 5) % 5" :key="n.id"></div>
              </div>
            </div>
          </div>
      </div>
    </div>
</template>
<script>
import {getRequest, postRequest, getIndicators} from "@/api/user"
import { treeData } from "../tab/treeData";
/*特征选择页面*/
export default ({
    name:'characterChoose',
    props:['active','type', 'label','step','analyzeStep','describeAna','selectTreeNode','featureDataFromParent','observeFeatFromParent','groupFeatFromParent','curentAnalyzeStep'],
    data(){
        return{
          defaultCheckedKeys: [],
          isDescribe: false,
          nodedata: {},
          selectedNode: [],
          treeData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
       options: [{
          value: '选项1',
          label: '全部特征'
        }, {
          value: '选项2',
          label: '疾病标准特征',
          disabled: false
        }, {
          value: '选项3',
          label: '非疾病标准特征'
        }],
        groupFeature: {},
        observeFeaure: {},
        allFeatures: [],
        // curentAnalyzeStep: 1,
        checkedFeats: [],
        tableName: '',
        peopleFeatures: [],
        physiologicalFeatures: [],
        socialFeatures: [],
        checkAll_1: false,
        checkAll_2: false,
        checkAll_target: false,
        computeFeatures: [],
        knownFeatures: [],
        targetFeature: [],
        //用于存储左侧特征选择树值
        featureSelectTree: [],
        //特征选择数的备份，用于删除叶子节点
        filteredTree:[],
        featureData: [],
        //用于存储右侧特征条件选项
        feature_select_options: [
            { value: 0, label: "全部特征" },
            { value: 1, label: "疾病标准特征" },
            { value: 2, label: "非疾病标准特征" }
        ],
        //用于存储所有特征
        all_features: [],
        //用于存储已选的因变量（已选标签特征）
        checked_dependent_variables: [],
        //用于存储已选的因变量（已选危险因素）
        checked_independent_variables: [],
        //分页数据
        pageSize: 10,
        currentPage: 1,
        dataTotal: 10,
        value: '',
        templist: []
      }
    },
    created(){
      console.log("分组依据：",this.observeFeatFromParent)
      this.isDescribe=this.describeAna==true?true:false;
      this.groupFeature= {};
      this.observeFeaure={};
      this.tableName = this.label;
      this.getIndicatorCategory();

    // 缺失值补齐和描述性分析选择记忆功能
      this.defaultCheckedKeys = [];
      this.defaultCheckedKeys = this.selectTreeNode
      if(this.featureDataFromParent.length>0) {
        this.checkedFeats = [];
        for(let i=0; i<this.featureDataFromParent.length; i++){
          if(this.featureDataFromParent[i].cheack) this.checkedFeats.push(this.featureDataFromParent[i]);
        }
        this.featureData = this.featureDataFromParent;
      }
      // 单因素分析选择记忆功能
      if(this.observeFeatFromParent!=null) {
        console.log("分组依据2：",this.observeFeatFromParent)
        this.observeFeaure = this.observeFeatFromParent;
      }
      if(this.groupFeatFromParent!=null) this.groupFeature = this.groupFeatFromParent;

      // if(this.analyzeStep!=null){
      //   this.curentAnalyzeStep = this.analyzeStep;
      // }
      
    },
    methods:{
      getConsistencyAnalyzeLength(){
        var len = this.featureData.length;
        for(let i=0; i<this.featureData.length; i++){
          if(this.featureData[i].featureDataType==3 || this.featureData[i].missingRate>=30) len -=1 ;
        }
        return len;
      },
      getProgressStatus(missingRate) {
        if (missingRate < 30) {
          return '#25bef5';
        } else if (missingRate < 70) {
          return '#e6a23c';
        } else {
          return '#ff0000';
        }
      },
      format(percentage) {
        return percentage === 100 ? '满' : `${percentage}%`;
      },

      getProgressColor(percentage) {
        if (percentage == 0 || percentage < 20) {
          return '#00cc66'; // 绿色
        } else if (percentage >= 20 && percentage < 50) {
          return '#3399ff'; // 蓝色
        } else if (percentage >= 50 && percentage < 80) {
          return '#ff6666'; // 红色
        } else {
          return '#cc0000'; // 深红色
        }
      },
      getGroupFeatLength(){
        let count = 2;
        for(let i=0; i<this.featureData.length; i++) {
          if (this.featureData[i].discrete && this.featureData[i].missingRate<50) count+=1;
        }
        if(this.observeFeaure!={}) {
          return count-1;
        }else {
          return count;
          }
      },
      getObserveFeatLength(){
        var len = this.featureData.length;
        for(let i=0; i<this.featureData.length; i++){
          if(this.featureData[i].missingRate>=50) len -=1 ;
        }
        if(this.groupFeature!={}) len=-1;
        return len;
      },
      handleCheckboxChangeGroup(feat){
         this.$emit("sendFeatueData",this.featureData);
        if(feat.cheack) { // 其他都设置为非选中状态
          this.groupFeature = feat;
          // 发送给父组件
          this.$emit("send_group_feature",feat);
          for(let i=0; i<this.featureData.length; i++){
            if(this.featureData[i]!=feat && this.featureData[i]!=this.observeFeaure) this.featureData[i].cheack = false;
          }
        }else{
          this.groupFeature = {};
          this.$emit("send_group_feature",this.groupFeature);
        }
      },
      handleCheckboxChangeObserve(feat){
        this.$emit("sendFeatueData",this.featureData);
        if(feat.cheack){
          // 发送给父组件
          this.observeFeaure = feat;
          this.$emit("send_observe_feature",feat);
          for(var i=0; i<this.featureData.length; i++){
            if(this.featureData[i]!=this.groupFeature && this.featureData[i]!=feat) this.featureData[i].cheack = false;
          }
        }else{
          this.observeFeaure = {};
          this.$emit("send_observe_feature",this.observeFeaure);
        }
      },
      handleCheckboxChangeConsis(feat){
        this.$emit("sendFeatueData",this.featureData);
        // 选中了其他就取消选中
        this.checkedFeats = [];
        if(feat.cheack){
               this.checkedFeats.length = 0;
               this.checkedFeats.push(feat);
              for(let i=0; i<this.featureData.length; i++) {
                if(this.featureData[i].cheack==true && this.featureData[i]!=feat) this.featureData[i].cheack=false;
              }
         }else{
            this.checkedFeats.length = 0;
            // for(let i=0; i<this.featureData.length; i++) {
            //   this.featureData[i].cheack=false;
            // }
          }
         // 传递给父组件
        this.$emit("send_feat",this.checkedFeats)
      },
      countVisibleFeatures(val) {
        return this.featureData.filter(feat => feat.featureDataType == val).length;
      },
      handleCheckboxChange(feat){
        // 发送给父组件
        this.$emit("sendFeatueData",this.featureData);
       if(this.isDescribe==false){ //  缺失值补齐
          if(this.checkedFeats.includes(feat)){
            if(!feat.cheack) { // 非选中状态
              this.checkedFeats = this.checkedFeats.filter(item => item !== feat);
            }
          }else{  // 不包含
            if(feat.cheack) { // 选中状态
              this.checkedFeats.push(feat);
            }
          }
        }else{ // 描述性分析  描述性分析只能选择一个复选框
            if(feat.cheack){
              console.log("选中")
               this.checkedFeats = [feat];
              for(let i=0; i<this.featureData.length; i++) {
                if(this.featureData[i]!=feat && this.featureData[i].cheack == true) {
                  this.featureData[i].cheack=false;
                }
              }
            }else{
              console.log("取消")
              this.checkedFeats = [];
              // for(let i=0; i<this.featureData.length; i++) {
              //   this.featureData[i].cheack=false;
              // }
            }
        }
        // 传递给父组件
        this.$emit("send_feat",this.checkedFeats)
      },
      getIndicatorsFromBackEnd(types){
        console.log("tableName  "+this.tableName)
        getIndicators("/api/getIndicators",types, this.tableName).then(response=>{
          console.log("features:",response.data)
          this.featureData = response.data;
          // 给父组件传递参数
          this.$emit("send_indicators",this.featureData)
        }).catch(error=>{
        })
      },
      handleCheck(data,node){
        this.selectedNode.length = 0;
        this.defaultCheckedKeys = [];
        for(let i=0; i<node.checkedNodes.length; i++){
          this.selectedNode.push(node.checkedNodes[i].label);
          this.defaultCheckedKeys.push(node.checkedNodes[i].id)
        }
        // 将选中的树节点传递给父节点
        this.$emit("sendTreeNode",this.defaultCheckedKeys)
        this.getIndicatorsFromBackEnd(this.selectedNode.join(","));
      },
      getIndicatorCategory(){
        getRequest("/api/indicatorCategory").then(response=>{
          this.treeData = response.data;
        })
      }
    },

    mounted(){
    }

})

</script>
<style lang="less">
// .title{
//   margin-left: 0px;
//   margin-bottom: 0px;
//   font-size: 15px; /* 修改字体大小 */
// }

.mainCharacter {
    display: flex;
    width: 100%;
    border-top: 1px solid black;
    margin-top: 20px;
    height: 750px;
}
.top{
  front-size: 20px;
  margin-top: 0px;
}
.contain {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
}
 .contain1 {
    display: flex;
    width: 100%;
    flex-direction: row; /* 按列排版 */
    height: calc(29% - 20px);/* 每个容器宽度为父容器的1/3，减去间距 */
    padding: 10px;
    flex-wrap: wrap; /* 每行换行 */
    border-radius: 3px;
    border-left: 2px solid #e6e6e6;
    border-right: 2px solid #e6e6e6;
    border-top: 2px solid #e6e6e6;
    border-bottom: 2px solid #e6e6e6;
    overflow-y: auto;
  }
   .contain2 {
    display: flex;
     width: 100%;
    flex-direction: row; /* 按列排版 */
    height: calc(29% - 20px); /* 每个容器宽度为父容器的1/3，减去间距 */
    padding: 10px;
    flex-wrap: wrap; /* 每行换行 */
    border-radius: 3px;
    border-left: 2px solid #e6e6e6;
    border-right: 2px solid #e6e6e6;
    border-top: 2px solid #e6e6e6;
    border-bottom: 2px solid #e6e6e6;
    overflow-y: auto;
  }
   .contain3 {
    display: flex;
    width: 100%;
    flex-direction: row; /* 按列排版 */
    height: calc(29% - 20px);; /* 每个容器宽度为父容器的1/3，减去间距 */
    padding: 10px;
    overflow-y: auto;
    flex-wrap: wrap; /* 每行换行 */
    border-radius: 3px;
    border-left: 2px solid #e6e6e6;
    border-right: 2px solid #e6e6e6;
    border-top: 2px solid #e6e6e6;
    border-bottom: 2px solid #e6e6e6;
    overflow-y: auto;
  }

  .contain4 {
    display: flex;
    width: 100%;
    flex-direction: row; /* 按列排版 */
    height: calc(40% - 20px);; /* 每个容器宽度为父容器的1/3，减去间距 */
    overflow-y: auto;
    flex-wrap: wrap; /* 每行换行 */
    padding: 20px;
    border-radius: 3px;
    border-left: 2px solid #e6e6e6;
    border-right: 2px solid #e6e6e6;
    border-top: 2px solid #e6e6e6;
    border-bottom: 2px solid #e6e6e6;
  }
  .contain5 {
    display: flex;
    width: 100%;
    flex-direction: row; /* 按列排版 */
    height: calc(40% - 20px);; /* 每个容器宽度为父容器的1/3，减去间距 */
    // margin-top: 15px;
    margin-bottom: 5px;
    overflow-y: auto;
    flex-wrap: wrap; /* 每行换行 */
    border-radius: 3px;
    border-left: 2px solid #e6e6e6;
    border-right: 2px solid #e6e6e6;
    border-top: 2px solid #e6e6e6;
    border-bottom: 2px solid #e6e6e6;
    padding: 20px;
  }

  .contain6{
    display: flex;
    width: 90%;
    flex-direction: row;
    margin-top: 30px;
    margin-bottom: 5px;
    height: 70%;
    overflow-y: auto;
    flex-wrap: wrap;
    border: #0066cc 2px solid;
    padding: 20px;
    overflow-y: auto;
  }

.step{
    width: 100%;
    text-align: center;
}
.left_sidebar {
    height: 700px;
    width: 15%;
    padding: 5x;
    margin-top: 20px;
    border-radius: 3px;
    border-left: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
    border-bottom: none;
}
.right{
    width: 85%;
    display: flex;
    flex-direction: column;
    // box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    height: 720px;
}


.info {
  margin: 0; /* 移除默认的外边距 */
  height: 30px;
  margin-left: 100px;
  margin-right: 100px;
  display: flex;
  // background-color: #cbc8c8;
}

.selectClass{
    margin-top: 0px;
    margin-left: 100px;
    width: 1300px;
    height: 800px;
}
.selectClassSingle{
    margin-top: 10px;
    margin-left: 100px;
    width: 1300px;
    height: 800px;
}
.consistencyAnalyze{
    margin-top: 10px;
    margin-left: 100px;
    width: 1300px;
    height: 800px;
}
.block {
    flex: 20%; /* 每个块占据1/6的行宽 */
    height: 70px;
    align-items: center; 
}
.block2 {
    flex: 16.66%; /* 每个块占据1/6的行宽 */
    height: 70px;
    align-items: center; 
}
.checkbox-font-size .el-checkbox__label {
    font-family: "宋体", SimSun; /* 设置字体为宋体 */
    font-size: 20px; /* 设置您希望的字体大小 */
    font-weight: bold; /* 加粗字体 */
}



.table{
  // display: flex;
  margin-top: 50px;
  width: 1400px;
}


.feature {
  display: block; 
  height: auto;
  width: 1400px;
  margin-left: 20px;
}
.checkbox-font-size .el-checkbox__inner {
  border-color: #0066cc; /* 设置边框颜色 */
  border-width: 2px; /* 增加边框宽度 */
}


.progress-green {
  background-color: #00cc66; /* 绿色 */
}

.progress-blue {
  background-color: #3399ff; /* 蓝色 */
}

.progress-red {
  background-color: #ff6666; /* 红色 */
}

.progress-dark-red {
  background-color: #cc0000; /* 深红色 */
}



</style>