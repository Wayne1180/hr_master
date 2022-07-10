<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容 -->
      <el-card class="tree-card">
        <!-- 放置结构内容 -->
        <TreeTools :treeNode="company" :isRoot="true" @addDepts="addDepts" />
        <!-- 放置一个el-tree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少个节点就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据 data 每个节点的数据对象 -->
          <TreeTools
            slot-scope="{ data }"
            :treeNode="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>

    <!-- 放置新增弹层组件 -->
    <add-dept
      ref="addDept"
      :showDialog.sync="showDialog"
      :treeNode="node"
      @addDepts="getDepartments"
    ></add-dept>
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue";
import AddDept from "./components/add-dept.vue";
import { reqDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils";
export default {
  components: {
    TreeTools,
    AddDept,
  },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: "name",
        children: "children",
      },
      company: {},
      showDialog: false, //默认不显示弹层
      node: null, //记录当前点击的node节点
    };
  },
  created() {
    this.getDepartments(); //调用自身的方法
  },
  methods: {
    async getDepartments() {
      let result = await reqDepartments();
      this.company = {
        name: "韦恩科技股份有限公司",
        manager: "负责人",
        id: "",
      };
      this.departs = tranListToTreeData(result.depts, ""); //需要将其转化为树形结构
    },
    //监听tree-tools中触发的点击添加子部门的事件
    //node是我们点击的部门
    addDepts(node) {
      this.showDialog = true;
      this.node = node;
    },
    editDepts(node) {
      this.showDialog = true;
      this.node = node;
      //应该在这里调用获取部门详情的方法
      this.$refs.addDept.getDepartDetail(node.id);
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>