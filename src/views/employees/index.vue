<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <!-- 左侧显示总记录数 -->
        <template v-slot:before>
          <span slot="before">共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 -->
        <template v-slot:after>
          <el-button
            size="small"
            type="success"
            @click="$router.push('/import')"
            >Excel导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >Excel导出</el-button
          >
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </PageTools>
      <!-- 表格组件 -->
      <el-table v-loading="loading" :data="list">
        <el-table-column
          type="index"
          label="序号"
          sortable=""
        ></el-table-column>
        <el-table-column
          label="姓名"
          sortable=""
          prop="username"
        ></el-table-column>
        <el-table-column width="120px" label="头像" align="center">
          <!-- 插槽 -->
          <template v-slot="{ row }">
            <img
              @click="showQrCode(row.staffPhoto)"
              v-imagerror="require('@/assets/common/QQ.jpg')"
              :src="row.staffPhoto"
              alt=""
              style="
                border-radius: 50%;
                width: 100px;
                height: 100px;
                padding: 10px;
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          label="工号"
          sortable=""
          prop="wordNumber"
        ></el-table-column>
        <el-table-column
          label="聘用形式"
          sortable=""
          prop="formOfEmployment"
          :formatter="formatEmployment"
        ></el-table-column>
        <el-table-column
          label="部门"
          sortable=""
          prop="departmentName"
        ></el-table-column>
        <!-- 作用域插槽+过滤器 -->
        <el-table-column
          label="入职时间"
          sortable=""
          prop="timeOfEntry"
          align="center"
        >
          <template v-slot="{ row }">
            <!-- 将时间进行格式化 -->
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="账户状态"
          sortable=""
          prop="enableState"
          align="center"
        >
          <template v-slot="{ row }">
            <el-switch :value="row.enableState == 1"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button
            >
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)"
              >删除</el-button
            >
          </template></el-table-column
        >
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          @current-change="changePage"
        >
        </el-pagination>
      </el-row>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync修饰符是子组件去改变父组件数据的一个语法糖 -->
    <AddEmployee :showDialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas"></canvas>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { reqEmployeeList, reqDelEmployee } from "@/api/employees";
import EmployeeEnum from "@/api/constant/employees"; //引入员工的枚举对象
import AddEmployee from "./components/add-employee.vue";
import { formatDate } from "@/filters";
import QrCode from "qrcode";
export default {
  components: { AddEmployee },
  data() {
    return {
      list: [], //接收数组
      page: {
        page: 1,
        size: 10,
        total: 0, //分页的总数
      },
      loading: false, //显示遮罩层
      showDialog: false, //默认是关闭的弹层
      showCodeDialog: false, //显示二维码弹层
    };
  },
  methods: {
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await reqEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      this.loading = false;
    },
    //newPage是最新的页码
    changePage(newPage) {
      this.page.page = newPage; //赋值最新页码
      this.getEmployeeList(); //重新拉取数据
    },
    //格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      //要去找1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async delEmployee(id) {
      try {
        await this.$confirm("确定删除该员工？");
        //如果点击了确定会进入下方
        await reqDelEmployee(id);
        this.$message.success("删除员工成功");
        this.getEmployeeList();
      } catch (error) {
        console.log(error);
      }
    },
    exportData() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      //导出excel
      import("@/vendor/Export2Excel").then(async (excel) => {
        //excel是引入文件的导出对象
        //导出 header从哪里来  data从哪里来
        //现在没有一个接口获取所有的数据
        //获取员工的接口 页码 每页条数
        const { rows } = await reqEmployeeList({
          page: 1,
          size: this.page.total,
        });
        // const data = this.formatJson(headers, rows); //返回的data就是要导出的结构
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        excel.export_json_to_excel({
          filename: "员工资料表",
          header: Object.keys(headers),
          data: this.formatJson(headers, rows),
          multiHeader, //复杂表头
          merges, //合并选项
        });
        // excel.export_json_to_excel({
        //   header: ["姓名", "工资"],
        //   data: [["张三", 3000]],
        //   filename: "员工工资表",
        // });
      });
    },
    //将表头数据和数据进行对应
    formatJson(headers, rows) {
      return rows.map((item) => {
        //Item是一个对象
        return Object.keys(headers).map((key) => {
          //需要判断字段
          if (
            headers[key] === "timeOfEntry" ||
            headers[key] === "correctionTime"
          ) {
            //格式化日期
            return formatDate(item[headers[key]]);
          } else if (headers[key] === "formOfEmployment") {
            const obj = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return obj ? obj.value : "未知";
          }
          return item[headers[key]];
        });
      });
      // return rows.map((item) =>
      //   Object.keys(headers).map((key) => item[headers[key]])
      // );
    },
    showQrCode(url) {
      //url存在的情况下才弹出层，否则不弹
      if (url) {
        this.showCodeDialog = true; //数据更新了，但是我的弹层不会立刻出现  页面的渲染是异步的
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url); // 将地址转化成二维码链接
        });
      } else {
        this.$message.warning("该用户还未上传头像");
      }
    },
  },
  created() {
    this.getEmployeeList();
  },
};
</script>

<style>
</style>