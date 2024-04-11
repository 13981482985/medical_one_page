<template>
  <div class="main">
    <div class="left_tree">
      <el-tree
        ref="tree"
        :data="treeData"
        :show-checkbox="false"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        @node-click="changeData"
      >
      </el-tree>
      <el-dialog title="提示" :visible.sync="dialogDiseaseVisible" width="30%">
        <span>
          请输入新病种名称：<el-input
            placeholder="请输入内容"
            v-model="diseaseName"
            class="nameInput"
          ></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanInput()">取 消</el-button>
          <el-button type="primary" @click="() => append()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="right">
      <!--==========================     头部按钮     ==============================================================-->
      <div id="top_buttons">
        <div id="task_leader">
          <span>任务负责人：</span>
          <el-select v-model="leader" placeholder="请选择">
            <el-option
              v-for="item in leaderList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </div>
        <el-button @click="clearFilter">清除</el-button>
        <!-- <el-button type="success">新建任务</el-button> -->
      </div>

      <!--===============================    卡片组     ==============================================================-->
      <div class="cardGroup">
        <el-card
          class="taskCard"
          v-for="item in taskList"
          :key="item.id"
          shadow="always"
          v-show="
            !(disease || leader) ||
            (disease == item.disease && !leader) ||
            (leader == item.leader && !disease) ||
            (disease == item.disease && leader == item.leader)
          "
        >
          <div class="cardInfo">
            <div><span class="ttl">任务名称：</span>{{ item.taskname }}</div>
            <div><span class="ttl">负责人：</span>{{ item.leader }}</div>
            <div><span class="ttl">所属疾病：</span>{{ item.disease }}</div>
            <div><span class="ttl">使用模型：</span>{{ item.model }}</div>
            <div><span class="ttl">数据表：</span>{{ item.dataset }}</div>
            <div><span class="ttl">创建时间：</span>{{ item.createtime }}</div>
          </div>
          <div class="editButton">
            <el-button
              size="mini"
              type="primary"
              @click="handleCheck(item)"
              style="margin-right: 20px"
              >查看</el-button
            >
            <el-popconfirm
              title="删除后无法恢复"
              icon="el-icon-warning"
              icon-color="red"
              @confirm="handleDelete(item)"
            >
              <el-button slot="reference" size="mini" type="danger"
                >删除</el-button
              >
            </el-popconfirm>
          </div>
        </el-card>
      </div>

      <el-dialog
        :title="result.taskName"
        :visible.sync="resultDialogShow"
        v-if="resultDialogShow"
        width="32%"
        center
      >
        <div class="taskInfoBox principal">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">任务负责人：</span>
          <span>{{ result.leader }}</span>
        </div>
        <div
          class="taskInfoBox participants"
          v-if="result.participant !== null"
        >
          <span class="lineStyle">▍</span
          ><span class="featureTitle">参与人：</span>
          <span>{{ result.participant }}</span>
        </div>
        <div class="taskInfoBox disease">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">研究病种：</span>
          <span>{{ result.disease }}</span>
        </div>
        <div class="taskInfoBox dataset">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用数据：</span>
          <span>{{ result.dataset }}</span>
        </div>
        <div class="taskInfoBox algorithm">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用算法：</span>
          <span>{{ result.model }}</span>
        </div>
        <div class="taskInfoBox algorithmValue">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">算法参数：</span>
          <span v-if="result.parameters != null && result.parametersv != null"
            >本算法没有参数</span
          >
          <div>
            <div v-for="(item, index) in result.parameters" :key="index">
              <span
                >{{ result.parameters[index] }}：{{
                  result.parametersv[index]
                }}</span
              >
            </div>
          </div>
        </div>
        <div class="taskInfoBox use_features">
          <span class="lineStyle">▍</span
          ><span class="featureTitle">所用特征：</span>
          <span>{{ result.feature }}</span>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button @click="resultDialogShow = false">关 闭</el-button>
          <el-button @click="getTaskDetail()">详细信息</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRequest } from "@/utils/api";
// import { state } from "@antv/g2plot/lib/adaptor/common";
// import { mapGetters, mapMutations, mapState, mapActions } from "vuex";

export default {
  computed: {
    // ...mapState(["taskList","treeData"]),
    // ...mapGetters(["taskLeaderList", "taskDiseaseList"]),
  },
  created() {
    this.getTaskAllList();
    this.getTreeData();
  },
  data() {
    return {
      curTaskInfo:{},
      look: false,
      disease: "",
      leader: "",
      resultDialogShow: false,
      result: {},
      taskList: [],
      treeData: [],
      leaderList: [],
      dialogDiseaseVisible: false,
      diseaseName: "",
    };
  },
  methods: {
    getTaskDetail(){
        // 判断任务类型然后给这些任务结果页面添加参数
        if(this.curTaskInfo.taskname==='缺失值补齐'){
          let missCompleteMethods = []; // 缺失值补齐的参数
          let features = this.curTaskInfo.feature.split(","); // 哪些字段参与填充
          let missCompleteMehtod = this.curTaskInfo.model.split(","); // 字段填充方法
          for(let i=0; i<features.length; i++){
            missCompleteMethods.push({"index": features[i], "missCompleteMethod": missCompleteMehtod[i]})
          }
          let paramData = {"missCompleteMethods":missCompleteMethods, "label": this.curTaskInfo.dataset} // 最终传递参数
          this.$router.push({ name: 'missingoutcome', params: paramData});
        }
        if(this.curTaskInfo.taskname==='单因素分析'){
          console.log('this.curTaskInfo.taskname',this.curTaskInfo)
          let features = this.curTaskInfo.feature.split(",");
          let paramData = {"features": features,"label": this.curTaskInfo.dataset}
          this.$router.push({ name: 'singleOutcome', params: paramData});
        }
        if(this.curTaskInfo.taskname==='描述性分析'){
          let paramData = {"label":this.curTaskInfo.dataset, "feature":this.curTaskInfo.feature}
          this.$router.push({ name: 'describeOutcome', params: paramData});
        }
        if(this.curTaskInfo.taskname==='一致性验证') {
          let paramData = {"label": this.curTaskInfo.dataset, "featureName":this.curTaskInfo.feature}
          this.$router.push({ name: 'consistencyOutcome', params: paramData});
        }
        if(this.curTaskInfo.taskname==='病人画像') {
          let paramData = {"label": this.curTaskInfo.dataset, "select":this.curTaskInfo.result}
          this.$router.push({ name: 'visualization', params: paramData});
        }
        if(this.curTaskInfo.taskname==='疾病特征表征') {
          let paramData = {"tableName": this.curTaskInfo.dataset, "aiName":this.curTaskInfo.model, "runParams": this.curTaskInfo.feature}
          this.$router.push({ name: 'represent', params: paramData});
        }
    },
    getTreeData() {
      getRequest("/api/disease/all").then((res) => {
        if (res.code == 200) {
          this.treeData = res.data;
        } else {
          this.$message.error("获取树形结构数据失败");
        }
      });
    },
    getTaskAllList() {
      var that = this;
      getRequest("/Task/all")
        .then((res) => {

          that.taskList = res.data;
        })
        .catch((err) => {
          console.log("任务列表获取错误，请联系管理员。");
          console.log(err);
        });
      getRequest("/Task/getLeaderList")
        .then((res) => {
          this.leaderList = res.data;
        })
        .catch((err) => {
          console.log("任务列表获取错误，请联系管理员。");
          console.log(err);
        });
    },
    handleCheck(row) {
      console.log("当前任务：",row)
      this.curTaskInfo = row;
      getRequest(`Task/getOne/${row.id}`).then((res) => {
        if (res.code == 200) {
          this.result = res.data;
          console.log(JSON.stringify(this.result));
          if (
            this.result.parameters != null &&
            this.result.parametersv != null
          ) {
            this.result.parameters = this.result.parameters.split(",");
            this.result.parametersv = this.result.parametersv.split(",");
          }
          this.resultDialogShow = true;
        } else {
          this.$message.error("查看任务失败");
        }
      });
    },
    handleDelete(row) {
      getRequest(`Task/delete/${row.id}`).then((res) => {
        if (res.code == 200) {
          this.$message.success("删除任务成功");
          // this.SetTaskList(res.data);
          this.getTaskAllList();
        } else {
          this.$message.error("删除任务失败");
        }
      });
    },
    clearFilter() {
      this.disease = "";
      this.leader = "";
    },
    changeData(node) {
      this.disease = node.label;
    },
  },
};
</script>
<style scoped>
.main {
  display: grid;
  grid-template-columns: 12% 85%;
  width: 100%;
}

.left_tree {
  display: inline-block;
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
  border-bottom: none;
}
.right {
  float: right;
  width: 100%;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

#top_buttons {
  margin-left: 3%;
  margin-bottom: 20px;
}

#top_buttons > * {
  display: inline-block;
}
#task_disease {
  margin-right: 40px;
}
#task_leader {
  margin-right: 20px;
}
#table {
  margin-top: 10px;
}
.lineStyle {
  color: rgb(100, 172, 231);
}
.featureTitle {
  font-weight: 800;
}
.cardGroup {
  width: 100%;
  margin-left: 3%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 400px);
  grid-row-gap: 40px;
  grid-column-gap: 60px;
}

.cardInfo {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 定义两列，每列占用相等的空间 */
  grid-template-rows: auto auto auto auto; /* 定义四行，高度根据内容自适应 */
  gap: 10px; /* 定义网格行和列之间的间隙 */
}

.cardInfo > div:nth-child(5), /* 第五个子元素（数据表） */
    .cardInfo > div:nth-child(6) /* 第六个子元素（创建时间） */ {
  grid-column: 1 / span 2; /* 这两个元素跨越两列 */
}

.ttl {
  font-weight: 600;
  color: #071135;
}

.editButton {
  margin-left: 30%;
  margin-top: 5%;
}

.icon {
  justify-self: end;
}
.taskCard {
  width: 100%;
}
</style>
