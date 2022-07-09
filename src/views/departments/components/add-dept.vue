<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 -->
    <!-- label-width设置所有标题的宽度 -->
    <el-form
      :model="formData"
      :rules="rules"
      label-width="120px"
      ref="deptForm"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        ></el-input>
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <!-- 遍历选项 -->
          <el-option
            v-for="item in people"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  reqDepartments,
  reqAddDepartment,
  reqDepartmentDetail,
  updateDepartments,
} from "@/api/departments";
import { reqEmployeeSimple } from "@/api/employees";
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    //检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      //value是部门名称 要去和同级部门下的部门去比较，有没有相同的 有相同的 不能过  / 不相同就可以过
      const { depts } = await reqDepartments();
      //去找同级部门下 有没有和value相同的数据
      //找到同级部门的所有子部门
      let isRepeat = false;
      if (this.formData.id) {
        //有id就是编辑模式
        //编辑的数据 在数据库里有  同级部门下 我的名字不能和其他的同级部门的名字重复
        //首先要找到我的同级部门  this.formData.id  就是我当前的id 我的pid是 this.formData.pid
        // depts.filter(item => item.pid === this.formData.pid)
        isRepeat = depts
          .filter(
            (item) =>
              item.pid === this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some((item) => item.name === value);
      } else {
        //没有id就是新增模式
        isRepeat = depts
          .filter((item) => item.pid === this.treeNode.id)
          .some((item) => item.name === value);
      }

      //如果isRepeat为true，表示找到了一样的名字
      isRepeat
        ? callback(new Error(`同级部门下已经存在这个${value}部门了`))
        : callback();
    };
    //检查编码
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await reqDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        //要求是 不能有一样的code
        isRepeat = depts
          .filter((item) => item.id !== this.treeNode.id)
          .some((item) => item.code === value);
      } else {
        isRepeat = depts.some((item) => item.code === value && value);
      }
      //要求编码和所有的部门编码都不能重复 由于历史数据有可能没有code 所以这里加一个强制性条件 就是value值不为空

      isRepeat
        ? callback(new Error(`组织架构下已经存在这个${value}编码了`))
        : callback();
    };
    return {
      //定义一个表单数据
      formData: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "部门名称不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "部门名称长度为1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkNameRepeat,
          },
        ],
        code: [
          {
            required: true,
            message: "部门编码不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "部门编码长度为1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCodeRepeat,
          },
        ],
        manager: [
          {
            required: true,
            message: "部门负责人不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 50,
            message: "部门负责人长度为1-50个字符",
            trigger: "blur",
          },
        ],
        introduce: [
          {
            required: true,
            message: "部门介绍不能为空",
            trigger: "blur",
          },
          {
            min: 1,
            max: 300,
            message: "部门介绍长度为1-300个字符",
            trigger: "blur",
          },
        ],
      }, //校验规则{key：数组}
      people: [],
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  methods: {
    async getEmployeeSimple() {
      this.people = await reqEmployeeSimple();
    },
    btnOK() {
      //手动校验表单
      this.$refs.deptForm.validate(async (isOK) => {
        //说明表单校验通过
        if (isOK) {
          if (this.formData.id) {
            //编辑
            await updateDepartments(this.formData);
          } else {
            //新增
            //这里我们将id设成我们的pid
            await reqAddDepartment({ ...this.formData, pid: this.treeNode.id });
          }

          //告诉父组件，更新数据
          this.$emit("addDepts"); // 触发一个自定义事件
          //此时应该去修改showDialog值
          this.$emit("update:showDialog", false);
          //关闭dialog的时候会触发el-dialog的close事件 所以这里不需要再单独的重置数据了
        }
      });
    },
    btnCancel() {
      //重置数据
      this.formData = {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      };
      //关闭弹层
      this.$emit("update:showDialog", false);
      //清除之前的校验 可以重置数据 但是只能重置定义在data中的数据
      this.$refs.deptForm.resetFields();
    },
    //获取详情方法
    async getDepartDetail(id) {
      this.formData = await reqDepartmentDetail(id);
      //因为我们是父组件调用子组件的方法 先设置了node数据 直接调用方法
      //props传值是异步的
    },
  },
};
</script>

<style>
</style>