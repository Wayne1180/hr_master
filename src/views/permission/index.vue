<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <PageTools>
        <el-button
          type="primary"
          slot="after"
          size="small"
          @click="addPermission(1, '0')"
          >添加权限</el-button
        >
      </PageTools>
      <!-- //指定id为唯一属性的标识 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" align="center" prop="name">
        </el-table-column>
        <el-table-column label="标识" align="center" prop="code">
        </el-table-column>
        <el-table-column label="描述" align="center" prop="description">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{ row }">
            <!-- 添加按钮只在访问权的层级显示 当type==1时才显示添加按钮 -->
            <el-button
              v-if="row.type == 1"
              type="text"
              @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 新增编辑弹层 -->
    <el-dialog :visible="showDialog" :title="showText" @close="btnCancel">
      <!-- 表单 -->
      <el-form
        label-width="120px"
        :model="formData"
        :rules="rules"
        ref="permForm"
      >
        <el-form-item label="名称" prop="name">
          <el-input style="width: 90%" v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input style="width: 90%" v-model="formData.code"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            style="width: 90%"
            v-model="formData.description"
          ></el-input>
        </el-form-item>
        <!-- 当值为1时 激活 当值为0时 不激活 -->
        <el-form-item label="开启">
          <el-switch
            style="width: 90%"
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqPermissionList,
  reqUpdatePermission,
  delPermission,
  reqAddPermission,
  reqPermissionDetail,
} from "@/api/permission";
import { tranListToTreeData } from "@/utils";
export default {
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: "", //名称
        code: "", //标识
        description: "", //描述
        type: "", //类型 该类型不需要显示 因为点击添加的时候已经知道类型了
        pid: "", //因为做的是树，需要知道添加到哪个节点下了
        enVisible: "0", //开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async getPerissionList() {
      //将数据转化成带children的
      this.list = tranListToTreeData(await reqPermissionList(), "0");
    },
    delPermission(id) {
      this.$confirm("确认删除该权限点吗")
        .then(() => {
          return delPermission(id);
        })
        .then(() => {
          this.$message.success("删除成功");
          //重新拉取数据
          this.getPerissionList();
        });
    },
    addPermission(type, pid) {
      //访问权的type==1  按钮操作权的type==2
      //pid表示当前数据的父节点的标识
      //记录当前添加的类型和父标识
      this.formData.type = type;
      this.formData.pid = pid;

      this.showDialog = true;
    },
    btnOK() {
      this.$refs.permForm
        .validate()
        .then(() => {
          //校验成功
          if (this.formData.id) {
            //认为是编辑
            return reqUpdatePermission(this.formData);
          }
          return reqAddPermission(this.formData); //新增接口
        })
        .then(() => {
          //添加成功
          this.$message.success("操作成功");
          this.getPerissionList();
          this.showDialog = false;
        });
    },
    btnCancel() {
      this.formData = {
        //重置数据
        name: "",
        code: "",
        desctiption: "",
        type: "",
        pid: "",
        enVisible: "0",
      };
      //移除校验
      this.$refs.permForm.resetFields(); //移除校验
      this.showDialog = false;
    },
    async editPermission(id) {
      this.formData = await reqPermissionDetail(id);
      this.showDialog = true;
    },
  },
  computed: {
    showText() {
      return this.formData.id ? "编辑权限" : "新增权限";
    },
  },
  created() {
    this.getPerissionList();
  },
};
</script>

<style>
</style>