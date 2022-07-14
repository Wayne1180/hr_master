<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 放置一个el-card -->
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置内容 -->
            <el-form
              ref="userForm"
              :rules="rules"
              :model="userInfo"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="用户名" prop="username">
                <el-input
                  style="width: 300px"
                  v-model="userInfo.username"
                ></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input
                  style="width: 300px"
                  type="password"
                  v-model="userInfo.password2"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置内容 -->
            <component :is="UserComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- 放置内容 -->
            <JobInfo />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetUserDetailById } from "@/api/user";
import { reqSaveUserDetailById } from "@/api/employees";
import UserInfo from "./components/user-info.vue";
import JobInfo from "./components/job-info.vue";
export default {
  components: {
    UserInfo,
    JobInfo,
  },
  data() {
    return {
      UserComponent: "UserInfo",
      userInfo: {
        username: "",
        password2: "", //因为读取出来的password是密文
      },
      userId: this.$route.params.id, //直接将路由中的参数赋值给data中的属性
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserDetailById();
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await reqGetUserDetailById(this.userId);
    },
    saveUser() {
      //调用方法时： 应该校验
      this.$refs.userForm.validate().then(async () => {
        await reqSaveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2,
        });
        this.$message.success("修改用户信息成功");
      });
    },
  },
};
</script>

<style>
</style>