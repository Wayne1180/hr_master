<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCancel">
    <!-- 表单 -->
    <el-form
      label-width="120px"
      :model="formData"
      :rules="rules"
      ref="addEmployee"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          style="width: 50%"
          placeholder="请输入姓名"
          v-model="formData.username"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          style="width: 50%"
          placeholder="请输入手机号"
          v-model="formData.mobile"
        ></el-input>
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择入职时间"
          v-model="formData.timeOfEntry"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          style="width: 50%"
          placeholder="请选择"
          v-model="formData.formOfEmployment"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          style="width: 50%"
          placeholder="请输入工号"
          v-model="formData.workNumber"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          style="width: 50%"
          placeholder="请选择部门"
          v-model="formData.departmentName"
          @focus="getDepartments"
        ></el-input>
        <!-- 放置一个树形组件 -->
        <el-tree
          v-loading="loading"
          v-if="showTree"
          :data="treeData"
          :props="{ label: 'name' }"
          :default-expoand-all="true"
          @node-click="selectNode"
        >
        </el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          style="width: 50%"
          placeholder="请选择转正时间"
          v-model="formData.correctionTime"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <el-row type="flex" justify="center" slot="footer">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { reqDepartments } from "@/api/departments";
import { tranListToTreeData } from "@/utils/";
import EmployeeEnum from "@/api/constant/employees";
import { reqAddEmployee } from "@/api/employees";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      //定义表单数据
      EmployeeEnum,
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
      treeData: [], //定义一个数组来接收树形结构
      showTree: false, //默认不显示树形组件
      loading: false,
    };
  },
  methods: {
    async getDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await reqDepartments();
      //depts是一个数组，他需要转化成树形结构 才可以被el-tree显示
      this.treeData = tranListToTreeData(depts, "");
      this.loading = false;
    },
    selectNode(node) {
      this.formData.departmentName = node.name;
      this.showTree = false;
    },
    async btnOK() {
      //校验表单
      try {
        await this.$refs.addEmployee.validate();
        //校验成功
        await reqAddEmployee(this.formData); //调用新增接口
        //通知父组件 更新数据
        this.$parent.getEmployeeList(); //父组件的实例 调用父组件的更新方法
        this.$parent.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    btnCancel() {
      //
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
      this.$refs.addEmployee.resetFields();
      this.$emit("update:showDialog", false);
      //update：props 名称 这么写的话 可以在父组件 直接用sync修饰符处理
    },
  },
};
</script>

<style>
</style>