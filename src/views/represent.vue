<template>
  <div>
    <el-header>
      <div v-if="head1">
        <h3>任务设置</h3>
        <el-divider></el-divider>
      </div>
      <div>
        <el-tabs v-if="head2" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="原始数据统计分析" name="first"
            ><oldData
              v-if="oldShow"
              :dataAll="dataAll"
              :dataName="dataSelectForm.formData.selectedData"
              :statisData="statisData"
              :dataColumns="dataInOptions"
            >
            </oldData>
            <div class="button1" v-if="oldShow">
              <el-button size="small" @click="stepBack(active)" class="el-button--primary"
                >上一步</el-button
              >
            </div>
          </el-tab-pane>
          <el-tab-pane label="处理后数据统计分析" name="second"
            ><newData
              v-if="newShow"
              :dataChoose="dataChoose"
              :dataNew="dataNew"
              :dataNewColumns="dataNewColumns"
              :dataName="dataSelectForm.formData.selectedData"
              :columnName="columnSelectForm.formData.selectedData"
              :chartDatay="chartDatay"
            ></newData>
            <div class="button1" v-if="newShow">
              <el-button size="small" @click="stepBack(active)" class="el-button--primary"
                >上一步</el-button
              >
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-header>

    <el-container id="maintest">
      <div id="step" v-show="showStep">
        <el-steps :active="active" align-center>
          <el-step title="选择数据"></el-step>
          <el-step title="选择属性"></el-step>
          <el-step title="算法选择"></el-step>
        </el-steps>
      </div>
      <div id="stepcontain" v-show="showStep">
        <datasetChoose
          v-show="dataSelectForm.isShow"
          :showDataManageStep="(showDataManageStep = false)"
          @send_data="getTableName"
          class="represent_datasetChoose"
        ></datasetChoose>
        <div class="button1" v-show="dataSelectForm.isShow">
          <el-button size="small" type="primary" @click="submitForm(active)"
            >下一步</el-button
          >
        </div>
        <!--======================================     选择属性列表单      ======================================================-->
        <el-form
          class="form"
          :model="columnSelectForm.formData"
          :rules="columnSelectForm.rules"
          v-show="columnSelectForm.isShow"
          ref="columnSelectForm"
          label-position="top"
        >
          <el-form-item label="选择属性列" prop="selectedData">
            <el-checkbox-group
              v-model="columnSelectForm.formData.selectedData"
              size="medium"
              prop="selectedData"
            >
              <el-row :gutter="10">
                <h5 class="text">人口学指标</h5>

                <el-col
                  v-for="item in demoOptions"
                  :key="item.columnName"
                  :span="6"
                >
                  <div v-if="item.columnisR">
                    <el-checkbox
                      class="radio"
                      :label="item.columnName"
                      border
                      style="margin-top: 20px"
                      >{{ item.columnName }}</el-checkbox
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <h5 class="text" style="margin-top: 20px">行为学指标</h5>

                <el-col
                  v-for="item in sociolOptions"
                  :key="item.columnName"
                  :span="6"
                >
                  <div v-if="item.columnisX">
                    <el-checkbox
                      class="radio"
                      :label="item.columnName"
                      border
                      style="margin-top: 20px"
                      >{{ item.columnName }}</el-checkbox
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <h5 class="text" style="margin-top: 20px">生理指标</h5>

                <el-col
                  v-for="item in physioOptions"
                  :key="item.columnName"
                  :span="6"
                >
                  <div v-if="item.columnisS">
                    <el-checkbox
                      class="radio"
                      :label="item.columnName"
                      border
                      style="margin-top: 20px"
                      >{{ item.columnName }}</el-checkbox
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <h5 class="text" style="margin-top: 20px">其他指标</h5>
                <el-col
                  v-for="item in otherOptions"
                  :key="item.columnName"
                  :span="6"
                >
                  <div v-if="item.columnisO">
                    <el-checkbox
                      class="radio"
                      :label="item.columnName"
                      border
                      style="margin-top: 20px"
                      >{{ item.columnName }}</el-checkbox
                    >
                  </div>
                </el-col>
              </el-row>
            </el-checkbox-group>
          </el-form-item>
          <br />
          <div class="button1">
            <el-button size="small" @click="stepBack(active)">上一步</el-button>
            <el-button size="small" type="primary" @click="submitForm(active)"
              >下一步</el-button
            >
          </div>
        </el-form>
        <!--======================================     算法选择表单     =======================================================-->
        <el-form
          class="form"
          :model="algoForm.formData"
          :rules="algoForm.rules"
          v-show="algoForm.isShow"
          ref="algoForm"
          label-position="top"
        >
          <el-form-item label="选择算法模型" prop="algoName">
            <el-row :gutter="60">
              <h5 class="text">算法类别</h5>
              <br />
              <el-radio-group
                v-model="algoForm.formData.algoName"
                prop="selectedData"
              >
                <el-col
                  :span="8"
                  v-for="item in algoOptions1"
                  :key="item.algoName"
                >
                  <el-radio :label="item.algoName" border>{{
                    item.algoName
                  }}</el-radio>
                </el-col>
              </el-radio-group>
            </el-row>
            <br />
            <!-- <el-row :gutter="60">
              <h5 class="text">有监督类算法</h5>
              <br />
              <el-radio-group
                v-model="algoForm.formData.algoName"
                prop="selectedData"
              >
                <el-col
                  :span="8"
                  v-for="item in algoOptions2"
                  :key="item.algoName"
                >
                  <el-radio :label="item.algoName" border>{{
                    item.algoName
                  }}</el-radio>
                </el-col>
              </el-radio-group>
            </el-row>
            <br /> -->
            <!-- <el-row :gutter="60">
              <h5 class="text">深度学习算法</h5>
              <br />
              <el-radio-group
                v-model="algoForm.formData.algoName"
                prop="selectedData"
              >
                <el-col
                  :span="9"
                  v-for="item in algoOptions3"
                  :key="item.algoName"
                  style="marigin-right: 5px"
                >
                  <el-radio :label="item.algoName" border>{{
                    item.algoName
                  }}</el-radio>
                </el-col>
              </el-radio-group>
            </el-row> -->
          </el-form-item>
          <br />
          <div class="button1">
            <el-button size="small" @click="stepBack(active)">上一步</el-button>
            <el-button size="small" type="primary" @click="submitForm(active)"
              >完成</el-button
            >
          </div>
        </el-form>
      </div>
    </el-container>
  </div>
</template>
<script>
import { postRequest, getRequest } from "@/utils/api";
import knn from "@/components/algos/knn.vue";
import oldData from "@/components/outcomeShow/oldData.vue";
import newData from "@/components/outcomeShow/newData.vue";
import datasetChoose from "@/components/datasetChoose/dataManage.vue";
export default {
  components: {
    knn,
    oldData,
    newData,
    datasetChoose,
  },
  data() {
    return {
      taskInfoParam: null,
      dataPre: false,
      activeName: "first",
      head1: true,
      head2: false,
      showStep: true,
      oldShow: true,
      newShow: false,
      dataOptions: [],
      dataInOptions: [],
      dataNew: [],
      dataNewColumns: [],
      demoOptions: [],
      physioOptions: [],
      sociolOptions: [],
      otherOptions: [],

      algoOptions1: [
        {
          id: 1,
          algoName: "PCA(主成分分析)",
          algoType: "1",
        },
        {
          id: 2,
          algoName: "ICA(独立成分分析)",
          algoType: "1",
        },
        {
          id: 3,
          algoName: "因子分析",
          algoType: "1",
        },
      ],
      // algoOptions2: [
      //   {
      //     id: 4,
      //     algoName: "LDA(线性判别分析)",
      //     algoType: "2",
      //   },
      //   {
      //     id: 5,
      //     algoName: "稀疏表示学习",
      //     algoType: "2",
      //   },
      //   {
      //     id: 6,
      //     algoName: "神经网络",
      //     algoType: "2",
      //   },
      // ],
      // algoOptions3: [
      //   {
      //     id: 7,
      //     algoName: "CNN(卷积神经网络)",
      //     algoType: "3",
      //   },
      //   {
      //     id: 8,
      //     algoName: "RNN(循环神经网络)",
      //     algoType: "3",
      //   },
      // ],
      value1: [],
      value2: [],
      chartDatay: [],
      formArray: ["dataSelectForm", "columnSelectForm", "algoForm", "outcome"],
      active: 0,

      //数据选择-----------------------------------------------------------------------------------------------
      dataSelectForm: {
        isShow: true,
        formData: {
          selectedData: "",
        },
        rules: {
          selectedData: [
            { required: true, message: "请选择数据表", trigger: "blur" },
          ],
        },
      },
      //选择属性列-----------------------------------------------------------------------------------------------
      columnSelectForm: {
        isShow: false,
        formData: {
          selectedData: [],
        },
        rules: {
          selectedData: [
            { required: true, message: "请选择属性列", trigger: "blur" },
          ],
        },
      },

      //数据处理-----------------------------------------------------------------------------------------------
      algoForm: {
        isShow: false,
        formData: {
          algoName: "",
          params: [],
        },
        rules: {
          algoName: [
            { required: true, message: "请选择一个算法模型", trigger: "blur" },
          ],
        },
      },

      //模型算法-----------------------------------------------------------------------------------------------
      modelAlgoForm: {
        isShow: false,
        formData: {
          classifyMode: "0",
          regressMode: "0",
          predictMode: "0",
          clusterMode: "0",
        },
      },
      dataAll: [],
      dataChoose: [],
      // dataNew: [],
      statisData: [],
    };
  },
  created() {
    this.taskInfoParam = this.$route.params;
    if(this.taskInfoParam == null || Object.keys(this.taskInfoParam).length==0){
      this.getAllData();
    }else{
      this.dataSelectForm.isShow = false;
      this.columnSelectForm.isShow = false;
      this.algoForm.isShow = false;
      this.head2  = true;
      // this.oldShow = true;
      this.showStep  = false
      this.getAllData()
      this.submitForm(2)
    }
    
  },
  methods: {
    open3(msg) {
      this.$message({
        message: msg,
        type: "warning",
      });
    },
    getTableName(tableName) {
      console.log("表明", tableName);
      this.dataSelectForm.formData.selectedData = tableName;
    },
    submitForm(stepIndex) {
      let formName = this.formArray[stepIndex];
      this.active++;
      if (stepIndex < 2) {
        let nextFormName = this.formArray[++stepIndex];
        if (this.active == 1) {
          this[formName].isShow = false;
          this[nextFormName].isShow = true;
          let tableName = this.dataSelectForm.formData;
          getRequest("/feature/getAllFiled/" + tableName.selectedData).then(
            (response) => {
              this.demoOptions = [];
              this.physioOptions = [];
              this.sociolOptions = [];
              this.otherOptions = [];
              let data = response.data;
              console.log("data", data);
              let columnNametemp = Object.keys(data);
              for (let i = 0; i < columnNametemp.length; i++) {
                if (data[columnNametemp[i]] != null) {
                  const obj = {
                    columnName: data[columnNametemp[i]].featureName,
                  };
                  if (data[columnNametemp[i]].isDemography == true) {
                    // 人口学
                    console.log("人口学");
                    obj.columnisR = true;
                  } else {
                    obj.columnisR = false;
                  }
                  if (data[columnNametemp[i]].isSociology == true) {
                    // 社会学
                    console.log("社会学");
                    obj.columnisX = true;
                  } else {
                    obj.columnisX = false;
                  }
                  if (data[columnNametemp[i]].isPhysiological == true) {
                    // 生理指标
                    console.log("生理指标");
                    obj.columnisS = true;
                  } else {
                    obj.columnisS = false;
                  }
                  if (!obj.columnisR && !obj.columnisS && !obj.columnisX) {
                    // 其他
                    console.log("其他指标");
                    obj.columnisO = true;
                  } else {
                    obj.columnisO = false;
                  }

                  if (obj.columnisR == true) {
                    this.demoOptions.push(obj);
                  }

                  if (obj.columnisS == true) {
                    this.physioOptions.push(obj);
                  }

                  if (obj.columnisX == true) {
                    this.sociolOptions.push(obj);
                  }

                  if (obj.columnisO == true) {
                    this.otherOptions.push(obj);
                  }

                  this.dataInOptions.push(obj);
                }
              }
            }
          );
          getRequest(
            "/feature/getInfoByTableName?tableName=" +
              tableName.selectedData +
              "&page=" +
              1
          ).then((response) => {
            this.dataAll = response;
          });
          getRequest(
            "/feature/getStatisticaldData/" + tableName.selectedData
          ).then((response) => {
            console.log("测试.....");
            console.log(response);
            this.statisData = response.data;
          });
        }
        if (this.active == 2) {
          const page = 1;
          if (
            this.columnSelectForm.formData.selectedData == null ||
            this.columnSelectForm.formData.selectedData.length <=1
          ) {
            this.open3("选择的属性列必须为多选！"); // TODO 控制下一步跳转
            this.active--;
            return;
          } else {
            this[formName].isShow = false;
            this[nextFormName].isShow = true;
            getRequest(
              "/feature/getInfoBySelectedFiled?page=" +
                page +
                "&tableName=" +
                this.dataSelectForm.formData.selectedData +
                "&params=" +
                this.columnSelectForm.formData.selectedData
            ).then((response) => {
              this.dataChoose = response;
            });
          }
        }
      } else if (stepIndex == 2) {
        if(this.algoForm.formData.algoName==""){
          this.open3("请选择分析算法");
          this.active--;
          return;
        }
        let params = {};
        if(this.taskInfoParam == null || Object.keys(this.taskInfoParam).length == 0){
          params = {
            tableName: this.dataSelectForm.formData.selectedData, //模型选择的数据表表名
            runParams: this.columnSelectForm.formData.selectedData, //模型选择的属性列（数组）
            // modelAlgo: this.algoForm.formData.algoName, //模型选择的算法名
            aiName: "pca",
          };
        }else{
          params = {
            tableName: this.taskInfoParam.tableName, //模型选择的数据表表名
            runParams: this.taskInfoParam.runParams, //模型选择的属性列（数组）
            aiName: this.taskInfoParam.runParams,
          }
        }
        postRequest("feature/runAi", params)
          .then((response) => {
            for (let i in response.data[0]) {
              var num = parseInt(i) + 1;
              this.dataNewColumns.push("主成分" + num);
              this.dataNew["主成分" + num] = response.data[0][i];
            }
            for (let i in response.data[1]) {
              this.chartDatay.push(response.data[1][i]);
            }
            this.head1 = !this.head1;
            this.head2 = !this.head2;
            this.showStep = !this.showStep;
          })
          .catch((error) => {
            console.log(error);
            this.active--;
          });
      } 
      if(this.activeName=='first'){
               this.oldShow = true;
      }
        if(this.activeName=='second'){
               this.newShow = true;
      }
    },
    resetForm(stepIndex) {
      let formName = this.formArray[stepIndex];
      this.$refs[formName].resetFields();
    },
    stepBack(stepIndex) {
      // this.dataNewColumns = [];
      if (this.active - 1 >= 0) {
        if (this.active == 1) {
          this.dataInOptions = [];
        }
        let formName = this.formArray[stepIndex];
        if (formName == "outcome") {
          this.newShow = false;
          this.oldShow = false;
          this.head1 = !this.head1;
          this.head2 = !this.head2;
          this.showStep = !this.showStep;
        } else {
          this[formName].isShow = false;
        }
        this.active--;
        let preFormName = this.formArray[--stepIndex];
        this[preFormName].isShow = true;
      }
    },

    clearSample() {
      this.featureExtractForm.formData.sample = "";
    },
    getAllData() {
      this.dataPre = false;
      this.dataOptions.length = 0;
      var tempList = JSON.parse(this.$store.getters.getAllTableData);
      for (let i = 0; i < tempList.length; i++) {
        const obj = {
          tableName: tempList[i].tableName,
        };
        this.dataOptions.push(obj);
      }
      this.dataPre = true;
    },
    outputParams(value) {
      this.algoForm.formData.params = value;
    },
    handleClick(tab, event) {
      if (tab.$options.propsData.name == "first") {
        this.oldShow = true;
      } else if (tab.$options.propsData.name == "second") {
        this.newShow = true;
      }
      // this.newShow = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-form {
  /deep/.el-form-item__content {
    line-height: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.form {
  margin-left: 100px;
  // overflow-x: hidden;
}

#maintest {
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: baseline;
}

// #step {
//   // display: flex;
//   width: 80%;
//   position: absolute;
//   margin-top: 50px;
// }
#step {
  height: 100%;
  margin-top: 0px;
}
#stepcontain {
  // position: absolute;
  // top: 340px;
  // left: 30%;
  width: 100%;
  height: 100%;
  left: 15%;
  overflow-y: auto;
}
.represent_datasetChoose {
  ::v-deep .right_table {
    height: 630px;
  }
  ::v-deep .left_tree {
    height: 630px;
  }
}
.button1 {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.text {
  font-size: 14px;
}
// #step[data-v-b6bb290c] {
//     height: 100%;
//     margin-top: 0px;
// }
</style>