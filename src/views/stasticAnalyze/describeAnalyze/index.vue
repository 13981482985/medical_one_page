<template>
  <div>
    <el-container>
      <div class="outcontainer">
        <datasetChoose
          v-if="active == 1"
          :active="active"
          :type="3"
          class="des_datasetChoose"
          @send_data="handleDataFromChild"
          :showDataManageStep="(showDataManageStep = true)"
        ></datasetChoose>
        <characterChoose
          v-if="active == 2"
          :active="active"
          :type="2"
          :step="2"
          :label="label"
          :curentAnalyzeStep="1"
          @send_feat="getCheackedFeats"
          :describeAna="true"
           @sendTreeNode="getSelectTreeNode" :selectTreeNode="selectTreeNode" @sendFeatueData="getFeatureData" :featureDataFromParent="featureDataFromParent"
        ></characterChoose>
        <describeOutcome
          v-if="active == 3"
          :active="active"
          :label="label"
          :checkedFeats="checkedFeats"
          ref="childComponentRef"
        ></describeOutcome>
        <div class="stepbutton">
          <el-button size="small" v-if="active != 1" @click="stepBack(active)"
            >上一步</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-if="active != 3"
            @click="stepNext(active)"
            >下一步</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-if="active == 3"
            @click="exportContent()"
            >导出</el-button
          >
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
import characterChoose from "@/components/characterChoose/index.vue";
import datasetChoose from "@/components/datasetChoose/dataManage.vue";
import describeOutcome from "@/views/stasticAnalyze/describeAnalyze/outcome.vue";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
/*描述性统计分析页面*/
export default {
  name: "outcome",
  prop: [],
  components: {
    characterChoose,
    datasetChoose,
    describeOutcome,
  },
  data() {
    return {
      featureDataFromParent: [],
      selectTreeNode: [],
      label: "",
      active: 1,
      checkedFeats: [],
    };
  },
  methods: {
    open3(msg) {
        this.$message({
          message: msg,
          type: 'warning'
        });
    },
     getFeatureData(data){
      this.featureDataFromParent = data;
    },
    getSelectTreeNode(data){
      console.log("选中的树节点：",data)
      this.selectTreeNode = data;
    },
    getCheackedFeats(data) {
      this.checkedFeats = data;
      console.log("aaa收到子组件传来的值");
      console.log(this.checkedFeats);
    },
    handleDataFromChild(label) {
      console.log("收到参数:", label);
      this.label = label;
    },
    stepBack(active) {
      this.active--;
      if(active === 2) {
        // 将 this.selectTreeNode 传递给子组件 characterChoose
        this.$refs.characterChoose.selectTreeNode = this.selectTreeNode;
        this.$refs.characterChoose.featureDataFromParent = this.featureDataFromParent;
      }
    },
    stepNext(active) {
      if(this.active == 2 && (this.checkedFeats==null || this.checkedFeats.length==0)){
        this.open3("请选择需要分析的指标！")
      }else if(this.active == 2 && (this.checkedFeats[0].missRate>30)){
        this.open3("数据异常，无法分析！")
      }else{
        this.active++;
      }
    },
    async exportContent() {
      try {
        const divToCapture =
          this.$refs.childComponentRef.$el.querySelector(".outcome");
        const canvas = await html2canvas(divToCapture);
        const imageUrl = canvas.toDataURL();
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = "image.png";
        link.click();
      } catch (error) {
        console.error("Error capturing image:", error);
      }
    },

    downloadPDF() {
      try {
        const divToCapture =
          this.$refs.childComponentRef.$el.querySelector(".outcome");
        const divContent = divToCapture.innerHTML;
        const doc = new jsPDF();
        doc.html(divContent, {
          callback: function (doc) {
            doc.save("document.pdf");
          },
          x: 10,
          y: 10,
        });
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    },
  },
  mounted() {},
};
</script>
<style lang="scss" scoped>
.outcontainer {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow-x: hidden;
  /* align-items: center; */
}
.stepcontainer {
  display: flex;
  width: 100%;
  height: 100%;
}
.stepbutton {
  margin-top: 10px;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.des_datasetChoose {
  ::v-deep .right_table {
    width: 1350px;
    height:620px;
  }
  ::v-deep .left_tree {
    height: 620px;
  }
}
</style>