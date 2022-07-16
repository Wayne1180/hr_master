<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置内容 -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧内容 -->
            <el-row style="height: 60px">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showDialog = true"
                >新增角色</el-button
              >
              <!-- 给表格绑定数据 -->
            </el-row>
            <el-table border="" :data="list">
              <el-table-column
                label="序号"
                width="120"
                align="center"
                type="index"
              >
              </el-table-column>
              <el-table-column
                label="名称"
                width="240"
                prop="name"
                align="center"
              >
              </el-table-column>
              <el-table-column label="描述" prop="description" align="center">
              </el-table-column>
              <el-table-column label="操作" align="center">
                <!-- 作用域插槽 -->
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 放置分页组件 -->
            <el-row
              type="flex"
              justify="center"
              style="height: 60px"
              align="middle"
            >
              <el-pagination
                :page-size="page.pagesize"
                :current-page="page.page"
                layout="prev, pager, next"
                :total="page.total"
                @current-change="changePage"
              >
              </el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            >
            </el-alert>
            <!-- 右侧内容 -->
            <!-- 并不是所有的表单都需要model rules -->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="企业名称">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="formData.name"
                ></el-input>
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="formData.companyAddress"
                ></el-input>
              </el-form-item>
              <el-form-item label="电话">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="formData.companyPhone"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  style="width: 400px"
                  disabled
                  v-model="formData.mailbox"
                ></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  style="width: 400px"
                  disabled
                  type="textarea"
                  :rows="3"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组件 -->
    <el-dialog title="编辑角色" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        label-width="120px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center" slot="footer">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 放置一个弹层 -->
    <el-dialog
      title="分配权限"
      :visible.sync="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 权限是一棵树 -->
      <!-- id作为唯一标识 -->
      <el-tree
        :data="permData"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        node-key="id"
        :default-checked-keys="selectCheck"
        ref="permTree"
      >
      </el-tree>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnPermCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnPermOK"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqRoleList,
  reqCompanyInfo,
  reqDeleteRole,
  reqRoleDetail,
  reqUpdateRole,
  reqAddRole,
  reqAssignPerm,
} from "@/api/setting";
import { reqPermissionList } from "@/api/permission";
import { tranListToTreeData } from "@/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      list: [], //承接数组
      page: {
        //放置页码及相关数据
        page: 1,
        pagesize: 5,
        total: 0, //记录默认总数
      },
      formData: {
        //公司信息
      },
      showDialog: false, //控制弹层显示
      showPermDialog: false, //控制分配权限弹层的显示或者隐藏
      roleForm: {
        name: "",
        description: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "blur",
          },
        ],
      },
      permData: [], //接受权限数据
      defaultProps: {
        label: "name",
      }, //定义显示字段的名称  和 子属性的字段名称
      rowId: null, //用来记录当前分配权限的id
      selectCheck: [], //用来记录当前的权限点的标识
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  created() {
    this.getRoleList();
    this.getCompanyInfo();
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await reqRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    changePage(newPage) {
      //newPage是当前点击的页码
      this.page.page = newPage; //将当前页码赋值给最新的页码
      this.getRoleList();
    },
    async getCompanyInfo() {
      this.formData = await reqCompanyInfo(this.companyId); //赋值给formData
    },
    async deleteRole(id) {
      //提示
      try {
        await this.$confirm("确认删除该角色吗");
        //只有点击了确定才能进入到下方
        await reqDeleteRole(id); //调用删除接口
        this.getRoleList(); //重新加载数据
        this.$message.success("删除角色成功");
      } catch (error) {
        console.log(error);
      }
    },
    async editRole(id) {
      this.roleForm = await reqRoleDetail(id); //实现数据的回写
      this.showDialog = true; //显示弹层
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate((isOK) => {});
        //只有校验通过的情况下，才会执行await的下方内容
        if (this.roleForm.id) {
          await reqUpdateRole(this.roleForm);
        } else {
          //新增业务
          await reqAddRole(this.roleForm);
        }

        this.getRoleList();
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (error) {
        alert("校验失败");
      }
    },
    btnCancel() {
      this.roleForm = {
        name: "",
        description: "",
      };
      //移除校验规则
      this.$refs.roleForm.resetFields();
      this.showDialog = false;
    },
    //弹出层
    //获取权限点数据 在点击的时候调用  获取权限点数据
    async assignPerm(id) {
      this.permData = tranListToTreeData(await reqPermissionList(), "0"); //转化list到一个树形数据
      //id先记下来
      this.rowId = id;
      //应该去获取这个id的权限点
      const { permIds } = await reqRoleDetail(id); //permIds
      this.selectCheck = permIds; //将当前角色所拥有的权限id赋值
      this.showPermDialog = true;
    },
    async btnPermOK() {
      //调用el-tree方法

      await reqAssignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId,
      });
      this.$message.success("分配权限成功");
      this.showPermDialog = false;
    },
    btnPermCancel() {
      this.selectCheck = []; //重置数据
      this.showPermDialog = false;
    },
  },
};
</script>

<style>
</style>